import React, { useEffect, useState } from 'react';

export default function FluidBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden bg-[#020617]" style={{ zIndex: -1 }}>
      {/* High-Intensity Deep Glows */}
      <div className="absolute top-[-15%] left-[-15%] w-[80vw] h-[80vw] rounded-full bg-teal-600/30 blur-[140px] animate-fluid-1 mix-blend-screen"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[70vw] h-[70vw] rounded-full bg-blue-700/30 blur-[140px] animate-fluid-2 mix-blend-screen"></div>
      <div className="absolute top-[20%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-700/20 blur-[140px] animate-fluid-3 mix-blend-screen"></div>
      
      {/* Dynamic Cursor Spotlight - Ultra Pulsing */}
      <div 
        className="absolute w-[900px] h-[900px] rounded-full opacity-[0.5] blur-[100px] transition-transform duration-500 ease-out pointer-events-none mix-blend-screen"
        style={{ 
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.25) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 80%)',
          left: mousePos.x - 450,
          top: mousePos.y - 450,
        }}
      ></div>

      {/* Cyberpunk Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(20, 184, 166, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 184, 166, 0.2) 1px, transparent 1px)', 
             backgroundSize: '50px 50px' 
           }}></div>
           
      {/* Glowing Moving Lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-teal-500/20 to-transparent animate-scan-down"></div>
        <div className="absolute top-0 left-[80%] w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent animate-scan-down delay-700"></div>
      </div>

      {/* High-Contrast Grain Texture */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
           style={{
             backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")'
           }}></div>

      <style jsx>{`
        @keyframes fluid-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(8%, 12%) scale(1.15); }
        }
        @keyframes fluid-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-12%, -8%) scale(1.2); }
        }
        @keyframes fluid-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-5%, 15%) scale(1.1); }
        }
        @keyframes scan-down {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-fluid-1 { animation: fluid-1 15s infinite alternate ease-in-out; }
        .animate-fluid-2 { animation: fluid-2 20s infinite alternate ease-in-out; }
        .animate-fluid-3 { animation: fluid-3 25s infinite alternate ease-in-out; }
        .animate-scan-down { animation: scan-down 8s infinite linear; }
        .delay-700 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}
