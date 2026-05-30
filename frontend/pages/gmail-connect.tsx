import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { GmailService } from '@/lib/api';
import { Mail, CheckCircle2, AlertCircle, ShieldCheck, Key, Zap, Info, ExternalLink, ChevronRight, XCircle, HelpCircle } from 'lucide-react';

export default function GmailConnectPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [connection, setConnection] = useState<{connected: boolean, email?: string} | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const data = await GmailService.getStatus();
      setConnection(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await GmailService.connect({ gmail_email: email, app_password: password });
      setStatus('success');
      fetchStatus();
      setEmail('');
      setPassword('');
    } catch (err) {
      setStatus('error');
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect Gmail? Automated follow-ups will stop.")) return;
    try {
        await GmailService.disconnect();
        fetchStatus();
    } catch (e) {
        console.error(e);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-10 px-4 md:px-0">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
                <h1 className="text-4xl font-bold text-apple-500 tracking-tight">Gmail Connection</h1>
                <p className="text-apple-300 mt-1.5 text-sm font-medium">Link your account for automated follow-up sequences.</p>
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={() => setShowTutorial(!showTutorial)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-apple-100 rounded-apple-xl text-apple-300 hover:text-apple-500 hover:bg-apple-50 transition-all shadow-apple-soft font-bold text-[10px] uppercase tracking-widest"
                >
                    <HelpCircle size={14} /> 
                    {showTutorial ? 'Hide Setup Guide' : 'Setup Guide'}
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Side: Connection Status & Form */}
            <div className="lg:col-span-7 space-y-10">
                
                {/* Status Card */}
                {connection && connection.connected ? (
                    <div className="bg-white rounded-apple-2xl p-10 border border-emerald-100 shadow-apple-medium relative overflow-hidden group transition-all duration-500">
                         {/* Subtle Background Decoration */}
                         <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 blur-3xl rounded-full -translate-y-20 translate-x-10 pointer-events-none transition-all duration-1000 group-hover:bg-emerald-100"></div>
                         
                         <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-sm transition-transform group-hover:scale-105">
                                <ShieldCheck className="text-emerald-500" size={28} />
                            </div>
                            <div className="bg-emerald-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">Connected</div>
                         </div>
                         
                         <h3 className="text-2xl font-bold text-apple-500 tracking-tight mb-2">Service Active</h3>
                         <p className="text-emerald-600 font-bold text-lg mb-8">{connection.email}</p>
                         
                         <div className="flex gap-4 relative z-10">
                            <button 
                                onClick={handleDisconnect}
                                className="px-6 py-3.5 bg-white hover:bg-red-50 border border-apple-100 text-red-500 rounded-apple-xl font-bold text-[10px] uppercase tracking-widest transition-all inline-flex items-center gap-2 shadow-apple-soft active:scale-95"
                            >
                                <XCircle size={14} /> Disconnect Account
                            </button>
                         </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-apple-2xl p-10 border border-apple-100 shadow-apple-soft relative overflow-hidden">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-apple-50 rounded-2xl flex items-center justify-center border border-apple-100">
                                <Zap className="text-apple-200" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-apple-500 tracking-tight">Status: Offline</h3>
                         </div>
                         <p className="text-apple-300 text-sm font-medium leading-relaxed mb-6 italic">
                           NEXUS requires a Gmail connection to send automated outreach. 
                           Once linked, your sales worker will operate in the background.
                         </p>
                    </div>
                )}

                {/* Connection Form */}
                <div className="bg-white rounded-apple-2xl p-10 md:p-12 border border-apple-100 shadow-apple-medium relative overflow-hidden">
                    <h3 className="text-xl font-bold text-apple-500 mb-10 border-b border-apple-50 pb-6 tracking-tight flex items-center gap-3">
                        <Key className="text-primary" size={20} /> Connection Details
                    </h3>
                    
                    <form onSubmit={handleConnect} className="space-y-8">
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-apple-300 uppercase tracking-wider ml-1">Gmail Address</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-apple-50/50 border border-apple-100 rounded-apple-xl px-6 py-3.5 text-apple-500 font-medium placeholder-apple-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-md tracking-tight"
                                placeholder="example@gmail.com"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-apple-300 uppercase tracking-wider ml-1">16-Digit App Password</label>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-apple-50/50 border border-apple-100 rounded-apple-xl px-6 py-3.5 text-apple-500 font-medium placeholder-apple-200 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all font-bold text-md tracking-widest"
                                placeholder="•••• •••• •••• ••••"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={status === 'loading'}
                            className="w-full py-4 bg-primary text-white rounded-apple-xl font-bold text-sm tracking-tight shadow-apple-soft hover:bg-primary-dark transition-all disabled:opacity-50 flex justify-center items-center group active:scale-[0.95]"
                        >
                            {status === 'loading' ? 'Establishing link...' : 'Connect Gmail'}
                            {status !== 'loading' && <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />}
                        </button>

                        {status === 'success' && (
                            <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center text-emerald-600 gap-3 animate-in fade-in slide-in-from-bottom duration-500">
                                <CheckCircle2 size={20} />
                                <p className="text-xs font-bold uppercase tracking-wider">Account linked successfully.</p>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center text-red-600 gap-3 animate-pulse">
                                <AlertCircle size={20} />
                                <p className="text-xs font-bold uppercase tracking-wider">Authentication failed. Check your app password.</p>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Right Side: Simple Tutorial */}
            <div className={`lg:col-span-5 transition-all duration-700 ${showTutorial ? 'opacity-100 translate-x-0' : 'opacity-40 translate-x-4'}`}>
                <div className="bg-white rounded-apple-2xl p-10 border border-apple-100 h-full relative overflow-hidden group hover:shadow-apple-medium transition-all">
                    <h3 className="text-lg font-bold text-apple-500 mb-8 border-b border-apple-50 pb-6 tracking-tight">
                        How to get an App Password
                    </h3>
                    
                    <div className="space-y-10">
                        <div className="flex gap-6">
                            <div className="w-10 h-10 rounded-xl bg-apple-50 border border-apple-100 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0 shadow-sm">1</div>
                            <div>
                                <h4 className="text-xs font-bold text-apple-500 uppercase tracking-widest mb-1.5 text-[10px]">Google Security</h4>
                                <p className="text-xs text-apple-300 font-medium leading-relaxed">
                                  Go to your <a href="https://myaccount.google.com/security" target="_blank" className="text-primary font-bold hover:underline inline-flex items-center gap-1">Account Security <ExternalLink size={10} /></a>.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-10 h-10 rounded-xl bg-apple-50 border border-apple-100 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0 shadow-sm">2</div>
                            <div>
                                <h4 className="text-xs font-bold text-apple-500 uppercase tracking-widest mb-1.5 text-[10px]">2-Step Verification</h4>
                                <p className="text-xs text-apple-300 font-medium leading-relaxed">
                                  Ensure <strong className="text-apple-400">2-Step Verification</strong> is enabled on your Gmail account.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-10 h-10 rounded-xl bg-apple-50 border border-apple-100 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0 shadow-sm">3</div>
                            <div>
                                <h4 className="text-xs font-bold text-apple-500 uppercase tracking-widest mb-1.5 text-[10px]">App Passwords</h4>
                                <p className="text-xs text-apple-300 font-medium leading-relaxed">
                                  Search for <strong className="text-apple-400">"App Passwords"</strong>. Create one for "NEXUS".
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-10 h-10 rounded-xl bg-apple-50 border border-apple-100 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0 shadow-sm">4</div>
                            <div>
                                <h4 className="text-xs font-bold text-apple-500 uppercase tracking-widest mb-1.5 text-[10px]">Establish Link</h4>
                                <p className="text-xs text-apple-300 font-medium leading-relaxed">
                                  Copy the <strong className="text-apple-400">16-character code</strong> and paste it into the form.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-14 p-6 bg-apple-50 border border-apple-100 rounded-apple-xl">
                         <div className="flex items-center gap-3 mb-3">
                            <Info size={16} className="text-primary" />
                            <h4 className="text-[10px] font-bold text-apple-500 uppercase tracking-widest">Security Notice</h4>
                         </div>
                         <p className="text-[10px] text-apple-300 font-medium leading-relaxed italic">
                           App Passwords provide a secure tunnel for NEXUS without requiring your primary password. 
                           You can revoke access at any time from your Google Security dashboard.
                         </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
}
