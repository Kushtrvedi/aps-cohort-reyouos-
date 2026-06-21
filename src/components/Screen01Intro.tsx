import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../utils/audio';

interface Screen01IntroProps {
  onComplete: () => void;
}

export default function Screen01Intro({ onComplete }: Screen01IntroProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Start ambient laboratory atmosphere
    sounds.playOrbHum();
  }, []);

  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => {
        setStep(1);
      }, 3500); // 3.5 seconds center branding
      return () => clearTimeout(timer);
    } else if (step === 1) {
      const timer = setTimeout(() => {
        setStep(2);
      }, 3500); // 3.5 seconds next message
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Generate simple, slow-moving premium floating gold particles
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 2,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 12,
  }));

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111111] flex flex-col justify-between items-center p-8 md:p-16 relative overflow-hidden select-none font-serif">
      {/* Subtle Floating Gold Particles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[#D4AF37]/25"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
            animate={{
              y: ['0px', '-120px', '0px'],
              x: ['0px', '40px', '0px'],
              opacity: [0.1, 0.6, 0.1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Header and status info */}
      <div className="w-full flex justify-between items-center text-[9px] font-mono tracking-widest text-[#D4AF37] font-extrabold z-10 select-none">
        <span className="uppercase">REYOU SYSTEM ACTIVE • APS COHORT</span>
        <span className="uppercase">STAGE 01</span>
      </div>

      {/* Center Screen */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[450px] w-full max-w-2xl text-center z-10 relative">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h2 className="text-[11px] font-mono uppercase tracking-[0.40em] text-[#D4AF37] font-black">
                REYOU EDUCATION
              </h2>
              <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-wide text-[#111111] uppercase leading-tight font-sans">
                APS FOUNDER COHORT
              </h1>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="mantra"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 max-w-md mx-auto"
            >
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-black">
                TODAY
              </p>
              <h2 className="text-2xl md:text-3xl font-display font-bold leading-relaxed text-[#111111] uppercase select-none font-sans">
                you will think
              </h2>
              <h2 className="text-2xl md:text-3xl font-display font-bold leading-relaxed text-[#111111] uppercase select-none font-sans">
                debate
              </h2>
              <h2 className="text-2xl md:text-3xl font-display font-bold leading-relaxed text-[#111111] uppercase select-none font-sans">
                decide
              </h2>
              <h2 className="text-2xl md:text-3xl font-display font-bold leading-relaxed text-[#111111] uppercase select-none font-sans flex items-center justify-center gap-1.5 font-sans">
                and defend
              </h2>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8 flex flex-col items-center"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-450 font-bold block mb-1">
                  TRANSITION GATEWAY
                </span>
                <p className="text-2xl md:text-3xl font-display font-medium text-[#111111] leading-relaxed uppercase font-sans">
                  Your team is waiting.
                </p>
              </div>

              <motion.button
                id="begin-cohort-btn"
                whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(212,175,55,0.25)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  sounds.playValidationChime();
                  onComplete();
                }}
                className="border-2 border-[#D4AF37] text-[#D4AF37] bg-white font-mono hover:bg-[#D4AF37] hover:text-white text-[11px] py-4 px-12 tracking-[0.3em] font-extrabold uppercase transition-all duration-500 rounded-xs shadow-[0_4px_15px_rgba(212,175,55,0.08)] cursor-pointer select-none font-black"
              >
                BEGIN COHORT
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Corporate Boardroom Signature line */}
      <div className="w-full text-center text-[9px] font-mono text-neutral-400 tracking-widest uppercase z-10 select-none">
        HARVARD LEADERSHIP LABS • EXECUTIVE ACCELERATOR
      </div>
    </div>
  );
}

