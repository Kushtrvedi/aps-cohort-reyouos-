import { useEffect } from 'react';
import { motion } from 'motion/react';
import { sounds } from '../utils/audio';

interface Screen07OathProps {
  onComplete: () => void;
}

export default function Screen07Oath({ onComplete }: Screen07OathProps) {
  useEffect(() => {
    // Play intense hum on loading the oath room
    sounds.playOrbHum();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between items-center p-8 md:p-16 relative overflow-hidden select-none font-serif">
      {/* Subtle background radial glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.05)_0%,transparent_60%)] pointer-events-none select-none animate-pulse" />
      </div>

      {/* Header and status info */}
      <div className="w-full flex justify-between items-center text-[9px] font-mono tracking-widest text-[#D4AF37] font-black z-10 select-none uppercase">
        <span>REYOU TEAM WORKSPACE</span>
        <span>STAGE 08: THE TEAM OATH</span>
      </div>

      {/* Main Core */}
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-2xl px-4 my-8 text-center z-10 relative">
        <div className="space-y-10">
          
          {/* Main Title Headings */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-1"
          >
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37]/75 uppercase block font-black mb-1 select-none">
              THE TEAM AGREEMENT
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-bold tracking-wider leading-none text-white uppercase font-sans select-none">
              FOR THE NEXT 60 MINUTES
            </h1>
          </motion.div>

          {/* Oath Statements in exact Georgia Typography */}
          <div className="space-y-6 max-w-xl mx-auto border-y border-neutral-800/80 py-10 select-none">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-base md:text-lg text-neutral-300 tracking-wide leading-relaxed font-normal font-sans"
            >
              You will think about things you have never thought about before.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="text-base md:text-lg text-neutral-300 tracking-wide leading-relaxed font-normal font-sans"
            >
              You will debate with people you have never had serious conversations with before.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="text-base md:text-lg text-[#D4AF37] tracking-wide leading-relaxed font-sans text-lg uppercase font-black"
            >
              You will make decisions that are uncomfortable.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0, duration: 0.8 }}
              className="text-base md:text-lg text-neutral-300 tracking-wide leading-relaxed font-normal font-sans"
            >
              You will explain and backup those decisions to the class.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 1.0 }}
              className="text-lg md:text-xl text-white tracking-widest leading-relaxed font-bold uppercase font-sans mt-4"
            >
              During this game, you make the choices. You are in charge.
            </motion.p>
          </div>

          <div className="text-[9.5px] tracking-widest font-mono text-neutral-500 uppercase select-none font-bold">
            YOUR CLASS SIMULATION IS READY • LET'S GO
          </div>

        </div>
      </div>

      {/* Footer controls: Gold breathing/pulse outlined buttons */}
      <div className="w-full max-w-xs flex flex-col items-center gap-4 z-10">
        <motion.button
          id="boardroom-activate-proceed-btn"
          onClick={() => {
            sounds.playValidationChime();
            onComplete();
          }}
          whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(212,175,55,0.3)' }}
          whileTap={{ scale: 0.98 }}
          animate={{
            borderColor: ['#D4AF37', '#FFF', '#D4AF37'],
            boxShadow: [
              '0 0 10px rgba(212,175,55,0.1)',
              '0 0 20px rgba(212,175,55,0.25)',
              '0 0 10px rgba(212,175,55,0.1)'
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="w-full border-2 text-[#D4AF37] bg-[#D4AF37]/5 font-mono text-[11px] py-4 px-8 tracking-[0.3em] font-extrabold uppercase transition-all duration-300 cursor-pointer text-center font-black rounded-xs"
        >
          START THE SIMULATION
        </motion.button>
        <div className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest leading-none select-none">
          ALL TEAMS CONNECTED • READY TO PLAY
        </div>
      </div>
    </div>
  );
}
