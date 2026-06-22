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
  const particles = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1.5,
    delay: Math.random() * 6,
    duration: Math.random() * 12 + 14,
  }));

  const [checkInCount, setCheckInCount] = useState(195);

  useEffect(() => {
    // Dynamic countdown count-up ticker for check-in founders to feel live and organic
    const interval = setInterval(() => {
      setCheckInCount(prev => {
        if (prev < 198) {
          sounds.playTickingSound();
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#FFFFFF] flex flex-col justify-between items-center p-6 md:p-12 relative overflow-hidden select-none font-sans">
      {/* Subtle Floating Gold/Slate Particles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[#D4AF37]/20"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
            animate={{
              y: ['0px', '-180px', '0px'],
              x: ['0px', '50px', '0px'],
              opacity: [0.1, 0.55, 0.1],
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

      {/* Outer Immersive Glow from Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* Header and status info */}
      <div className="w-full flex justify-between items-center text-[10px] font-mono tracking-widest text-[#AAB2C8] font-bold z-10 select-none">
        <span className="uppercase text-[#D4AF37]">REYOU STUDENT EXPERIENCE • APS BHOPAL</span>
        <span className="uppercase bg-[#D4AF37]/15 px-3 py-1 border border-[#D4AF37]/30 rounded-xs text-[#D4AF37]">JOURNEY READY</span>
      </div>

      {/* Center Screen */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[460px] w-full max-w-2xl text-center z-10 relative">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8 flex flex-col items-center"
            >
              {/* Massive Breathing Gold Interactive Orb */}
              <div className="relative w-36 h-36 mb-4 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-full blur-xl animate-pulse" />
                <div className="absolute inset-2 border border-[#D4AF37]/20 rounded-full animate-spin [animation-duration:15s]" />
                <div className="absolute inset-4 border border-[#AAB2C8]/10 rounded-full animate-spin [animation-duration:25s] [animation-direction:reverse]" />
                <div className="w-16 h-16 rounded-full bg-[radial-gradient(circle_at_center,#F3D070_0%,#D4AF37_60%,#AA8310_100%)] shadow-[0_0_40px_rgba(212,175,55,0.45)] animate-breathe" />
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.45em] text-[#D4AF37] font-extrabold bg-[#D4AF37]/10 py-1 px-4 border border-[#D4AF37]/20 rounded-sm">
                  REYOU FOUNDER COHORT
                </span>
                <h1 className="text-4xl md:text-5xl font-sans tracking-tight text-white uppercase font-black">
                  Army Public School
                </h1>
                <h2 className="text-sm font-sans tracking-wide text-[#AAB2C8] uppercase font-semibold">
                  A modern learning experience in real-world decision making
                </h2>
              </div>

              {/* Status Readiness Indicators */}
              <div className="pt-6 grid grid-cols-2 gap-4 w-full max-w-md mx-auto">
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-sm text-left">
                  <span className="block text-[8px] font-mono text-neutral-500 uppercase tracking-widest">COHORT STATUS</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-sm font-mono text-emerald-400 font-extrabold uppercase tracking-wider">LIVE & READY</span>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-sm text-left">
                  <span className="block text-[8px] font-mono text-neutral-500 uppercase tracking-widest">PEERS ASSEMBLED</span>
                  <span className="text-sm font-mono text-white mt-1 block font-black">
                    <span className="text-[#D4AF37]">{checkInCount}</span> <span className="text-neutral-500">/ 200</span> Checked In
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="mantra"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 max-w-md mx-auto flex flex-col items-center"
            >
              {/* Gentle breathing orb in step 2 too */}
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] blur-sm opacity-60 animate-breathe" />

              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-black">
                TODAY IS THE DAY
              </p>
              <div className="space-y-2 uppercase text-neutral-200">
                <h2 className="text-2xl md:text-3xl font-sans font-black tracking-wider text-white">
                  you will think
                </h2>
                <h2 className="text-2xl md:text-3xl font-sans font-normal tracking-wide text-neutral-300">
                  discuss & align
                </h2>
                <h2 className="text-2xl md:text-3xl font-sans font-black tracking-normal text-[#D4AF37] flex items-center justify-center gap-1.5">
                  decide
                </h2>
                <h2 className="text-xl md:text-2xl font-sans tracking-tight text-neutral-400">
                  & discover your unique strengths
                </h2>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="cta"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8 flex flex-col items-center"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#D4AF37] font-semibold block bg-[#D4AF37]/5 px-3 py-1 border border-[#D4AF37]/10 rounded-sm">
                  YOUR FUTURE PATHWAY
                </span>
                <p className="text-xl md:text-2xl font-sans font-bold text-white uppercase tracking-tight">
                  Your team is waiting for you.
                </p>
                <p className="text-xs text-[#AAB2C8] leading-relaxed max-w-sm mx-auto">
                  Army Public School Class XII: Join standard rooms of fellow peers. Let's make every choice count, learn from trial and error, and grow together!
                </p>
              </div>

              <motion.button
                id="begin-cohort-btn"
                whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(212,175,55,0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  sounds.playValidationChime();
                  onComplete();
                }}
                className="bg-[#D4AF37] text-neutral-950 font-mono hover:bg-yellow-500 text-[11px] py-4.5 px-14 tracking-[0.3em] font-extrabold uppercase transition-all duration-300 rounded-sm shadow-[0_4px_25px_rgba(212,175,55,0.25)] cursor-pointer select-none font-black"
              >
                ENTER SIMULATION
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Corporate Boardroom Signature line */}
      <div className="w-full text-center text-[10px] font-mono text-[#AAB2C8] opacity-50 tracking-widest uppercase z-10 select-none">
        REYOU SCHOOL OPERATING SYSTEM • EMPOWERING INDEPENDENCE
      </div>
    </div>
  );
}

