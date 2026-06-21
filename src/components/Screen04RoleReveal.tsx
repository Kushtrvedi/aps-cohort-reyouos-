import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RoleId, TEAMS } from '../types';
import { sounds } from '../utils/audio';

interface Screen04RoleRevealProps {
  selectedTeamId: string;
  assignedRoleId: RoleId;
  setAssignedRoleId: (roleId: RoleId) => void;
  onComplete: () => void;
}

const OFFICIAL_ROLE_MANDATES: Record<RoleId, { title: string; subtitle: string; description: string; mandates: string[] }> = {
  TEAM_LEAD: {
    title: 'TEAM LEAD',
    subtitle: 'COORDINATOR & DECIDER',
    description: 'You lead the team to a final decision. You help find common ground.',
    mandates: [
      'Keep the group focused and moving forward so we do not run out of time.',
      'Make sure every team member gets a chance to share before we vote.',
      'Make the final click to lock in our choice when the team is ready.'
    ]
  },
  STRATEGY_LEAD: {
    title: 'BIG PICTURE THINKER',
    subtitle: 'LONG-TERM CONSEQUENCES',
    description: 'You look ahead. You help the team think about what might happen next.',
    mandates: [
      'Look at how our choices will impact life 5 to 10 years down the line.',
      'Identify long-term trades: what are we giving up tomorrow for comfort today?',
      'Prioritize future safety and stable savings over easy, quick rewards.'
    ]
  },
  RISK_LEAD: {
    title: 'WHAT COULD GO WRONG?',
    subtitle: 'HIDDEN DANGER FINDER',
    description: 'You spot the hidden dangers. You ask: "What are we ignoring?"',
    mandates: [
      'Inquire about the worst-case scenario: what if this plan completely fails?',
      'Challenge easy choices where the team is being too comfortable or lazy.',
      'Help find backup plans so the team has security if things go wrong.'
    ]
  },
  COMMUNICATION_LEAD: {
    title: 'TEAM SPEAKER',
    subtitle: 'VOICE OF THE BOARD',
    description: 'You explain the team\'s reasoning and move choices to the class.',
    mandates: [
      'Translate our group\'s complex discussions into clear, simple points.',
      'Speak up for your team\'s choices when we share or do class reviews.',
      'Help other teams understand the perspective behind our decisions.'
    ]
  },
  REFLECTION_LEAD: {
    title: 'LESSON FINDER',
    subtitle: 'ERROR & LEARNING LOGGER',
    description: 'You find smart lessons. You identify when we change our minds.',
    mandates: [
      'Keep track of what went wrong so we do not make the same mistake twice.',
      'Identify traps like following the crowd or grabbing immediate rewards blindly.',
      'Help the team process group outcomes during our final reflection huddles.'
    ]
  }
};

