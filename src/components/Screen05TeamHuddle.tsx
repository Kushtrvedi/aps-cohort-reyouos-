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

  const activeTeam = TEAMS.find(t => t.id === selectedTeamId) || TEAMS[1]; // default to Team Bhagat

  // Pull classmates from cache inside team assembly page
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

    return rolesList;
  };

  const boardMembers = getFullBoard();

  useEffect(() => {
    sounds.playTickingSound();

    // Trigger sequential entry of each card
    const intervals = boardMembers.map((_, idx) => {
      return setTimeout(() => {
        setMountedIndex(idx);
        sounds.playTickingSound();
      }, (idx + 1) * 350);
    });

    return () => {
      intervals.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1020] text-white flex flex-col justify-between items-center p-6 md:p-12 relative overflow-hidden select-none font-sans">
      
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.03)_0%,transparent_70%)] animate-pulse" />
      </div>

      {/* Header and status info */}
      <div className="w-full flex justify-between items-center text-[10px] font-mono tracking-widest text-[#AAB2C8] z-10 select-none uppercase">
        <span className="text-[#D4AF37]">REYOU TEAM HUDDLE</span>
        <span>STEP 4 • TEAM ROOM</span>
      </div>

      {/* Main Core */}
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-5xl text-center px-4 my-6 z-10 relative">
        <div className="space-y-8 w-full">
          
          {/* Dashboard Header Info */}
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] uppercase font-black bg-[#D4AF37]/10 py-1 px-4 border border-[#D4AF37]/20 rounded-xs inline-block">
              ACTIVE STUDY GROUP
            </span>
            <h1 className="text-3xl md:text-4.5xl font-sans tracking-tight text-white uppercase font-black">
              TEAM {activeTeam.name.toUpperCase()}
            </h1>
            <p className="text-xs text-[#AAB2C8] max-w-md mx-auto leading-relaxed">
              Your team space is ready! Together you will explore tough choices, balance priorities, and learn first-hand how your decisions shape the future.
            </p>
          </div>

          {/* MASTER METRIC BOARD (Points: 120, Rank: 3, Decisions Made: 4, Confidence Score: 78) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto w-full">
            {[
              { label: 'GROUP SCORE', value: '120 PTS', detail: 'Initial starting points', color: 'text-[#D4AF37]' },
              { label: 'CLASS RANK', value: 'RANK 3', detail: 'Among current active teams', color: 'text-white' },
              { label: 'TASKS COMPLETED', value: '4 / 4', detail: 'Ready for trade-off decisions', color: 'text-white' },
              { label: 'TEAM ALIGNMENT', value: '78 %', detail: 'Peer agreement level', color: 'text-[#D4AF37]' }
            ].map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/[0.02] border border-white/5 p-4 rounded-sm text-left relative overflow-hidden backdrop-blur-md"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="block text-[8px] font-mono text-[#AAB2C8] uppercase tracking-wider">{metric.label}</span>
                <span className={`text-2xl font-mono font-black mt-1 block tracking-tight ${metric.color}`}>{metric.value}</span>
                <span className="text-[9px] font-sans text-neutral-500 mt-1 block leading-none">{metric.detail}</span>
              </motion.div>
            ))}
          </div>

          {/* 5 Premium Profile Cards in alignment */}
          <div className="space-y-3 max-w-4xl mx-auto w-full pt-2">
            <h3 className="text-xs font-mono uppercase tracking-widest text-left text-neutral-500 border-b border-[#FAF8F5]/10 pb-2">
              Your Teammates & Roles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {boardMembers.map((member, idx) => {
                const isVisible = mountedIndex >= idx;
                return (
                  <div
                    key={idx}
                    className={`bg-white/[0.01] border text-left p-5 flex flex-col justify-between min-h-[140px] relative transition-all duration-500 rounded-xs select-none ${
                      isVisible 
                        ? 'opacity-100 translate-y-0 border-white/10' 
                        : 'opacity-0 translate-y-4 border-transparent'
                    } ${member.isUser ? 'ring-1 ring-[#D4AF37]/50 border-[#D4AF37]/50 bg-[#D4AF37]/5 shadow-[0_10px_30px_rgba(212,175,55,0.06)]' : ''}`}
                  >
                    <div className="space-y-2">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-[#D4AF37] font-black block leading-none">
                        {member.roleTitle}
                      </span>
                      <h3 className="text-base font-sans font-black text-white uppercase tracking-tight leading-tight select-all">
                        {member.name}
                      </h3>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-neutral-500 font-bold">
                      <span>STATUS:</span>
                      <span className={member.isUser ? 'text-[#D4AF37] font-extrabold animate-pulse' : 'text-neutral-400 font-bold'}>
                        {member.isUser ? 'ONLINE' : 'ACTIVE'}
                      </span>
                    </div>

                    {member.isUser && (
                      <div className="absolute top-1.5 right-1.5 text-[9px] text-[#D4AF37]">✦</div>
                    )}
                  </div>
                );
              })}
            </div>
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
          className="w-full bg-[#D4AF37] text-neutral-950 border border-[#D4AF37] font-mono hover:bg-yellow-500 text-[11px] py-4 px-8 tracking-[0.3em] font-extrabold uppercase transition-all duration-300 shadow-[0_4px_15px_rgba(212,175,55,0.15)] flex justify-center items-center gap-2 cursor-pointer font-black"
        >
          CONTINUE TO GUIDELINES
        </motion.button>
        <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest leading-none">
          Get ready for your first choice adventure!
        </div>
      </div>
    </div>
  );
}
