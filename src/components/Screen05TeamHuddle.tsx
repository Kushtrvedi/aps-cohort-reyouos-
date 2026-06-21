import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { sounds } from '../utils/audio';
import { TEAMS } from '../types';

interface Screen05TeamHuddleProps {
  userName: string;
  selectedTeamId: string;
  onComplete: () => void;
}

export default function Screen05TeamHuddle({ userName, selectedTeamId, onComplete }: Screen05TeamHuddleProps) {
  const [mountedIndex, setMountedIndex] = useState<number>(-1);

  const activeTeam = TEAMS.find(t => t.id === selectedTeamId) || TEAMS[0];

  // Pull balanced cohort classmates from cache to show realistic peer names
  const getFullBoard = () => {
    let customTeam: any = null;
    const cached = localStorage.getItem('reyou-imported-cohort-full');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed)) {
          customTeam = parsed.find((x: any) => x.id === selectedTeamId);
        }
      } catch (e) {
        console.error("Cache decoding lookup inside team assembly page", e);
      }
    }

    const rolesList = [
      { id: 'TEAM_LEAD', title: 'TEAM LEAD', defaultName: 'Suresh Raina' },
      { id: 'STRATEGY_LEAD', title: 'BIG PICTURE THINKER', defaultName: 'Alia Bhatt' },
      { id: 'RISK_LEAD', title: 'WHAT COULD GO WRONG?', defaultName: 'Sidharth Malhotra' },
      { id: 'COMMUNICATION_LEAD', title: 'TEAM SPEAKER', defaultName: 'Rashmika Mandanna' },
      { id: 'REFLECTION_LEAD', title: 'LESSON FINDER', defaultName: userName.trim() || 'You', isUser: true }
    ];

    if (customTeam && customTeam.members) {
      // Keep classmates assigned to roles, but ensure reflection lead is the student
      return rolesList.map(role => {
        if (role.isUser) {
          return {
            roleId: role.id,
            roleTitle: role.title,
            name: userName.trim() || 'You',
            isUser: true
          };
        }
        const member = customTeam.members.find((m: any) => m.roleId === role.id);
        return {
          roleId: role.id,
          roleTitle: role.title,
          name: member ? member.name : role.defaultName,
          isUser: false
        };
      });
    }

    // Default Fallbacks
    return rolesList;
  };

  const boardMembers = getFullBoard();

  useEffect(() => {
    sounds.playTickingSound();

    // Trigger sequential entry of each card every 450 milliseconds
    const intervals = boardMembers.map((_, idx) => {
      return setTimeout(() => {
        setMountedIndex(idx);
        sounds.playTickingSound();
      }, (idx + 1) * 450);
    });

    return () => {
      intervals.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111111] flex flex-col justify-between items-center p-8 md:p-16 relative overflow-hidden select-none font-serif">
      
      {/* Header and status info */}
      <div className="w-full flex justify-between items-center text-[9px] font-mono tracking-widest text-[#D4AF37] font-extrabold z-10 select-none uppercase">
        <span>REYOU COHORT COORDINATION INDEX</span>
        <span>STAGE 06: BOARD FORMATION</span>
      </div>

      {/* Main Core */}
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-4xl text-center px-4 my-8 z-10 relative">
        <div className="space-y-12 w-full">
          
          {/* Main Display Header */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-black block leading-none select-none">
              TEAM MEMBER ASSEMBLY
            </span>
            <h1 className="text-3.5xl md:text-5xl font-display font-semibold tracking-wide text-neutral-900 uppercase leading-none font-sans select-none">
              TEAM {activeTeam.name.toUpperCase()}
            </h1>
            <p className="text-sm font-normal text-neutral-500 max-w-lg mx-auto leading-relaxed select-none">
              These five roles will work together to make decisions during today's class. Make sure everyone is ready!
            </p>
          </div>

          {/* 5 Premium Profile Cards with sequential animation */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full pt-4">
            {boardMembers.map((member, idx) => {
              const isVisible = mountedIndex >= idx;
              return (
                <div
                  key={idx}
                  className={`bg-white border text-left p-6 flex flex-col justify-between min-h-[160px] relative transition-all duration-700 rounded-xs shadow-[0_10px_35px_rgba(0,0,0,0.02)] ${
                    isVisible 
                      ? 'opacity-100 translate-y-0 border-neutral-300' 
                      : 'opacity-0 translate-y-6 border-transparent'
                  } ${member.isUser ? 'ring-2 ring-[#D4AF37] border-[#D4AF37] bg-[#D4AF37]/5 shadow-[0_15px_40px_rgba(212,175,55,0.08)]' : ''}`}
                >
                  <div className="space-y-3">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#D4AF37] font-black block leading-none">
                      {member.roleTitle}
                    </span>
                    <h3 className="text-[17px] font-display font-bold text-neutral-900 uppercase tracking-wide font-sans leading-tight">
                      {member.name}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex justify-between items-center text-[8.5px] font-mono text-neutral-450 select-none font-bold">
                    <span>ATTESTED STATUS:</span>
                    <span className={member.isUser ? 'text-[#D4AF37] font-extrabold animate-pulse' : 'text-neutral-500 font-bold'}>
                      {member.isUser ? 'SIGNED IN' : 'CONNECTING...'}
                    </span>
                  </div>

                  {/* Golden seal marker on User card */}
                  {member.isUser && (
                    <div className="absolute top-1.5 right-1.5 text-[9px] text-[#D4AF37] hover:scale-105 transition-all">✦</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-center items-center gap-1.5 text-[8.5px] font-mono text-neutral-400 uppercase tracking-widest select-none">
            <span>GET CLASSED</span>
            <span>•</span>
            <span>FIND TEAM</span>
            <span>•</span>
            <span>START PLAYING</span>
          </div>

        </div>
      </div>

      {/* Footer controls */}
      <div className="w-full max-w-sm flex flex-col items-center gap-4 z-10">
        <motion.button
          id="reveal-rules-btn"
          onClick={() => {
            sounds.playValidationChime();
            onComplete();
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full border-2 border-[#D4AF37] text-[#D4AF37] bg-white font-mono hover:bg-[#D4AF37] hover:text-white text-[11px] py-4 px-8 tracking-[0.3em] font-extrabold uppercase transition-all duration-300 shadow-[0_4px_15px_rgba(212,175,55,0.08)] flex justify-center items-center gap-2 cursor-pointer font-black"
        >
          READ THE CLASS LAWS
        </motion.button>
        <div className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest leading-none">
          GET READY TO START
        </div>
      </div>
    </div>
  );
}
