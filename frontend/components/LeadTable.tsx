import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Search, SlidersHorizontal, Sparkles, ArrowRight, Zap, Shield, ChevronRight, Trash2 } from 'lucide-react';

interface LeadTableProps {
  leads: any[];
  onSearch: (s: string) => void;
  onFilter: (status: string) => void;
  onDelete: (id: number) => void;
}

const statusTheme: any = {
  new: 'bg-primary/10 text-primary border-primary/20',
  contacted: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  responded: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  qualified: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  converted: 'bg-secondary/10 text-secondary border-secondary/20',
  lost: 'bg-apple-200/40 text-apple-300 border-apple-200/50',
  invalid: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export default function LeadTable({ leads, onSearch, onFilter, onDelete }: LeadTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
        onDelete(id);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="relative w-full md:max-w-lg group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-apple-300 group-focus-within:text-primary transition-all duration-300" size={20} />
          <input
            type="text"
            placeholder="Filter by name, email or company..."
            value={searchTerm}
            onChange={handleSearch}
            className="glass-input w-full pl-16 pr-8 py-5 rounded-full text-apple-500 font-black placeholder-apple-200 shadow-xl"
          />
        </div>
        <div className="flex items-center space-x-6 w-full md:w-auto">
          <div className="relative flex-1 md:w-72 group">
            <select 
              onChange={(e) => onFilter(e.target.value)}
              className="glass-input w-full rounded-full px-8 py-5 outline-none cursor-pointer font-black text-apple-400 appearance-none shadow-xl pr-14 focus:text-primary transition-all"
            >
              <option value="">Status: All Intelligence</option>
              {['new', 'contacted', 'responded', 'qualified', 'converted', 'lost', 'invalid'].map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)} Leads</option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-apple-300 group-focus-within:text-primary transition-colors">
              <SlidersHorizontal size={16} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-premium rounded-[4rem] border-t border-white shadow-soft overflow-hidden animate-in fade-in zoom-in-95 duration-1000">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/40 border-b border-apple-100/50 text-apple-300 text-[11px] uppercase font-black tracking-[0.3em]">
                <th className="px-10 py-8">Lead Entity</th>
                <th className="px-10 py-8">Venture</th>
                <th className="px-10 py-8">Intent Score</th>
                <th className="px-10 py-8">Pipeline Stage</th>
                <th className="px-10 py-8 text-center">Interactions</th>
                <th className="px-10 py-8">Acquisition Date</th>
                <th className="px-10 py-8 text-right pr-14">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apple-100/30">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-10 py-32 text-center">
                    <p className="text-apple-300 font-black text-xs tracking-widest opacity-40 uppercase">No Intelligence Records Found</p>
                  </td>
                </tr>
              ) : null}
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-apple-50 transition-all duration-500 group cursor-pointer relative">
                  <td className="px-10 py-8">
                    <Link href={`/leads/${lead.id}`} className="block">
                      <div className="font-black text-apple-500 text-lg flex items-center gap-1 group-hover:text-primary transition-all tracking-tighter">
                        {lead.first_name} {lead.last_name}
                      </div>
                      <div className="text-xs text-apple-300 font-black mt-1.5 opacity-60 uppercase tracking-widest">{lead.email}</div>
                    </Link>
                  </td>
                  <td className="px-10 py-8">
                    <Link href={`/leads/${lead.id}`} className="block">
                      <div className="text-[15px] font-black text-apple-400 opacity-80 group-hover:opacity-100 tracking-tight">
                        {lead.company || <span className="text-apple-200 italic font-bold">Independent Entity</span>}
                      </div>
                    </Link>
                  </td>
                  <td className="px-10 py-8">
                    <Link href={`/leads/${lead.id}`} className="block">
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-2.5 glass rounded-full overflow-hidden border-t border-white shadow-inner">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              lead.score >= 71 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]' : 
                              lead.score <= 30 ? 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.3)]' : 
                              'bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]'
                            }`}
                            style={{ width: `${lead.score}%` }}
                          ></div>
                        </div>
                        <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${
                           lead.score >= 71 ? 'text-emerald-500' : 
                           lead.score <= 30 ? 'text-red-500' : 
                           'text-primary'
                        }`}>{lead.score >= 71 ? "Priority" : lead.score <= 30 ? "Cold" : "Warm"}</span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-10 py-8">
                    <Link href={`/leads/${lead.id}`} className="block">
                      <span className={`inline-flex items-center px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border-t border-white shadow-soft group-hover:scale-110 transition-all ${statusTheme[lead.status] || 'glass text-apple-400'}`}>
                        {lead.status}
                      </span>
                    </Link>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <Link href={`/leads/${lead.id}`} className="block">
                      <span className="text-lg font-black text-apple-500 glass w-12 h-12 inline-flex items-center justify-center rounded-2xl border-t border-white shadow-sm group-hover:scale-110 transition-transform">{lead.followup_attempts}</span>
                    </Link>
                  </td>
                  <td className="px-10 py-8 text-[13px] text-apple-300 font-black whitespace-nowrap opacity-60 uppercase tracking-widest">
                    <Link href={`/leads/${lead.id}`} className="block">
                      {format(new Date(lead.created_at), 'MMM dd, yyyy')}
                    </Link>
                  </td>
                  <td className="px-10 py-8 text-right pr-14">
                    <div className="flex justify-end gap-3">
                        <button 
                          onClick={(e) => handleDelete(e, lead.id)}
                          className="w-12 h-12 glass rounded-full text-apple-200 hover:text-red-500 hover:bg-white border-t border-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-soft"
                        >
                          <Trash2 size={20} />
                        </button>
                        <ChevronRight className="text-apple-200 group-hover:text-primary group-hover:translate-x-2 transition-all" size={24} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
