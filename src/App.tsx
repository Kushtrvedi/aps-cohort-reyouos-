import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RoleId } from './types';
import { sounds } from './utils/audio';
import { Orb, Canvas } from './components/BreathingOrb';

// Import Screens
import Screen01Intro from './components/Screen01Intro';
import Screen02Welcome from './components/Screen02Welcome';
import Screen03TeamAssigned from './components/Screen03TeamAssigned';
import Screen04RoleReveal from './components/Screen04RoleReveal';
import Screen05TeamHuddle from './components/Screen05TeamHuddle';
import Screen06Principle from './components/Screen06Principle';
import Screen07Oath from './components/Screen07Oath';
import Screen08Briefing from './components/Screen08Briefing';
import Screen09Simulation2 from './components/Screen09Simulation2';
import FacilitatorConsole from './components/FacilitatorConsole';
import ReyouHub from './components/ReyouHub';

const SCREEN_STEPS = [
  { id: 'INTRO', title: 'Entry' },
  { id: 'WELCOME', title: 'Batch Briefing' },
  { id: 'TEAM', title: 'Team Assignment' },
  { id: 'ROLE', title: 'Role Assignment' },
  { id: 'HUDDLE', title: 'Team Alignment' },
  { id: 'PRINCIPLE', title: 'Lab Guidelines' },
  { id: 'OATH', title: 'Boardroom Activation' },
  { id: 'BRIEFING', title: 'Simulation 01' },
  { id: 'SIMULATION2', title: 'Simulation 02' },
];

