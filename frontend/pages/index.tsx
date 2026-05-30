import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import {
  ArrowRight, Bot, Zap, Shield, Sparkles, ChevronRight,
  Target, Mail, BarChart3, Globe, Layers, MessageCircle, ShieldCheck,
  UserCircle, Users
} from 'lucide-react';

const statuses = [
  { s: 'New', m: 'Fresh records just entering the stream. Untouched intelligence.', icon: Sparkles, color: 'text-orange-400' },
  { s: 'Contacted', m: 'Initial Outreach phase initiated. actively monitoring.', icon: Mail, color: 'text-primary' },
  { s: 'Responded', m: 'Active intent detected. High-priority review required.', icon: MessageCircle, color: 'text-secondary' },
  { s: 'Qualified', m: 'Intent verified. meets all strategic partnership criteria.', icon: ShieldCheck, color: 'text-emerald-500' },
  { s: 'Converted', m: 'Mission objective achieved. Partnership secured.', icon: Zap, color: 'text-amber-500' },
  { s: 'Lost', m: 'Signal dissipated. archived for potential re-intelligence.', icon: Layers, color: 'text-apple-300' }
];

export default function Home() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <Layout>
      <div className={`transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>

        {/* HERO SECTION: Permanent Free Status */}
        <section className="relative pt-32 pb-40 overflow-hidden">
          <div className="w-full text-center relative z-10 px-4">
            <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-black text-apple-500 tracking-tighter leading-[0.8] animate-in slide-in-from-bottom duration-1000">
              All your leads on <br />
              <span className="relative inline-block mt-4">
                one platform.
                <svg className="absolute -bottom-4 left-0 w-full h-8 text-primary opacity-80" viewBox="0 0 500 50" preserveAspectRatio="none">
                  <path d="M5,45 Q250,5 495,45" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-20 text-2xl md:text-5xl text-apple-400 font-black tracking-tight mx-auto leading-relaxed opacity-80">
              Capture, Convert, and <span className="text-secondary italic underline decoration-secondary/30 decoration-8 underline-offset-8">Repeat .</span>
            </p>

            <div className="mt-24 flex flex-col md:flex-row items-center justify-center gap-10">
              <Link href="/login">
                <button className="glass-bubble-orange py-8 px-20 rounded-full font-black text-2xl text-apple-950 flex items-center group shadow-2xl hover:scale-105 active:scale-95 transition-all">
                  Get Started Free
                  <ArrowRight className="ml-5 group-hover:translate-x-2 transition-all" size={32} />
                </button>
              </Link>
              <button className="glass-bubble py-8 px-20 rounded-full font-black text-2xl text-apple-500 hover:bg-white transition-all shadow-apple-medium active:scale-95">
                Meet an advisor
              </button>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1000px] bg-primary/5 blur-[150px] rounded-full -z-0 opacity-40"></div>
        </section>

        {/* SECTION: The Nexsarth Intelligence Suite (Service Description) */}
        <section className="py-40 bg-white/40 border-b border-apple-100/30">
          <div className="w-full px-4 mb-24 text-center lg:text-left">
            <h2 className="text-6xl md:text-8xl font-black text-apple-500 tracking-tighter leading-none mb-8">
              Lead Intelligence, Simplified.<br />
              <span className="text-primary italic">Clarity in every lead.</span>
            </h2>
            <p className="text-xl md:text-2xl text-apple-400 font-black uppercase tracking-[0.4em] opacity-60">Built for teams that move fast. </p>
          </div>

          <div className="w-full grid md:grid-cols-3 gap-12 px-4">
            {[
              {
                title: "Contact Hub",
                desc: "Organize and score your leads with surgical precision. Track status, engagement levels, and deal potential in a single liquid interface.",
                icon: Users,
                color: "text-orange-400",
                bg: "bg-orange-500/5"
              },
              {
                title: "Outreach Pulse",
                desc: "Automate your engagement with connected Gmail intelligence. Our system sends follow-ups and tracks responses autonomously while you stay in control.",
                icon: Mail,
                color: "text-primary",
                bg: "bg-primary/5"
              },
              {
                title: "Strategic Insights",
                desc: "Advanced analytics that show you exactly what's working. Monitor conversion rates and pipeline health with high-fidelity visual reports.",
                icon: BarChart3,
                color: "text-secondary",
                bg: "bg-secondary/5"
              }
            ].map((service, i) => (
              <div key={i} className="group glass-premium p-16 rounded-[4.5rem] border-t border-white shadow-soft hover:shadow-2xl hover:-translate-y-4 transition-all duration-700 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-64 h-64 ${service.bg} blur-[80px] -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000`}></div>

                <div className="relative z-10">
                  <div className={`w-24 h-24 glass rounded-[2.5rem] flex items-center justify-center ${service.color} mb-12 shadow-xl border-t border-white group-hover:scale-110 transition-transform`}>
                    <service.icon size={44} />
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-apple-500 mb-8 tracking-tighter">{service.title}</h3>
                  <p className="text-xl text-apple-300 font-black leading-relaxed opacity-80">{service.desc}</p>

                  <div className="mt-12 flex items-center gap-3 text-apple-400 font-black text-sm uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                    <span>Explore Module</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: Visual Showcase */}
        <section className="py-40 bg-white/40">
          <div className="w-full px-4">
            <div className="grid lg:grid-cols-2 gap-32 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-6xl md:text-8xl font-black text-apple-500 tracking-tighter leading-none mb-12">
                  Unified <br />
                  <span className="text-primary">Lead Control.</span>
                </h2>
                <div className="space-y-12">
                  <div className="flex gap-10 group cursor-default">
                    <div className="w-24 h-24 glass rounded-[2rem] flex items-center justify-center text-orange-400 shrink-0 border-t border-white shadow-xl">
                      <Target size={40} />
                    </div>
                    <div>
                      <h3 className="text-4xl font-black text-apple-500 mb-2">Instant Capture</h3>
                      <p className="text-xl text-apple-300 font-black leading-relaxed opacity-80">Import leads instantly into your stream. No manual data entry required.</p>
                    </div>
                  </div>
                  <div className="flex gap-10 group cursor-default">
                    <div className="w-24 h-24 glass rounded-[2rem] flex items-center justify-center text-primary shrink-0 border-t border-white shadow-xl">
                      <Mail size={40} />
                    </div>
                    <div>
                      <h3 className="text-4xl font-black text-apple-500 mb-2">Direct Outreach</h3>
                      <p className="text-xl text-apple-300 font-black leading-relaxed op
