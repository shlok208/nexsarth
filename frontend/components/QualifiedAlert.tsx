import React from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, Target, Sparkles, CheckCircle } from 'lucide-react';

interface QualifiedAlertProps {
  leads: any[];
}

export default function QualifiedAlert({ leads }: QualifiedAlertProps) {
  const qualifiedLeads = leads.filter(l => l.status === 'qualified');

  if (qualifiedLeads.length === 0) return null;

  return (
    <div className="mb-10 animate-in fade-in slide-in-from-top duration-700">
      <div className="bg-white border border-emerald-100 rounded-apple-2xl p-6 md:p-8 relative overflow-hidden group shadow-apple-soft hover:shadow-apple-medium transition-all duration-500">
        {/* Subtle Decorative Gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 blur-3xl rounded-full -translate-y-20 translate-x-20 pointer-events-none transition-all duration-1000 group-hover:bg-emerald-100/50"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10">
          <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
            <CheckCircle size={32} />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <h2 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Opportunity Detected</h2>
            </div>
            <h3 className="text-2xl font-bold text-apple-500 tracking-tight mb-2">
              {qualifiedLeads.length} Lead{qualifiedLeads.length > 1 ? 's' : ''} Qualified
            </h3>
            <p className="text-apple-300 text-sm font-medium max-w-xl leading-relaxed">
              These prospects have shown high intent. Reach out personally to transition them to conversion.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 w-full md:w-64">
            {qualifiedLeads.slice(0, 2).map((lead) => (
              <Link key={lead.id} href={`/leads/${lead.id}`}>
                <div className="bg-emerald-50/30 hover:bg-emerald-50 border border-emerald-100/50 rounded-xl p-3.5 flex items-center justify-between group/item transition-all cursor-pointer">
                   <div className="flex flex-col overflow-hidden">
                      <span className="text-apple-500 font-bold text-sm truncate">{lead.first_name} {lead.last_name}</span>
                      <span className="text-[9px] text-emerald-600/70 font-bold uppercase tracking-wider truncate">{lead.company || 'Direct Contact'}</span>
                   </div>
                   <div className="ml-4 w-7 h-7 rounded-full bg-white text-emerald-500 flex items-center justify-center group-hover/item:translate-x-1 transition-transform shadow-sm border border-emerald-100/50 shrink-0">
                      <ArrowRight size={14} />
                   </div>
                </div>
              </Link>
            ))}
            {qualifiedLeads.length > 2 && (
               <div className="text-center md:text-left py-1 px-1">
                  <p className="text-[9px] font-bold text-apple-200 uppercase tracking-widest">+ {qualifiedLeads.length - 2} additional opportunities</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
