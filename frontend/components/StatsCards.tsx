import React from 'react';
import { Users, TrendingUp, Target, Ghost, CheckCircle, PieChart, Inbox, Zap, MessageSquare, ShieldX } from 'lucide-react';

export default function StatsCards({ stats }: { stats: any }) {
  if (!stats) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-20 px-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-44 glass-premium animate-pulse rounded-[3.5rem] border border-white/30 shadow-apple-soft"></div>
      ))}
    </div>
  );

  const dist = stats.status_distribution || {};
  const total = stats.total_leads || 0;
  const contacted = dist.contacted || 0;
  const responded = dist.responded || 0;
  const lost = dist.lost || 0;

  const cards = [
    { 
      label: 'New Intelligence', 
      value: total, 
      icon: Users, 
      color: 'text-white',
      accent: 'bg-primary',
      glow: 'shadow-[0_20px_40px_rgba(37,99,235,0.3)]',
      iconBg: 'bg-gradient-to-tr from-blue-400 to-blue-600'
    },
    { 
      label: 'Contacted', 
      value: contacted, 
      icon: Inbox, 
      color: 'text-white',
      accent: 'bg-emerald-500', 
      glow: 'shadow-[0_20px_40px_rgba(16,185,129,0.3)]',
      iconBg: 'bg-gradient-to-tr from-emerald-400 to-emerald-600'
    },
    { 
      label: 'Responded', 
      value: responded, 
      icon: MessageSquare, 
      color: 'text-white',
      accent: 'bg-orange-500', 
      glow: 'shadow-[0_20px_40px_rgba(249,115,22,0.3)]',
      iconBg: 'bg-gradient-to-tr from-orange-400 to-orange-600'
    },
    { 
      label: 'Lost Leads', 
      value: lost, 
      icon: ShieldX, 
      color: 'text-white',
      accent: 'bg-rose-500', 
      glow: 'shadow-[0_20px_40px_rgba(244,63,94,0.3)]',
      iconBg: 'bg-gradient-to-tr from-rose-400 to-rose-600'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-20 px-2">
      {cards.map((card, idx) => (
        <div key={idx} className={`glass-premium p-10 rounded-[4rem] border-t border-white flex items-center gap-8 ${card.glow} hover:scale-[1.05] transition-all duration-700 cursor-pointer group`}>
          <div className={`w-20 h-20 ${card.iconBg} rounded-[2rem] flex items-center justify-center border-t border-white/40 shadow-xl group-hover:rotate-12 transition-transform`}>
            <card.icon size={36} className="text-white drop-shadow-md" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-5xl font-black text-apple-500 tracking-tighter leading-none mb-1">
                {card.value}
            </h4>
            <p className="text-[11px] font-black text-apple-300 uppercase tracking-[0.25em] opacity-80">
                {card.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
