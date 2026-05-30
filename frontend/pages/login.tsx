import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Script from 'next/script';
import { AuthService } from '@/lib/api';
import { LogIn, Mail, Lock, AlertCircle, ChevronRight, Sparkles, User, MoreHorizontal, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (router.query.mode === 'register') {
      setIsRegister(true);
    }
  }, [router.query.mode]);

  useEffect(() => {
    setMounted(true);
    const initGoogle = () => {
      if (typeof window !== 'undefined' && (window as any).google) {
        (window as any).google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
          callback: handleGoogleResponse
        });
        const googleDiv = document.getElementById("googleSignInDiv");
        if (googleDiv) {
          (window as any).google.accounts.id.renderButton(
            googleDiv,
            { theme: "outline", size: "large", width: "100%", shape: "pill" }
          );
        }
      }
    };
    const timer = setTimeout(initGoogle, 1200);
    return () => clearTimeout(timer);
  }, [isRegister]);

  const handleGoogleResponse = async (response: any) => {
    setLoading(true);
    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });

      if (supabaseError) throw supabaseError;

      await AuthService.googleLogin(data.session?.access_token || "");
      router.push('/');
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await AuthService.login({ email, password });
      router.push('/');
    } catch (err: any) {
      let errorMessage = 'Login failed. Please check your credentials.';
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') errorMessage = detail;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await AuthService.register({ email, password });
      setIsRegister(false);
      setError('Account created! Please sign in with your credentials.');
    } catch (err: any) {
      let errorMessage = 'Registration failed. Please try again.';
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') errorMessage = detail;
      else if (Array.isArray(detail)) errorMessage = detail[0].msg;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col md:flex-row relative overflow-hidden font-sans selection:bg-primary/20">

      {/* Static Solid Background (Soft Light Studio) */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#F5F5F7]"></div>

      {/* Left Side: Branding/Hero (Soft/Glassy) */}
      <div className={`hidden md:flex flex-1 flex-col justify-center p-24 relative z-20 transition-all duration-1000 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
        <div className="max-w-2xl">
          <div className="flex items-center gap-6 mb-16">
            <div className="w-20 h-20 glass rounded-full flex items-center justify-center border-t border-white shadow-soft overflow-hidden">
              <img src="/logo.png" alt="Nexsarth Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-4xl font-black text-apple-500 tracking-tighter italic">NEXSARTH</span>
          </div>

          <h1 className="text-[6.5rem] font-black text-apple-500 leading-[0.9] tracking-tighter mb-12">
            Focus on closing,<br />
            <span className="text-primary italic">not managing.</span>
          </h1>

          <p className="text-3xl text-apple-400 font-black leading-tight mb-16 max-w-lg opacity-70">
            The world's simplest lead management system.
            Keep track of your customers and close more deals.
          </p>


        </div>
      </div>

      {/* Right Side: 3D Flip Container (Ultra-Liquid Bubble Architecture) */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-20 relative z-30 transition-all duration-1000 delay-300 [perspective:2500px]">
        <div className={`w-full max-w-lg relative transition-all duration-1000 [transform-style:preserve-3d] ${isRegister ? '[transform:rotateY(180deg)]' : ''}`}>

          {/* FRONT FACE: SIGN IN (BUBBLE FORM) */}
          <div className="glass-premium rounded-[5rem] p-12 md:p-16 [backface-visibility:hidden] relative z-20 border-t border-white shadow-apple-medium flex flex-col items-center">

            {/* Floating Avatar Bubble */}
            <div className="w-24 h-24 glass-bubble rounded-full flex items-center justify-center -mt-28 mb-10 shadow-xl scale-110">
              <User size={40} className="text-apple-500" />
            </div>

            <div className="mb-14 text-center">
              <h2 className="text-5xl font-black text-apple-500 tracking-tighter">Login</h2>
              <p className="text-apple-300 font-black text-[11px] mt-4 uppercase tracking-[0.3em] opacity-60">Authorize Your Identity</p>
            </div>

            {error && !isRegister && (
              <div className={`mb-10 w-full p-6 rounded-[2.5rem] flex items-center gap-5 text-sm font-black border border-white/40 ${error.includes('created') ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-500 shadow-sm animate-in shake duration-500'}`}>
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-8">
              <div className="relative group">
                <User className="absolute left-7 top-1/2 -translate-y-1/2 text-apple-300 group-focus-within:text-primary transition-all duration-300" size={20} />
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="glass-bubble w-full rounded-full py-6 pl-16 pr-8 text-apple-500 font-black placeholder-apple-200 outline-none focus:bg-white/60 transition-all"
                  placeholder="Username / Email"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-7 top-1/2 -translate-y-1/2 text-apple-300 group-focus-within:text-primary transition-all duration-300" size={20} />
                <input
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="glass-bubble w-full rounded-full py-6 pl-16 pr-8 text-apple-500 font-black placeholder-apple-200 outline-none focus:bg-white/60 transition-all"
                  placeholder="Password"
                />
              </div>

              <div className="pt-6">
                <button type="submit" disabled={loading}
                  className="glass-bubble-orange w-full text-apple-950 py-6 px-10 rounded-full font-black text-[15px] tracking-[0.1em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center group border-t border-white/60"
                >
                  {loading ? 'Processing...' : 'Login'}
                  {!loading && <MoreHorizontal className="ml-4 opacity-70" size={20} />}
                </button>
              </div>

              <div className="text-center pt-4">
                <button type="button" className="text-apple-300 font-black text-[13px] hover:text-apple-500 transition-colors">Forgot Password?</button>
              </div>
            </form>

            <div className="mt-10 mb-6 flex items-center gap-4 w-full">
              <div className="flex-1 h-[1px] bg-apple-100"></div>
              <span className="text-[10px] font-black text-apple-200 uppercase tracking-widest"></span>
              <div className="flex-1 h-[1px] bg-apple-100"></div>
            </div>

            <div id="googleSignInDiv" className="w-full flex justify-center mb-8"></div>

            <div className="mt-8 pt-8 border-t border-apple-100/50 w-full text-center">
              <button onClick={() => { setIsRegister(true); setError(''); }} className="text-apple-300 font-black text-[12px] uppercase tracking-[0.2em] hover:text-primary transition-all group">
                New Entity? <span className="text-primary border-b-2 border-primary/20 ml-1 group-hover:border-primary">Request Entry</span>
              </button>
            </div>
          </div>

          {/* BACK FACE: REGISTER (BUBBLE FORM) */}
          <div className="glass-premium rounded-[5rem] p-12 md:p-16 [backface-visibility:hidden] [transform:rotateY(180deg)] absolute inset-0 z-10 border-t border-white shadow-apple-medium flex flex-col items-center">

            {/* Floating Register Bubble */}
            <div className="w-24 h-24 glass-bubble rounded-full flex items-center justify-center -mt-28 mb-10 shadow-xl scale-110">
              <UserPlus size={40} className="text-primary" />
            </div>

            <div className="mb-14 text-center">
              <h2 className="text-5xl font-black text-apple-500 tracking-tighter">Initialize</h2>
              <p className="text-apple-300 font-black text-[11px] mt-4 uppercase tracking-[0.3em] opacity-60">Join the Intelligence Stream</p>
            </div>

            {error && isRegister && (
              <div className="mb-10 w-full p-6 bg-red-500/10 border border-white text-red-500 rounded-[2.5rem] flex items-center gap-5 text-sm font-black shadow-sm animate-in shake duration-500">
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="w-full space-y-8">
              <div className="relative group">
                <Mail className="absolute left-7 top-1/2 -translate-y-1/2 text-apple-300 group-focus-within:text-primary transition-all duration-300" size={20} />
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="glass-bubble w-full rounded-full py-6 pl-16 pr-8 text-apple-500 font-black placeholder-apple-200 outline-none focus:bg-white/60 transition-all"
                  placeholder="Authorized Email"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-7 top-1/2 -translate-y-1/2 text-apple-300 group-focus-within:text-primary transition-all duration-300" size={20} />
                <input
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="glass-bubble w-full rounded-full py-6 pl-16 pr-8 text-apple-500 font-black placeholder-apple-200 outline-none focus:bg-white/60 transition-all"
                  placeholder="Secure Password"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-7 top-1/2 -translate-y-1/2 text-apple-300 group-focus-within:text-primary transition-all duration-300" size={20} />
                <input
                  type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="glass-bubble w-full rounded-full py-6 pl-16 pr-8 text-apple-500 font-black placeholder-apple-200 outline-none focus:bg-white/60 transition-all"
                  placeholder="Confirm Identity Key"
                />
              </div>

              <div className="pt-6">
                <button type="submit" disabled={loading}
                  className="glass-bubble-orange w-full text-apple-950 py-6 px-10 rounded-full font-black text-[15px] tracking-[0.1em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center group border-t border-white/60"
                >
                  {loading ? 'Initializing...' : 'Create Identity'}
                  {!loading && <MoreHorizontal className="ml-4 opacity-70" size={20} />}
                </button>
              </div>
            </form>

            <div className="mt-14 pt-8 border-t border-apple-100/50 w-full text-center">
              <button onClick={() => { setIsRegister(false); setError(''); }} className="text-apple-300 font-black text-[13px] uppercase tracking-[0.2em] hover:text-primary transition-all group">
                Existing Node? <span className="text-primary border-b-2 border-primary/20 ml-1 group-hover:border-primary">Sign In</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
    </div>
  );
}
