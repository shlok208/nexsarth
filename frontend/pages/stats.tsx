import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import StatsCards from '@/components/StatsCards';
import QualifiedAlert from '@/components/QualifiedAlert';
import { StatsService, LeadService } from '@/lib/api';
import { BarChart3, Rocket, Activity, Zap, PieChart, TrendingUp, Inbox, Calendar, User, Search, ChevronRight, RotateCw, Donut } from 'lucide-react';
import { format } from 'date-fns';

export default function StatsPage() {
  const [stats, setStats] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [statsData, leadsData] = await Promise.all([
        StatsService.getOverview(),
        LeadService.getLeads({ limit: 5 })
      ]);
      setStats(statsData);
      setLeads(leadsData);
    } catch (e) {
      console.error("Data Retrieval Error:", e);
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
    
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const total = stats?.total_leads || 0;
  const dist = stats?.status_distribution || {};
  
  // Calculate Donut Segments
  const segments = [
    { label: 'New', val: dist.new || 0, color: '#2563eb' },
    { label: 'Contacted', val: dist.contacted || 0, color: '#10b981' },
    { label: 'Responded', val: dist.responded || 0, color: '#f59e0b' },
    { label: 'Lost', val: dist.lost || 0, color: '#f43f5e' }
  ];
  
  const totalInDist = segments.reduce((acc, s) => acc + s.val, 0) || 1;
  let currentRotation = 0;

  return (
    <Layout>
      <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="mb-14 flex justify-between items-center px-4">
          <div>
            <h1 className="text-6xl font-black text-apple-500 tracking-tighter uppercase leading-none">Intelligence Hub</h1>
            <p className="text-apple-300 mt-4 text-[11px] font-black uppercase tracking-[0.3em] opacity-70">Strategic Analytics & Performance Matrix</p>
          </div>
          <div className="flex items-center gap-6">
            <button 
                onClick={fetchData}
                disabled={refreshing}
                className={`w-14 h-14 glass-bubble rounded-full flex items-center justify-center border-t border-white shadow-apple-soft hover:scale-110 active:scale-95 transition-all group ${refreshing ? 'opacity-50' : ''}`}
                title="Refresh Intelligence Data"
            >
                <RotateCw size={22} className={`text-primary transition-transform duration-700 ${refreshing ? 'rotate-180' : 'group-hover:rotate-180'}`} />
            </button>
          </div>
        </div>

        <QualifiedAlert leads={leads} />

        <div className="mb-14">
          <StatsCards stats={stats} />
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-12 mb-14">
            {/* VOLUMETRIC BAR CHART */}
            <div className="xl:col-span-3 glass-premium p-12 rounded-[5rem] border-t border-white shadow-apple-medium relative overflow-hidden">
                <div className="flex justify-between items-center mb-16 relative z-10">
                    <div>
                        <h3 className="text-3xl font-black text-apple-500 tracking-tight leading-none">Intelligence Density</h3>
                        <p className="text-[11px] font-black text-apple-300 uppercase tracking-[0.3em] mt-3 opacity-60">Volumetric Intensity per day</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 px-5 py-2.5 glass-bubble rounded-full border border-primary/20 text-[9px] font-black text-primary uppercase tracking-widest shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-primary mb-0.5 animate-pulse"></div> Generated
                        </div>
                        <div className="flex items-center gap-2 px-5 py-2.5 glass-bubble rounded-full border border-rose-500/20 text-[9px] font-black text-rose-600 uppercase tracking-widest shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-rose-500 mb-0.5"></div> Lost
                        </div>
                    </div>
                </div>

                <div className="h-[450px] flex items-end justify-between px-6 gap-4">
                    {(() => {
                        const velocityData = stats?.daily_velocity || [];
                        const maxVal = Math.max(...velocityData.map((d: any) => Math.max(d.new || 0, d.lost || 0)), 10);
                        
                        return velocityData.map((bar: any, i: number) => (
                            <div key={i} className="flex-1 flex flex-col items-center group">
                                <div className="w-full relative flex items-end justify-center mb-6 h-full gap-1.5">
                                    {/* NEW BAR */}
                                    <div 
                                        className="w-full max-w-[30px] glass-bubble-primary rounded-t-xl transition-all duration-1000 ease-out shadow-lg relative overflow-hidden"
                                        style={{ 
                                            height: mounted ? `${((bar.new || 0) / maxVal) * 100}%` : '0%', 
                                            transitionDelay: `${i * 100}ms` 
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                                    </div>
                                    {/* LOST BAR */}
                                    <div 
                                        className="w-full max-w-[30px] bg-rose-500 rounded-t-xl transition-all duration-1000 ease-out shadow-lg relative overflow-hidden border-t border-white/40"
                                        style={{ 
                                            height: mounted ? `${((bar.lost || 0) / maxVal) * 100}%` : '0%', 
                                            transitionDelay: `${i * 100 + 50}ms`,
                                            boxShadow: '0 10px 30px -5px rgba(244, 63, 94, 0.4)'
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-apple-300 uppercase tracking-widest">{bar.day}</span>
                            </div>
                        ));
                    })()}
                </div>
            </div>

            {/* DONUT INTELLIGENCE */}
            <div className="glass-premium p-12 rounded-[5rem] border-t border-white shadow-apple-medium flex flex-col items-center relative overflow-hidden">
                <h3 className="text-2xl font-black text-apple-500 tracking-tight leading-none mb-2 text-center">Status Mix</h3>
                <p className="text-[10px] font-black text-apple-300 uppercase tracking-[0.2em] opacity-60 mb-12 text-center">Neural Distribution</p>
                
                <div className="relative w-64 h-64 mb-16">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {segments.map((seg, i) => {
                            const percentage = (seg.val / totalInDist) * 100;
                            const strokeDasharray = `${percentage} ${100 - percentage}`;
                            const strokeDashoffset = -currentRotation;
                            currentRotation += percentage;
                            
                            return (
                                <circle
                                    key={i}
                                    cx="50" cy="50" r="40"
                                    fill="none"
                                    stroke={seg.color}
                                    strokeWidth="12"
                                    strokeDasharray={`${(percentage * 251.2) / 100} 251.2`}
                                    strokeDashoffset={`${(strokeDashoffset * 251.2) / 100}`}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000"
                                    style={{ transitionDelay: `${i * 150}ms` }}
                                />
                            );
                        })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[10px] font-black text-apple-300 uppercase tracking-widest">Total</span>
                        <span className="text-4xl font-black text-apple-500 tracking-tighter">{total}</span>
                    </div>
                </div>

                <div className="w-full space-y-4">
                    {segments.map((seg, i) => (
                        <div key={i} className="flex items-center justify-between p-4 glass-bubble rounded-3xl border border-apple-100/30">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }}></div>
                                <span className="text-[10px] font-black text-apple-400 uppercase tracking-widest">{seg.label}</span>
                            </div>
                            <span className="text-xl font-black text-apple-500 tracking-tighter">{seg.val}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 mb-14">
             {/* RECENT RECORDS (Moved to bottom grid) */}
             <div className="xl:col-span-3 glass-premium p-14 rounded-[5rem] border-t border-white shadow-apple-medium relative overflow-hidden">
                <h3 className="text-3xl font-black text-apple-500 tracking-tight leading-none mb-12">Intelligence Stream</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {leads.map((lead, i) => (
                        <div key={i} className="flex items-center gap-6 p-6 glass-bubble rounded-[2.5rem] border border-apple-100/30 group hover:bg-white/60 transition-all cursor-crosshair">
                            <div className={`w-14 h-14 glass rounded-2xl flex items-center justify-center border-t border-white shadow-md ${
                                lead.status === 'qualified' ? 'text-emerald-500' :
                                lead.status === 'contacted' ? 'text-primary' :
                                'text-apple-300'
                            }`}>
                                <User size={24} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h4 className="text-lg font-black text-apple-500 tracking-tight truncate">{lead.first_name || 'Incognito'}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                                    <p className="text-[9px] font-black text-apple-300 uppercase tracking-widest truncate">{lead.status}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {leads.length === 0 && (
                        <div className="col-span-full py-20 text-center opacity-30">
                            <h4 className="text-lg font-black uppercase tracking-widest">No Stream Data</h4>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* BOTTOM METRIC SUMMARY */}
        <div className="glass-premium p-14 rounded-[5rem] border-t border-white shadow-apple-medium flex flex-col md:flex-row items-center gap-14 group transition-all duration-1000 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -mr-32 -mt-32"></div>
          <div className="w-32 h-32 glass-bubble rounded-[3rem] flex items-center justify-center flex-shrink-0 border border-t-white transition-transform group-hover:scale-110 group-hover:rotate-6 shadow-xl">
            <Zap size={56} className="text-primary" />
          </div>
          <div className="text-center md:text-left relative z-10">
            <h2 className="text-5xl font-black text-apple-500 tracking-tighter leading-none mb-6">Success Index</h2>
            <p className="text-apple-400 text-xl font-black leading-relaxed max-w-4xl opacity-80">
              Operational Efficiency is currently optimized.
              All intelligence points are being monitored for autonomous follow-up activation.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
