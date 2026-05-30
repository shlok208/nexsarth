import React, { useEffect, useState } from 'react';

export default function GalaxyBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ 
        x: (e.clientX / window.innerWidth - 0.5) * 50, 
        y: (e.clientY / window.innerHeight - 0.5) * 50 
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden bg-slate-900" style={{ zIndex: -1 }}>
      {/* Lighter, More Vibrant Nebula Atmosphere */}
      <div 
        className="absolute w-[180vw] h-[180vw] top-[-40%] left-[-40%] opacity-40 blur-[130px] mix-blend-screen transition-transform duration-1000 ease-out"
        style={{
          background: `
            radial-gradient(circle at 25% 35%, rgba(20, 184, 166, 0.5) 0%, transparent 45%),
            radial-gradient(circle at 75% 25%, rgba(59, 130, 246, 0.4) 0%, transparent 45%),
            radial-gradient(circle at 45% 75%, rgba(168, 85, 247, 0.45) 0%, transparent 45%),
            radial-gradient(circle at 65% 55%, rgba(45, 212, 191, 0.5) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 60%)
          `,
          transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(1.1)`
        }}
      ></div>

      {/* Sparkling Twinkling Stars - Three Continuous Looping Layers */}
      <div className="stars-layer stars-small animate-star-drift"></div>
      <div className="stars-layer stars-medium animate-star-drift-reverse"></div>
      
      {/* Realistic Large Glowing Stars (Supergiants) */}
      <div className="absolute inset-0 z-0 opacity-80">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="supergiant-star"
            style={{
                top: `${(i * 13) % 100}%`,
                left: `${(i * 21) % 100}%`,
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                background: i % 2 === 0 ? '#fff' : '#e0f2fe',
                boxShadow: `0 0 ${10 + (i % 10)}px ${2 + (i % 5)}px ${i % 3 === 0 ? 'rgba(20, 184, 166, 0.6)' : 'rgba(59, 130, 246, 0.5)'}`,
                animationDelay: `${i * 1.5}s`,
                animationDuration: `${3 + (i % 5)}s`
            }}
          ></div>
        ))}
      </div>

      {/* Shooting Stars Container */}
      <div className="absolute inset-0 z-0">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className={`shooting-star`}
            style={{
                top: `${(i * 15) % 60}%`,
                left: `${(i * 10) % 80}%`,
                animationDelay: `${i * 4}s`,
                animationDuration: `${2.5 + (i % 2)}s`
            }}
          ></div>
        ))}
      </div>

      {/* Pulsing Galaxy Core */}
      <div className="absolute top-[15%] left-[25%] w-[50vw] h-[50vw] bg-blue-500/10 blur-[200px] rounded-full animate-pulse-infinite"></div>

      <style jsx>{`
        .stars-layer {
          position: absolute;
          top: -100%;
          left: -100%;
          width: 300%;
          height: 300%;
          background-repeat: repeat;
          pointer-events: none;
        }
        
        .stars-small {
          background-image: 
            radial-gradient(1px 1px at 25px 35px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 75px 85px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 150px 120px, #eee, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 60px 180px, #fff, rgba(0,0,0,0));
          background-size: 250px 250px;
          animation: twinkle-pulse 4s infinite ease-in-out;
          opacity: 0.6;
        }

        .stars-medium {
          background-image: 
            radial-gradient(1.5px 1.5px at 125px 35px, #fff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 45px 165px, #fff, rgba(0,0,0,0)),
            radial-gradient(1.5px 1.5px at 190px 240px, #ddd, rgba(0,0,0,0));
          background-size: 350px 350px;
          animation: twinkle-pulse 6s infinite ease-in-out reverse;
          animation-delay: 1s;
          opacity: 0.4;
        }

        /* Large Realistic Glowing Stars */
        .supergiant-star {
          position: absolute;
          border-radius: 50%;
          animation: glow-pulse infinite ease-in-out;
        }

        @keyframes glow-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.4); opacity: 1; }
        }

        /* Shooting Star Effect */
        .shooting-star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #fff;
          border-radius: 50%;
          opacity: 0;
          animation: shootingStar linear infinite;
        }
        .shooting-star::after {
          content: "";
          position: absolute;
          top: 50%;
          transform: translateY(-50%) rotate(-45deg);
          width: 150px;
          height: 1px;
          background: linear-gradient(90deg, #fff, transparent);
        }

        @keyframes shootingStar {
          0% { transform: translateX(0) scale(0); opacity: 0; }
          5% { opacity: 1; scale(1); }
          40% { transform: translateX(400px) translateY(400px); opacity: 1; }
          100% { transform: translateX(800px) translateY(800px) scale(0); opacity: 0; }
        }

        @keyframes twinkle-pulse {
          0%, 100% { 
            opacity: 0.3; 
            transform: translate(0, 0) scale(1);
          }
          50% { 
            opacity: 0.9; 
            transform: translate(10px, 10px) scale(1.05);
          }
        }
        
        .animate-star-drift { animation: starDrift 120s linear infinite; }
        .animate-star-drift-reverse { animation: starDrift 180s linear infinite reverse; }

        @keyframes starDrift {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes pulse-infinite {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.3); opacity: 0.3; }
        }
        .animate-pulse-infinite { animation: pulse-infinite 12s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
