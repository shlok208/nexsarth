import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  Inbox, 
  BarChart3, 
  Mail, 
  Settings, 
  LogOut, 
  User,
  Sparkles,
  Bell,
  AlertCircle,
  Menu,
  X,
  Copy,
  Check
} from 'lucide-react';
import { AuthService } from '@/lib/api';
import SetupTourModal from './SetupTourModal';

interface LayoutProps {
  children: ReactNode;
  showBackground?: boolean;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [setupComplete, setSetupComplete] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [contactName, setContactName] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Nexsarth Inquiry from ${contactName}`);
    const body = encodeURIComponent(`Hi Shlok,\n\n${contactMessage}\n\nBest regards,\n${contactName}`);
    window.location.href = `mailto:shlokthakkar208@gmail.com?subject=${subject}&body=${body}`;
    setContactName('');
    setContactMessage('');
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('shlokthakkar208@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsGuest(true);
      const restrictedPages = ['/leads', '/stats', '/gmail-connect', '/leads/[id]', '/settings'];
      const isRestricted = restrictedPages.some(page => 
          router.pathname === page || (page === '/leads/[id]' && router.pathname.startsWith('/leads/'))
      );
      
      if (isRestricted) {
        router.push('/login');
      }
    } else {
      setIsGuest(false);
      Promise.all([
        AuthService.me(),
        AuthService.getSetupStatus()
      ])
        .then(([userData, statusData]) => {
          setUser(userData);
          setSetupComplete(statusData.is_complete);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setIsGuest(true);
          if (router.pathname !== '/') router.push('/login');
        });
    }
  }, [router.pathname]);

  const handleLogout = () => {
    AuthService.logout();
    router.push('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/', guest: true },
    { label: 'Leads', icon: Inbox, path: '/leads', guest: false },
    { label: 'Analytics', icon: BarChart3, path: '/stats', guest: false },
    { label: 'Integrations', icon: Mail, path: '/gmail-connect', guest: false },
  ].filter(item => item.guest || !isGuest);

  if (router.pathname === '/login' || router.pathname === '/register') {
    return <div className="min-h-screen bg-apple-50">{children}</div>;
  }

  return (
    <div className="relative min-h-screen bg-[#F5F5F7] transition-colors duration-500 overflow-x-hidden selection:bg-primary/20 flex flex-col">
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#F5F5F7]"></div>

      {setupComplete === false && !isGuest && (
        <>
            <SetupTourModal onComplete={() => setSetupComplete(true)} />
            <div className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-top-4 duration-1000 w-[90%] md:w-auto">
                <div className="glass-premium px-4 md:px-8 py-2.5 md:py-3 rounded-full border border-orange-500/20 shadow-apple-medium flex items-center justify-center gap-3 md:gap-4 group cursor-help">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                    <span className="text-[9px] md:text-[11px] font-black text-apple-500 uppercase tracking-[0.15em] md:tracking-[0.2em] whitespace-nowrap">Calibration Required</span>
                    <AlertCircle size={12} className="text-orange-500 opacity-60 ml-auto md:ml-0" />
                </div>
            </div>
        </>
      )}

      {/* Responsive Liquid Navbar */}
      <nav className="fixed top-6 md:top-8 left-1/2 -translate-x-1/2 w-[92%] md:w-[95%] max-w-7xl z-50">
        <div className="glass-premium px-6 md:px-10 py-3.5 md:py-5 rounded-full flex items-center justify-between border-t border-white shadow-apple-medium">
          <Link href="/" className="flex items-center space-x-2 md:space-x-4 group z-50">
            <div className="w-10 h-10 md:w-14 md:h-14 glass rounded-full flex items-center justify-center border-t border-white shadow-sm overflow-hidden">
              <img src="/logo.png" alt="Nexsarth Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-lg md:text-2xl font-black text-apple-500 tracking-tighter">NEXSARTH</span>
          </Link>

          {/* Large Screen Nav */}
          <div className="hidden min-[1150px]:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = router.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  className={`flex items-center space-x-3 px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all ${
                    isActive ? 'glass text-primary border-t border-white' : 'text-apple-300 hover:text-apple-500 hover:bg-white/40'
                  }`}
                >
                  <item.icon size={15} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {isGuest ? (
              <div className="flex items-center gap-2 md:gap-4">
                <Link href="/login" className="hidden sm:block">
                  <button className="text-apple-400 font-black text-[10px] uppercase tracking-widest px-2">Login</button>
                </Link>
                <Link href="/login?mode=register">
                  <button className="glass-bubble-orange py-2.5 md:py-3 px-5 md:px-8 rounded-full font-black text-[9px] md:text-[11px] uppercase tracking-widest text-apple-950 shadow-sm active:scale-95 transition-all whitespace-nowrap">Sign Up</button>
                </Link>
              </div>
            ) : (
              <>
                <Link href="/settings">
                  <div className="w-10 h-10 md:w-12 md:h-12 glass rounded-full flex items-center justify-center border-t border-white cursor-pointer hover:scale-105 active:scale-95 transition-transform shadow-sm">
                    <User size={18} className="text-apple-400" />
                  </div>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="hidden sm:flex glass p-2.5 md:p-3.5 rounded-full border-t border-white hover:bg-red-50 hover:border-red-200 transition-all group shadow-sm"
                >
                  <LogOut size={18} className="text-apple-300 group-hover:text-red-500" />
                </button>
              </>
            )}
            
            {/* Mobile Toggle */}
            <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="min-[1150px]:hidden w-10 h-10 glass rounded-full flex items-center justify-center border-t border-white text-apple-400 active:scale-95 transition-all shadow-sm"
            >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Flyout Menu */}
        <div className={`min-[1150px]:hidden mt-4 glass-premium rounded-[2.5rem] border border-white p-6 shadow-apple-large overflow-hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'max-h-[500px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'}`}>
             <div className="grid grid-cols-2 gap-4">
                 {navItems.map((item) => {
                     const isActive = router.pathname === item.path;
                     return (
                        <Link
                            key={item.label}
                            href={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] border transition-all ${
                                isActive ? 'glass border-primary/20 text-primary bg-primary/5' : 'bg-white/40 border-apple-100/30 text-apple-300'
                            }`}
                        >
                            <item.icon size={28} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                        </Link>
                     );
                 })}
             </div>
             {!isGuest && (
                <button 
                    onClick={handleLogout}
                    className="w-full mt-6 py-5 rounded-[2rem] bg-red-500/5 text-red-500 font-black text-[10px] uppercase tracking-widest border border-red-500/10 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    <LogOut size={18} /> Logout Session
                </button>
             )}
        </div>
      </nav>

      {/* Main Content Area: Responsive Scaling */}
      <main className="relative z-10 pt-32 md:pt-44 pb-20 px-4 md:px-12 lg:px-20 xl:px-32 w-full min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {setupComplete === false && !isGuest && (
            <div className="mb-12 w-full glass-premium p-6 md:p-8 rounded-[3rem] border border-orange-500/20 shadow-soft flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 shadow-sm border border-orange-200/20">
                        <AlertCircle size={28} />
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-apple-500 tracking-tighter uppercase leading-none">Calibration Required</h4>
                        <p className="text-[10px] font-black text-apple-400 uppercase tracking-widest mt-3 opacity-60">Outreach is currently <span className="text-orange-600">offline</span></p>
                    </div>
                </div>
                <button 
                    onClick={() => setSetupComplete(false)}
                    className="w-full md:w-auto glass-bubble-orange py-4 px-12 rounded-full font-black text-[11px] uppercase tracking-widest text-apple-950 shadow-md active:scale-95 transition-all"
                >
                    Fix Now
                </button>
            </div>
        )}
        {children}
      </main>

      <footer className="relative z-10 border-t border-apple-100/30 mt-auto w-full pt-16 pb-8 px-6 md:px-12 lg:px-20 xl:px-32 bg-white/40 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Brand Column */}
          <div className="flex flex-col space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 glass rounded-full flex items-center justify-center border-t border-white shadow-sm overflow-hidden">
                <img src="/logo.png" alt="Nexsarth Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-black text-apple-500 tracking-tighter">NEXSARTH</span>
            </div>
            <p className="text-xs font-medium text-apple-300 max-w-sm leading-relaxed">
              Empowering leaders with automated lead generation and relationship management. Maximize efficiency, optimize analytics, and close deals effortlessly.
            </p>
            <div className="text-[10px] font-bold text-apple-300 uppercase tracking-widest pt-2">
              © {new Date().getFullYear()} NEXSARTH. All rights reserved.
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col space-y-4 text-left">
            <h5 className="text-[10px] font-black text-apple-400 uppercase tracking-[0.2em]">Quick Navigation</h5>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.path}
                  className="text-apple-300 hover:text-primary transition-all duration-300 font-semibold"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/settings"
                className="text-apple-300 hover:text-primary transition-all duration-300 font-semibold"
              >
                Settings
              </Link>
            </div>
          </div>

          {/* Contact Developer Column */}
          <div className="flex flex-col space-y-4 text-left">
            <h5 className="text-[10px] font-black text-apple-400 uppercase tracking-[0.2em]">Contact Developer</h5>
            <p className="text-xs font-medium text-apple-300 leading-relaxed">
              Have feedback, questions, or custom inquiries? Get in touch directly via form or email.
            </p>
            
            {/* Contact Form */}
            <form onSubmit={handleContactSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full text-xs font-semibold px-4 py-2.5 rounded-2xl glass-input placeholder:text-apple-300 text-apple-500"
                  required
                />
              </div>
              <div className="relative">
                <textarea
                  placeholder="Your Message"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows={2}
                  className="w-full text-xs font-semibold px-4 py-2.5 rounded-2xl glass-input resize-none placeholder:text-apple-300 text-apple-500"
                  required
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="glass-bubble-orange flex-grow py-2.5 px-4 rounded-full font-black text-[10px] uppercase tracking-widest text-apple-950 shadow-sm active:scale-95 transition-all text-center flex items-center justify-center gap-2"
                >
                  <Mail size={12} />
                  Send Email
                </button>
                
                {/* Click to copy email button */}
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className={`p-2.5 rounded-full border transition-all relative group flex items-center justify-center ${
                    copied 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                      : 'glass border-apple-100/50 text-apple-300 hover:text-apple-500 hover:scale-105 active:scale-95'
                  }`}
                  title="Copy Email Address"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  
                  {/* Tooltip */}
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-apple-500 text-white text-[9px] px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap font-black uppercase tracking-wider shadow-sm z-50">
                    {copied ? 'Copied!' : 'Copy Email'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-apple-100/10 pt-8 text-center">
          <p className="text-[9px] font-black text-apple-300 uppercase tracking-[0.4em] px-4">
            Built for Leaders • NEXSARTH v2.0
          </p>
        </div>
      </footer>
    </div>
  );
}
