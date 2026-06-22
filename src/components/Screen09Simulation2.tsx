import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RoleId, TEAMS } from '../types';
import { sounds } from '../utils/audio';
import { Orb, Canvas } from './BreathingOrb';
import { useTeamActivityMonitor } from './useTeamActivityMonitor';
import CertificateGenerator from './CertificateGenerator';
import RoleCheckpoint from './RoleCheckpoint';
import {
  Lock,
  Unlock,
  AlertTriangle,
  Activity,
  Sparkles,
  ArrowRight,
  Check,
  CheckCircle2,
  Heart,
  TrendingUp,
  Briefcase,
  Layers,
  Skull,
  Award,
  BookOpen
} from 'lucide-react';

interface Screen09Simulation2Props {
  userName: string;
  selectedTeamId: string;
  assignedRoleId: RoleId;
}

interface ScorecardData {
  familyStability: 'High' | 'Moderate' | 'Low' | 'Critical';
  savings: 'High' | 'Moderate' | 'Low' | 'Debt';
  stress: 'High' | 'Moderate' | 'Low' | 'Critical';
}

// Data definitions for the 10 teams under Simulation 2 context
const TEAM_STRIKES: Record<string, {
  scorecard: ScorecardData;
  crisisTitle: string;
  crisisAmount: string;
  crisisDesc: string;
  options: { id: 'A' | 'B'; title: string; cost: string; consequenceWithReserve: string; consequenceWithoutReserve: string }[];
}> = {
  TEAM_ALPHA: {
    scorecard: { familyStability: 'High', savings: 'Moderate', stress: 'High' },
    crisisTitle: "Father Hospitalized",
    crisisAmount: "₹80,000",
    crisisDesc: "Your father requires emergency surgery. The private clinic demands immediate deposit. Without it, treatment will be delayed.",
    options: [
      {
        id: 'A',
        title: "Deploy Personal Reserve Fund",
        cost: "₹80,000 from team reserves",
        consequenceWithReserve: "Because of your team's robust disciplined saving program, you transferred the deposit in 15 minutes. The surgery was successful. Your family remains fully stable.",
        consequenceWithoutReserve: "Your team lacked emergency reserves. You were forced to borrow at 24% interest. Your monthly savings goals are wiped, and father feels guilty about the burden."
      },
      {
        id: 'B',
        title: "Seek NGO & Public Medical Aid Allocation",
        cost: "Relies on government timeline (Queue wait)",
        consequenceWithReserve: "By waitlisting, you preserved reserves but delayed the surgery by 3 days. Your father recovered, but has chronic fatigue. Your stress remains critically high.",
        consequenceWithoutReserve: "Because you had no savings buffer anyway, waitlisting was your only rational strategy. The procedure was done, but stressful delays caused permanent post-op complications."
      }
    ]
  },
  TEAM_BRAVO: {
    scorecard: { familyStability: 'Low', savings: 'Low', stress: 'Critical' },
    crisisTitle: "Job Layoff & Restructure",
    crisisAmount: "Income Stops entirely",
    crisisDesc: "A sudden global restructuring project eliminates your division. You receive some statutory package, but the corporate income cuts off immediately.",
    options: [
      {
        id: 'A',
        title: "Accept Freelance Side gig with heavy hours",
        cost: "14 hours/day fatigue",
        consequenceWithReserve: "You pivot safely. Since you kept high-level tech reserves, you did not panick. You comfortably took a part-time gig and found a better full-time position in three months.",
        consequenceWithoutReserve: "Without any savings reserve, you took the first gig out of absolute despair. Under massive sleep deprivation and low pay, your health deteriorated rapidly."
      },
      {
        id: 'B',
        title: "Spend 2 Months Upskilling on AI Engineering",
        cost: "₹35,000 certificate fee & 60 days idle time",
        consequenceWithReserve: "You had the savings buffer. You utilized the 60 days to train as an AI specialist. You landed a 40% salary hike. High-order risk management yielded remarkable victory.",
        consequenceWithoutReserve: "You tried to upskill, but with debt creditors knocking, you abandoned the course 3 weeks in. You ended up taking a low-level call-center job with worse prospects."
      }
    ]
  },
  TEAM_CHARLIE: {
    scorecard: { familyStability: 'Moderate', savings: 'High', stress: 'Moderate' },
    crisisTitle: "Unplanned Business Franchise Opportunity",
    crisisAmount: "₹1,00,000 required",
    crisisDesc: "A relative with a proven franchise model offers you a 20% equity stake if you transfer funding immediately to lock down the regional rights.",
    options: [
      {
        id: 'A',
        title: "Deploy Savings to Buy Franchise Equity",
        cost: "₹1,00,000 upfront seed cash",
        consequenceWithReserve: "Your solid financial discipline paid off. You invested excess capital. The franchise opened and returned ₹12,000 monthly dividend stream by year-end. Real secondary growth.",
        consequenceWithoutReserve: "You took high-risk loans to participate. The franchise had delayed permit issues, compounding interest on your debt. A severe double liquidity trap."
      },
      {
        id: 'B',
        title: "Pass opportunity to preserve stable cache",
        cost: "Zero cash expenditure, missed upside",
        consequenceWithReserve: "You comfortably passed, maintaining massive liquidity for future volatility. You missed the yield, but slept perfectly with guaranteed security.",
        consequenceWithoutReserve: "You passed out of absolute necessity because of empty reserves. You watched peers double their income, heightening regret and resentment of your current job."
      }
    ]
  },
  TEAM_DELTA: {
    scorecard: { familyStability: 'Low', savings: 'Low', stress: 'High' },
    crisisTitle: "Credit Card Debt Spiral",
    crisisAmount: "₹75,000 Accumulated",
    crisisDesc: "Unmonitored premium lifestyle subscriptions, coffee meetups, and high-street rentals compounded. The bank has officially increased interest to 42% APR.",
    options: [
      {
        id: 'A',
        title: "Immediate Liquidation & Hard Budgeting Cuts",
        cost: "Rethink lifestyle, sell gadget reserve",
        consequenceWithReserve: "Your disciplined cuts were rapid. You cleared the debt in 2 months. The temporary hardship made your decision patterns remarkably stronger.",
        consequenceWithoutReserve: "With zero reserves and high rental commitments, you struggled to meet the card minimums. You borrowed from personal peers, severely poisoning three lifelong friendships."
      },
      {
        id: 'B',
        title: "Restructure with a Refinance Loan",
        cost: "3-year repayment locking contract",
        consequenceWithReserve: "Refinancing safely smoothed your cash flows. You kept your safety buffer in check, slowly automating payments over the next 24 months.",
        consequenceWithoutReserve: "Refinancing only delayed the inevitable. Lacking basic habit adjustments, you simply maxed out a new card alongside the refinance loan, causing bankruptcy."
      }
    ]
  },
  TEAM_ECHO: {
    scorecard: { familyStability: 'Critical', savings: 'Low', stress: 'High' },
    crisisTitle: "Sibling College Admission Opportunity",
    crisisAmount: "₹90,000 Tuition Due",
    crisisDesc: "Your brilliant younger sister passes the elite institute exam. However, the merit scholarship only covers tuition, leaving a massive boarding gap.",
    options: [
      {
        id: 'A',
        title: "Sponsor tuition using your family funds",
        cost: "₹90,000 cash outlay",
        consequenceWithReserve: "Because of careful budgeting, your family savings pool absorbed the cost easily. Your sister enrolled and everyone was extremely happy.",
        consequenceWithoutReserve: "With zero backup, you had to pawn family assets. Although your sister is studying, the stress of the debt dampens the family's joy."
      },
      {
        id: 'B',
        title: "Ask your sister to wait a year before starting college",
        cost: "1 year delay",
        consequenceWithReserve: "You convinced her to wait so your family could save more money first. During the year, you helped her practice skills and build online projects.",
        consequenceWithoutReserve: "The delay felt like a tragic failure of support. Huge disappointment hurt sibling trust, creating bad feelings inside the household."
      }
    ]
  },
  TEAM_FOXTROT: {
    scorecard: { familyStability: 'High', savings: 'Moderate', stress: 'Moderate' },
    crisisTitle: "Sudden Dental & Medical Outbreak",
    crisisAmount: "₹60,000 Required",
    crisisDesc: "An acute root-canal infection combined with an unexpected orthopedic condition requires immediate rehabilitation therapy.",
    options: [
      {
        id: 'A',
        title: "Pay cash to resolve treatment instantly",
        cost: "₹60,000 liquidity depletion",
        consequenceWithReserve: "You solved it immediately. Your health is restored and pain vanished. Your productivity remained optimal, restoring the cash drain quickly.",
        consequenceWithoutReserve: "You had to defer therapy, taking heavy pain killers that reduced your corporate focus. Your performance review dropped, ending your bonus candidacy."
      },
      {
        id: 'B',
        title: "Opt for cheaper public health infrastructure",
        cost: "8-week queue wait, low comfort clinics",
        consequenceWithReserve: "You utilized public queues. Your recovery was slow and moderately uncomfortable, but your financial cash-flow reserves remained fully intact.",
        consequenceWithoutReserve: "The public hospital was overcrowded. You lost 12 working days waiting in triage queues. The loss of daily freelance gig wages exceeded treatment costs."
      }
    ]
  },
  TEAM_GOLF: {
    scorecard: { familyStability: 'High', savings: 'Low', stress: 'High' },
    crisisTitle: "Elite Global Academy Internship",
    crisisAmount: "₹1,20,000 Required in 48h",
    crisisDesc: "You are selected for a prestigious fellowship at an outstanding incubator. You must pay airfare, visas, and living costs immediately or lose your slot.",
    options: [
      {
        id: 'A',
        title: "Finance full fellowship using all resources",
        cost: "₹1,20,000 cash & extreme borrowing",
        consequenceWithReserve: "Having previous cash buffer made the borrowing light. You flew to London, met outstanding partners, and secured a world-class global research offer.",
        consequenceWithoutReserve: "You had to borrow the entire sum at extortionate loan shark rates. Though the program went well, constant collection agency calls in your internship broke your mental focus."
      },
      {
        id: 'B',
        title: "Decline and request localized online slot",
        cost: "Missed networking, zero debt risk",
        consequenceWithReserve: "You declined safely. You focused your energy on securing local venture backing instead, developing high-value software without debt loads.",
        consequenceWithoutReserve: "You were forced to decline with heavy tears. Seeing peers upload travel photos made you disengaged with study. You fell into a long depressive phase."
      }
    ]
  },
  TEAM_HOTEL: {
    scorecard: { familyStability: 'High', savings: 'Low', stress: 'Moderate' },
    crisisTitle: "Lower Salary, High Impact Non-Profit offer",
    crisisAmount: "45% lower salary structure",
    crisisDesc: "A gorgeous non-profit focused on national rural digitisation invites you. The salary is very small, but you would lead the entire primary-level team.",
    options: [
      {
        id: 'A',
        title: "Transition to High Purpose, low margin path",
        cost: "Severe lifestyle optimization",
        consequenceWithReserve: "Since you accumulated stable initial savings, the drop in income was perfectly safe. You spent 2 beautiful years building software for 5 million kids.",
        consequenceWithoutReserve: "Without a reserve buffer, your noble goal was immediately crushed by urban inflation. You resigned on month 4 to return to generic corporate work, feeling defeated."
      },
      {
        id: 'B',
        title: "Stay at your high-paying corporate job",
        cost: "Feeling unhappy and disconnected",
        consequenceWithReserve: "You stayed, keeping your high salary. You resolved to allocate 5 hours weekly to volunteer coaching, keeping your life's purpose alive.",
        consequenceWithoutReserve: "You stayed solely due to financial panic. Over time, heavy burnout and lack of purpose made you lose focus, eventually leading to a performance layoff."
      }
    ]
  },
  TEAM_INDIA: {
    scorecard: { familyStability: 'High', savings: 'Moderate', stress: 'High' },
    crisisTitle: "Promotion and Relocation Offer",
    crisisAmount: "₹65,000 Relocation costs",
    crisisDesc: "Your company offers you a big promotion! But there is a catch: you have to move to a very expensive city in just 15 days.",
    options: [
      {
        id: 'A',
        title: "Move and pay for the relocation yourself",
        cost: "₹65,000 relocation cost",
        consequenceWithReserve: "Your savings buffer allowed you to move easily. Your career took off, and your new promotion bonuses paid back your moving costs in less than 3 months.",
        consequenceWithoutReserve: "Your move was messy and stressful. You could only afford a cheap, damp basement, and got sick, missing your first two weeks of your new job."
      },
      {
        id: 'B',
        title: "Say no and stay at your current job",
        cost: "Slower career growth",
        consequenceWithReserve: "You decided to take things slow and steady. You enjoyed spending weekends with family, keeping up strong relationships, and earning normal promotions over time.",
        consequenceWithoutReserve: "You said no because you couldn't afford the deposit for a flat in the new city. Your boss thought you lacked ambition, and started giving the best projects to other people."
      }
    ]
  },
  TEAM_JULIET: {
    scorecard: { familyStability: 'Low', savings: 'Low', stress: 'High' },
    crisisTitle: "New Startup Investment Offer",
    crisisAmount: "₹1,00,000 required",
    crisisDesc: "Your college roommate pitches a brand new tech startup idea. They need money right now, or they will take the deal to other investors.",
    options: [
      {
        id: 'A',
        title: "Invest to get a share of the startup",
        cost: "₹1,00,000 (all your savings)",
        consequenceWithReserve: "You invested extra money you didn't need for daily life. The startup succeeded and raised more funding, making your share worth 6 times what you paid.",
        consequenceWithoutReserve: "You used money meant for school and took a loan. Sadly, the founders had a big fight 6 months later, and your money is now stuck in a court battle."
      },
      {
        id: 'B',
        title: "Keep your money and avoid the risk",
        cost: "Miss out on potential growth, keep total peace of mind",
        consequenceWithReserve: "You turned down the deal politely. You slept soundly knowing your money was safe and growing steadily in simple, secure bank savings.",
        consequenceWithoutReserve: "You had to pass simply because you had no money. Watching your roommate buy luxury apartments 3 years later made you feel a lot of regret."
      }
    ]
  }
};

