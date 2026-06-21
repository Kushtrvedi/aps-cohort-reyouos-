import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../utils/audio';

interface Screen02WelcomeProps {
  onComplete: () => void;
}

export default function Screen02Welcome({ onComplete }: Screen02WelcomeProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const SEQUENCE_DATA = [
    'Loading Student Records...',
    'Creating Teams...',
    'Assigning Roles...',
    'Building Cohort...',
    'Cohort Ready'
  ];

  useEffect(() => {
    // Soft beating background or ticking suspenses
    sounds.playTickingSound();
    
    const timers: NodeJS.Timeout[] = [];
    
    SEQUENCE_DATA.forEach((text, index) => {
      const isLast = index === SEQUENCE_DATA.length - 1;
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, text]);
        setCurrentIndex(index);
        
        if (isLast) {
          sounds.playValidationChime();
          setIsDone(true);
        } else {
          sounds.playTickingSound();
        }
      }, (index + 1) * 1200); // 1.2 seconds stagger
      
      timers.push(timeout);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between items-center p-8 md:p-16 relative overflow-hidden select-none font-sans">
      {/* Immersive subtle heartbeat overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(214,175,55,0.04)_0%,transparent_65%)] select-none" />
      </div>

      {/* Header and status info */}
      <div className="w-full flex justify-between items-center text-[9px] font-mono tracking-widest text-[#D4AF37]/70 z-10 uppercase">
        <span>REYOU COGNITIVE COMPREHENSION MATRIX</span>
        <span>STAGE 02</span>
      </div>

      {/* Main Terminal Centerpiece */}
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-xl text-center px-4 z-10 my-8">
        <div className="space-y-6 w-full text-left font-mono border border-neutral-900 bg-neutral-950/40 p-10 rounded-sm relative shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent" />
          
          <div className="space-y-4 min-h-[170px] uppercase select-none">
            <AnimatePresence>
              {lines.map((line, idx) => {
                const isReady = line === 'Cohort Ready';
                return (
                  <motion.div
                    key={line}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="flex items-center gap-3 text-xs md:text-sm tracking-wider"
                  >
                    <span className={isReady ? 'text-[#D4AF37] font-black' : 'text-neutral-500'}>
                      {isReady ? '✦' : '❯'}
                    </span>
                    <span className={isReady ? 'text-[#D4AF37] font-bold text-base tracking-widest' : 'text-neutral-200'}>
                      {line}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="border-t border-neutral-900 pt-5 flex justify-between items-center text-[9px] text-[#D4AF37]/45 select-none font-bold">
            <span>SEQUENCE LATENCY: 4.8s</span>
            <span>SHUFFLE COMPLETE</span>
          </div>
        </div>
      </div>

      {/* Footer controls */}
      <div className="w-full max-w-sm flex flex-col items-center gap-4 z-10">
        <AnimatePresence>
          {isDone && (
            <motion.button
              id="reveal-team-navigation-btn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              onClick={() => {
                sounds.playValidationChime();
                onComplete();
              }}
              whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(212,175,55,0.15)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full border border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5 font-mono hover:bg-[#D4AF37] hover:text-black text-[11px] py-4 px-8 tracking-[0.3em] font-extrabold uppercase transition-all duration-300 shadow-[0_4px_15px_rgba(212,175,55,0.08)] flex justify-center items-center gap-2 group cursor-pointer"
            >
              PROCEED TO REVEAL
            </motion.button>
          )}
        </AnimatePresence>
        <div className="text-[9px] font-mono text-neutral-600 tracking-wider">
          ATTESTATION PROTOCOL ACTIVE
        </div>
      </div>
    </div>
  );
}

