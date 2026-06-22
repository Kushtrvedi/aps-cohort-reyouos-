import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TEAMS } from '../types';
import { sounds } from '../utils/audio';

interface Screen03TeamAssignedProps {
  userName: string;
  setUserName: (val: string) => void;
  rollNumber: string;
  setRollNumber: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  selectedTeamId: string;
  setSelectedTeamId: (id: string) => void;
  onComplete: () => void;
}

export default function Screen03TeamAssigned({
  userName,
  selectedTeamId,
  setSelectedTeamId,
  onComplete,
}: Screen03TeamAssignedProps) {
  const [phase, setPhase] = useState<'LOADING' | 'REVEALED'>('LOADING');
  const [dots, setDots] = useState('');

  // Suffix matching list of beautiful team symbols
  const TEAM_SYMBOLS: Record<string, string> = {
    TEAM_ALPHA: '🔱', // Jhansi
    TEAM_BRAVO: '✊', // Bhagat
    TEAM_CHARLIE: '⚖️', // Chanakya
    TEAM_DELTA: '🦅', // Azad
    TEAM_ECHO: '🦁', // Netaji
    TEAM_FOXTROT: '🛡️', // Patel
    TEAM_GOLF: '🚀', // Kalam
    TEAM_HOTEL: '🕯️', // Vivekananda
    TEAM_INDIA: '⚔️', // Shivaji
    TEAM_JULIET: '👑', // Bose
  };

  const activeTeam = TEAMS.find(t => t.id === selectedTeamId) || TEAMS[1]; // Default to Team Bhagat (TEAM_BRAVO)!

  useEffect(() => {
    // Play suspense ticketing sounds
    sounds.playTickingSound();

    // Stagger loading text
    const textTimer = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    // After 3.5s, trigger the high-celebrative reveal chime
    const revealSync = setTimeout(() => {
      clearInterval(textTimer);
      // Auto assign to TEAM_BRAVO (Team Bhagat) by default to match "WELCOME TEAM BHAGAT" if no team pre-selected!
      if (!selectedTeamId || selectedTeamId === 'TEAM_ALPHA') {
        setSelectedTeamId('TEAM_BRAVO');
      }
      sounds.playValidationChime();
      setPhase('REVEALED');
    }, 3800);

    return () => {
      clearInterval(textTimer);
      clearTimeout(revealSync);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1020] text-white flex flex-col justify-between items-center p-6 md:p-12 relative overflow-hidden select-none font-sans">
      
      {/* Background radial matrix glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.04)_0%,transparent_70%)]" />
      </div>

      {/* Header and status info */}
      <div className="w-full flex justify-between items-center text-[10px] font-mono tracking-widest text-[#AAB2C8] z-10 select-none uppercase">
        <span className="text-[#D4AF37]">COHORT INTEGRATION ENGINE</span>
        <span>STAGE 03 • TEAM MATCHING</span>
      </div>

      {/* Main Core */}
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-2xl text-center px-4 my-6 z-10">
        <AnimatePresence mode="wait">
          
          {phase === 'LOADING' && (
            <motion.div
              key="loading-stage"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 flex flex-col items-center"
            >
              {/* Spinning high quality ring loader */}
              <div className="relative w-24 h-24 flex items-center justify-center mb-2">
                <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/10" />
                <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[#D4AF37] animate-spin" />
                <span className="text-xl">📊</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-black">
                  Finding your team{dots}
                </h2>
                <p className="text-xs text-[#AAB2C8] max-w-xs mx-auto leading-relaxed">
                  Scanning class profiles, balancing dynamic psychological values, and mapping 40 boardroom chambers...
                </p>
              </div>

              {/* Mock scanning data rows */}
              <div className="w-48 bg-white/[0.04] p-3 rounded-sm border border-white/5 space-y-1 text-left text-[8px] font-mono text-neutral-450 uppercase tracking-widest">
                <div className="flex justify-between"><span>Registry ID:</span> <span className="text-white">OK</span></div>
                <div className="flex justify-between"><span>Section Match:</span> <span className="text-white">100%</span></div>
                <div className="flex justify-between"><span>Traits Balance:</span> <span className="text-[#D4AF37]">ACTIVE</span></div>
              </div>
            </motion.div>
          )}

          {phase === 'REVEALED' && (
            <motion.div
              key="revealed-stage"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="space-y-8 flex flex-col items-center"
            >
              {/* Exploding celebration effects (Gold particles with motion.div) */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                
                {/* Concentric rotating gold rings */}
                <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-full blur-xl animate-pulse" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                  className="absolute inset-0 border border-dashed border-[#D4AF37]/50 rounded-full"
                />
                
                {/* Golden Badge Emblem */}
                <div className="w-20 h-20 rounded-full bg-[#D4AF37] text-neutral-950 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(212,175,55,0.45)] select-none">
                  {TEAM_SYMBOLS[activeTeam.id] || '✊'}
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-[0.35em] text-[#D4AF37] uppercase font-bold bg-[#D4AF37]/10 px-4 py-1.5 border border-[#D4AF37]/20 rounded-xs select-none">
                  WELCOME TO COHORT BOARDROOM
                </span>
                <h1 className="text-4xl md:text-5xl font-sans tracking-tight text-white uppercase font-black">
                  {activeTeam.name.toUpperCase()}
                </h1>
                <p className="text-xs text-[#AAB2C8] leading-relaxed max-w-sm mx-auto">
                  Congratulations <span className="text-white font-bold">{userName}</span>! You have been drafted into <strong className="text-white font-black">{activeTeam.name}</strong> alongside 4 peer leaders.
                </p>
              </div>

              {/* Celebration statistics block */}
              <div className="bg-white/[0.02] border border-white/5 py-4 px-6 rounded-sm w-full max-w-md grid grid-cols-3 gap-4 text-center">
                <div>
                  <span className="block text-[8px] font-mono text-neutral-500 uppercase">COHORT RANK</span>
                  <span className="text-base font-mono text-white font-black">#03</span>
                </div>
                <div className="border-x border-white/5">
                  <span className="block text-[8px] font-mono text-neutral-500 uppercase">INITIAL POINTS</span>
                  <span className="text-base font-mono text-[#D4AF37] font-black">120 PTS</span>
                </div>
                <div>
                  <span className="block text-[8px] font-mono text-neutral-500 uppercase">ACTIVE CHAMBER</span>
                  <span className="text-base font-mono text-white font-black">ROOM 08</span>
                </div>
              </div>

              <motion.button
                id="celebrated-team-continue-btn"
                whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(212,175,55,0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  sounds.playValidationChime();
                  onComplete();
                }}
                className="bg-[#D4AF37] text-neutral-950 font-mono text-xs hover:bg-yellow-500 font-extrabold tracking-widest py-4 px-12 uppercase transition-all duration-300 rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.15)] cursor-pointer"
              >
                PROCEED TO THE PORTRAIT →
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Corporate Boardroom Signature line */}
      <div className="w-full text-center text-[10px] font-mono text-[#AAB2C8] opacity-50 tracking-widest uppercase z-10 select-none">
        HARVARD LEADERSHIP LABS SIGNATURE EXPERIENCE COHORT
      </div>
    </div>
  );
}