export default function Screen09Simulation2({
  userName,
  selectedTeamId,
  assignedRoleId
}: Screen09Simulation2Props) {
  const [phase, setPhase] = useState<number>(1);
  const [timelineYear, setTimelineYear] = useState<number>(2026);
  const [isTransitionActive, setIsTransitionActive] = useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [activeBoardRole, setActiveBoardRole] = useState<RoleId | null>(null);
  const [decisionLocked, setDecisionLocked] = useState<boolean>(false);
  const [isTimelineExpanding, setIsTimelineExpanding] = useState<boolean>(false);
  const [hasScrapedSim1Reserve, setHasScrapedSim1Reserve] = useState<boolean>(true);
  const [checkpointPassed, setCheckpointPassed] = useState<boolean>(false);

  // Discovery / Rahul Lens questions answers
  const [lensQ1, setLensQ1] = useState<number | null>(null); // Interactive pause
  const [lensQ2, setLensQ2] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // APS Final state
  const [apsAnswer, setApsAnswer] = useState<string>('');
  const [surpriseAnswer, setSurpriseAnswer] = useState<string>('');
  const [wrongAssumptionAnswer, setWrongAssumptionAnswer] = useState<string>('');
  const [differentActionAnswer, setDifferentActionAnswer] = useState<string>('');
  const [completedAPS, setCompletedAPS] = useState<boolean>(false);

  // AI report states
  const [studentReport, setStudentReport] = useState<{ didWell: string; canImprove: string; learned: string } | null>(null);
  const [parentReport, setParentReport] = useState<{ didWell: string; canImprove: string; conversationStarter: string } | null>(null);
  const [loadingReports, setLoadingReports] = useState<boolean>(false);
  const [activeReportTab, setActiveReportTab] = useState<'student' | 'parent'>('student');

  // Track team activity in Simulation 2
  useTeamActivityMonitor(selectedTeamId, `Simulation 2: Phase ${phase}`, [
    phase,
    selectedOption,
    decisionLocked,
    lensQ1,
    lensQ2,
    showExplanation,
    apsAnswer,
    completedAPS
  ]);

  const handleGenerateReports = async () => {
    setLoadingReports(true);
    try {
      const d1 = localStorage.getItem('reyou-d1-choice') || 'Unspecified';
      const d2 = localStorage.getItem('reyou-d2-choice') || 'Unspecified';
      const d3 = localStorage.getItem('reyou-d3-choice') || 'Unspecified';
      const d1Why = localStorage.getItem('reyou-d1-why') || 'Unspecified';
      const d2Assumption = localStorage.getItem('reyou-d2-assumption') || 'Unspecified';
      const d3Evidence = localStorage.getItem('reyou-d3-evidence') || 'Unspecified';

      const decisions = [
        { title: 'Baseline Income Allocation Focus', choice: d1, cost: 'N/A', consequence: d1Why },
        { title: 'Housing Rent Premium vs Practical', choice: d2, cost: 'N/A', consequence: d2Assumption },
        { title: 'Mystery Solicitations Response Strategy', choice: d3, cost: 'N/A', consequence: d3Evidence },
        { title: `${data?.crisisTitle || "Emergency expense"} Crisis Response`, choice: selectedOption || 'Unspecified', cost: data?.options?.find(o => o.id === selectedOption)?.cost || 'N/A', consequence: selectedOption === 'A' ? (hasScrapedSim1Reserve ? data?.options?.[0]?.consequenceWithReserve : data?.options?.[0]?.consequenceWithoutReserve) : (hasScrapedSim1Reserve ? data?.options?.[1]?.consequenceWithReserve : data?.options?.[1]?.consequenceWithoutReserve) }
      ];

      const payload = {
        name: userName,
        role: assignedRoleId,
        team: selectedTeamId,
        decisions: decisions,
        reflections: {
          reflectionFailed: apsAnswer,
          reflectionDifferently: 'Pace family savings growth carefully over short-term desires'
        }
      };

      const [resStudent, resParent] = await Promise.all([
        fetch("/api/reports/student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }),
        fetch("/api/reports/parent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      ]);

      const dataStudent = await resStudent.json();
      const dataParent = await resParent.json();

      if (dataStudent.success && dataStudent.report) {
         setStudentReport(dataStudent.report);
      }
      if (dataParent.success && dataParent.report) {
         setParentReport(dataParent.report);
      }
    } catch (err) {
      console.error("Failed to generate AI reports:", err);
    } finally {
      setLoadingReports(false);
    }
  };

  // Safe checks
  const teamId = TEAM_STRIKES[selectedTeamId] ? selectedTeamId : 'TEAM_ALPHA';
  const data = TEAM_STRIKES[teamId];
  const activeProfile = TEAMS.find(t => t.id === teamId) || TEAMS[0];

  // Map Roles
  const rolesList: { id: RoleId; name: string; prompt: string; action: string }[] = [
    {
      id: 'RISK_LEAD',
      name: 'What Could Go Wrong?',
      prompt: 'What could go wrong?',
      action: 'Find where we are hiding the risk. Can we handle a complete structural breakdown or loss of security?'
    },
    {
      id: 'STRATEGY_LEAD',
      name: 'Big Picture Thinker',
      prompt: 'What might happen next?',
      action: 'Look ahead. Ask: "What will this choice lead to in 5 years?" Keep the team focused on long-term safety.'
    },
    {
      id: 'COMMUNICATION_LEAD',
      name: 'Team Speaker',
      prompt: 'Can we defend this to the class?',
      action: 'Explain why we chose what we chose, and help other teams understand our perspective.'
    },
    {
      id: 'REFLECTION_LEAD',
      name: 'Lesson Finder',
      prompt: 'What did we believe that turned out to be wrong?',
      action: 'Look at what failed and find the smart lessons from each outcome so we can make better decisions.'
    },
    {
      id: 'TEAM_LEAD',
      name: 'Team Lead',
      prompt: 'Move the team to a final decision.',
      action: 'Listen to all viewpoints, make sure we do not freeze, and click the final choice when the group is ready.'
    }
  ];

  // Let's load Sim 1 results if possible to simulate persistence
  useEffect(() => {
    const savedD2 = localStorage.getItem('reyou-d2-choice'); // Premium vs Practical
    const savedD3 = localStorage.getItem('reyou-d3-choice'); // Invest vs Investigate vs Ignore
    
    // If they chose 'Practical' or ignored risky solicitation, they have built high safety margins (reserves)
    if (savedD2 === 'PRACTICAL' || savedD3 === 'IGNORE') {
      setHasScrapedSim1Reserve(true);
    } else {
      setHasScrapedSim1Reserve(false);
    }
  }, []);

  // Time Transition Controller for Phase 1
  useEffect(() => {
    if (phase === 1 && isTransitionActive) {
      const yearSequence = [2026, 2027, 2028, 2029];
      let i = 0;
      const interval = setInterval(() => {
        if (i < yearSequence.length) {
          setTimelineYear(yearSequence[i]);
          i++;
        } else {
          clearInterval(interval);
          setIsTimelineExpanding(true);
          setTimeout(() => {
            setIsTransitionActive(false);
          }, 1500); // Wait after freeze
        }
      }, 950);
      return () => clearInterval(interval);
    }
  }, [phase, isTransitionActive]);

  const handleNextPhase = () => {
    if (phase < 8) {
      setPhase(p => p + 1);
    }
  };

  const handlePrevPhase = () => {
    if (phase > 1) {
      setPhase(p => p - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] text-[#F5F5F5] flex flex-col justify-between p-4 md:p-8 relative selection:bg-neutral-800 selection:text-white font-sans overflow-x-hidden">
      
      {/* Subtle light background mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.03),transparent_60%)] pointer-events-none" />

      {/* STAGE HEADER MONITOR */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex justify-between items-center border-b border-white/15 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_10px_#D4AF37]" />
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] font-bold uppercase block">
              REYOU SIMULATION 2.0
            </span>
            <h1 className="text-sm font-display font-medium text-white uppercase tracking-wider">
              Life Happens • Uncertainty Protocol
            </h1>
          </div>
        </div>

        <div className="flex gap-2">
          <span className="hidden sm:inline-flex text-[10px] font-mono text-neutral-400 border border-white/10 px-2.5 py-1 rounded-sm uppercase tracking-wide">
            Team: {activeProfile.name.split(' (')[0]}
          </span>
          <span className="text-[10px] font-mono text-[#D4AF37] border border-[#D4AF37]/35 bg-[#D4AF37]/10 px-2.5 py-1 rounded-sm uppercase font-bold tracking-widest">
            PHASE {phase} / 8
          </span>
        </div>
      </header>

      {/* CORE EXPERIENCE VIEW */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-6 w-full max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* PHASE 1: FUTURE TRANSITION */}
          {phase === 1 && (
            <motion.div
              key="sim2-phase1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl text-center flex flex-col items-center justify-center min-h-[500px]"
            >
              {/* Golden Core activation during timeline movement */}
              <div className="mb-4">
                <Canvas frameloop="demand" id="timeline-orb-portal" className="flex justify-center items-center">
                  <Orb
                    intensity={isTransitionActive ? 0.8 : 0.4}
                    turbulence={isTransitionActive ? 0.75 : 0.25}
                    color="#D4AF37"
                    isSlow={!isTransitionActive}
                  />
                </Canvas>
              </div>

              {isTransitionActive ? (
                <div className="space-y-8">
                  <span className="text-[10px] font-mono tracking-[0.4em] text-[#D4AF37] font-black uppercase inline-block animate-pulse">
                    ACCELERATING TEMPORAL ENVELOPE
                  </span>
                  
                  {/* Digital Timeline Counter */}
                  <div className="flex items-center justify-center gap-6">
                    {[2026, 2027, 2028, 2029].map((yr) => {
                      const isCurrent = timelineYear === yr;
                      const isPassed = timelineYear > yr;
                      return (
                        <div key={yr} className="flex items-center">
                          <span className={`text-2xl md:text-3xl font-mono tracking-wider font-extrabold transition-all duration-500 ${
                            isCurrent 
                              ? 'text-white scale-125 border-b-2 border-[#D4AF37] pb-1'
                              : isPassed
                              ? 'text-neutral-700 font-medium line-through'
                              : 'text-neutral-800'
                          }`}>
                            {yr}
                          </span>
                          {yr < 2029 && (
                            <span className="text-neutral-800 text-lg mx-3">→</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-xs text-neutral-500 font-mono tracking-widest max-w-xs mx-auto animate-pulse">
                    Computing simulation responses based on first stage assumptions...
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 max-w-md"
                >
                  <h1 className="text-3xl md:text-4xl font-display font-medium tracking-[0.2em] text-white leading-tight uppercase font-serif">
                    THREE YEARS LATER
                  </h1>

                  <div className="space-y-4">
                    <p className="text-lg text-neutral-300 font-serif leading-relaxed italic">
                      "You made decisions."
                    </p>
                    <p className="text-lg text-neutral-300 font-serif leading-relaxed italic">
                      "Life has been responding."
                    </p>
                    <p className="text-lg text-neutral-300 font-serif leading-relaxed italic">
                      "Today you discover what happened next."
                    </p>
                  </div>

                  {/* Future timeline tag */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="bg-neutral-900 border border-white/10 p-4 rounded-sm inline-block w-full"
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-bold">
                      ACTIVE CHASSIS: {activeProfile.name.split(' (')[0]}
                    </span>
                    <strong className="text-xl font-mono text-[#D4AF37] font-black block mt-1 tracking-wider uppercase">
                      YEAR 2029
                    </strong>
                    <span className="text-[9px] font-mono text-neutral-600 uppercase block tracking-widest mt-1">
                      Identity Locked • Same Decisions • New Environment
                    </span>
                  </motion.div>

                  <div className="pt-4">
                    <button
                      onClick={handleNextPhase}
                      className="w-full sm:w-auto px-10 py-4 bg-white text-black hover:bg-[#D4AF37] font-mono text-xs font-bold tracking-[0.25em] uppercase rounded-sm transition-all duration-300 cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.05)]"
                    >
                      DISCOVER MY LIFE SCORECARD
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* PHASE 2: LIFE SCORECARD */}
          {phase === 2 && (
            <motion.div
              key="sim2-phase2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl bg-neutral-950/40 border border-white/10 rounded-sm p-6 md:p-10 shadow-2xl space-y-8 text-left"
            >
              <div className="text-center space-y-2 border-b border-white/10 pb-6">
                <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-bold block">
                  PHASE 02 : TRANS-PEDAGOGIC METRICS
                </span>
                <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tight">
                  The Life Scorecard
                </h2>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  Not marks. Not numerical scores. Authentically tracing the emotional assets and liabilities generated by your prior planning.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Metric Card 1 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-black/50 border border-white/5 p-6 rounded-sm relative flex flex-col justify-between h-48"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black">
                        Metric #01
                      </span>
                      <Heart className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-lg font-mono font-bold text-white uppercase">
                      Family Stability
                    </h3>
                    <p className="text-xs text-neutral-400 mt-2">
                      Measuring household peace, psychological safety, and the security of your immediate support network.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-neutral-500">LEVEL</span>
                    <strong className={`text-sm font-mono font-black ${
                      data.scorecard.familyStability === 'High' ? 'text-emerald-400' :
                      data.scorecard.familyStability === 'Moderate' ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      {data.scorecard.familyStability.toUpperCase()}
                    </strong>
                  </div>
                </motion.div>

                {/* Metric Card 2 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="bg-black/50 border border-white/5 p-6 rounded-sm relative flex flex-col justify-between h-48"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black">
                        Metric #02
                      </span>
                      <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-lg font-mono font-bold text-white uppercase">
                      Accumulated Savings
                    </h3>
                    <p className="text-xs text-neutral-400 mt-2">
                      Your liquidity reserve. The volume of surplus you managed to insulate from immediate lifestyle expansion temptations.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-neutral-500">LEVEL</span>
                    <strong className={`text-sm font-mono font-black ${
                      data.scorecard.savings === 'High' ? 'text-emerald-400' :
                      data.scorecard.savings === 'Moderate' ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      {data.scorecard.savings.toUpperCase()}
                    </strong>
                  </div>
                </motion.div>

                {/* Metric Card 3 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-black/50 border border-white/5 p-6 rounded-sm relative flex flex-col justify-between h-48"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-black">
                        Metric #03
                      </span>
                      <Activity className="w-4 h-4 text-rose-500" />
                    </div>
                    <h3 className="text-lg font-mono font-bold text-white uppercase">
                      Ambient Stress
                    </h3>
                    <p className="text-xs text-neutral-400 mt-2">
                      Cognitive tax. Sleep quality, constant alert levels, and psychological fragility due to monthly budget tightness or workspace commutes.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-neutral-500">LEVEL</span>
                    <strong className={`text-sm font-mono font-black ${
                      data.scorecard.stress === 'Low' ? 'text-emerald-400' :
                      data.scorecard.stress === 'Moderate' ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      {data.scorecard.stress.toUpperCase()}
                    </strong>
                  </div>
                </motion.div>

              </div>

              {/* Comparing feedback bar */}
              <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/25 p-4 rounded-sm flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <p className="text-xs text-[#D4AF37]/90 leading-relaxed font-sans">
                  <strong>Peer Comparison Alert:</strong> Teams that prioritized <em>Premium Apartments</em> in Sim 1 show high ambient stress due to locked financial weight. Teams that sacrificed reserves to invest in risky solicitation proposals struggle with critical liquidity limitations today. Compare your position with other cohort terminals!
                </p>
              </div>

              <div className="pt-4 flex justify-between border-t border-white/10">
                <button
                  onClick={handlePrevPhase}
                  className="font-mono text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest font-bold cursor-pointer"
                >
                  ← TIMELINE
                </button>
                <button
                  onClick={handleNextPhase}
                  className="px-8 py-3 bg-white text-black hover:bg-[#D4AF37] hover:text-black rounded-sm font-mono text-xs uppercase tracking-wider font-bold cursor-pointer transition-all"
                >
                  PROCEED TO HORIZON EVENTS →
                </button>
              </div>

            </motion.div>
          )}

          {/* PHASE 3: LIFE STRIKES */}
          {phase === 3 && (
            <motion.div
              key="sim2-phase3"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                x: [0, -5, 5, -5, 5, 0] // subtle screen shaking entrance
              }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-xl bg-black border border-rose-500/40 rounded-sm p-6 md:p-10 text-center shadow-[0_0_35px_rgba(239,68,68,0.15)] space-y-8 relative"
            >
              {/* Alert indicator icon */}
              <div className="flex justify-center">
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-full inline-flex text-rose-500 animate-pulse">
                  <AlertTriangle className="w-10 h-10" />
                </div>
              </div>

              {/* Danger alert flag */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-rose-500 uppercase tracking-[0.35em] font-black block animate-pulse">
                  ⚠️ SYSTEM UNEXPECTED CONTINGENCY SHOCK
                </span>
                <h1 className="text-3xl font-display font-medium text-white tracking-widest uppercase">
                  UNEXPECTED EVENT: {data.crisisTitle.toUpperCase()}
                </h1>
              </div>

              {/* Custom crisis box */}
              <div className="bg-neutral-950/80 border border-neutral-900 rounded-sm p-5 space-y-3 text-left">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[9px] font-mono text-[#D4AF37] uppercase font-bold tracking-widest">
                    IMMEDIATE EXPOSURE
                  </span>
                  <span className="text-xs font-mono font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-sm uppercase">
                    {data.crisisAmount}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-sans text-neutral-300 leading-relaxed font-serif">
                  {data.crisisDesc}
                </p>
              </div>

              {/* Educational alert statement */}
              <div className="p-4 bg-neutral-900 border border-white/10 rounded-sm text-left text-xs leading-relaxed font-mono text-neutral-400">
                ⚠️ <span className="text-white font-bold">ACT NOW:</span> No lecture slides. No practice worksheets. Your team has to react right now. Waiting too long makes things harder.
              </div>

              <div>
                <button
                  onClick={() => {
                    sounds.playValidationChime();
                    handleNextPhase();
                  }}
                  className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold tracking-[0.25em] uppercase rounded-sm transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.2)] cursor-pointer"
                >
                  ENTER THE CRISIS ROOM
                </button>
              </div>
            </motion.div>
          )}

          {/* PHASE 4: CRISIS ROOM */}
          {phase === 4 && (
            <motion.div
              key="sim2-phase4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-5xl bg-[#090909] border border-white/10 rounded-sm p-6 md:p-8 shadow-2xl space-y-6 text-left"
            >
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.25em] font-bold block">
                  PHASE 04 : THE CRISIS COORDINATION PROTOCOL
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-wider">
                  The Crisis Room
                </h2>
                <p className="text-xs text-neutral-400">
                  Select your board role to access your custom perspective prompt. Under pressure, the team must draft and lock the final strategy.
                </p>
              </div>

              {/* Team Profile Overview helper */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black p-4 border border-white/5 rounded-sm">
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase block font-bold">Horizon Contingency</span>
                  <strong className="text-sm font-sans font-bold text-rose-400">{data.crisisTitle} ({data.crisisAmount})</strong>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 block font-bold">Sim 1 Reserve Status</span>
                  <strong className={`text-sm font-sans font-bold ${
                    hasScrapedSim1Reserve ? 'text-emerald-400' : 'text-amber-500'
                  }`}>
                    {hasScrapedSim1Reserve 
                      ? 'SAFE BUFFER: Discipline preserved capital cache' 
                      : 'DRY WELL: High housing/proposal expenditure'
                    }
                  </strong>
                </div>
              </div>

              {/* Grid of Board Members/Roles */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {rolesList.map((rl) => {
                  const isUserRole = rl.id === assignedRoleId;
                  const isActive = activeBoardRole === rl.id;
                  return (
                    <button
                      key={rl.id}
                      onClick={() => {
                        sounds.playClickSound();
                        setActiveBoardRole(rl.id);
                      }}
                      className={`p-4 text-left border rounded-sm transition-all focus:outline-none flex flex-col justify-between ${
                        isActive
                          ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-white shadow-[0_0_15px_rgba(212,175,55,0.08)]'
                          : isUserRole
                          ? 'bg-neutral-900 border-white/20 border-dashed text-neutral-200'
                          : 'bg-white/5 border-white/5 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[8px] font-mono text-neutral-500 uppercase font-black">
                            {rl.prompt.toUpperCase()}
                          </span>
                          {isUserRole && (
                            <span className="text-[7px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 py-0.5 border border-[#D4AF37]/20 rounded-xs uppercase">
                              My Role
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-mono font-bold text-white uppercase">{rl.name}</h4>
                        <p className="text-[11px] text-neutral-400 mt-2 italic font-serif leading-relaxed">
                          "{rl.prompt}"
                        </p>
                      </div>
                      
                      <span className="text-[9px] font-mono text-neutral-500 mt-3 hover:text-white block uppercase">
                        {isActive ? '[ACTIVE PREVIEW]' : '[EXPLORE BRIEF]'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Prompt Output Display panel */}
              <AnimatePresence mode="wait">
                {activeBoardRole && (
                  <motion.div
                    key={activeBoardRole}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="bg-neutral-900/40 border border-white/5 p-5 rounded-sm space-y-2 text-xs font-mono"
                  >
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[9px] text-[#D4AF37] uppercase font-bold tracking-widest">
                        {rolesList.find(r => r.id === activeBoardRole)?.name.toUpperCase()} CRITICAL MEMO
                      </span>
                      <span className="text-neutral-500 text-[8px]">APS SIM 02 PROTOCOL</span>
                    </div>
                    <p className="text-neutral-200 leading-relaxed font-sans text-sm font-serif">
                      {rolesList.find(r => r.id === activeBoardRole)?.action}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* The Action Choices */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">
                  CONSENSUS DECISION OUTLINE (TEAM LEAD MANDATORY CHOICE)
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    return (
                      <button
                        key={opt.id}
                        disabled={decisionLocked}
                        onClick={() => {
                          sounds.playValidationChime();
                          setSelectedOption(opt.id);
                        }}
                        className={`p-5 text-left border rounded-sm transition-all focus:outline-none relative ${
                          decisionLocked && !isSelected ? 'opacity-30' : ''
                        } ${
                          isSelected
                            ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-white shadow-[0_0_15px_rgba(212,175,55,0.08)]'
                            : 'bg-white/5 border-white/5 text-neutral-400 hover:border-neutral-500'
                        }`}
                      >
                        <div className="flex justify-between mb-2">
                          <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold">
                            Option {opt.id}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-[#D4AF37]" />}
                        </div>
                        <h4 className="text-lg font-mono font-bold text-white uppercase">{opt.title}</h4>
                        <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                          Cost Margin: <strong className="text-white font-mono">{opt.cost}</strong>
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Role Checkpoint Gates */}
              <div className="py-6">
                <RoleCheckpoint
                  userName={userName}
                  assignedRoleId={assignedRoleId}
                  selectedTeamId={selectedTeamId}
                  selectedOption={selectedOption}
                  crisisTitle={data?.crisisTitle || 'emergency'}
                  onCheckpointStatusChange={(isApproved) => setCheckpointPassed(isApproved)}
                />
              </div>

              {/* Locking Mechanism Panel */}
              <div className="pt-4 flex justify-between items-center border-t border-white/10 flex-col sm:flex-row gap-4">
                <button
                  onClick={handlePrevPhase}
                  className="font-mono text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest font-bold cursor-pointer"
                >
                  ← LIFE EVENTS
                </button>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      sounds.playValidationChime();
                      setDecisionLocked(true);
                      handleNextPhase();
                    }}
                    disabled={!selectedOption || decisionLocked || !checkpointPassed}
                    className={`w-full sm:w-64 py-3.5 rounded-sm font-bold tracking-widest text-xs uppercase transition-all font-mono cursor-pointer ${
                      selectedOption && !decisionLocked && checkpointPassed
                        ? 'bg-[#D4AF37] hover:bg-yellow-500 text-black shadow-[0_0_20px_rgba(212,175,55,0.15)] bg-[#D4AF37]!'
                        : 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                    }`}
                  >
                    LOCK DECISION & RECORD TO TIMELINE
                  </button>
                </div>
              </div>

            </motion.div>
          )}

          {/* PHASE 5: DECISION LOCK */}
          {phase === 5 && (
            <motion.div
              key="sim2-phase5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-xl bg-black border border-neutral-900 rounded-sm p-10 text-center space-y-10 shadow-2xl relative"
            >
              <div className="flex justify-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="p-6 bg-neutral-950 border border-neutral-800 rounded-full inline-flex text-white font-mono"
                >
                  <Lock className="w-8 h-8 text-[#D4AF37]" strokeWidth={1} />
                </motion.div>
              </div>

              <div className="space-y-6 max-w-sm mx-auto font-mono text-sm leading-relaxed tracking-wider">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-neutral-300"
                >
                  Consensus coordination resolved.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="text-neutral-300"
                >
                  Crisis strategic choice secured.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.8 }}
                  className="text-[#D4AF37] font-bold"
                >
                  Decision officially recorded.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.8 }}
                  className="text-neutral-500 italic text-xs"
                >
                  Life continues.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 4.8 }}
                  className="text-white font-bold tracking-[0.25em] uppercase text-xs"
                >
                  Observe the unfolding consequence.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5.5 }}
                className="pt-4"
              >
                <button
                  onClick={handleNextPhase}
                  className="w-full py-4 bg-[#D4AF37] hover:bg-yellow-500 text-black font-semibold tracking-widest text-xs uppercase rounded-sm font-mono font-bold cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                >
                  PLAY CONSEQUENCE CINEMA LIVE
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* PHASE 6: CONSEQUENCE CINEMA */}
          {phase === 6 && (
            <motion.div
              key="sim2-phase6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-3xl bg-[#090909] border border-white/10 rounded-sm p-6 md:p-10 shadow-2xl space-y-8 text-left"
            >
              <div className="text-center space-y-2 border-b border-white/10 pb-6">
                <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-bold block">
                  PHASE 06 : THE CONSEQUENCE HORIZON REVEAL
                </span>
                <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wider">
                  Consequence Cinema
                </h1>
                <p className="text-xs text-neutral-400">
                  Observe how your choices combined with initial financial reserves to drive your structural life outcome.
                </p>
              </div>

              {/* Dynamic feedback representation of Consequence Cinema */}
              <div className="bg-black/80 border border-white/5 rounded-sm p-6 sm:p-8 space-y-6 font-serif leading-relaxed text-sm md:text-base">
                
                <div className="flex items-center gap-3 border-b border-white/5 pb-4 font-mono text-[10px] text-neutral-500 tracking-wider">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  <span>LIFE REVEAL STORY CARDS • YEAR 2030</span>
                </div>

                <div className="space-y-4">
                  <p className="text-neutral-400 italic">
                    You chose standard tracking strategy: <strong className="text-white uppercase font-sans text-xs border border-white/10 px-2 py-0.5 rounded-sm">{selectedOption === 'A' ? 'OPTION A' : 'OPTION B'} </strong>
                  </p>

                  <div className="text-center font-display text-white text-xl font-bold py-2 border-l-2 border-[#D4AF37] pl-4 text-left">
                    {selectedOption === 'A' 
                      ? data.options[0].title 
                      : data.options[1].title
                    }
                  </div>

                  <p className="text-[#F5F5F5] font-serif leading-loose">
                    {hasScrapedSim1Reserve ? (
                      // With reserve path
                      selectedOption === 'A' ? data.options[0].consequenceWithReserve : data.options[1].consequenceWithReserve
                    ) : (
                      // Without reserve path
                      selectedOption === 'A' ? data.options[0].consequenceWithoutReserve : data.options[1].consequenceWithoutReserve
                    )}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-4 text-xs font-mono text-neutral-500 flex justify-between flex-wrap gap-2">
                  <span>RESESRVE DISCIPLINE: {hasScrapedSim1Reserve ? "MET" : "FAILED / LIQUIDATED"}</span>
                  <span className="text-emerald-400">DECISION ARCHIVE UNLOCKED</span>
                </div>
              </div>

              {/* Timeline graphic bar representation */}
              <div className="relative h-1 bg-neutral-800 rounded-full w-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                  className="absolute left-0 top-0 bottom-0 bg-[#D4AF37]"
                />
              </div>

              <div className="pt-4 flex justify-between border-t border-white/10">
                <button
                  onClick={handlePrevPhase}
                  className="font-mono text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest font-bold cursor-pointer"
                >
                  ← CRISIS ROOM
                </button>
                <button
                  onClick={handleNextPhase}
                  className="px-8 py-3 bg-[#D4AF37] hover:bg-yellow-500 text-black rounded-sm font-mono text-xs uppercase tracking-wider font-bold cursor-pointer transition-all"
                >
                  DEPLAY LENS PROTOCOL →
                </button>
              </div>

            </motion.div>
          )}

          {/* PHASE 7: RAHUL DECISION INTELLIGENCE */}
          {phase === 7 && (
            <motion.div
              key="sim2-phase7"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl bg-[#090909] border border-white/10 rounded-sm p-6 md:p-8 shadow-2xl space-y-6 text-left animate-fade-in"
            >
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.25em] font-bold block">
                  PHASE 07 : DEBRIEF AND FINDING SMART LESSONS
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-tight">
                  Rahul Lens : What We Learned From Rahul's Mistakes
                </h2>
                <p className="text-xs text-neutral-400">
                  This is NOT standard teaching. This is discovery. Let us analyze why our choices crashed or cruised.
                </p>
              </div>

              {/* Discovery Pause 1 */}
              <div className="space-y-4 bg-black/60 p-5 border border-white/5 rounded-sm">
                <div className="flex gap-2 items-center text-xs font-mono text-rose-400">
                  <BookOpen className="w-4 h-4" />
                  <span>CONGRUENCE INQUIRY #1: THE UNDERLYING ERROR</span>
                </div>
                <h3 className="text-lg font-sans text-neutral-200">
                  Why did Team Azad (The Lifestyle Upgraded) struggle critically under normal variance today?
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    "Because of sudden bad luck.",
                    "Because of excessive spending and subscriptions.",
                    "Because they assumed good times would continue indefinitely."
                  ].map((ans, idx) => {
                    const isSelected = lensQ1 === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          sounds.playClickSound();
                          setLensQ1(idx);
                        }}
                        className={`p-3 text-left border text-xs rounded-sm transition-all text-neutral-300 ${
                          isSelected 
                            ? 'bg-[#D4AF37]/10 border-[#D4AF37]' 
                            : 'bg-white/5 border-white/5 hover:border-neutral-700'
                        }`}
                      >
                        {ans}
                      </button>
                    );
                  })}
                </div>

                {lensQ1 !== null && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-serif text-[#D4AF37] bg-yellow-500/5 p-3 rounded-sm border border-[#D4AF37]/25 leading-relaxed"
                    >
                      {lensQ1 === 2 ? (
                        <span>
                          ★ <strong>Magnificent Discovery!</strong> It was not the coffee spending, but the baseline epistemic mistake. They mapped their entire savings capacity assuming zero volatility in the job, family, or health.
                        </span>
                      ) : (
                        <span>
                          <strong>Analyze closely:</strong> While spending was a minor catalyst, the root fallacy was assuming the baseline of Sim 1 represented a deterministic spreadsheet future.
                        </span>
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* Concepts Reveal */}
              <div className="space-y-4 pt-4 border-t border-white/15">
                <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase block font-bold">
                  THE THREE CORE COGNITIVE FRAMEWORKS
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Concept 1 */}
                  <div className="bg-neutral-950 p-5 border border-white/5 rounded-sm space-y-2">
                    <span className="text-[9px] font-mono text-[#D4AF37] uppercase font-bold tracking-widest block">
                      Concept #01
                    </span>
                    <h4 className="text-sm font-mono font-bold text-white uppercase">
                      Second-Order Thinking
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      "And then what?" Always trace option reactions past immediate speed. A short-term borrow fixes father's bill but saddles 36 months of compounding interest.
                    </p>
                  </div>

                  {/* Concept 2 */}
                  <div className="bg-neutral-950 p-5 border border-white/5 rounded-sm space-y-2">
                    <span className="text-[9px] font-mono text-[#D4AF37] uppercase font-bold tracking-widest block">
                      Concept #02
                    </span>
                    <h4 className="text-sm font-mono font-bold text-white uppercase">
                      Opportunity Cost
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Every asset allocated is a choice denied. Sponsoring siblings tuition or renting premium spaces directly eliminates your ability to act on pre-seed tech investments.
                    </p>
                  </div>

                  {/* Concept 3 */}
                  <div className="bg-neutral-950 p-5 border border-white/5 rounded-sm space-y-2">
                    <span className="text-[9px] font-mono text-[#D4AF37] uppercase font-bold tracking-widest block">
                      Concept #03
                    </span>
                    <h4 className="text-sm font-mono font-bold text-white uppercase">
                      Probability Thinking
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Life does not map to narrow averages. We must budget for standard mathematical variance and black swan shocks (hospitals, layoffs, urgent relocation).
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between border-t border-white/10">
                <button
                  onClick={handlePrevPhase}
                  className="font-mono text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest font-bold cursor-pointer"
                >
                  ← CINEMA REVEAL
                </button>
                <button
                  disabled={lensQ1 === null}
                  onClick={handleNextPhase}
                  className={`px-8 py-3 rounded-sm font-bold tracking-wider text-xs uppercase transition-all font-mono cursor-pointer ${
                    lensQ1 !== null
                      ? 'bg-white hover:bg-[#D4AF37] hover:text-black text-black'
                      : 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                  }`}
                >
                  INITIATE APS IDENTITY INQUIRY →
                </button>
              </div>

            </motion.div>
          )}

          {/* PHASE 8: THE APS MOMENT */}
          {phase === 8 && (
            <motion.div
              key="sim2-phase8"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl bg-[#090909] border border-white/15 rounded-sm p-6 md:p-10 shadow-3xl text-center space-y-8"
            >
              
              <div className="space-y-4">
                <span className="text-[9px] font-mono tracking-[0.4em] text-[#D4AF37] uppercase font-bold block animate-pulse">
                  THE SOLEMN TRANS-Pedagogic PAUSE
                </span>
                
                {/* Large Playfair display heading */}
                <h1 className="text-4xl md:text-5xl font-serif italic text-white tracking-tight leading-tight pt-2">
                  What kind of person are you becoming?
                </h1>
                
                <p className="text-xs text-neutral-500 font-mono tracking-widest">
                  NO CHATTER • NO TEAM DISCUSSIONS • PURE PERSONAL REFLECTION
                </p>
              </div>

              {!completedAPS ? (
                <div className="space-y-6 text-left max-w-lg mx-auto">
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-wider block font-bold">
                      1. What surprised you about today's trade-offs?
                    </label>
                    <textarea
                      rows={2}
                      value={surpriseAnswer}
                      onChange={(e) => setSurpriseAnswer(e.target.value)}
                      placeholder="E.g., I was surprised by how fast the cash reserves drained when I bought premium assets..."
                      className="w-full bg-black border border-white/10 focus:border-[#D4AF37] rounded-sm p-3 text-xs text-white outline-none font-sans leading-relaxed resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-wider block font-bold">
                      2. What assumption of yours turned out to be wrong?
                    </label>
                    <textarea
                      rows={2}
                      value={wrongAssumptionAnswer}
                      onChange={(e) => setWrongAssumptionAnswer(e.target.value)}
                      placeholder="E.g., I wrongly assumed that borrowing extra money is cheap, but the compounding interest is brutal..."
                      className="w-full bg-black border border-white/10 focus:border-[#D4AF37] rounded-sm p-3 text-xs text-white outline-none font-sans leading-relaxed resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-wider block font-bold">
                      3. What is one decision you will make differently tomorrow?
                    </label>
                    <textarea
                      rows={2}
                      value={differentActionAnswer}
                      onChange={(e) => setDifferentActionAnswer(e.target.value)}
                      placeholder="E.g., I will build a dedicated emergency buffer first before thinking about discretionary assets..."
                      className="w-full bg-black border border-white/10 focus:border-[#D4AF37] rounded-sm p-3 text-xs text-white outline-none font-sans leading-relaxed resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        const combined = `Surprised: ${surpriseAnswer}\nWrong Assumption: ${wrongAssumptionAnswer}\nDo Differently: ${differentActionAnswer}`;
                        setApsAnswer(combined);
                        sounds.playValidationChime();
                        setCompletedAPS(true);
                      }}
                      disabled={!surpriseAnswer.trim() || !wrongAssumptionAnswer.trim() || !differentActionAnswer.trim()}
                      className={`w-full py-4 rounded-sm font-bold tracking-[0.2em] text-xs uppercase transition-all font-mono cursor-pointer ${
                        surpriseAnswer.trim() && wrongAssumptionAnswer.trim() && differentActionAnswer.trim()
                          ? 'bg-[#D4AF37] hover:bg-yellow-500 text-black shadow-[0_0_25px_rgba(212,175,55,0.2)]'
                          : 'bg-neutral-850 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                      }`}
                    >
                      COMMIT PERSONAL IDENTITY SHIFT
                    </button>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 max-w-2xl mx-auto py-4"
                >
                  <div className="flex justify-center">
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-full inline-flex text-emerald-400 animate-pulse">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-black block">
                      PEDAGOGICAL IDENTITY SECURED
                    </span>
                    <h2 className="text-2xl font-serif text-white italic">
                      Reflection Committed to Archives
                    </h2>
                  </div>

                  <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/25 p-5 rounded-sm space-y-2">
                    <span className="text-[9px] font-mono text-[#D4AF37] block uppercase font-black">
                      APS SUCCESS TEST VERDICT:
                    </span>
                    <blockquote className="font-serif italic text-sm text-neutral-200 leading-relaxed text-center">
                      &ldquo;I realized that my assumptions about the future were driving my decisions.&rdquo;
                    </blockquote>
                    <p className="text-[10px] text-neutral-400 font-sans leading-relaxed">
                      By shifting from localized budget tactics to structural uncertainty testing, you secured the core educational objective of the OECD curriculum standards.
                    </p>
                  </div>

                  {/* HIGH-QUALITY FELLOWSHIP CERTIFICATE GENERATOR */}
                  <CertificateGenerator
                    userName={userName}
                    assignedRoleId={assignedRoleId}
                    selectedTeamId={selectedTeamId}
                  />

                  {/* REYOU INTEL REPORT INTERACTIVE BLOCK */}
                  <div className="border border-[#1A1A1A] bg-black p-6 rounded-sm space-y-6 text-left relative overflow-hidden">
                    <div className="absolute right-0 top-0 bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 text-[8.5px] font-mono border-b border-l border-[#D4AF37]/25 uppercase font-bold tracking-widest">
                      REYOU Advisor Group Integration
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                        PERSONAL TRANSITIONAL REPORTS
                      </h3>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Generate real-time summaries of what you did well, how to manage sudden surprises, and a warm conversation topic to share with your family tonight.
                      </p>
                    </div>

                    {!studentReport && !parentReport && !loadingReports && (
                      <div className="pt-2">
                        <button
                          onClick={handleGenerateReports}
                          className="w-full py-4 bg-[#D4AF37] hover:bg-yellow-500 text-black font-mono font-black text-xs uppercase tracking-widest rounded-sm transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] cursor-pointer"
                        >
                          Generate Cohort Growth & Parent Reports
                        </button>
                      </div>
                    )}

                    {loadingReports && (
                      <div className="p-6 border border-neutral-800 bg-neutral-950/65 rounded-sm space-y-4 text-center">
                        <div className="inline-block relative w-8 h-8 border-3 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
                        <p className="text-[10px] font-mono text-[#D4AF37] tracking-widest">CONNECTING TO REYOU ANALYTICAL SERVER...</p>
                        <div className="text-[9.5px] font-mono text-neutral-500 space-y-1">
                          <p className="animate-pulse">Analyzing Simulation Year 1 & Year 2 Decisions...</p>
                          <p className="animate-pulse delay-200">Evaluating Personal Identity Shifts...</p>
                          <p className="animate-pulse delay-500">Sanitizing Complex Jargon into Plain English...</p>
                        </div>
                      </div>
                    )}

                    {(studentReport || parentReport) && (
                      <div className="space-y-5 pt-2">
                        {/* Tab Headers */}
                        <div className="flex bg-neutral-950 p-1 border border-neutral-800 rounded-sm">
                          <button
                            onClick={() => setActiveReportTab('student')}
                            className={`flex-1 py-2 font-mono text-[9px] uppercase font-bold tracking-widest rounded-xs transition-all cursor-pointer ${
                              activeReportTab === 'student' 
                                ? 'bg-[#D4AF37] text-black' 
                                : 'text-neutral-400 hover:text-white'
                            }`}
                          >
                            Student Growth Report
                          </button>
                          <button
                            onClick={() => setActiveReportTab('parent')}
                            className={`flex-1 py-2 font-mono text-[9px] uppercase font-bold tracking-widest rounded-xs transition-all cursor-pointer ${
                              activeReportTab === 'parent' 
                                ? 'bg-[#D4AF37] text-black' 
                                : 'text-neutral-400 hover:text-white'
                            }`}
                          >
                            Parent Conversation Guide
                          </button>
                        </div>

                        {/* Student Tab Content */}
                        {activeReportTab === 'student' && studentReport && (
                          <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            className="space-y-4"
                          >
                            <div className="p-4 bg-[#0A0A0A] border border-neutral-900 rounded-xs">
                              <span className="text-[8.5px] font-mono text-emerald-400 uppercase tracking-widest font-black block mb-1">
                                ★ WHAT YOU DID WELL
                              </span>
                              <p className="text-xs text-neutral-300 leading-relaxed">
                                {studentReport.didWell}
                              </p>
                            </div>

                            <div className="p-4 bg-[#0A0A0A] border border-neutral-900 rounded-xs">
                              <span className="text-[8.5px] font-mono text-amber-500 uppercase tracking-widest font-black block mb-1">
                                ▲ WHAT TO PRACTICE / IMPROVE
                              </span>
                              <p className="text-xs text-neutral-300 leading-relaxed">
                                {studentReport.canImprove}
                              </p>
                            </div>

                            <div className="p-4 bg-[#0A0A0A] border border-neutral-900 rounded-xs">
                              <span className="text-[8.5px] font-mono text-[#D4AF37] uppercase tracking-widest font-black block mb-1">
                                🔑 CORE LIFE LESSON LEARNED
                              </span>
                              <p className="text-xs text-neutral-300 leading-relaxed">
                                {studentReport.learned}
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {/* Parent Tab Content */}
                        {activeReportTab === 'parent' && parentReport && (
                          <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            className="space-y-4"
                          >
                            <div className="p-4 bg-[#0A0A0A] border border-neutral-900 rounded-xs">
                              <span className="text-[8.5px] font-mono text-emerald-400 uppercase tracking-widest font-black block mb-1">
                                ★ WHAT YOUR CHILD DID WELL
                              </span>
                              <p className="text-xs text-neutral-300 leading-relaxed">
                                {parentReport.didWell}
                              </p>
                            </div>

                            <div className="p-4 bg-[#0A0A0A] border border-neutral-900 rounded-xs">
                              <span className="text-[8.5px] font-mono text-amber-500 uppercase tracking-widest font-black block mb-1">
                                ▲ WHAT YOUR CHILD CAN IMPROVE
                              </span>
                              <p className="text-xs text-neutral-300 leading-relaxed">
                                {parentReport.canImprove}
                              </p>
                            </div>

                            <div className="p-5 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xs">
                              <span className="text-[8.5px] font-mono text-[#D4AF37] uppercase tracking-widest font-black block mb-1">
                                💬 SUGGESTED FAMILY CONVERSATION STARTER
                              </span>
                              <p className="text-sm font-serif italic text-white leading-relaxed">
                                &ldquo;{parentReport.conversationStarter}&rdquo;
                              </p>
                              <span className="text-[9.5px] font-mono text-neutral-500 block mt-2">
                                Ask your parent or guardian this exact question at the dining table tonight!
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 font-mono">
                    <p className="text-[9px] text-neutral-600 uppercase tracking-widest mb-1">
                      APS FOUNDER FELLOWSHIP COMPLETE
                    </p>
                    <p className="text-[8px] text-neutral-700 uppercase">
                      BUILD APS-S2 END_EXP v1.2 • REYOU LABS
                    </p>
                  </div>

                </motion.div>
              )}

              {/* Bottom backtrack control */}
              {!completedAPS && (
                <div className="pt-2 flex justify-start border-t border-white/5">
                  <button
                    onClick={handlePrevPhase}
                    className="font-mono text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest font-bold cursor-pointer"
                  >
                    ← RAHUL DEBRIEF
                  </button>
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* PHASE CONTROL NAVIGATION SYSTEM BAR */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-4 mt-6 text-[10px] font-mono tracking-widest text-[#D4AF37]">
        <div className="flex items-center gap-1.5 mb-2 md:mb-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="font-bold text-neutral-500 uppercase">SYS SIMULATION 2 LIVE</span>
        </div>

        {/* 8 Stepper Dots */}
        <div className="flex items-center gap-1.5 mb-2 md:mb-0">
          {Array.from({ length: 8 }).map((_, i) => {
            const num = i + 1;
            return (
              <button
                key={i}
                disabled={isTransitionActive && num > 1}
                onClick={() => {
                  sounds.playClickSound();
                  setPhase(num);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  phase === num
                    ? 'w-8 bg-[#D4AF37]'
                    : phase > num
                    ? 'w-2.5 bg-white'
                    : 'w-2 bg-neutral-850 hover:bg-neutral-600'
                }`}
                title={`Jump to Phase ${num}`}
              />
            );
          })}
        </div>

        <div className="text-neutral-500 font-bold uppercase select-none">
          Life Happens Challenge
        </div>
      </footer>

    </div>
  );
}