export default function App() {
  const [appViewMode, setAppViewMode] = useState<'STUDENT' | 'FACILITATOR' | 'REYOU_HUB'>('STUDENT');
  const [screenIndex, setScreenIndex] = useState(() => {
    const saved = localStorage.getItem('reyou-student-screen-index');
    if (saved) {
      const idx = parseInt(saved, 10);
      if (!isNaN(idx) && idx >= 0 && idx < SCREEN_STEPS.length) {
        return idx;
      }
    }
    return 0;
  });
  const [userName, setUserName] = useState(() => localStorage.getItem('reyou-student-name') || '');
  const [rollNumber, setRollNumber] = useState(() => localStorage.getItem('reyou-student-roll') || '');
  const [email, setEmail] = useState(() => localStorage.getItem('reyou-student-email') || '');
  const [selectedTeamId, setSelectedTeamId] = useState('TEAM_ALPHA');
  const [assignedRoleId, setAssignedRoleId] = useState<RoleId>('STRATEGY_LEAD');
  const [transitionState, setTransitionState] = useState<'none' | 'implosion' | 'bloom'>('none');

  useEffect(() => {
    localStorage.setItem('reyou-student-screen-index', screenIndex.toString());
  }, [screenIndex]);

  useEffect(() => {
    localStorage.setItem('reyou-student-name', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('reyou-student-roll', rollNumber);
  }, [rollNumber]);

  useEffect(() => {
    localStorage.setItem('reyou-student-email', email);
  }, [email]);

  const [receivedNudge, setReceivedNudge] = useState<{ teamId: string; timestamp: number; prompt: string; roleId: string | null } | null>(null);

  // Simulation 2 deployment controller
  const [isSim2Deployed, setIsSim2Deployed] = useState<boolean>(() => {
    return localStorage.getItem('reyou-sim2-deployed') === 'true';
  });

  const [sim1Locked, setSim1Locked] = useState<boolean>(() => {
    return localStorage.getItem('reyou-sim1-locked') === 'true';
  });

  const [sim2Locked, setSim2Locked] = useState<boolean>(() => {
    return localStorage.getItem('reyou-sim2-locked') === 'true';
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'reyou-sim2-deployed') {
        setIsSim2Deployed(e.newValue === 'true');
      }
      if (e.key === 'reyou-sim1-locked') {
        setSim1Locked(e.newValue === 'true');
      }
      if (e.key === 'reyou-sim2-locked') {
        setSim2Locked(e.newValue === 'true');
      }
      if (e.key === 'reyou-student-screen-index' && e.newValue !== null) {
        const idx = parseInt(e.newValue, 10);
        if (!isNaN(idx) && idx >= 0 && idx < SCREEN_STEPS.length) {
          setScreenIndex(idx);
        }
      }
      if (e.key === 'reyou-active-nudge' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setReceivedNudge(parsed);
          sounds.playValidationChime();
        } catch (err) {}
      }
    };
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsSim2Deployed(customEvent.detail);
    };
    const handleSim1LockedCustom = (e: Event) => {
      setSim1Locked((e as CustomEvent).detail);
    };
    const handleSim2LockedCustom = (e: Event) => {
      setSim2Locked((e as CustomEvent).detail);
    };
    const handleScreenIndexChanged = (e: Event) => {
      const idx = (e as CustomEvent).detail;
      if (typeof idx === 'number' && idx >= 0 && idx < SCREEN_STEPS.length) {
        setScreenIndex(idx);
      }
    };
    const handleNudgeEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      setReceivedNudge(customEvent.detail);
      sounds.playValidationChime();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('reyou-sim2-deployed-changed', handleCustomEvent);
    window.addEventListener('reyou-sim1-locked-changed', handleSim1LockedCustom);
    window.addEventListener('reyou-sim2-locked-changed', handleSim2LockedCustom);
    window.addEventListener('reyou-student-screen-index-changed', handleScreenIndexChanged);
    window.addEventListener('reyou-active-nudge-dispatched', handleNudgeEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('reyou-sim2-deployed-changed', handleCustomEvent);
      window.removeEventListener('reyou-sim1-locked-changed', handleSim1LockedCustom);
      window.removeEventListener('reyou-sim2-locked-changed', handleSim2LockedCustom);
      window.removeEventListener('reyou-student-screen-index-changed', handleScreenIndexChanged);
      window.removeEventListener('reyou-active-nudge-dispatched', handleNudgeEvent);
    };
  }, []);

  const visibleSteps = isSim2Deployed 
    ? SCREEN_STEPS 
    : SCREEN_STEPS.filter(step => step.id !== 'SIMULATION2');

  const activeVisibleIdx = visibleSteps.findIndex(s => s.id === SCREEN_STEPS[screenIndex]?.id);

  const isCurrentScreenLocked = 
    appViewMode === 'STUDENT' && (
      (SCREEN_STEPS[screenIndex]?.id === 'BRIEFING' && sim1Locked) ||
      (SCREEN_STEPS[screenIndex]?.id === 'SIMULATION2' && sim2Locked)
    );

  // Trigger implosion and bloom animations for the Orb as a visual bridge
  const changeScreen = (newIdx: number) => {
    if (newIdx === screenIndex) return;
    setTransitionState('implosion');
    sounds.playClickSound();

    setTimeout(() => {
      setScreenIndex(newIdx);
      setTransitionState('bloom');

      setTimeout(() => {
        setTransitionState('none');
      }, 700);
    }, 450);
  };

  // Audio resonance on stage modifications
  const handleNextScreen = () => {
    const nextIdx = screenIndex + 1;
    if (nextIdx < SCREEN_STEPS.length) {
      if (SCREEN_STEPS[nextIdx].id === 'SIMULATION2' && !isSim2Deployed) {
        return;
      }
      changeScreen(nextIdx);
    }
  };

  const handlePrevScreen = () => {
    if (screenIndex > 0) {
      changeScreen(screenIndex - 1);
    }
  };

  const handleJumpToScreen = (idx: number) => {
    const targetStep = visibleSteps[idx];
    const realIdx = SCREEN_STEPS.findIndex(step => step.id === targetStep.id);
    if (realIdx !== -1) {
      changeScreen(realIdx);
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      {/* 
        Sleek, minimal demo pagination track for facilitators.
        Highly polished. Displays only on Screens 2 to 8, adhering strictly to
        the "No navigation, no dashboard" mandate of SCREEN 01.
      */}
      {screenIndex > 0 && (
        <div className="absolute top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xs border-b border-neutral-100 px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-4 justify-between w-full sm:w-auto">
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => { sounds.playClickSound(); setScreenIndex(0); setAppViewMode('STUDENT'); }}>
              <div className="w-1.5 h-1.5 rounded-full bg-reyou-gold animate-pulse" />
              <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase font-bold">
                REYOU EDUCATION
              </span>
            </div>

            {/* Micro Mode Toggler inside pagination deck */}
            <div className="flex bg-neutral-100 p-0.5 rounded-sm border border-neutral-200 text-[10px] font-mono leading-none">
              <button
                onClick={() => { sounds.playClickSound(); setAppViewMode('STUDENT'); }}
                className={`px-2 py-1 font-bold rounded-xs cursor-pointer transition-all ${
                  appViewMode === 'STUDENT' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                🎓 Student Sim
              </button>
              <button
                onClick={() => { sounds.playClickSound(); setAppViewMode('FACILITATOR'); }}
                className={`px-2 py-1 font-bold rounded-xs cursor-pointer transition-all ${
                  appViewMode === 'FACILITATOR' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-500 hover:text-[#D4AF37]'
                }`}
              >
                👁️ Cohorts
              </button>
              <button
                onClick={() => { sounds.playClickSound(); setAppViewMode('REYOU_HUB'); }}
                className={`px-2 py-1 font-bold rounded-xs cursor-pointer transition-all ${
                  appViewMode === 'REYOU_HUB' ? 'bg-[#D4AF37] text-neutral-950 shadow-xs' : 'text-neutral-500 hover:text-[#D4AF37]'
                }`}
              >
                🛡️ OS Hub
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {appViewMode === 'STUDENT' && screenIndex > 1 && (
              <button
                onClick={handlePrevScreen}
                className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-300 rounded px-2 py-0.5 mr-3 cursor-pointer transition-all"
              >
                ← Back
              </button>
            )}

            {/* Micro steps sequence line - only if we are playing with the Student Simulation */}
            {appViewMode === 'STUDENT' && (
              <div className="hidden md:flex items-center gap-2">
                {visibleSteps.map((step, idx) => {
                  const isActive = activeVisibleIdx === idx;
                  const isPassed = activeVisibleIdx > idx;
                  return (
                    <button
                      key={step.id}
                      onClick={() => handleJumpToScreen(idx)}
                      title={`Jump to ${step.title}`}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'w-10 bg-reyou-gold'
                          : isPassed
                          ? 'w-3 bg-neutral-900'
                          : 'w-2 bg-neutral-200 hover:bg-neutral-300'
                      }`}
                    />
                  );
                })}
              </div>
            )}

            {/* Mobile simplified digit */}
            {appViewMode === 'STUDENT' && (
              <span className="text-[10px] font-mono text-neutral-500 font-semibold md:hidden">
                STAGE {activeVisibleIdx !== -1 ? activeVisibleIdx + 1 : 1} / {visibleSteps.length}
              </span>
            )}
            
            {appViewMode === 'FACILITATOR' && (
              <span className="text-[9px] font-mono text-[#D4AF37] font-semibold bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-sm border border-[#D4AF37]/20 uppercase tracking-widest animate-pulse">
                Facilitator Mode Live
              </span>
            )}

            {appViewMode === 'REYOU_HUB' && (
              <span className="text-[9px] font-mono text-[#D4AF37] font-semibold bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-sm border border-[#D4AF37]/20 uppercase tracking-widest animate-pulse">
                REYOU OS Active Hub
              </span>
            )}
          </div>
        </div>
      )}

      {/* Primary Orchestration Stage */}
      <main className={screenIndex > 0 ? "pt-12" : ""}>
        {appViewMode === 'REYOU_HUB' ? (
          <motion.div
            key="reyou-hub"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <ReyouHub />
          </motion.div>
        ) : appViewMode === 'FACILITATOR' ? (
          <motion.div
            key="facilitator"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <FacilitatorConsole />
          </motion.div>
        ) : isCurrentScreenLocked ? (
          <motion.div
            key="sandbox-locked"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border-2 border-dashed border-[#D4AF37] flex items-center justify-center text-[#D4AF37] text-2xl font-bold animate-pulse">
              🔒
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] uppercase font-black block">
                ✦ SYSTEM SUSPENDED BY FACILITATOR
              </span>
              <h2 className="text-2xl font-display font-extrabold text-neutral-900 uppercase tracking-tight">
                {SCREEN_STEPS[screenIndex]?.id === 'BRIEFING' ? 'SIMULATION 01 HAS BEEN LOCKED' : 'SIMULATION 02 HAS BEEN LOCKED'}
              </h2>
              <div className="h-0.5 w-12 bg-[#D4AF37] mx-auto my-3" />
            </div>

            <p className="text-sm font-sans leading-relaxed text-neutral-600 max-w-md">
              The Lead Instructor has locked this trade-off playground. Active decisions and cognitive bias reflections are being synthesized on the classroom main deck.
            </p>

            <div className="bg-neutral-50 p-4 border border-neutral-100 rounded-sm w-full space-y-2 font-mono text-left max-w-md">
              <span className="text-[9px] text-[#D4AF37] font-bold block uppercase tracking-widest">💡 Focus Challenge Prompt</span>
              <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                Discuss with your group: "What option has your team not considered yet, and what role bias is currently guiding your decisions?"
              </p>
            </div>

            <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest leading-none">
              Please await class-wide debrief signals.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {screenIndex === 0 && (
              <motion.div
                key="screen-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Screen01Intro onComplete={handleNextScreen} />
            </motion.div>
          )}

          {screenIndex === 1 && (
            <motion.div
              key="screen-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Screen02Welcome
                userName={userName}
                setUserName={setUserName}
                onComplete={handleNextScreen}
              />
            </motion.div>
          )}

          {screenIndex === 2 && (
            <motion.div
              key="screen-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Screen03TeamAssigned
                userName={userName}
                setUserName={setUserName}
                rollNumber={rollNumber}
                setRollNumber={setRollNumber}
                email={email}
                setEmail={setEmail}
                selectedTeamId={selectedTeamId}
                setSelectedTeamId={setSelectedTeamId}
                onComplete={handleNextScreen}
              />
            </motion.div>
          )}

          {screenIndex === 3 && (
            <motion.div
              key="screen-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Screen04RoleReveal
                selectedTeamId={selectedTeamId}
                assignedRoleId={assignedRoleId}
                setAssignedRoleId={setAssignedRoleId}
                onComplete={handleNextScreen}
              />
            </motion.div>
          )}

          {screenIndex === 4 && (
            <motion.div
              key="screen-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Screen05TeamHuddle
                userName={userName}
                selectedTeamId={selectedTeamId}
                onComplete={handleNextScreen}
              />
            </motion.div>
          )}

          {screenIndex === 5 && (
            <motion.div
              key="screen-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Screen06Principle onComplete={handleNextScreen} />
            </motion.div>
          )}

          {screenIndex === 6 && (
            <motion.div
              key="screen-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Screen07Oath onComplete={handleNextScreen} />
            </motion.div>
          )}

          {screenIndex === 7 && (
            <motion.div
              key="screen-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Screen08Briefing
                userName={userName}
                selectedTeamId={selectedTeamId}
                assignedRoleId={assignedRoleId}
                onComplete={handleNextScreen}
                isSim2Deployed={isSim2Deployed}
              />
            </motion.div>
          )}

          {screenIndex === 8 && (
            <motion.div
              key="screen-9"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Screen09Simulation2
                userName={userName}
                selectedTeamId={selectedTeamId}
                assignedRoleId={assignedRoleId}
              />
            </motion.div>
          )}
        </AnimatePresence>
        )}
      </main>

      {/* Immersive Visual Bridge Transition Overlay using the requested Orb */}
      <AnimatePresence>
        {transitionState !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#060606] flex flex-col justify-center items-center pointer-events-auto"
          >
            <Canvas frameloop="demand" id="transition-portal-canvas" className="flex flex-col justify-center items-center">
              <div className="scale-125 md:scale-150 transform transition-transform duration-500">
                <Orb
                  intensity={transitionState === 'implosion' ? 0.95 : 0.45}
                  turbulence={transitionState === 'implosion' ? 0.85 : 0.25}
                  color="#D4AF37"
                  transitionState={transitionState}
                />
              </div>
            </Canvas>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time facilitator active nudge notification */}
      <AnimatePresence>
        {receivedNudge && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm bg-neutral-950 text-white border-2 border-[#D4AF37] p-5 rounded-md shadow-[0_10px_35px_rgba(212,175,55,0.15)] space-y-3.5 font-sans"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-black">
                  {receivedNudge.roleId ? "🎯 SYSTEM ROLE CALL" : "⚡ COHORT DIRECTIVE"}
                </span>
              </div>
              <button
                onClick={() => { sounds.playClickSound(); setReceivedNudge(null); }}
                className="text-[10px] font-mono text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕ CLOSE
              </button>
            </div>
            
            <div className="space-y-2">
              {receivedNudge.roleId && (
                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2.5 py-1 rounded text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider font-extrabold inline-block">
                  Target Role: {receivedNudge.roleId}
                </div>
              )}
              <p className="text-xs font-serif leading-relaxed text-neutral-200">
                "{receivedNudge.prompt}"
              </p>
            </div>

            <button
              onClick={() => {
                sounds.playValidationChime();
                setReceivedNudge(null);
              }}
              className="w-full py-2 bg-[#D4AF37] text-black hover:bg-yellow-500 transition-colors font-mono text-xs font-black uppercase rounded-xs tracking-wider cursor-pointer"
            >
              Acknowledge & Sync
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
