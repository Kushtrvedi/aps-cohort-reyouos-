import { useState } from 'react';
import { motion } from 'motion/react';
import { sounds } from '../utils/audio';

interface Screen06PrincipleProps {
  onComplete: () => void;
}

export default function Screen06Principle({ onComplete }: Screen06PrincipleProps) {
  const [understood, setUnderstood] = useState(false);

  const rules = [
    { label: 'Rule 01', text: 'Every decision requires reasoning. You cannot guess.' },
    { label: 'Rule 02', text: 'Every team member participates. Silence is a choice.' },
    { label: 'Rule 03', text: 'Assumptions must be challenged. Trust, but verify.' },
    { label: 'Rule 04', text: 'Every decision can be questioned by facilitators.' },
    { label: 'Rule 05', text: 'You will defend your choices publicly without excuse.' },
  ];

  const handleUnderstandToggle = () => {
    sounds.playTickingSound();
    setUnderstood(!understood);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111111] flex flex-col justify-between items-center p-8 md:p-16 relative overflow-hidden select-none font-serif">
      
      {/* Header and status info */}
      <div className="w-full flex justify-between items-center text-[9px] font-mono tracking-widest text-[#D4AF37] font-extrabold z-10 select-none uppercase">
        <span>REYOU LAWS & RULES</span>
        <span>STAGE 07: CLASS RULES</span>
      </div>

      {/* Main Core Section */}
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-2xl px-4 my-8 z-10">
        
        <div className="text-center mb-8 space-y-3">
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-black block leading-none">
            HOW TO BE A GREAT PLAYER
          </span>
          <h2 className="text-3xl md:text-4.5xl font-display font-semibold text-neutral-900 tracking-wide uppercase font-sans">
            RULES OF THE SIMULATION
          </h2>
          <p className="text-sm font-normal text-neutral-500 leading-relaxed max-w-md mx-auto">
            These simple rules help your team think clearly and make the best possible moves during today's game.
          </p>
        </div>

        {/* Rules container list */}
        <div className="w-full space-y-4 max-w-lg mb-8 select-none">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="bg-white border border-neutral-200 rounded-sm p-5 text-left flex items-start gap-4 hover:border-[#D4AF37]/50 hover:shadow-[0_8px_25px_rgba(0,0,0,0.02)] transition-all duration-300"
            >
              <div className="mt-0.5 px-2 py-1 bg-neutral-50 border border-neutral-200 rounded-xs text-[9px] font-mono text-[#D4AF37] font-extrabold shrink-0">
                {rule.label}
              </div>
              <p className="text-sm text-neutral-800 font-normal leading-relaxed">
                {rule.text}
              </p>
            </div>
          ))}
        </div>

        {/* Checkbox Trigger aligned with style */}
        <div
          onClick={handleUnderstandToggle}
          className={`flex items-center gap-4 p-5 rounded-xs border w-full max-w-md transition-all duration-300 cursor-pointer select-none ${
            understood
              ? 'bg-[#D4AF37]/5 border-[#D4AF37] text-[#D4AF37] shadow-[0_10px_35px_rgba(212,175,55,0.05)]'
              : 'bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300'
          }`}
        >
          <div className="flex-shrink-0">
            <div
              className={`w-5 h-5 rounded-xs border-2 flex items-center justify-center transition-all ${
                understood ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-neutral-300'
              }`}
            >
              {understood && (
                <svg className="w-3.5 h-3.5 text-white" strokeWidth="3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
          <p className="text-[11px] font-mono tracking-widest uppercase font-black">
            I agree to follow the rules
          </p>
        </div>
      </div>

      {/* Footer controls */}
      <div className="w-full max-w-sm flex flex-col items-center gap-4 z-10">
        <motion.button
          id="rules-understood-btn"
          disabled={!understood}
          onClick={() => {
            if (understood) {
              sounds.playValidationChime();
              onComplete();
            }
          }}
          whileHover={understood ? { scale: 1.02 } : {}}
          whileTap={understood ? { scale: 0.98 } : {}}
          className={`w-full font-mono text-[11px] py-4 px-8 tracking-[0.3em] font-extrabold uppercase transition-all duration-500 flex justify-center items-center gap-2 rounded-xs font-black ${
            understood
              ? 'border-2 border-[#D4AF37] text-white bg-[#D4AF37] hover:bg-yellow-600 focus:outline-none cursor-pointer shadow-[0_4px_15px_rgba(212,175,55,0.1)]'
              : 'border border-neutral-200 bg-neutral-105 text-neutral-400 cursor-not-allowed opacity-50'
          }`}
        >
          TAKE THE OATH
        </motion.button>
        <div className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest leading-none">
          GETTING READY FOR THE SIMULATION
        </div>
      </div>
    </div>
  );
}
