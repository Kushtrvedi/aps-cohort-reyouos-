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

// 10 Historical Premium Symbols matching the requested teams
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

export default function Screen03TeamAssigned({
  userName,
  setUserName,
  rollNumber,
  setRollNumber,
  email,
  setEmail,
  selectedTeamId,
  setSelectedTeamId,
  onComplete,
}: Screen03TeamAssignedProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [hasConfirmedName, setHasConfirmedName] = useState<boolean>(!!userName && !!rollNumber && !!email);

  useEffect(() => {
    // Play ambient paper layout soundtrack
    sounds.playTickingSound();
  }, []);

  const handleCardSelection = (teamId: string) => {
    setSelectedTeamId(teamId);
    setSelectedCardId(teamId);
    sounds.playTickingSound();
    
    // Auto-proceed with paper unfolding effect to Screen 4 after a majestic 1.2s delay
    setTimeout(() => {
      sounds.playValidationChime();
      onComplete();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111111] flex flex-col justify-between items-center p-8 md:p-16 relative overflow-hidden select-none font-serif">
      
      {/* Header element adhering to color and font strict rules */}
      <div className="w-full flex justify-between items-center text-[9px] font-mono tracking-widest text-[#D4AF37] font-extrabold z-10 select-none">
        <span className="uppercase">REYOU SYSTEM HUB • DECK 03</span>
        <span className="uppercase">CEREMONY OF SEALS</span>
      </div>

      {/* Main Core */}
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-4xl text-center px-4 my-8 z-10">
        
        {/* Name input flow to build executive psychological safety, if not confirmed yet */}
        {!hasConfirmedName ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white border border-neutral-200/85 p-8 rounded-xs shadow-[0_10px_35px_rgba(0,0,0,0.03)] space-y-6 animate-fade-in"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] font-black block">
                REGISTRANT IDENTITY SECURE ONBOARDING
              </span>
              <h2 className="text-2xl font-display font-bold text-neutral-900 tracking-wide uppercase font-sans">
                Enter Your Credentials
              </h2>
              <p className="text-xs text-neutral-500 leading-relaxed max-w-xs mx-auto">
                Your custom team workspace and profile will be saved under this name.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-[9px] font-mono font-black uppercase text-neutral-450 tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="EX: ARIANNA CHATTERJEE..."
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-neutral-200 text-left text-sm tracking-widest uppercase font-mono py-3 px-4 text-neutral-900 focus:outline-none focus:border-[#D4AF37] transition-all rounded-xs font-bold"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[9px] font-mono font-black uppercase text-neutral-450 tracking-wider">
                  Roll Number
                </label>
                <input
                  type="text"
                  placeholder="EX: APS-2026-0841..."
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-neutral-200 text-left text-sm tracking-widest uppercase font-mono py-3 px-4 text-neutral-900 focus:outline-none focus:border-[#D4AF37] transition-all rounded-xs font-bold"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[9px] font-mono font-black uppercase text-neutral-450 tracking-wider">
                  Official Email Address
                </label>
                <input
                  type="email"
                  placeholder="EX: FOUNDER@REYOU.EDU..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-neutral-200 text-left text-sm tracking-wider uppercase font-mono py-3 px-4 text-neutral-900 focus:outline-none focus:border-[#D4AF37] transition-all rounded-xs font-bold"
                />
              </div>

              <div className="flex justify-start items-center pt-1">
                <button
                  type="button"
                  id="autofill-mock-credentials-btn"
                  onClick={() => {
                    sounds.playClickSound();
                    setUserName('ARIANNA CHATTERJEE');
                    setRollNumber('APS-2026-0841');
                    setEmail('arianna.chatterjee@reyou.edu');
                  }}
                  className="text-[9.5px] font-mono uppercase text-[#D4AF37] hover:text-white font-extrabold tracking-widest flex items-center gap-1.5 bg-[#FAF8F5] hover:bg-[#D4AF37] py-2 px-3.5 rounded border border-[#D4AF37]/35 hover:border-[#D4AF37] cursor-pointer transition-all duration-300 shadow-[0_2px_10px_rgba(212,175,55,0.04)]"
                >
                  ⚡ Autofill Mock Credentials
                </button>
              </div>

              <button
                disabled={!userName.trim() || !rollNumber.trim() || !email.trim() || !email.includes('@')}
                onClick={() => {
                  sounds.playValidationChime();
                  setHasConfirmedName(true);
                }}
                className="w-full bg-white border-2 border-[#D4AF37] hover:bg-[#D4AF37] hover:text-white text-[#D4AF37] font-mono text-xs font-extrabold tracking-widest py-4 px-6 uppercase transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-black mt-2"
              >
                PROCEED TO THE SEALS
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8 w-full">
            
            {/* Title Block using Playfair Display Heading & Georgia Regular */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-black block leading-none select-none">
                CHOOSE ONE ENVELOPE TO REVEAL YOUR TEAM
              </span>
              <h1 className="text-3.5xl md:text-4.5xl font-display font-semibold tracking-wide text-neutral-900 uppercase leading-none font-sans select-none">
                TEAM ASSIGNMENT REVEAL
              </h1>
              <p className="text-sm font-normal text-neutral-600 max-w-xl mx-auto leading-relaxed select-none">
                Ten distinct student teams are listed below. One will be yours! Click on any team envelope to open it.
              </p>
            </div>

            {/* 10 Premium Sealed cards in grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-3xl mx-auto pt-6">
              {TEAMS.map((t, idx) => {
                const isSelected = selectedCardId === t.id;
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.9, 
                      delay: idx * 0.1, 
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    whileHover={{ 
                      y: -8, 
                      transition: { duration: 0.3, ease: 'easeOut' }
                    }}
                    onClick={() => !selectedCardId && handleCardSelection(t.id)}
                    className={`bg-white border border-neutral-200 rounded-sm p-6 flex flex-col items-center justify-between min-h-[140px] relative transition-all duration-500 cursor-pointer select-none ${
                      isSelected 
                        ? 'ring-2 ring-[#D4AF37] bg-[#D4AF37]/5 border-[#D4AF37] scale-102 shadow-[0_15px_40px_rgba(212,175,55,0.15)]' 
                        : 'hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    {/* Card Wax Seal Effect and Design element */}
                    <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#D4AF37]/40 flex items-center justify-center relative shadow-inner mb-4">
                      {/* Wax Seal Symbol */}
                      <span className="text-xl filter grayscale group-hover:grayscale-0">{TEAM_SYMBOLS[t.id]}</span>
                      
                      {/* Inner gold circular borders */}
                      <div className="absolute inset-1 border border-[#D4AF37]/25 rounded-full" />
                    </div>

                    <div className="space-y-1">
                      <div className="w-4 h-[1px] bg-[#D4AF37]/40 mx-auto" />
                      <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block font-bold">
                        SEAL 0{idx + 1}
                      </span>
                    </div>

                    {/* Wax Seal Stamp Stamp Effect */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-bl-sm border-b border-l border-[#D4AF37]/15 bg-neutral-50/10 pointer-events-none" />
                  </motion.div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-center items-center gap-1.5 text-[9px] font-mono text-neutral-500 uppercase tracking-widest select-none">
              <span>REYOU INTELLECTUAL COMPLIANCE FRAMEWORK</span>
              <span>•</span>
              <span className="text-[#D4AF37]">SECURE PROTOCOL</span>
            </div>
          </div>
        )}
      </div>

      {/* Corporate Boardroom Signature line */}
      <div className="w-full text-center text-[9px] font-mono text-neutral-400 tracking-widest uppercase z-10 select-none">
        HARVARD LEADERSHIP LABS • EXECUTIVE ACCELERATOR
      </div>
    </div>
  );
}