acity-80">Connected Gmail automation handles your engagement wave autonomously.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="glass-premium rounded-[5rem] p-8 border-t border-white shadow-2xl overflow-hidden transition-all duration-700 hover:scale-[1.02]">
                  <img src="/lms_dashboard_preview_1775726683669.png" alt="Nexsarth Dashboard Preview" className="rounded-[3.2rem] w-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Simple 3-Step Guide (Simple English) */}
        <section className="py-48 bg-white/40 border-t border-apple-100/30">
          <div className="w-full text-center mb-24 px-4">
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-apple-500 tracking-tighter mb-8 leading-none">
              Start your journey <br />
              <span className="text-secondary">in 3 Easy Steps.</span>
            </h2>
            <p className="text-xl md:text-3xl text-apple-300 font-black uppercase tracking-[0.3em] opacity-40">No complicated talk. Just results.</p>
          </div>

          <div className="w-full grid md:grid-cols-3 gap-12 px-4">
            {[
              { step: "01", title: "Join us", desc: "Create your free account in 30 seconds. No credit card, no fees.", icon: UserCircle },
              { step: "02", title: "Add Leads", desc: "Put your customer info into the system. It's easy like typing a message.", icon: Users },
              { step: "03", title: "Close Deals", desc: "Talk to your customers and grow your business. We handle the rest.", icon: Target }
            ].map((item, i) => (
              <div key={i} className="glass-premium p-16 rounded-[5rem] border-t border-white shadow-soft group hover:-translate-y-4 transition-all duration-700">
                <div className="w-24 h-24 glass rounded-[2.5rem] flex items-center justify-center text-primary mb-10 group-hover:scale-110 transition-transform border-t border-white shadow-xl">
                  <item.icon size={44} />
                </div>
                <div className="text-5xl font-black text-apple-100 mb-4 group-hover:text-primary/20 transition-colors tracking-tighter">{item.step}</div>
                <h3 className="text-5xl font-black text-apple-500 mb-6 tracking-tight leading-none">{item.title}</h3>
                <p className="text-xl text-apple-300 font-black leading-relaxed opacity-80">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: Intelligence Matrix (Status Glossary) */}
        <section className="py-48 bg-white/40 border-t border-apple-100/30">
          <div className="w-full px-4 mb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
              <div className="max-w-4xl">
                <h2 className="text-6xl md:text-8xl font-black text-apple-500 tracking-tighter leading-[0.9] mb-8">
                  The Status <br />
                  <span className="text-primary italic">Intelligence Matrix.</span>
                </h2>
                <p className="text-xl md:text-2xl text-apple-300 font-black uppercase tracking-[0.4em] opacity-60">Understanding the states of your intelligence stream</p>
              </div>
              <div className="hidden lg:block text-right">
                <div className="text-apple-200 font-black text-xs uppercase tracking-widest mb-4"></div>
                <div className="w-64 h-[2px] bg-apple-100 ml-auto"></div>
              </div>
            </div>
          </div>

          <div className="w-full grid md:grid-cols-2 xl:grid-cols-3 gap-10 px-4">
            {[
              { s: 'New', m: 'Fresh records just entering the stream.', act: 'Awaiting initial triage.', icon: Sparkles, color: 'text-orange-400', bg: 'bg-orange-500/5' },
              { s: 'Contacted', m: 'Initial Outreach wave has been initiated.', act: 'Actively monitoring signals.', icon: Mail, color: 'text-primary', bg: 'bg-primary/5' },
              { s: 'Responded', m: 'Active lead intent has been detected.', act: 'High-priority review needed.', icon: MessageCircle, color: 'text-secondary', bg: 'bg-secondary/5' },
              { s: 'Qualified', m: 'Lead meets all strategic criteria.', act: 'Verified for partnership.', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
              { s: 'Converted', m: 'Mission objective achieved.', act: 'Partnership successfully secured.', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/5' },
              { s: 'Lost', m: 'Signal dissipated or lead disengaged.', act: 'Archived for future cycles.', icon: Layers, color: 'text-apple-300', bg: 'bg-apple-200/10' }
            ].map((status, i) => (
              <div key={i} className={`group relative glass-premium p-12 rounded-[4rem] border-t border-white shadow-soft hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-48 h-48 ${status.bg} blur-3xl -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000`}></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-12">
                    <div className={`w-20 h-20 glass rounded-3xl flex items-center justify-center ${status.color} shadow-lg border-t border-white group-hover:scale-110 transition-transform`}>
                      <status.icon size={36} />
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-apple-200 uppercase tracking-widest mb-1">Status Code</div>
                      <div className="text-apple-400 font-black text-sm">0{i + 1}-INTEL</div>
                    </div>
                  </div>

                  <h3 className="text-4xl font-black text-apple-500 mb-6 tracking-tight">{status.s}</h3>
                  <p className="text-xl text-apple-300 font-black leading-relaxed opacity-80 mb-10 min-h-[4rem]">{status.m}</p>

                  <div className="pt-8 border-t border-apple-100/50">
                    <div className="text-[10px] font-black text-apple-200 uppercase tracking-widest mb-2">Automated Action</div>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${status.color} animate-pulse`}></div>
                      <span className="text-sm font-black text-apple-400 tracking-tight">{status.act}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* REFINED CTA */}
        <section className="pb-40 text-center">
          <div className="w-full glass shadow-apple-medium p-24 md:p-32 rounded-[5rem] border-t border-white relative overflow-hidden group hover:shadow-2xl transition-all">
            <h2 className="text-7xl md:text-9xl font-black text-apple-500 tracking-tighter mb-16 leading-none">Ready to start?</h2>
            <Link href="/leads">
              <button className="glass-bubble-orange py-10 px-24 rounded-full font-black text-3xl text-apple-950 shadow-2xl hover:scale-105 active:scale-95 transition-all inline-flex items-center">
                Go to Dashboard <ChevronRight className="ml-8" size={48} />
              </button>
            </Link>
            <p className="mt-14 text-apple-300 font-black uppercase text-sm tracking-[0.8em] opacity-50">Permanent Free Access — No Hidden Costs</p>
          </div>
        </section>

      </div>
    </Layout>
  );
}
