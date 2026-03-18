import React, { useState, useEffect } from "react";
import { Trophy, Heart, Star, Gamepad2, Coins } from "lucide-react";

export function ArcadeCabinet() {
  const [blink, setBlink] = useState(true);
  const [score, setScore] = useState(999990);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-black text-[#39ff14] overflow-hidden flex flex-col items-center justify-center font-mono select-none">
      {/* Google Font Import for Pixel Font */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        
        .font-pixel {
          font-family: 'Press Start 2P', monospace;
        }
        
        .scanlines {
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,0),
            rgba(255,255,255,0) 50%,
            rgba(0,0,0,0.2) 50%,
            rgba(0,0,0,0.2)
          );
          background-size: 100% 4px;
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          z-index: 10;
        }

        .crt {
          animation: textShadow 1.6s infinite;
        }

        @keyframes textShadow {
          0% {
            text-shadow: 0.4389924193300864px 0 1px rgba(0,30,255,0.5), -0.4389924193300864px 0 1px rgba(255,0,80,0.3), 0 0 3px;
          }
          5% {
            text-shadow: 2.7928974010788217px 0 1px rgba(0,30,255,0.5), -2.7928974010788217px 0 1px rgba(255,0,80,0.3), 0 0 3px;
          }
          100% {
            text-shadow: 0.4389924193300864px 0 1px rgba(0,30,255,0.5), -0.4389924193300864px 0 1px rgba(255,0,80,0.3), 0 0 3px;
          }
        }
        
        .neon-text {
          text-shadow: 0 0 5px #39ff14, 0 0 10px #39ff14, 0 0 20px #39ff14;
        }
      `}} />

      {/* Screen Glare & Scanlines */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/5 pointer-events-none z-0"></div>
      <div className="scanlines"></div>

      {/* Main Arcade Bezel/Frame */}
      <div className="absolute inset-4 border-4 border-[#39ff14] rounded-lg pointer-events-none opacity-50 shadow-[0_0_20px_#39ff14_inset]"></div>
      <div className="absolute inset-8 border-2 border-dashed border-[#39ff14]/30 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-12 h-full flex flex-col justify-between items-center text-center crt">
        
        {/* Top Header / Hi-Score */}
        <div className="w-full flex justify-between items-start font-pixel text-sm md:text-xl text-[#ff073a] neon-text tracking-widest uppercase mb-12">
          <div className="flex flex-col items-start">
            <span>1UP</span>
            <span className="text-[#39ff14]">000000</span>
          </div>
          <div className="flex flex-col items-center">
            <span>HI-SCORE</span>
            <span className="text-[#39ff14]">{score}</span>
          </div>
          <div className="flex flex-col items-end">
            <span>CREDIT</span>
            <span className="flex items-center gap-2"><Coins className="w-4 h-4" /> 99</span>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col justify-center items-center gap-12 w-full">
          
          <div className="flex items-center gap-4 text-[#ff073a] animate-pulse">
            <Star className="w-8 h-8 fill-current" />
            <Star className="w-12 h-12 fill-current" />
            <Star className="w-8 h-8 fill-current" />
          </div>

          <div className="relative">
            <h1 className="font-pixel text-6xl md:text-8xl lg:text-9xl text-transparent bg-clip-text bg-gradient-to-b from-[#39ff14] to-[#004d00] neon-text tracking-tighter filter drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]">
              SCORELY
            </h1>
            <div className="absolute -top-6 -right-6 rotate-12 bg-[#ff073a] text-black font-pixel text-xs px-2 py-1 border-2 border-[#ff073a] neon-text shadow-[0_0_15px_#ff073a]">
              NEW!
            </div>
          </div>

          <p className="font-pixel text-sm md:text-base lg:text-lg leading-loose max-w-2xl mx-auto text-[#39ff14]/80">
            TRACK SCORES, CROWN WINNERS,<br/>AND MAKE EVERY GAME NIGHT<br/>COMPETITIVE.
          </p>

          <div className="mt-12 flex flex-col items-center gap-8">
            <button 
              className={`font-pixel text-xl md:text-3xl text-black bg-[#39ff14] px-8 py-4 uppercase border-4 border-[#39ff14] hover:bg-black hover:text-[#39ff14] transition-colors duration-200 ${blink ? 'opacity-100' : 'opacity-0'} shadow-[0_0_20px_#39ff14]`}
            >
              &gt; PRESS START &lt;
            </button>
            <p className="font-pixel text-xs text-[#ff073a] tracking-widest mt-2 neon-text">
              START A LEADERBOARD
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full flex justify-between items-center font-pixel text-xs text-[#39ff14]/50 mt-12">
          <div className="flex gap-4">
            <Heart className="w-4 h-4 fill-current text-[#ff073a]" />
            <Trophy className="w-4 h-4 fill-current text-[#ffd700]" />
            <Gamepad2 className="w-4 h-4 fill-current text-[#00ffff]" />
          </div>
          <p>© 2025 SCORELY CORP.</p>
          <div className="flex gap-4">
            <Gamepad2 className="w-4 h-4 fill-current text-[#00ffff]" />
            <Trophy className="w-4 h-4 fill-current text-[#ffd700]" />
            <Heart className="w-4 h-4 fill-current text-[#ff073a]" />
          </div>
        </div>

      </div>
    </div>
  );
}
