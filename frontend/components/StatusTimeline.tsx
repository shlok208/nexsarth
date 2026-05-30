import React from 'react';
import { format } from 'date-fns';
import { Clock, Info } from 'lucide-react';

export default function StatusTimeline({ history }: { history: any[] }) {
  if (!history || history.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-apple-100 rounded-apple-2xl text-apple-200">
            <Info size={24} className="mb-4 opacity-50" />
            <p className="text-sm font-medium italic">No activity recorded for this lead.</p>
        </div>
    );
  }

  // Ensure we only show records where a status shift occurred
  const filteredHistory = history.filter(event => event.from_status !== event.to_status);

  if (!filteredHistory || filteredHistory.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-apple-100 rounded-apple-2xl text-apple-200">
            <Info size={24} className="mb-4 opacity-50" />
            <p className="text-sm font-medium italic">No status changes recorded.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 relative py-4">
      {/* Sleek Vertical Path */}
      <div className="absolute left-[7px] top-0 bottom-0 w-[1px] bg-apple-100"></div>
      
      {filteredHistory.map((event, idx) => (
        <div key={event.id} className="relative pl-10 group">
          {/* Minimalist Node */}
          <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-apple-100 z-10 transition-all duration-300 group-hover:scale-125 group-hover:border-primary/20 group-hover:bg-primary shadow-sm">
             {idx === 0 && <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></div>}
          </div>
          
          <div className="bg-white p-5 rounded-apple-xl border border-apple-50 shadow-apple-soft hover:shadow-apple-medium transition-all duration-500 relative group-hover:border-apple-100">
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col space-y-1.5">
                    <span className="text-[10px] font-bold text-apple-200 uppercase tracking-wider">Status Change</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-apple-300 line-through opacity-50">{event.from_status || 'none'}</span>
                      <span className="text-apple-200 text-xs">→</span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          event.to_status === 'qualified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          event.to_status === 'converted' ? 'bg-secondary/5 text-secondary border-secondary/10' :
                          event.to_status === 'lost' ? 'bg-red-50 text-red-600 border-red-100' :
                          'bg-primary/5 text-primary border-primary/10'
                      }`}>
                          {event.to_status}
                      </span>
                    </div>
                </div>
                <div className="text-[10px] font-bold text-apple-200 uppercase tracking-tight flex items-center bg-apple-50 px-2 py-1 rounded-md">
                    <Clock size={10} className="mr-1.5" />
                    {format(new Date(event.created_at), 'MMM d, p')}
                </div>
            </div>
            
            {event.reason && (
                <div className="text-sm text-apple-400 font-medium leading-relaxed pl-4 border-l-2 border-apple-50 mt-2">
                    {event.reason}
                </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
