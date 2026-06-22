import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Layers, 
  Activity, 
  Compass, 
  Radio, 
  Quote, 
  Target, 
  Sparkles, 
  TrendingUp,
  Brain,
  Award,
  AlertTriangle,
  Lightbulb,
  Workflow,
  Cloud,
  Download,
  Upload,
  RefreshCw,
  X,
  FileText
} from 'lucide-react';
import { sounds } from '../utils/audio';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  saveFileToDrive 
} from '../utils/googleWorkspace';
import { User } from 'firebase/auth';

interface PrincipalConsoleProps {
  currentPhase: number;
  phaseTitle: string;
  showEndScreen: boolean;
  onReset?: () => void;
  spotlightedReflection?: any;
}

const HISTORIC_STUDENT_QUOTES = [
  { text: "I thought saving money was about money. Now I think it is about options.", author: "Meera (Team Kalam)" },
  { text: "I realized I trust people more than evidence.", author: "Siddharth (Team Shivaji)" },
  { text: "Under pressure, urgency replaced checking. I skipped validation papers because of artificial deadline panic.", author: "Ananya (Team Bhagat)" },
  { text: "Our excel sheets looked secure, but real life doesn't follow perfect percentage projections.", author: "Rohan (Team Chanakya)" },
  { text: "I realized I was choosing immediate comfort without looking at our actual consequence horizon.", author: "Sonal (Team Azad)" }
];

