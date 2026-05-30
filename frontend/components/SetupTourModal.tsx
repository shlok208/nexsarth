import React, { useState } from 'react';
import { SettingsService, GmailService } from '@/lib/api';
import { Rocket, Building2, Mail, CheckCircle2, ChevronRight, X, AlertCircle, Info, MoreHorizontal, ShieldCheck, Sparkles } from 'lucide-react';

interface SetupTourModalProps {
  onComplete: () => void;
}

export default function SetupTourModal({ onComplete }: SetupTourModalProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1 State
  const [profile, setProfile] = useState({
    name: '',
    description: '',
    services: '',
    tagline: '',
    tone: 'Professional'
  });

  // Step 2 State
  const [gmail, setGmail] = useState({
    email: '',
    password: ''
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await SettingsService.updateProfile(profile);
      setStep(2);
    } catch (err) {
      setError('System rejected profile data. Please verify inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleGmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await GmailService.connect({ gmail_email: gmail.email, app_password: gmail.password });
      setStep(3);
    } catch (err) {
      setError('Connection refused. Verify your 16-digit App Password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
      {/* Heavy Backdrop */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-2xl"></div>
      
      <div className="w-full max-w-2xl glass-premium rounded-[5rem] p-12 md:p-16 border-t border-white shadow-apple-large relative overflow-hidden flex flex-col">
        
        {/* Floating Background Elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-500/5 blur-[100px] pointer-events-none rounded-full"></div>

        {/* Close Option (Skip) */}
        {step < 3 && (
            <button 
                onClick={onComplete}
                className="absolute top-10 right-10 w-12 h-12 glass rounded-full flex items-center justify-center border-t border-white text-apple-200 hover:text-red-500 transition-all z-20 group"
            >
                <X size={20} className="group-hover:rotate-90 transition-transform" />
            </button>
        )}

        {/* --- STEP 0: INTRO --- */}
        {step === 0 && (
          <div className="flex flex-col items-center text-center space-y-10 relative z-10">
            <div className="w-28 h-28 glass-bubble rounded-[2.5rem] flex items-center justify-center border-t border-white shadow-xl scale-110 mb-4 animate-bounce-slow">
              <Rocket className="w-14 h-14 text-primary" />
            </div>
            <div className="space-y-4">
                <h2 className="text-5xl font-black text-apple-500 tracking-tighter leading-none">
                    Initialize your <br/>
                    <span className="text-primary italic">Workspace.</span>
                </h2>
                <p className="text-xl text-apple-300 font-black leading-relaxed max-w-md mx-auto opacity-80">
                    To activate autonomous lead tracking, we must calibrate your brand identity and secure your email uplink.
                </p>
            </div>
            <button 
              onClick={() => setStep(1)}
              className="glass-bubble-orange py-6 px-12 rounded-full font-black text-[15px] tracking-widest text-apple-950 shadow-xl hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center gap-4 group"
            >
              Begin Calibration <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* --- STEP 1: BUSINESS PROFILE --- */}
        {step === 1 && (
          <div className="space-y-10 relative z-10">
             <div className="flex items-center gap-6 border-b border-apple-100 pb-10">
                <div className="w-16 h-16 glass-bubble rounded-2xl flex items-center justify-center text-primary shadow-lg">
                    <Building2 size={32} />
                </div>
                <div>
                    <h2 className="text-4xl font-black text-apple-500 tracking-tighter uppercase leading-none">Brand Identity</h2>
                    <p className="text-[11px] uppercase font-black text-apple-300 tracking-[0.3em] mt-3 opacity-60">Sequence 1 of 2: AI Protocol Definition</p>
                </div>
             </div>

             {error && (
                <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-[2rem] flex items-center gap-4 text-xs font-black uppercase tracking-widest shadow-sm animate-in shake duration-500">
                    <AlertCircle size={20} /> {error}
                </div>
             )}

             <form onSubmit={handleProfileSubmit} className="space-y-8">
                <div className="space-y-3">
                    <label className="block text-[11px] font-black text-apple-400 uppercase tracking-[0.2em] ml-6">Company Legal Name</label>
                    <input type="text" required value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="glass-bubble w-full rounded-full py-6 px-8 text-apple-500 font-black placeholder-apple-200 outline-none focus:bg-white transition-all shadow-inner" placeholder="e.g. Acme Corporation" />
                </div>
                <div className="space-y-3">
                    <label className="block text-[11px] font-black text-apple-400 uppercase tracking-[0.2em] ml-6">Operational Mission</label>
                    <textarea required rows={3} value={profile.description} onChange={e => setProfile({...profile, description: e.target.value})} className="glass-bubble w-full rounded-[2.5rem] py-6 px-8 text-apple-500 font-black placeholder-apple-200 outline-none focus:bg-white transition-all shadow-inner resize-none" placeholder="Briefly describe what your agency does..." />
                </div>
                <div className="space-y-3">
                    <label className="block text-[11px] font-black text-apple-400 uppercase tracking-[0.2em] ml-6">Service Inventory (comma separated)</label>
                    <input type="text" required value={profile.services} onChange={e => setProfile({...profile, services: e.target.value})} className="glass-bubble w-full rounded-full py-6 px-8 text-apple-500 font-black placeholder-apple-200 outline-none focus:bg-white transition-all shadow-inner" placeholder="Web Design, AI Consulting, SEO" />
                </div>

                <div className="pt-6 flex justify-between items-center">
                    <div className="flex gap-2">
                        <div className="w-8 h-2 rounded-full bg-primary/20"></div>
                        <div className="w-8 h-2 rounded-full bg-apple-100"></div>
                    </div>
                    <button type="submit" disabled={loading} className="glass-bubble-primary py-5 px-10 rounded-full font-black text-xs uppercase tracking-[0.2em] text-white flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                        {loading ? 'Processing...' : 'Secure & Proceed'} <ChevronRight size={16} />
                    </button>
                </div>
             </form>
          </div>
        )}

        {/* --- STEP 2: GMAIL CONNECT --- */}
        {step === 2 && (
            <div className="space-y-10 relative z-10">
             <div className="flex items-center gap-6 border-b border-apple-100 pb-10">
                <div className="w-16 h-16 glass-bubble rounded-2xl flex items-center justify-center text-orange-500 shadow-lg">
                    <Mail size={32} />
                </div>
                <div>
                    <h2 className="text-4xl font-black text-apple-500 tracking-tighter uppercase leading-none">SMTP Uplink</h2>
                    <p className="text-[11px] uppercase font-black text-apple-300 tracking-[0.3em] mt-3 opacity-60">Sequence 2 of 2: Communication Relay</p>
                </div>
             </div>

             {error && (
                <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-[2rem] flex items-center gap-4 text-xs font-black uppercase tracking-widest shadow-sm animate-in shake duration-500">
                    <AlertCircle size={20} /> {error}
                </div>
             )}

             <div className="bg-orange-500/5 p-8 rounded-[3rem] border border-orange-500/10 shadow-inner relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                    <ShieldCheck size={48} className="text-orange-500" />
                 </div>
                 <h4 className="flex items-center gap-3 text-[11px] font-black text-orange-600 uppercase tracking-widest underline decoration-orange-200 underline-offset-4 mb-4">
                    <Info size={16}/> Mandatory Security Key
                 </h4>
                 <p className="text-sm text-apple-300 font-bold leading-relaxed">
                    Gmail requires a <strong>Google App Password</strong> (16-digits). Standard passwords will be rejected by our security architecture.
                 </p>
                 <a href="https://myaccount.google.com/security" target="_blank" className="inline-flex items-center mt-6 text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] border-b-2 border-orange-200 hover:border-orange-500 transition-all cursor-pointer">
                    Generate Key in Google Security Settings
                 </a>
             </div>

             <form onSubmit={handleGmailSubmit} className="space-y-8">
                <div className="space-y-3">
                    <label className="block text-[11px] font-black text-apple-400 uppercase tracking-[0.2em] ml-6">Authorized Gmail Address</label>
                    <input type="email" required value={gmail.email} onChange={e => setGmail({...gmail, email: e.target.value})} className="glass-bubble w-full rounded-full py-6 px-8 text-apple-500 font-black placeholder-apple-200 outline-none focus:bg-white transition-all shadow-inner" placeholder="agent.01@gmail.com" />
                </div>
                <div className="space-y-3">
                    <label className="block text-[11px] font-black text-apple-400 uppercase tracking-[0.2em] ml-6">16-Digit Neural Key (App Password)</label>
                    <input type="password" required value={gmail.password} onChange={e => setGmail({...gmail, password: e.target.value})} className="glass-bubble w-full rounded-full py-6 px-8 text-apple-500 font-black placeholder-apple-200 outline-none focus:bg-white transition-all shadow-inner tracking-[0.5em]" placeholder="••••••••••••••••" />
                </div>

                <div className="pt-6 flex justify-between items-center">
                    <div className="flex gap-2">
                        <div className="w-8 h-2 rounded-full bg-primary/20"></div>
                        <div className="w-8 h-2 rounded-full bg-orange-500"></div>
                    </div>
                    <button type="submit" disabled={loading} className="glass-bubble-orange py-5 px-10 rounded-full font-black text-xs uppercase tracking-[0.2em] text-apple-950 flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                        {loading ? 'Authenticating...' : 'Establish Network Link'} <ChevronRight size={16} />
                    </button>
                </div>
             </form>
          </div>
        )}

        {/* --- STEP 3: SUCCESS --- */}
        {step === 3 && (
            <div className="flex flex-col items-center text-center space-y-12 py-10 relative z-10">
                <div className="w-32 h-32 glass-bubble rounded-full flex items-center justify-center border-t border-white shadow-2xl animate-in zoom-in spin-in duration-1000">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                </div>
                <div className="space-y-6">
                    <h2 className="text-5xl font-black text-apple-500 tracking-tighter uppercase leading-none">Workspace <br/><span className="text-emerald-500 italic">Active.</span></h2>
                    <div className="space-y-4 text-apple-300 font-black text-lg max-w-sm opacity-80">
                        <p>Identity confirmed. Uplink stable.</p>
                        <p className="text-apple-500">Your autonomous sales system is now primed for deployment.</p>
                    </div>
                </div>
                <button 
                  onClick={onComplete}
                  className="glass-bubble-primary py-7 px-16 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[13px] text-white shadow-apple-medium hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center gap-4"
                >
                  Enter Nexus Galaxy <Sparkles size={20} className="text-emerald-200" />
                </button>
            </div>
        )}

      </div>
    </div>
  );
}
