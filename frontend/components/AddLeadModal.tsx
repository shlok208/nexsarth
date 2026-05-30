import React, { useState, useEffect } from 'react';
import { X, UserPlus, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';

interface AddLeadModalProps {
  onClose: () => void;
  onSave: (lead: any) => Promise<void>;
}

export default function AddLeadModal({ onClose, onSave }: AddLeadModalProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      setError('Essential field: Primary Identity required.');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(detail || 'Entity onboarding failed. Service interruption.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-500">
      {/* Heavy Backdrop */}
      <div className="absolute inset-0 bg-[#F5F5F7]/80 backdrop-blur-2xl"></div>

      <div className={`glass-premium p-12 md:p-16 rounded-[5rem] border-t border-white w-full max-w-xl shadow-apple-large relative overflow-hidden transition-all duration-700 ${mounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-20'}`}>
        
        {/* Background glow highlights */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-10 right-10 text-apple-200 hover:text-red-500 transition-all glass w-12 h-12 rounded-full border-t border-white flex items-center justify-center hover:scale-110 z-10"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-6 mb-14 relative z-10">
            <div className="w-20 h-20 glass-bubble rounded-[2.5rem] flex items-center justify-center border-t border-white shadow-xl">
                <UserPlus className="text-primary" size={32} />
            </div>
            <div>
                <h2 className="text-4xl font-black text-apple-500 tracking-tighter leading-none">New Intelligence</h2>
                <p className="text-[11px] font-black text-apple-300 uppercase tracking-[0.4em] mt-3 opacity-60">Manual Entity Onboarding</p>
            </div>
        </div>
        
        {error && (
          <div className="mb-10 bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-[2.5rem] text-[13px] font-black flex items-center gap-5 shadow-sm animate-in shake duration-500">
            <AlertCircle size={20} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-apple-400 uppercase tracking-[0.2em] ml-6 font-bold">Given Name</label>
              <input 
                type="text" 
                name="first_name" 
                placeholder="John"
                value={formData.first_name} 
                onChange={handleChange}
                className="glass-bubble w-full rounded-full px-8 py-6 text-apple-500 font-black placeholder-apple-200 outline-none focus:bg-white transition-all shadow-inner"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[11px] font-black text-apple-400 uppercase tracking-[0.2em] ml-6 font-bold">Family Name</label>
              <input 
                type="text" 
                name="last_name" 
                placeholder="Doe"
                value={formData.last_name} 
                onChange={handleChange}
                className="glass-bubble w-full rounded-full px-8 py-6 text-apple-500 font-black placeholder-apple-200 outline-none focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="block text-[11px] font-black text-apple-400 uppercase tracking-[0.2em] ml-6 font-bold">Primary Identity *</label>
            <input 
              type="email" 
              name="email" 
              required
              placeholder="john.doe@entity.com"
              value={formData.email} 
              onChange={handleChange}
              className="glass-bubble w-full rounded-full px-8 py-6 text-apple-500 font-black placeholder-apple-200 outline-none focus:bg-white transition-all shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
                <label className="block text-[11px] font-black text-apple-400 uppercase tracking-[0.2em] ml-6 font-bold">Signal Path</label>
                <input 
                type="tel" 
                name="phone" 
                placeholder="+1 (555) 000-0000"
                value={formData.phone} 
                onChange={handleChange}
                className="glass-bubble w-full rounded-full px-8 py-6 text-apple-500 font-black placeholder-apple-200 outline-none focus:bg-white transition-all shadow-inner"
                />
            </div>
            <div className="space-y-3">
                <label className="block text-[11px] font-black text-apple-400 uppercase tracking-[0.2em] ml-6 font-bold">Affiliation</label>
                <input 
                type="text" 
                name="company" 
                placeholder="ACME Corp"
                value={formData.company} 
                onChange={handleChange}
                className="glass-bubble w-full rounded-full px-8 py-6 text-apple-500 font-black placeholder-apple-200 outline-none focus:bg-white transition-all shadow-inner"
                />
            </div>
          </div>

          <div className="flex items-center gap-8 mt-14 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-6 rounded-full text-apple-300 hover:text-apple-500 hover:bg-white/40 transition-all font-black text-[11px] uppercase tracking-[0.3em]"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] glass-bubble-primary py-6 text-white rounded-full transition-all shadow-xl disabled:opacity-50 font-black text-[15px] tracking-[0.2em] uppercase active:scale-95 border-t border-white/40 flex items-center justify-center gap-4 group"
            >
              {loading ? 'Processing...' : 'Add Intelligence'}
              {!loading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