export default function Screen04RoleReveal({
  selectedTeamId,
  assignedRoleId,
  setAssignedRoleId,
  onComplete,
}: Screen04RoleRevealProps) {
  const [subStep, setSubStep] = useState<'REVEAL_TEAM' | 'REVEAL_ROLE' | 'ROLE_EXPLANATION'>('REVEAL_TEAM');
  const [showRolePanel, setShowRolePanel] = useState(false);

  const activeTeam = TEAMS.find(t => t.id === selectedTeamId) || TEAMS[0];
  const activeMandate = OFFICIAL_ROLE_MANDATES[assignedRoleId];

  useEffect(() => {
    // Play paper unfolding audio ambient sound
    sounds.playTickingSound();

    if (subStep === 'REVEAL_TEAM') {
      const timer = setTimeout(() => {
        setSubStep('REVEAL_ROLE');
        sounds.playValidationChime();
      }, 2500); // 2.5 second pause before role reveals
      return () => clearTimeout(timer);
    }
  }, [subStep]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111111] flex flex-col justify-between items-center p-8 md:p-16 relative overflow-hidden select-none font-serif">
      
      {/* Header and status info */}
      <div className="w-full flex justify-between items-center text-[9px] font-mono tracking-widest text-[#D4AF37] font-extrabold z-10 select-none uppercase">
        <span>REYOU ALLOCATION PROTOCOLS</span>
        <span>STAGE 04 & 05: THE MANDATE</span>
      </div>

      {/* Main Core */}
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-2xl px-4 my-8 z-10">
        
        <AnimatePresence mode="wait">
          
          {subStep === 'REVEAL_TEAM' && (
            <motion.div
              key="team-reveal-panel"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-neutral-200 p-10 md:p-12 rounded-xs shadow-[0_12px_40px_rgba(0,0,0,0.03)] w-full max-w-md text-center space-y-6 relative"
            >
              {/* Gold paper alignment line */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#D4AF37]" />
              
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] uppercase font-black block">
                  OFFICIAL INDIVIDUAL ALLOCATION
                </span>
                <h2 className="text-xl md:text-2xl font-display font-medium text-neutral-400 uppercase tracking-widest font-sans">
                  TEAM ASSIGNED
                </h2>
              </div>

              <div className="py-6 border-y border-neutral-100 space-y-3">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 tracking-wider uppercase leading-none font-sans">
                  TEAM {activeTeam.name}
                </h1>
                <div className="w-8 h-[1.5px] bg-[#D4AF37] mx-auto" />
                <p className="text-base text-neutral-600 font-normal leading-relaxed">
                  You have been selected.
                </p>
              </div>

              <div className="text-[9.5px] font-mono text-neutral-450 tracking-widest uppercase">
                PRE-SIMULATION DEPLOYMENT • SEAL ATTESTED
              </div>
            </motion.div>
          )}

          {subStep === 'REVEAL_ROLE' && (
            <motion.div
              key="role-reveal-panel"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border-2 border-[#D4AF37] p-10 md:p-12 rounded-xs shadow-[0_15px_50px_rgba(212,175,55,0.08)] w-full max-w-lg text-center space-y-8 relative"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] uppercase font-black block animate-pulse">
                  ROLE ASSIGNED
                </span>
                <h2 className="text-xl md:text-2xl font-display font-medium text-neutral-500 uppercase tracking-widest font-sans">
                  TEAM {activeTeam.name.toUpperCase()}
                </h2>
              </div>

              {/* Gold pulsing glowing card role reveals */}
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-neutral-50/50 border border-neutral-200/80 p-8 rounded-xs space-y-3"
              >
                <span className="text-[10px] font-mono text-neutral-500 tracking-wider uppercase font-extrabold select-none">OFFICIAL DESIGNATION:</span>
                <h1 className="text-3xl md:text-4xl font-display font-extrabold text-neutral-900 tracking-wider uppercase leading-none font-sans">
                  {activeMandate.title}
                </h1>
                <p className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest font-bold">
                  {activeMandate.subtitle}
                </p>
              </motion.div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    sounds.playValidationChime();
                    setSubStep('ROLE_EXPLANATION');
                  }}
                  className="bg-[#FAF8F5] border-2 border-[#D4AF37] hover:bg-[#D4AF37] hover:text-white text-[#D4AF37] font-mono text-[10px] font-black tracking-[0.2em] py-4 px-10 uppercase transition-all duration-300 cursor-pointer w-full"
                >
                  READ MY BOARD MANDATE
                </button>
              </div>
            </motion.div>
          )}

          {subStep === 'ROLE_EXPLANATION' && (
            <motion.div
              key="role-explanation-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-[#D4AF37]/50 p-10 md:p-14 rounded-xs shadow-[0_20px_60px_rgba(0,0,0,0.04)] w-full max-w-xl text-left relative"
            >
              {/* Executive fellowship card design elements */}
              <div className="absolute top-0 right-0 p-6 font-mono text-[10px] text-neutral-400 uppercase select-none">
                FELLOWSHIP DECK
              </div>

              <div className="space-y-6 pb-6 border-b border-neutral-100">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-black block leading-none">
                    BOARD DESIGNER ATTESTATION • TEAM {activeTeam.name.toUpperCase()}
                  </span>
                  <h1 className="text-3xl md:text-3xl.5 font-display font-bold text-neutral-900 uppercase tracking-wide font-sans">
                    {activeMandate.title}
                  </h1>
                </div>

                <div className="p-4 bg-neutral-50 border border-neutral-150 rounded-xs">
                  <p className="text-normal font-medium text-neutral-850 leading-relaxed max-w-md">
                    {activeMandate.description}
                  </p>
                </div>
              </div>

              <div className="py-6 space-y-4">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                  — COMMAND PARAMETERS & DUTIES —
                </h4>
                
                <ul className="space-y-4 text-xs md:text-sm text-neutral-700 font-sans leading-relaxed">
                  {activeMandate.mandates.map((duty, idx) => (
                    <li key={idx} className="flex gap-4">
                      <span className="font-mono text-neutral-400 font-bold select-none pt-0.5">
                        [0{idx + 1}]
                      </span>
                      <span>
                        {duty}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-between items-center select-none">
                <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest font-bold">
                  APPLE LEADERSHIP PROGRAM RETAINED
                </span>
                <button
                  id="role-revealed-continue-btn"
                  onClick={() => {
                    sounds.playValidationChime();
                    onComplete();
                  }}
                  className="bg-[#D4AF37] text-white font-mono text-[10px] hover:bg-yellow-500 hover:text-black font-black tracking-widest py-3 px-8 uppercase transition-colors duration-300 rounded-xs"
                >
                  ASSEMBLE TEAM
                </button>
              </div>
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
