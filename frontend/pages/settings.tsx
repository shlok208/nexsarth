import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { SettingsService, AuthService } from '@/lib/api';
import { 
  Building2, 
  User, 
  ShieldCheck, 
  Save, 
  Activity, 
  Sparkles, 
  Globe, 
  Fingerprint, 
  Mail,
  MoreHorizontal
} from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    name: '',
    description: '',
    services: '',
    tagline: '',
    tone: 'Professional'
  });
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, profileData] = await Promise.all([
          AuthService.me(),
          SettingsService.getProfile()
        ]);
        setUser(userData);
        setProfile(profileData);
      } catch (e) {
        console.error("Settings retrieval failed:", e);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    try {
      await SettingsService.updateProfile(profile);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (e) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-10 px-4">
        {/* Header Section */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
                <h1 className="text-6xl font-black text-apple-500 tracking-tighter uppercase leading-none">Workspace Calibration</h1>
                <p className="text-apple-300 text-[11px] font-black uppercase tracking-[0.4em] opacity-70">Master Registry & Brand Identity Control</p>
            </div>
            <div className="flex gap-4">
                <div className="glass px-6 py-3 rounded-full border border-white/40 shadow-sm flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-apple-400 uppercase tracking-widest leading-none">Security Active</span>
                </div>
            </div>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* COLUMN 1: USER INTELLIGENCE */}
            <div className="space-y-10">
                <div className="glass-premium p-10 rounded-[4rem] border-t border-white shadow-apple-medium relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16"></div>
                    <div className="flex items-center gap-6 mb-10">
                        <div className="w-16 h-16 glass-bubble rounded-2xl flex items-center justify-center text-primary shadow-lg group-hover:scale-110 transition-transform">
                            <User size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-apple-500 tracking-tight leading-none">Operator</h3>
                            <p className="text-[10px] font-black text-apple-300 uppercase tracking-widest mt-2">Primary Intelligence Access</p>
                        </div>
                    </div>
                    
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-apple-300 uppercase tracking-[0.2em] ml-4">Registry Email</label>
                            <div className="glass-bubble px-6 py-4 rounded-full text-apple-500 font-black border border-apple-100/30 shadow-inner">
                                {user?.email || 'Synchronizing...'}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-apple-300 uppercase tracking-[0.2em] ml-4">Neural Signature ID</label>
                            <div className="glass-bubble px-6 py-4 rounded-full text-apple-200 font-black text-xs font-mono border border-apple-100/30 overflow-hidden truncate">
                                0X-INTEL-{user?.id || '---'}-SIG-SECURE
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-premium p-10 rounded-[4rem] border-t border-white shadow-soft group hover:shadow-apple-medium transition-all duration-700">
                    <div className="flex items-center gap-6 mb-10">
                        <div className="w-16 h-16 glass-bubble rounded-2xl flex items-center justify-center text-emerald-500 shadow-lg group-hover:rotate-12 transition-transform">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-apple-500 tracking-tight leading-none">Integrity</h3>
                            <p className="text-[10px] font-black text-apple-300 uppercase tracking-widest mt-2">Verified Operator Access</p>
                        </div>
                    </div>
                    <p className="text-sm text-apple-300 font-black leading-relaxed opacity-80">
                        Your account is currently encrypted. All business intelligence and lead data are stored in a private vault-sector.
                    </p>
                </div>
            </div>

            {/* COLUMN 2 & 3: BRAND IDENTITY (EDITABLE) */}
            <div className="lg:col-span-2 space-y-10">
                <div className="glass-premium p-12 md:p-16 rounded-[5rem] border-t border-white shadow-apple-medium relative overflow-hidden group">
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 blur-3xl -ml-32 -mb-32"></div>
                    <div className="flex items-center justify-between mb-16">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 glass-bubble rounded-2xl flex items-center justify-center text-orange-500 shadow-lg">
                                <Building2 size={32} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-apple-500 tracking-tight leading-none">Brand Signature</h3>
                                <p className="text-[11px] font-black text-apple-300 uppercase tracking-[0.3em] mt-3 opacity-60">Sequence: Narrative Calibration</p>
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={saveStatus === 'saving'}
                            className={`glass-bubble-orange px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all ${saveStatus === 'success' ? 'bg-emerald-500 shadow-emerald-500/30' : ''}`}
                        >
                            {saveStatus === 'saving' ? 'Calibrating...' : saveStatus === 'success' ? 'Synchronized!' : 'Save Changes'}
                            {saveStatus !== 'saving' && <Save size={16} />}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-apple-400 uppercase tracking-[0.2em] ml-6">Legal Entity Name</label>
                            <input 
                                type="text" 
                                value={profile.name} 
                                onChange={e => setProfile({...profile, name: e.target.value})}
                                className="glass-bubble w-full rounded-full py-6 px-8 text-apple-500 font-black placeholder-apple-200 outline-none focus:bg-white transition-all shadow-inner border border-apple-100/50" 
                                placeholder="Business Identity Alpha" 
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-apple-400 uppercase tracking-[0.2em] ml-6">Global Tagline</label>
                            <input 
                                type="text" 
                                value={profile.tagline || ''} 
                                onChange={e => setProfile({...profile, tagline: e.target.value})}
                                className="glass-bubble w-full rounded-full py-6 px-8 text-apple-500 font-black placeholder-apple-200 outline-none focus:bg-white transition-all shadow-inner border border-apple-100/50" 
                                placeholder="Elevating the Standard" 
                            />
                        </div>
                        <div className="md:col-span-2 space-y-3">
                            <label className="text-[11px] font-black text-apple-400 uppercase tracking-[0.2em] ml-6">Mission & Operational Scope</label>
                            <textarea 
                                rows={4}
                                value={profile.description} 
                                onChange={e => setProfile({...profile, description: e.target.value})}
                                className="glass-bubble w-full rounded-[3rem] py-6 px-8 text-apple-500 font-black placeholder-apple-200 outline-none focus:bg-white transition-all shadow-inner resize-none border border-apple-100/50" 
                                placeholder="State the core mission of your agency..." 
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-apple-400 uppercase tracking-[0.2em] ml-6">Core Service Inventory</label>
                            <input 
                                type="text" 
                                value={profile.services} 
                                onChange={e => setProfile({...profile, services: e.target.value})}
                                className="glass-bubble w-full rounded-full py-6 px-8 text-apple-500 font-black placeholder-apple-200 outline-none focus:bg-white transition-all shadow-inner border border-apple-100/50" 
                                placeholder="Web Design, AI, Consulting" 
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-apple-400 uppercase tracking-[0.2em] ml-6">Narrative Tone Intelligence</label>
                            <select 
                                value={profile.tone} 
                                onChange={e => setProfile({...profile, tone: e.target.value})}
                                className="glass-bubble w-full rounded-full py-6 px-8 text-apple-500 font-black outline-none focus:bg-white transition-all shadow-inner appearance-none cursor-pointer border border-apple-100/50"
                            >
                                <option value="Professional">Professional & Strategic</option>
                                <option value="Casual">Modern & Friendly</option>
                                <option value="Bold">Bold & Impactful</option>
                                <option value="Academic">Sophisticated & Academic</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-20 p-8 glass rounded-[3rem] border border-apple-100/30 flex items-center gap-8 group">
                        <div className="w-16 h-16 glass-bubble rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Sparkles size={32} />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-apple-500 uppercase tracking-tight">AI Narrative Lock</h4>
                            <p className="text-sm text-apple-300 font-black opacity-80 mt-1 leading-relaxed">
                                This identity profile is used to generate autonomous email sequences. Consistent profiles yield higher conversion indices.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
      </div>
    </Layout>
  );
}