export default function PrincipalConsole({
  currentPhase,
  phaseTitle,
  showEndScreen: parentShowEndScreen,
  onReset,
  spotlightedReflection
}: PrincipalConsoleProps) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [activeCapabilityIndex, setActiveCapabilityIndex] = useState<number | null>(null);
  const [forceLocalEnd, setForceLocalEnd] = useState(false);

  // AI reports for administrative dashboard
  const [teacherReport, setTeacherReport] = useState<{ strengths: string; weaknesses: string; activities: string } | null>(null);
  const [principalReport, setPrincipalReport] = useState<{
    commonDecisions: string;
    commonMistakes: string;
    commonFears: string;
    commonAssumptions: string;
    powerfulReflections: string;
    recommendations: string;
  } | null>(null);
  const [cohortReport, setCohortReport] = useState<{ learningStrengths: string; focusAreas: string; actionSteps: string } | null>(null);
  const [loadingAdminReports, setLoadingAdminReports] = useState<boolean>(false);
  const [adminActiveTab, setAdminActiveTab] = useState<'teacher' | 'principal' | 'cohort'>('teacher');

  // Google Workspace state inside Principal Console
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [driveSyncStatus, setDriveSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [driveSyncMessage, setDriveSyncMessage] = useState<string>('');

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    sounds.playClickSound();
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);
        setDriveSyncStatus('success');
        setDriveSyncMessage(`Connected to Google Drive!`);
        setTimeout(() => {
          setDriveSyncStatus('idle');
          setDriveSyncMessage('');
        }, 3000);
      }
    } catch (err: any) {
      console.error(err);
      setDriveSyncStatus('error');
      setDriveSyncMessage(`Auth Failed: ${err.message || err}`);
    }
  };

  const handleGoogleLogOut = async () => {
    sounds.playClickSound();
    await logout();
    setGoogleUser(null);
    setGoogleToken(null);
    setDriveSyncStatus('idle');
    setDriveSyncMessage('Successfully disconnected.');
    setTimeout(() => setDriveSyncMessage(''), 3000);
  };

  const handleArchiveReportsToDrive = async () => {
    if (!googleToken) {
      alert("Please connect your Google Workspace account first.");
      return;
    }

    if (!teacherReport && !principalReport && !cohortReport) {
      alert("No administrative reports generated yet. Raise reports first!");
      return;
    }

    const confirmed = window.confirm(
      "CONFIRM GOOGLE DRIVE ARCHIVAL: Are you sure you want to save or overwrite 'reyou-principal-report.json' in your private Google Drive folder?"
    );
    if (!confirmed) return;

    setDriveSyncStatus('syncing');
    setDriveSyncMessage('Archiving generated simulation reports to Google Drive...');
    sounds.playClickSound();

    try {
      const reportsBundle = {
        archivedAt: new Date().toISOString(),
        teacherReport,
        principalReport,
        cohortReport,
        phase: currentPhase,
        phaseTitle
      };

      const res = await saveFileToDrive('reyou-principal-report.json', reportsBundle, googleToken);
      if (res.success) {
        setDriveSyncStatus('success');
        setDriveSyncMessage(`Reports suite successfully archived! File ID: ${res.fileId?.substring(0, 10)}...`);
        sounds.playValidationChime();
        setTimeout(() => {
          setDriveSyncStatus('idle');
          setDriveSyncMessage('');
        }, 5000);
      } else {
        throw new Error("Target drive operation returned failed state");
      }
    } catch (err: any) {
      console.error(err);
      setDriveSyncStatus('error');
      setDriveSyncMessage(`Archive failure: ${err.message || err}`);
    }
  };

  // Principal Interactive AI Query States
  const [customQuery, setCustomQuery] = useState<string>('');
  const [queryAnswer, setQueryAnswer] = useState<string | null>(null);
  const [loadingQuery, setLoadingQuery] = useState<boolean>(false);

  const handleCustomQuerySubmit = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoadingQuery(true);
    setQueryAnswer(null);
    sounds.playClickSound();
    try {
      const res = await fetch("/api/reports/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryText,
          cohortData: {
            className: "APS Founder Cohort",
            totalTeams: 10,
          }
        })
      });
      const data = await res.json();
      if (data.success && data.answer) {
        setQueryAnswer(data.answer);
      } else {
        setQueryAnswer("An error occurred during cohort index aggregation. Please ensure server properties are sound.");
      }
    } catch (e) {
      console.error("Custom query failed:", e);
      setQueryAnswer("Connection timeout or bad response.");
    } finally {
      setLoadingQuery(false);
    }
  };

  // Principal Live Feed States
  const [liveIntel, setLiveIntel] = useState<{
    reflection1: string;
    reflection2: string;
    reflection3: string;
    simulation1WhatLearned: string;
    simulation2WhatLearned: string;
  } | null>(null);
  const [loadingLiveIntel, setLoadingLiveIntel] = useState<boolean>(false);

  const fetchLiveIntel = async () => {
    setLoadingLiveIntel(true);
    try {
      const res = await fetch("/api/reports/principal-live-feed");
      const data = await res.json();
      if (data.success && data.report) {
        setLiveIntel(data.report);
      }
    } catch (e) {
      console.error("Failed to load live intel feed:", e);
    } finally {
      setLoadingLiveIntel(false);
    }
  };

  useEffect(() => {
    fetchLiveIntel();
    const timer = setInterval(fetchLiveIntel, 30000); // 30 seconds auto-ping
    return () => clearInterval(timer);
  }, []);

  const handleGenerateAdminReports = async () => {
    setLoadingAdminReports(true);
    try {
      const payload = {
        className: "APS Founder Cohort",
        totalTeams: 10,
        mostCommonDecisions: [
          "Preserving basic life budget margins",
          "Selecting comfortable lifestyle rent traps initially",
          "Deciding on business franchise opportunities without deep reserves"
        ],
        mostCommonMistakes: [
          "Relying on friendship trust rather than checking verification rules",
          "Assuming simulation Year 1 represented permanent future stability"
        ],
        mostCommonFears: [
          "Falling behind their immediate peers in salary speed",
          "Facing sudden emergency medical or sibling costs"
        ],
        mostCommonAssumptions: [
          "That high investment returns carry zero risks if proposed by friends",
          "That active working energy scales infinitely"
        ],
        reflectionsSample: [
          "I realized that saving money is more about having options than just having coins.",
          "Under stress, pressure replaced checking. I skipped validation papers because of artificial deadline panic.",
          "Our spreadsheets looked secure, but real life doesn't follow perfect percentage projections.",
          "I was selecting immediate comfort without looking at our actual consequence horizon."
        ]
      };

      const [resTeacher, resPrincipal, resCohort] = await Promise.all([
        fetch("/api/reports/teacher", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }),
        fetch("/api/reports/principal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }),
        fetch("/api/reports/cohort", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      ]);

      const dataT = await resTeacher.json();
      const dataP = await resPrincipal.json();
      const dataC = await resCohort.json();

      if (dataT.success && dataT.report) setTeacherReport(dataT.report);
      if (dataP.success && dataP.report) setPrincipalReport(dataP.report);
      if (dataC.success && dataC.report) setCohortReport(dataC.report);

    } catch (error) {
      console.error("AI Admin Reports failed to generate:", error);
    } finally {
      setLoadingAdminReports(false);
    }
  };

  const showEnd = parentShowEndScreen || forceLocalEnd;

  // Auto-updating candidate quotes for the "photograph-worthy" student quote screen
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % HISTORIC_STUDENT_QUOTES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleCapabilityClick = (idx: number) => {
    sounds.playClickSound();
    setActiveCapabilityIndex(idx === activeCapabilityIndex ? null : idx);
  };

  // Six core student growths measured by Reyou Experiential platform
  const capabilities = [
    { 
      name: "Thinking About What Might Happen Next", 
      value: 78, 
      color: "from-blue-500 to-indigo-600",
      descr: "How well students look ahead and plan for long-term consequences over 10-year horizons." 
    },
    { 
      name: "Thinking About What Could Go Wrong", 
      value: 64, 
      color: "from-rose-500 to-orange-600", 
      descr: "Spotting hidden dangers and avoiding comfort traps."
    },
    { 
      name: "Checks Facts Before Believing", 
      value: 72, 
      color: "from-amber-500 to-yellow-600",
      descr: "Checking facts carefully even when in a hurry." 
    },
    { 
      name: "Knowing What They Are Giving Up", 
      value: 85, 
      color: "from-emerald-500 to-teal-600",
      descr: "Balancing immediate comfort needs against long-term safety." 
    },
    { 
      name: "Can Make Decisions Without Following Others", 
      value: 59, 
      color: "from-purple-500 to-fuchsia-600",
      descr: "Resisting the urge to follow what peers or media says blindly." 
    },
    { 
      name: "Lesson Finder (Learning from Mistakes)", 
      value: 91, 
      color: "from-cyan-500 to-sky-600",
      descr: "Learning from mistakes, thinking about what went wrong and rebuilding the plan." 
    },
  ];

  return (
    <div className="space-y-12">
      {/* ----------------------------------------- */}
      {/* HEADER SECTION                            */}
      {/* ----------------------------------------- */}
      <div className="bg-[#0E0E0E] border border-[#1A1A1A] p-8 rounded-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 immersive-ambient-radial pointer-events-none opacity-40" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-xs font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-black">
                REYOU EDUCATION
              </span>
            </div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight uppercase">
              APS FOUNDER COHORT
            </h1>
            <p className="text-sm font-mono text-neutral-400">
              Live Report: What Students Are Learning About Life
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playValidationChime();
                setForceLocalEnd(!forceLocalEnd);
              }}
              className={`px-5 py-2.5 rounded-xs font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                showEnd 
                  ? 'bg-[#141414] border-[#222] text-[#D4AF37] hover:bg-[#1A1A1A]' 
                  : 'bg-[#D4AF37] border-[#D4AF37] text-black hover:bg-yellow-500 font-extrabold'
              }`}
            >
              {showEnd ? "View Student Progress" : "See Final Class Lessons"}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showEnd ? (
          <motion.div
            key="nominal-screen"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-10"
          >
            {/* ----------------------------------------- */}
            {/* SECTION 1 & 2: REYOU MISSION CONTROL OVERVIEW & HERO WHAT STUDENTS ARE THINKING */}
            {/* ----------------------------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* SECTION 1: LIVE COHORT OVERVIEW (4 COLS) */}
              <div className="lg:col-span-5 bg-[#0E0E0E] border border-[#1A1A1A] p-6 rounded-xs flex flex-col justify-between space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-505 text-neutral-450 font-bold block">
                    SECTION 01
                  </span>
                  <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider border-b border-[#1A1A1A] pb-2">
                    LIVE COHORT OVERVIEW
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-black border border-[#141414] rounded-xs space-y-1">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">Students Present</span>
                    <div className="text-3xl font-display font-bold text-[#D4AF37] flex items-baseline gap-1.5">
                      50
                      <span className="text-[10px] font-mono text-emerald-400 font-normal">Active</span>
                    </div>
                  </div>

                  <div className="p-4 bg-black border border-[#141414] rounded-xs space-y-1">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">Teams</span>
                    <div className="text-3xl font-display font-bold text-[#D4AF37]">
                      10
                    </div>
                  </div>

                  <div className="p-4 bg-black border border-[#141414] rounded-xs space-y-1">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">Simulation</span>
                    <div className="text-lg font-mono font-bold text-[#D4AF37]">
                      Simulation 1
                    </div>
                  </div>

                  <div className="p-4 bg-black border border-[#141414] rounded-xs space-y-1">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">Current Phase</span>
                    <div className="text-xs font-sans font-bold text-white leading-tight uppercase tracking-wider">
                      {phaseTitle}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1A1A1A] text-[10px] font-mono text-neutral-500 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-ping" />
                  <span>SECURE ENCRYPTED NETWORK TRANSMISSION LIVE</span>
                </div>
              </div>

              {/* SECTION 2: WHAT STUDENTS ARE THINKING (HERO SECTION - 7 COLS) */}
              <div className="lg:col-span-7 bg-[#0E0E0E] border border-[#D4AF37] p-8 rounded-xs relative">
                <div className="absolute top-0 right-0 bg-[#D4AF37] text-black px-3 py-0.5 text-[8.5px] font-mono font-black uppercase tracking-widest">
                  HERO FOCUS AREA
                </div>

                <div className="space-y-5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold block">
                      SECTION 02
                    </span>
                    <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider">
                      WHAT STUDENTS ARE THINKING
                    </h2>
                    <p className="text-xs text-neutral-450 leading-relaxed max-w-md">
                      This is where educators become curious. The interface traces changing mindsets over years of virtual trade-offs.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    <div className="space-y-1 bg-black/45 p-4 border border-[#222] rounded-xs">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase block tracking-wider font-bold">
                        Most Common Priority
                      </span>
                      <div className="text-2xl font-display font-light text-white tracking-tight uppercase">
                        Security
                      </div>
                      <span className="text-[9.5px] font-mono text-[#D4AF37] block">
                        64% weightage
                      </span>
                    </div>

                    <div className="space-y-1 bg-black/45 p-4 border border-[#222] rounded-xs">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase block tracking-wider font-bold">
                        Most Common Fear
                      </span>
                      <div className="text-2xl font-display font-light text-rose-300 tracking-tight uppercase leading-none">
                        Financial Uncertainty
                      </div>
                      <span className="text-[9.5px] font-mono text-rose-400 block pt-1">
                        Live panic wave
                      </span>
                    </div>

                    <div className="space-y-1 bg-black/45 p-4 border border-[#222] rounded-xs">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase block tracking-wider font-bold">
                        Most Common Assumption
                      </span>
                      <div className="text-xl font-display font-light text-[#D4AF37] tracking-tight leading-snug">
                        I Can Save Later
                      </div>
                      <span className="text-[9.5px] font-mono text-neutral-400 block">
                        Under stress trap
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* NVIDIA NIM™ PRINCIPAL LIVE INTELLIGENCE FEED */}
            <div className="bg-[#0E0E0E] border-2 border-[#D4AF37]/25 p-8 rounded-xs space-y-6 relative">
              <div className="absolute top-0 right-0 bg-[#D4AF37] text-black px-3.5 py-0.5 text-[8.5px] font-mono font-black uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                <span>REYOU TEAM REAL-TIME ADVISOR</span>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#1A1A1A] pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-black block">
                    ✦ LIVE INTELLIGENCE FEED
                  </span>
                  <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">
                    COHORT MINDSET REFLECTION TRAJECTORY
                  </h2>
                </div>

                <button
                  onClick={() => {
                    sounds.playClickSound();
                    fetchLiveIntel();
                  }}
                  disabled={loadingLiveIntel}
                  className="px-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/55 text-[#D4AF37] hover:text-white rounded text-xs font-mono font-bold tracking-widest cursor-pointer uppercase transition-all flex items-center gap-1.5"
                >
                  {loadingLiveIntel ? (
                    <>
                      <span className="inline-block w-2.5 h-2.5 rounded-full border-2 border-t-transparent border-[#D4AF37] animate-spin" />
                      <span>POLLING INTERNALS...</span>
                    </>
                  ) : (
                    <>
                      <span>🔄</span>
                      <span>RE-POLL ADVISOR</span>
                    </>
                  )}
                </button>
              </div>

              {/* THREE LIVE MINDSET OBSERVATIONS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="bg-[#080808] p-5 border border-neutral-900 rounded-xs space-y-2">
                  <span className="font-mono text-[9px] text-[#D4AF37] uppercase font-black tracking-widest block">Mindset Vector 1</span>
                  {loadingLiveIntel ? (
                    <div className="text-neutral-500 font-mono text-xs animate-pulse">Synthesizing live cohort reflections...</div>
                  ) : (
                    <p className="text-xs text-neutral-250 italic leading-relaxed font-sans">
                      "{liveIntel?.reflection1 || 'Students are actively reflecting on whether instant peer social compliance overrides long-term compound asset building.'}"
                    </p>
                  )}
                </div>

                <div className="bg-[#080808] p-5 border border-neutral-900 rounded-xs space-y-2">
                  <span className="font-mono text-[9px] text-[#D4AF37] uppercase font-black tracking-widest block">Mindset Vector 2</span>
                  {loadingLiveIntel ? (
                    <div className="text-neutral-500 font-mono text-xs animate-pulse">Synthesizing live cohort reflections...</div>
                  ) : (
                    <p className="text-xs text-neutral-250 italic leading-relaxed font-sans">
                      "{liveIntel?.reflection2 || 'Many student teams believe future earn rates are guaranteed, rather than modeling economic uncertainty buffers.'}"
                    </p>
                  )}
                </div>

                <div className="bg-[#080808] p-5 border border-neutral-900 rounded-xs space-y-2">
                  <span className="font-mono text-[9px] text-[#D4AF37] uppercase font-black tracking-widest block">Mindset Vector 3</span>
                  {loadingLiveIntel ? (
                    <div className="text-neutral-500 font-mono text-xs animate-pulse">Synthesizing live cohort reflections...</div>
                  ) : (
                    <p className="text-xs text-neutral-250 italic leading-relaxed font-sans">
                      "{liveIntel?.reflection3 || 'Realization is setting in that quick lifestyle comfort rentals restrict financial independence trajectory.'}"
                    </p>
                  )}
                </div>
              </div>

              {/* TWIN SIMULATION DEEP LEARNING SUMMARIES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#161616]">
                {/* SIMULATION 1 SUMMARY */}
                <div className="bg-neutral-950 p-6 border border-neutral-850 rounded-xs space-y-3">
                  <div className="flex justify-between items-center pb-1">
                    <span className="font-mono text-[9px] text-neutral-450 font-extrabold uppercase bg-neutral-900 px-2 py-0.5 border border-neutral-800 rounded">
                      Simulation 1 Summary (Money)
                    </span>
                    <span className="text-[10px] text-emerald-450 font-mono font-bold">RESOURCE TRACKER</span>
                  </div>
                  <h3 className="text-sm font-display font-semibold text-white uppercase tracking-wider">
                    How Students Managed Assets & Checking Loops:
                  </h3>
                  {loadingLiveIntel ? (
                    <div className="h-10 bg-neutral-900 animate-pulse rounded" />
                  ) : (
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      {liveIntel?.simulation1WhatLearned || "Students discovered that every choice requires giving something up, changing minds once future consequences were modeled."}
                    </p>
                  )}
                </div>

                {/* SIMULATION 2 SUMMARY */}
                <div className="bg-neutral-950 p-6 border border-neutral-850 rounded-xs space-y-3">
                  <div className="flex justify-between items-center pb-1">
                    <span className="font-mono text-[9px] text-neutral-450 font-extrabold uppercase bg-neutral-900 px-2 py-0.5 border border-neutral-800 rounded">
                      Simulation 2 Summary (Life)
                    </span>
                    <span className="text-[10px] text-indigo-400 font-mono font-bold">TRADE-OFF PLANNER</span>
                  </div>
                  <h3 className="text-sm font-display font-semibold text-white uppercase tracking-wider">
                    How Students Navigated Life Traps & Contract Verification:
                  </h3>
                  {loadingLiveIntel ? (
                    <div className="h-10 bg-neutral-900 animate-pulse rounded" />
                  ) : (
                    <p className="text-xs text-neutral-450 leading-relaxed font-sans">
                      {liveIntel?.simulation2WhatLearned || "Unexpected crises exposed gaps in earlier hasty planning, highlighting that slower, verified decisions weather storms better."}
                    </p>
                  )}
                </div>
              </div>

              {/* INTERACTIVE AI INQUIRY PANEL */}
              <div className="pt-6 border-t border-[#161616] space-y-4">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-[#D4AF37] uppercase font-black tracking-widest block">
                    ✦ INTERACTIVE COHORT INTEL ADVISOR
                  </span>
                  <p className="text-xs text-neutral-450 leading-relaxed">
                    Ask a custom question regarding student mindset evolution, risk aversion, or pedagogical remedies to implement in the classroom.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pb-1 text-left">
                  <button
                    onClick={() => {
                      setCustomQuery("How can I help students avoid unverified friendship trust traps?");
                      handleCustomQuerySubmit("How can I help students avoid unverified friendship trust traps?");
                    }}
                    className="p-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-neutral-750 text-left rounded-xs transition-all cursor-pointer text-xs"
                  >
                    <span className="font-mono text-[9px] text-[#D4AF37] block font-bold mb-1">PRESET 1</span>
                    <span className="text-neutral-350">Avoid friendship trust traps</span>
                  </button>
                  <button
                    onClick={() => {
                      setCustomQuery("What are the key signs of peer conformity in this simulation?");
                      handleCustomQuerySubmit("What are the key signs of peer conformity in this simulation?");
                    }}
                    className="p-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-neutral-750 text-left rounded-xs transition-all cursor-pointer text-xs"
                  >
                    <span className="font-mono text-[9px] text-[#D4AF37] block font-bold mb-1">PRESET 2</span>
                    <span className="text-neutral-350">Identify signs of peer conformity</span>
                  </button>
                  <button
                    onClick={() => {
                      setCustomQuery("Provide a 5-minute debrief outline about overcoming financial panic.");
                      handleCustomQuerySubmit("Provide a 5-minute debrief outline about overcoming financial panic.");
                    }}
                    className="p-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-neutral-750 text-left rounded-xs transition-all cursor-pointer text-xs"
                  >
                    <span className="font-mono text-[9px] text-[#D4AF37] block font-bold mb-1">PRESET 3</span>
                    <span className="text-neutral-350">5-min debrief on financial panic</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    placeholder="Type your strategic pedagogical question here..."
                    className="flex-1 px-4 py-3 bg-black border border-neutral-800 focus:border-[#D4AF37] text-white text-xs font-sans rounded-xs focus:outline-none transition-all placeholder:text-neutral-600"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCustomQuerySubmit(customQuery);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleCustomQuerySubmit(customQuery)}
                    disabled={loadingQuery || !customQuery.trim()}
                    className="px-5 bg-[#D4AF37] hover:bg-yellow-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xs transition-all cursor-pointer"
                  >
                    {loadingQuery ? "Inquiring..." : "Ask Advisor"}
                  </button>
                </div>

                {loadingQuery && (
                  <div className="p-4 border border-dashed border-[#D4AF37]/30 bg-neutral-950/50 rounded-xs flex items-center justify-center gap-3">
                    <span className="inline-block w-4.5 h-4.5 rounded-full border-2 border-t-transparent border-[#D4AF37] animate-spin" />
                    <span className="text-[10px] font-mono text-[#D4AF37] tracking-wider animate-pulse uppercase">
                      REYOU CONSULTANT: Conducting semantic index search on team activity logs...
                    </span>
                  </div>
                )}

                {queryAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-[#090909] border border-[#D4AF37]/30 rounded-xs space-y-3 text-left animate-fade-in"
                  >
                    <div className="flex justify-between items-center pb-1 border-b border-neutral-900">
                      <span className="font-mono text-[9px] text-[#D4AF37] uppercase font-bold tracking-widest block">
                        ✦ AI ADVISORY REPLY
                      </span>
                      <button
                        onClick={() => {
                          sounds.playClickSound();
                          setQueryAnswer(null);
                        }}
                        className="text-neutral-600 hover:text-neutral-450 font-mono text-[9px] uppercase cursor-pointer transition-all"
                      >
                        [Clear]
                      </button>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line font-sans">
                      {queryAnswer}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* ----------------------------------------- */}
            {/* SECTION 3: DECISION INTELLIGENCE MAP     */}
            {/* ----------------------------------------- */}
            <div className="bg-[#0E0E0E] border border-[#1A1A1A] p-8 rounded-xs space-y-8">
              <div className="border-b border-[#1A1A1A] pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                    SECTION 03
                  </span>
                  <h2 className="text-lg font-display font-bold text-white uppercase tracking-tight">
                    STUDENT GROWTH REPORT MAP
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 border border-[#D4AF37]/20 rounded-xs font-bold uppercase">
                  WHAT COHORT IS EXPERIENCING
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* SVG CAPABILITY RADAR-WHEEL */}
                <div className="lg:col-span-5 flex justify-center items-center relative py-6">
                  <div className="relative w-72 h-72">
                    
                    {/* Concentric rings */}
                    <div className="absolute inset-0 border border-neutral-900 rounded-full" />
                    <div className="absolute inset-8 border border-neutral-800 rounded-full" />
                    <div className="absolute inset-16 border border-neutral-700/60 rounded-full" />
                    <div className="absolute inset-24 border border-[#D4AF37]/20 rounded-full animate-pulse" />

                    {/* Central radar core */}
                    <div className="absolute inset-[132px] bg-black border border-[#D4AF37]/50 rounded-full flex items-center justify-center shadow-lg">
                      <Brain className="w-5 h-5 text-[#D4AF37] animate-breathe" />
                    </div>

                    {/* Capability nodes revolving */}
                    {capabilities.map((cap, idx) => {
                      const angle = (idx * 360) / capabilities.length;
                      const rad = (angle * Math.PI) / 180;
                      const radius = 96; // px distance from center
                      const x = 144 + radius * Math.cos(rad) - 20; // 20 is half size of node box
                      const y = 144 + radius * Math.sin(rad) - 20;
                      const isActive = activeCapabilityIndex === idx;

                      return (
                        <button
                          key={cap.name}
                          onClick={() => handleCapabilityClick(idx)}
                          className="absolute w-10 h-10 rounded-full font-mono font-bold text-[10px] flex items-center justify-center transition-all bg-black border hover:scale-110 z-20 cursor-pointer shadow-md"
                          style={{
                            left: `${x}px`,
                            top: `${y}px`,
                            borderColor: isActive ? '#D4AF37' : 'rgba(255, 255, 255, 0.12)',
                            color: isActive ? '#D4AF37' : '#999'
                          }}
                          title={`Click to inspect ${cap.name}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}

                    {/* Render connect lines from central core */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                      {capabilities.map((_, idx) => {
                        const angle = (idx * 360) / capabilities.length;
                        const rad = (angle * Math.PI) / 180;
                        const radius = 96;
                        const x2 = 144 + radius * Math.cos(rad);
                        const y2 = 144 + radius * Math.sin(rad);
                        return (
                          <line
                            key={idx}
                            x1={144}
                            y1={144}
                            x2={x2}
                            y2={y2}
                            stroke="rgba(212, 175, 55, 0.2)"
                            strokeWidth={1}
                          />
                        );
                      })}
                    </svg>

                  </div>
                </div>

                {/* CAPACITY INDEX EXPANDED DETAIL VIEW */}
                <div className="lg:col-span-7 space-y-4">
                  <p className="text-xs text-neutral-450 leading-relaxed font-sans text-neutral-400">
                    We measure student growth through these six core real-world life areas. Click any point on the wheel to highlight student learning details.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {capabilities.map((cap, idx) => {
                      const isActive = activeCapabilityIndex === idx;
                      return (
                        <div
                          key={cap.name}
                          onClick={() => handleCapabilityClick(idx)}
                          className={`p-4 rounded-xs border transition-all cursor-pointer text-left ${
                            isActive 
                              ? 'bg-[#181815] border-[#D4AF37]' 
                              : 'bg-black/50 border-[#1A1A1A] hover:border-neutral-850'
                          }`}
                        >
                          <div className="flex justify-between items-center pb-1">
                            <span className="font-mono text-[10px] text-neutral-500 font-bold">
                              COORDINATE 0{idx + 1}
                            </span>
                            <span className="text-[10px] font-mono text-[#D4AF37] font-extrabold font-black uppercase">
                              {cap.value}% cohort depth
                            </span>
                          </div>
                          
                          <h3 className="text-sm font-display font-medium text-white pb-1.5">
                            {cap.name}
                          </h3>

                          <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                            {cap.descr}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* ----------------------------------------- */}
            {/* SECTION 4 & 5: STUDENT QUOTES & TEAM OBSERVATIONS */}
            {/* ----------------------------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* SECTION 4: STUDENT QUOTES (AUTO-UPDATING) */}
              <div className="bg-[#0E0E0E] border border-neutral-900 p-6 rounded-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold block">
                    SECTION 04
                  </span>
                  <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                    STUDENT QUOTES LIVE WIRE
                  </h2>
                  <p className="text-xs text-neutral-400 leading-normal">
                    These are original thoughts written by teams in real time as they notice their mistakes.
                  </p>
                </div>

                <div className="bg-black/80 border border-[#1A1A1A] p-6 rounded-xs relative">
                  <div className="absolute top-2.5 right-3.5 text-neutral-800">
                    <Quote className="w-12 h-12 stroke-1 opacity-20" />
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={quoteIndex}
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="space-y-4 minimum-h-24"
                    >
                      <p className="text-lg font-sans font-medium text-white italic leading-relaxed font-bold">
                        "{HISTORIC_STUDENT_QUOTES[quoteIndex].text}"
                      </p>
                      <span className="text-xs font-mono text-[#D4AF37] block font-semibold text-right">
                        — {HISTORIC_STUDENT_QUOTES[quoteIndex].author}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500">
                  <span>CYCLE INTERVAL: 8 SECONDS</span>
                  <div className="flex gap-1.5">
                    {HISTORIC_STUDENT_QUOTES.map((_, idx) => (
                      <span 
                        key={idx} 
                        className={`w-1.5 h-1.5 rounded-full transition-all ${idx === quoteIndex ? 'bg-[#D4AF37]' : 'bg-neutral-800'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 5: TEAM OBSERVATIONS */}
              <div className="bg-[#0E0E0E] border border-neutral-900 p-6 rounded-xs space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold block">
                    SECTION 05
                  </span>
                  <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider border-b border-[#1A1A1A] pb-2">
                    TEAM OBSERVATIONS
                  </h2>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Active real-time classroom observations. We track how students think together and highlight moments where they change their minds or spot issues.
                  </p>
                </div>

                <div className="space-y-3 font-mono font-bold text-xs pt-2">
                  <div className="flex justify-between items-center p-3 bg-black border border-[#1A1A1A] rounded-xs">
                    <span className="text-[#D4AF37] font-extrabold">Team Kalam</span>
                    <span className="text-emerald-400 font-bold bg-emerald-950/20 px-2 py-0.5 border border-emerald-900/30 rounded-xs uppercase text-[10px]">
                      Students Are Starting To Think About Long-Term Consequences
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-black border border-[#1A1A1A] rounded-xs">
                    <span className="text-[#D4AF37] font-extrabold">Team Bhagat</span>
                    <span className="text-blue-400 font-bold bg-blue-950/20 px-2 py-0.5 border border-blue-900/30 rounded-xs uppercase text-[10px]">
                      Students Usually Think About What Could Go Wrong Before Deciding
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-black border border-[#1A1A1A] rounded-xs">
                    <span className="text-[#D4AF37] font-extrabold">Team Azad</span>
                    <span className="text-rose-400 font-bold bg-rose-950/20 px-2 py-0.5 border border-rose-900/40 rounded-xs uppercase text-[10px]">
                      What Students Changed Their Mind About
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-black border border-[#1A1A1A] rounded-xs">
                    <span className="text-[#D4AF37] font-extrabold">Team Shivaji</span>
                    <span className="text-amber-405 text-amber-300 font-bold bg-amber-950/20 px-2 py-0.5 border border-amber-900/30 rounded-xs uppercase text-[10px]">
                      Checks Facts Before Believing
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* ----------------------------------------- */}
            {/* SECTION 6: COHORT INSIGHTS               */}
            {/* ----------------------------------------- */}
            <div className="bg-[#0E0E0E] border border-[#1A1A1A] p-6 rounded-xs space-y-4">
              <div className="space-y-1 border-b border-[#111] pb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold block">
                  SECTION 06
                </span>
                <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  COHORT LEARNING OVERVIEW
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                <div className="p-4 bg-black border border-[#1A1A1A] rounded-xs space-y-1.5">
                  <span className="font-mono text-[9px] text-neutral-500 uppercase font-black block">Most Common Mistake</span>
                  <div className="text-sm font-display font-bold text-rose-300">Focusing Only on Today</div>
                  <p className="text-[11px] text-neutral-450 leading-relaxed font-sans text-neutral-400">
                    Choosing what is quick and comfortable today instead of what protects them tomorrow.
                  </p>
                </div>

                <div className="p-4 bg-black border border-[#1A1A1A] rounded-xs space-y-1.5">
                  <span className="font-mono text-[9px] text-neutral-500 uppercase font-black block">What Students Changed Their Mind About</span>
                  <div className="text-sm font-display font-bold text-[#D4AF37]">More Money Solves Everything</div>
                  <p className="text-[11px] text-neutral-450 leading-relaxed font-sans text-neutral-400">
                    Students learned that earned income alone leads to direct lifestyle traps unless they possess the skills to shield it.
                  </p>
                </div>

                <div className="p-4 bg-black border border-[#1A1A1A] rounded-xs space-y-1.5">
                  <span className="font-mono text-[9px] text-neutral-500 uppercase font-black block">What Students Did Well</span>
                  <div className="text-sm font-display font-bold text-emerald-400">Working and Thinking Together</div>
                  <p className="text-[11px] text-neutral-450 leading-relaxed font-sans text-neutral-400">
                    Great team discussions, with students checking facts instead of just looking at superficial status.
                  </p>
                </div>

                <div className="p-4 bg-black border border-[#1A1A1A] rounded-xs space-y-1.5">
                  <span className="font-mono text-[9px] text-neutral-500 uppercase font-black block">What Students Can Improve</span>
                  <div className="text-sm font-display font-bold text-blue-300">Thinking Long-Term</div>
                  <p className="text-[11px] text-neutral-450 leading-relaxed font-sans text-neutral-400">
                    Looking and planning ahead so that they make better moves that are safe 5 to 10 years down the line.
                  </p>
                </div>
              </div>
            </div>

          </motion.div>
        ) : (
          <motion.div
            key="final-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-4xl mx-auto bg-black border border-[#D4AF37] p-10 md:p-14 rounded-xs space-y-10 relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 h-full w-2/5 immersive-ambient-radial pointer-events-none opacity-50" />
            
            <div className="text-center space-y-4 border-b border-[#222] pb-8 relative z-10">
              <span className="text-[10px] font-mono tracking-[0.3em] font-black text-[#D4AF37] uppercase">
                COHORT IMPACT VERB ARCHIVE
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                TODAY'S COHORT INSIGHT
              </h2>
              <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-2" />
            </div>

            {/* Core transformative moments demonstrating structural thinking shifts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 relative z-10 text-sm">
              <div className="flex gap-4 items-start p-5 bg-[#0F0F0F] border border-[#1B1B1B] rounded-xs">
                <span className="p-1 px-2.5 bg-[#D4AF37]/10 text-[#D4AF37] font-mono text-xs font-black rounded-full">1</span>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-white">Shifting Choice Vectors</h3>
                  <p className="text-neutral-400 font-sans leading-relaxed">
                    Students changed decisions after seeing consequences.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-5 bg-[#0F0F0F] border border-[#1B1B1B] rounded-xs">
                <span className="p-1 px-2.5 bg-[#D4AF37]/10 text-[#D4AF37] font-mono text-xs font-black rounded-full">2</span>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-white">Challenging Dogmatic Patterns</h3>
                  <p className="text-neutral-400 font-sans leading-relaxed">
                    Students challenged assumptions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-5 bg-[#0F0F0F] border border-[#1B1B1B] rounded-xs">
                <span className="p-1 px-2.5 bg-[#D4AF37]/10 text-[#D4AF37] font-mono text-xs font-black rounded-full">3</span>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-white">Defending Risk Strategies</h3>
                  <p className="text-neutral-400 font-sans leading-relaxed">
                    Students defended reasoning.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-5 bg-[#0F0F0F] border border-[#1B1B1B] rounded-xs">
                <span className="p-1 px-2.5 bg-[#D4AF37]/10 text-[#D4AF37] font-mono text-xs font-black rounded-full">4</span>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-white">Deep consequence awareness</h3>
                  <p className="text-neutral-400 font-sans leading-relaxed">
                    Students reflected on future outcomes.
                  </p>
                </div>
              </div>
            </div>

            {/* HERO PROJECTION - MOST POWERFUL REFLECTION */}
            <div className="p-8 bg-[#0C0C0D] border border-[#D4AF37]/35 rounded-xs space-y-4 relative z-10">
              <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest font-black uppercase block">
                MOST POWERFUL STUDENT REFLECTION
              </span>
              
              <p className="text-xl md:text-2xl font-serif font-medium italic text-neutral-105 text-white leading-normal">
                "{spotlightedReflection ? spotlightedReflection.text : 'Chasing a fast shortcut sounds tempting, but building personal skill is our real compound asset, giving us permanent options over temporary status.'}"
              </p>
              
              <span className="text-xs font-mono text-[#D4AF37] block font-bold text-right pt-2">
                — {spotlightedReflection ? spotlightedReflection.author : 'Kabir (Team Kalam)'}
              </span>
            </div>

            {/* NVIDIA NIM ADMINISTRATIVE COHORT REPORT CENTER */}
            <div className="border border-[#1A1A1A] bg-neutral-950 p-6 md:p-8 rounded-sm space-y-6 text-left relative overflow-hidden z-10">
              <div className="absolute right-0 top-0 bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-0.5 text-[8.5px] font-mono border-b border-l border-[#D4AF37]/25 uppercase font-bold tracking-widest">
                REYOU Advisor Group Analytics
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#D4AF37] tracking-widest font-black uppercase block">
                  ADMINISTRATIVE SIMULATION REPORTS
                </span>
                <p className="text-xs text-neutral-400">
                  Generate professional summaries for parents, teachers, and school leadership based on classroom interaction indices and student decision maps.
                </p>
              </div>

              {!teacherReport && !principalReport && !cohortReport && !loadingAdminReports && (
                <button
                  onClick={handleGenerateAdminReports}
                  className="w-full py-4 bg-[#D4AF37] hover:bg-yellow-500 text-black font-mono font-black text-xs uppercase tracking-widest rounded-sm transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] cursor-pointer"
                >
                  Generate Cohort, Teacher & Principal Reports
                </button>
              )}

              {loadingAdminReports && (
                <div className="p-6 border border-neutral-800 bg-neutral-900/65 rounded-sm space-y-4 text-center">
                  <div className="inline-block relative w-8 h-8 border-3 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
                  <p className="text-[10px] font-mono text-[#D4AF37] tracking-widest">CONSOLIDATING COHORT LEARNING CHANNELS...</p>
                  <p className="text-xs text-neutral-400 animate-pulse">Running semantic synthesis on all 10 student team logs...</p>
                </div>
              )}

              {(teacherReport || principalReport || cohortReport) && (
                <div className="space-y-5">
                  {/* GOOGLE DRIVE REPORT ARCHIVAL SUITE */}
                  <div className="bg-[#0c0d0f] border border-[#D4AF37]/35 p-4 rounded-xs space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Cloud className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span className="text-[9px] font-mono font-black text-[#D4AF37] tracking-widest uppercase pb-[1px]">
                            Google Drive Archival
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-300 font-sans leading-relaxed mt-0.5">
                          {googleUser ? (
                            <span>Authenticated to <strong className="text-white">{googleUser.email}</strong>. Ready to archive these reports to your secure Drive folder.</span>
                          ) : (
                            <span>Connect with Google Drive to securely write and archive this full administrative report suite.</span>
                          )}
                        </p>
                      </div>

                      <div className="shrink-0">
                        {googleUser ? (
                          <div className="flex gap-2">
                            <button
                              onClick={handleArchiveReportsToDrive}
                              disabled={driveSyncStatus === 'syncing'}
                              className="px-3 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 hover:border-[#D4AF37] font-mono text-[9px] font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Archive to Drive</span>
                            </button>
                            <button
                              onClick={handleGoogleLogOut}
                              className="px-2 py-1.5 text-neutral-500 hover:text-red-400 font-mono text-[8.5px] uppercase tracking-wider transition-all cursor-pointer"
                            >
                              Log Out
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={handleGoogleSignIn}
                            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 font-mono text-[9px] font-extrabold uppercase tracking-widest rounded-xs transition-all cursor-pointer flex items-center gap-2"
                          >
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ width: '12px', height: '12px' }}>
                              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                            </svg>
                            <span>Connect Drive</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {driveSyncMessage && (
                      <div className={`p-2.5 rounded-xs border font-mono text-[9px] flex items-center gap-1.5 select-none justify-between animate-fadeIn ${
                        driveSyncStatus === 'syncing' ? 'bg-[#0f0e0a] border-yellow-800/30 text-[#D4AF37]' :
                        driveSyncStatus === 'success' ? 'bg-emerald-950/10 border-emerald-950/20 text-emerald-400' :
                        'bg-red-950/15 border-red-950/20 text-red-400'
                      }`}>
                        <span>{driveSyncMessage}</span>
                        <button onClick={() => setDriveSyncMessage('')} className="text-neutral-500 font-bold px-1">✕</button>
                      </div>
                    )}
                  </div>

                  {/* Tab Selector */}
                  <div className="flex flex-col md:flex-row bg-neutral-900 p-1 border border-neutral-800 rounded-sm gap-1">
                    <button
                      onClick={() => setAdminActiveTab('teacher')}
                      className={`flex-1 py-2 font-mono text-[9px] uppercase font-bold tracking-widest rounded-xs transition-all cursor-pointer ${
                        adminActiveTab === 'teacher' ? 'bg-[#D4AF37] text-black font-black' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Teacher Summary
                    </button>
                    <button
                      onClick={() => setAdminActiveTab('principal')}
                      className={`flex-1 py-2 font-mono text-[9px] uppercase font-bold tracking-widest rounded-xs transition-all cursor-pointer ${
                        adminActiveTab === 'principal' ? 'bg-[#D4AF37] text-black font-black' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Principal Summary
                    </button>
                    <button
                      onClick={() => setAdminActiveTab('cohort')}
                      className={`flex-1 py-2 font-mono text-[9px] uppercase font-bold tracking-widest rounded-xs transition-all cursor-pointer ${
                        adminActiveTab === 'cohort' ? 'bg-[#D4AF37] text-black font-black' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Cohort Insights
                    </button>
                  </div>

                  {/* Teacher Summary View */}
                  {adminActiveTab === 'teacher' && teacherReport && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs font-sans">
                      <div className="p-4 bg-black border border-neutral-900 rounded-xs">
                        <span className="text-[8.5px] font-mono text-emerald-400 tracking-wider font-bold block mb-1">★ CLASS STRENGTHS</span>
                        <p className="text-neutral-300 leading-relaxed">{teacherReport.strengths}</p>
                      </div>
                      <div className="p-4 bg-black border border-neutral-900 rounded-xs">
                        <span className="text-[8.5px] font-mono text-amber-500 tracking-wider font-bold block mb-1">▲ CLASS WEAKNESSES</span>
                        <p className="text-neutral-300 leading-relaxed">{teacherReport.weaknesses}</p>
                      </div>
                      <div className="p-4 bg-[#D4AF37]/5 border border-[#D4AF37]/25 rounded-xs">
                        <span className="text-[8.5px] font-mono text-[#D4AF37] tracking-wider font-bold block mb-1">💡 SUGGESTED CLASSROOM ACTIVITIES</span>
                        <p className="text-neutral-200 leading-relaxed">{teacherReport.activities}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Principal Summary View */}
                  {adminActiveTab === 'principal' && principalReport && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                      <div className="p-4 bg-black border border-neutral-900 rounded-xs">
                        <span className="text-[8.5px] font-mono text-neutral-400 tracking-wider block mb-1">MOST COMMON DECISIONS</span>
                        <p className="text-neutral-300 leading-relaxed">{principalReport.commonDecisions}</p>
                      </div>
                      <div className="p-4 bg-black border border-neutral-900 rounded-xs">
                        <span className="text-[8.5px] font-mono text-rose-400 tracking-wider block mb-1">MOST COMMON MISTAKES</span>
                        <p className="text-neutral-300 leading-relaxed">{principalReport.commonMistakes}</p>
                      </div>
                      <div className="p-4 bg-black border border-neutral-900 rounded-xs">
                        <span className="text-[8.5px] font-mono text-blue-400 tracking-wider block mb-1">MOST COMMON FEARS</span>
                        <p className="text-neutral-300 leading-relaxed">{principalReport.commonFears}</p>
                      </div>
                      <div className="p-4 bg-black border border-neutral-900 rounded-xs">
                        <span className="text-[8.5px] font-mono text-yellow-500 tracking-wider block mb-1">MOST COMMON ASSUMPTIONS</span>
                        <p className="text-neutral-300 leading-relaxed">{principalReport.commonAssumptions}</p>
                      </div>
                      <div className="p-4 bg-black border border-neutral-900 rounded-xs md:col-span-2">
                        <span className="text-[8.5px] font-mono text-purple-400 tracking-wider block mb-1">POWERFUL CONVERGENT REFLECTIONS</span>
                        <p className="text-neutral-300 leading-relaxed font-serif italic">"{principalReport.powerfulReflections}"</p>
                      </div>
                      <div className="p-4 bg-[#D4AF37]/5 border border-[#D4AF37]/25 rounded-xs md:col-span-2">
                        <span className="text-[8.5px] font-mono text-[#D4AF37] tracking-wider block mb-1">RECOMMENDED ACTIONS</span>
                        <p className="text-neutral-200 leading-relaxed">{principalReport.recommendations}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Cohort Insights View */}
                  {adminActiveTab === 'cohort' && cohortReport && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs font-sans">
                      <div className="p-4 bg-black border border-neutral-900 rounded-xs">
                        <span className="text-[8.5px] font-mono text-emerald-400 block mb-1">LEARNING STRENGTHS</span>
                        <p className="text-neutral-300 leading-relaxed">{cohortReport.learningStrengths}</p>
                      </div>
                      <div className="p-4 bg-black border border-neutral-900 rounded-xs">
                        <span className="text-[8.5px] font-mono text-amber-500 block mb-1">RECOMMENDED FOCUS AREAS</span>
                        <p className="text-neutral-300 leading-relaxed">{cohortReport.focusAreas}</p>
                      </div>
                      <div className="p-4 bg-[#D4AF37]/5 border border-[#D4AF37]/25 rounded-xs">
                        <span className="text-[8.5px] font-mono text-[#D4AF37] block mb-1">PRACTICAL NEXT STEPS</span>
                        <p className="text-neutral-200 leading-relaxed">{cohortReport.actionSteps}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* IMPACT MOMENT PROMPTER STATEMENT */}
            <div className="text-center pt-6 pb-2 border-t border-[#1C1C1D] relative z-10">
              <p className="text-xl font-display font-bold text-[#E5E5E5] tracking-wide max-w-xl mx-auto italic drop-shadow-sm">
                "I've never seen students think like this before."
              </p>
              <span className="text-[10px] font-mono text-neutral-500 block uppercase tracking-widest mt-2">
                THE SOLE KPI THAT REAL PEDAGOGY MEASURES.
              </span>
            </div>

            {onReset && (
              <div className="pt-4 flex justify-center">
                <button
                  onClick={onReset}
                  className="px-6 py-2 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono uppercase font-black tracking-widest rounded-xs cursor-pointer transition-all"
                >
                  Restart Cohort Simulation Block
                </button>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
