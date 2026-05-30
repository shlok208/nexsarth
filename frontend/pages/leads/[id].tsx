import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import ConversationThread from '@/components/ConversationThread';
import StatusTimeline from '@/components/StatusTimeline';
import { LeadService } from '@/lib/api';
import { Mail, Phone, Building2, User2, Calendar, CheckCircle2, MessageCircle, ChevronLeft, Trash2, Edit3, Fingerprint, Activity, Zap } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function LeadDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [lead, setLead] = useState<any>(null);
  const [conversations, setConversations] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!id) return;
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leadData, convData, histData] = await Promise.all([
        LeadService.getLead(Number(id)),
        LeadService.getLeadConversations(Number(id)),
        LeadService.getLeadStatusHistory(Number(id))
      ]);
      setLead(leadData);
      setConversations(convData);
      setHistory(histData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setLoading(true);
      await LeadService.updateLeadStatus(Number(id), newStatus);
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !lead) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-[60vh]">
          <div className="w-16 h-16 glass-bubble rounded-full border-t border-white mb-8 flex items-center justify-center animate-spin">
            <Activity className="text-primary" />
          </div>
          <p className="text-apple-300 font-black uppercase tracking-[0.4em] text-[10px]">Accessing Record Cluster...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        
        {/* Navigation & Compact Actions */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Link href="/leads">
            <div className="inline-flex items-center text-apple-300 hover:text-primary transition-all group cursor-pointer bg-white px-4 py-2 rounded-full border border-apple-100 shadow-sm">
              <ChevronLeft size={14} className="mr-1 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[9px] font-black uppercase tracking-widest">Hub</span>
            </div>
          </Link>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button 
                onClick={async () => {
                    if (confirm("Permanently archive and delete this intelligence point?")) {
                        try {
                            await LeadService.deleteLead(Number(id));
                            router.push('/leads');
                        } catch (e) { console.error(e); }
                    }
                }}
                className="flex-1 md:flex-none px-5 py-2.5 rounded-full font-black text-[9px] uppercase tracking-widest text-red-500/60 hover:text-red-500 hover:bg-red-50 transition-all border border-apple-100 flex items-center justify-center gap-2"
            >
                <Trash2 size={12} /> Delete
            </button>
            <button className="flex-1 md:flex-none glass-bubble-primary px-5 py-2.5 rounded-full font-black text-[9px] uppercase tracking-widest shadow-apple-soft flex items-center justify-center gap-2 active:scale-95 transition-all">
                <Edit3 size={12} /> Modify
            </button>
          </div>
        </div>

        {/* Hero Identity Section: Downscaled */}
        <div className="mb-10">
            <div className="flex flex-col md:flex-row items-center md:items-center gap-8">
                <div className="w-16 h-16 md:w-20 md:h-20 glass-premium rounded-2xl md:rounded-3xl flex items-center justify-center border border-white shadow-xl shrink-0">
                    <div className="relative">
                        <User2 size={28} className="text-primary" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 glass-bubble-orange rounded-full flex items-center justify-center border border-white shadow-md">
                            <Fingerprint size={10} className="text-apple-950" />
                        </div>
                    </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-apple-500 tracking-tighter leading-none uppercase mb-2">
                                {lead.first_name} <span className="text-primary italic">{lead.last_name}</span>
                            </h1>
                            <div className="flex items-center justify-center md:justify-start gap-4">
                                <div className="glass px-4 py-1.5 rounded-full border border-apple-100 flex items-center gap-2 shadow-sm">
                                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                        lead.status === 'qualified' || lead.status === 'converted' ? 'bg-emerald-500' : 'bg-primary'
                                    }`}></div>
                                    <span className="text-[9px] font-black text-apple-400 uppercase tracking-widest">{lead.status}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="glass-premium px-6 py-3 rounded-2xl border-t border-white shadow-apple-soft flex items-center gap-4">
                            <div className="flex flex-col text-right">
                                <span className="text-[8px] font-black text-apple-300 uppercase tracking-widest opacity-60">Status Switchboard</span>
                                <select 
                                    value={lead.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className="bg-transparent font-black text-[11px] text-primary uppercase tracking-[0.1em] outline-none cursor-pointer hover:scale-105 transition-transform text-right"
                                >
                                    <option value="new">New Record</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="responded">Responded</option>
                                    <option value="qualified">Qualified</option>
                                    <option value="converted">Converted</option>
                                    <option value="lost">Archived</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Intel Body: Optimized Two-Column Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* SIDE PANEL: Dossier, Dynamics & Narrative */}
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
                
                {/* Unified Intelligence Card: Thinner Padding */}
                <div className="glass-premium p-6 md:p-8 rounded-[2rem] border-t border-white shadow-apple-soft relative overflow-hidden">
                    <div className="space-y-10">
                        {/* Essential Dossier */}
                        <div>
                            <h4 className="text-[9px] font-black text-apple-300 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Fingerprint size={12} /> Dossier
                            </h4>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <span className="text-[8px] font-black text-apple-200 uppercase tracking-widest ml-2">Uplink</span>
                                    <div className="glass p-3 rounded-2xl border border-apple-100 text-[11px] font-black text-apple-500 truncate cursor-copy">
                                        {lead.email}
                                    </div>
                                </div>
                                {lead.phone && (
                                    <div className="space-y-1.5">
                                        <span className="text-[8px] font-black text-apple-200 uppercase tracking-widest ml-2">Frequency</span>
                                        <div className="glass p-3 rounded-2xl border border-apple-100 text-[11px] font-black text-apple-500">
                                            {lead.phone}
                                        </div>
                                    </div>
                                )}
                                {lead.company && (
                                    <div className="space-y-1.5">
                                        <span className="text-[8px] font-black text-apple-200 uppercase tracking-widest ml-2">Node</span>
                                        <div className="glass p-3 rounded-2xl border border-apple-100 text-[11px] font-black text-secondary">
                                            {lead.company}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dynamics Matrix */}
                        <div>
                            <h4 className="text-[9px] font-black text-apple-300 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 border-t border-apple-100/30 pt-8">
                                <Activity size={12} /> Matrix
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="glass p-4 rounded-2xl flex flex-col items-center text-center">
                                    <span className="text-4xl font-black text-primary leading-none tracking-tighter">{lead.followup_attempts}</span>
                                    <span className="text-[7px] font-black text-apple-200 uppercase tracking-widest mt-1">Uplinks</span>
                                </div>
                                <div className={`glass p-4 rounded-2xl flex flex-col items-center text-center ${
                                    lead.score >= 71 ? 'bg-emerald-500/5' : lead.score <= 30 ? 'bg-red-500/5' : ''
                                }`}>
                                    <span className={`text-4xl font-black leading-none tracking-tighter ${
                                        lead.score >= 71 ? 'text-emerald-500' : lead.score <= 30 ? 'text-red-500' : 'text-primary'
                                    }`}>
                                        {lead.score}
                                    </span>
                                    <span className="text-[7px] font-black text-apple-200 uppercase tracking-widest mt-1">Intent</span>
                                </div>
                            </div>
                        </div>

                        {/* Lifecycle Stream */}
                        <div>
                            <h4 className="text-[9px] font-black text-apple-300 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 border-t border-apple-100/30 pt-8">
                                <Zap size={12} /> Log
                            </h4>
                            <div className="max-h-[250px] overflow-y-auto px-1 hide-scrollbar">
                                <StatusTimeline history={history} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN AREA: Intelligence Thread: Reduced Height & Padding */}
            <div className="lg:col-span-8">
                <div className="glass-premium rounded-[2.5rem] border border-white shadow-apple-soft overflow-hidden flex flex-col h-[800px] relative">
                    <div className="px-8 py-6 border-b border-apple-100/50 flex items-center justify-between flex-shrink-0 z-10 backdrop-blur-3xl bg-white/40">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 glass-bubble rounded-xl flex items-center justify-center text-primary shadow-sm border-t border-white">
                                <MessageCircle size={22} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-apple-500 tracking-tighter leading-none uppercase">Stream</h3>
                                <p className="text-[9px] font-black text-apple-300 uppercase tracking-[0.2em] mt-1.5 opacity-60">Synchronized Communication</p>
                            </div>
                        </div>
                        <div className="glass px-4 py-2 rounded-full border border-white shadow-sm flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                           <span className="text-[8px] font-black text-apple-400 uppercase tracking-widest">Active Feed</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto hide-scrollbar bg-apple-50/10">
                        <ConversationThread conversations={conversations} />
                    </div>

                    <div className="p-4 absolute bottom-0 left-0 right-0 pointer-events-none">
                        <div className="w-full h-16 bg-gradient-to-t from-[#F5F5F7] to-transparent"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
}
