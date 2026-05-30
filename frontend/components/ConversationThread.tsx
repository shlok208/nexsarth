import React from 'react';
import { format } from 'date-fns';
import { Mail, MessageCircle, ArrowUpRight, ArrowDownLeft, Sparkles, Inbox, User } from 'lucide-react';

export default function ConversationThread({ conversations }: { conversations: any[] }) {
  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-24 h-full text-center">
        <div className="w-24 h-24 glass-bubble rounded-[2.5rem] flex items-center justify-center mb-8 border-t border-white shadow-xl">
            <Inbox size={40} className="text-apple-200" />
        </div>
        <h4 className="text-2xl font-black text-apple-300 uppercase tracking-tighter mb-4 opacity-40">No Intelligence Flow</h4>
        <p className="text-sm font-black text-apple-200 uppercase tracking-widest max-w-xs opacity-60">Communication history will be synchronized as signals are processed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 flex flex-col py-6 pb-24 px-4 md:px-8">
      {conversations.map((conv) => {
        const isInbound = conv.direction === 'inbound';
        return (
          <div key={conv.id} className={`flex ${isInbound ? 'justify-start' : 'justify-end'} group animate-in fade-in slide-in-from-bottom-6 duration-700`}>
            <div className={`max-w-[95%] md:max-w-[90%] rounded-3xl p-6 md:p-10 border-t border-white shadow-apple-soft relative transition-all duration-500 hover:shadow-apple-medium ${
              isInbound 
                ? 'glass-premium rounded-tl-none border-l-2 border-emerald-500/30' 
                : 'bg-white/90 backdrop-blur-3xl border border-primary/20 rounded-tr-none border-r-2 border-primary/30'
            }`}>
              
              {/* Message Header */}
              <div className="flex items-center justify-between mb-6 gap-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-t border-white shadow-sm ${isInbound ? 'bg-emerald-500/10 text-emerald-600' : 'bg-primary/10 text-primary'}`}>
                    {isInbound ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-[8px] font-black uppercase tracking-widest ${isInbound ? 'text-emerald-600' : 'text-primary'}`}>
                        {isInbound ? 'Received' : 'Sent'}
                    </span>
                    <span className="text-[8px] font-black text-apple-300 uppercase tracking-widest mt-0.5">
                        {format(new Date(conv.created_at), 'MMM d • HH:mm')}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Message Content */}
              <div className="relative">
                {conv.subject && (
                    <div className="mb-4 pt-1">
                        <span className="text-[9px] font-black text-apple-300 uppercase tracking-widest mr-2">Ref:</span>
                        <span className="text-sm font-black text-apple-500 tracking-tight leading-none italic opacity-90">{conv.subject}</span>
                    </div>
                )}
                
                <div className="text-[13px] md:text-sm font-black text-apple-400 whitespace-pre-wrap leading-relaxed tracking-tight">
                    {conv.content}
                </div>
              </div>

              {/* Interaction Details */}
              <div className="mt-8 pt-6 border-t border-apple-100/30 flex items-center gap-3 opacity-30 group-hover:opacity-100 transition-opacity">
                 <div className="w-1.5 h-1.5 rounded-full bg-apple-100"></div>
                 <span className="text-[8px] font-black text-apple-300 uppercase tracking-widest">Secure Link [EMAIL]</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
