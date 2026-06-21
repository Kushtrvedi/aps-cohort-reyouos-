import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RoleId, TEAMS } from '../types';
import { sounds } from '../utils/audio';
import { Orb, Canvas } from './BreathingOrb';
import { 
  SVGSalaryNotification, 
  SVGApartmentComparison, 
  SVGFastMoneyOpportunity, 
  SVGFutureTimeline, 
  SVGExpertDecisionLens, 
  SVGBoardroomDefense 
} from './SFIllustrations';
import { 
  Lock, 
  Check, 
  Smartphone,
  Eye,
  Activity,
  AlertTriangle,
  Clock,
  Shield,
  RotateCcw,
  Play,
  Pause,
  Sliders,
  Award,
  Zap,
  CheckCircle2,
  HelpCircle,
  HelpCircle as QuestionIcon
} from 'lucide-react';

interface Screen08BriefingProps {
  userName: string;
  selectedTeamId: string;
  assignedRoleId: RoleId;
  onComplete?: () => void;
  isSim2Deployed?: boolean;
}

interface TeamProfileData {
  teamName: string;
  roleCaption: string;
  age: number;
  salary: string;
  dream: string;
  pressure: string;
  fear: string;
  blindSpot: string;
}

const PROFILES: Record<string, TeamProfileData> = {
  TEAM_ALPHA: {
    teamName: "TEAM JHANSI",
    roleCaption: "The Liability Manager",
    age: 22,
    salary: "₹55,000",
    dream: "Accumulate basic starting capital within one year.",
    pressure: "High outstanding credit loan commitments.",
    fear: "Having capital continuously drained by debts.",
    blindSpot: "I can deal with interest payments later."
  },
  TEAM_BRAVO: {
    teamName: "TEAM BHAGAT",
    roleCaption: "The Debt Resolver",
    age: 23,
    salary: "₹55,000",
    dream: "Clear all outstanding debt lines as quickly as possible.",
    pressure: "Large educational liability balances.",
    fear: "Having future income completely locked by debt overheads.",
    blindSpot: "Rigid cost-cutting is the only path to safety."
  },
  TEAM_CHARLIE: {
    teamName: "TEAM CHANAKYA",
    roleCaption: "The Strategic Investor",
    age: 22,
    salary: "₹55,000",
    dream: "Compound starting capital through diversified equity portfolios.",
    pressure: "Chasing maximum returns to beat inflation patterns.",
    fear: "Holding depreciating cash instead of compounding assets.",
    blindSpot: "Every market sector promises instant growth."
  },
  TEAM_DELTA: {
    teamName: "TEAM AZAD",
    roleCaption: "The Material Utility Buyer",
    age: 22,
    salary: "₹55,000",
    dream: "Equip workspace with high-end premium technology tools.",
    pressure: "Desire to resolve low consumption habits from student days.",
    fear: "Operating with obsolete workspace hardware.",
    blindSpot: "Premium equipment directly increases net earning capacity."
  },
  TEAM_ECHO: {
    teamName: "TEAM NETAJI",
    roleCaption: "The Structural Reserve Builder",
    age: 23,
    salary: "₹55,000",
    dream: "Establish high-liquidity capital accounts.",
    pressure: "Unsettled background billing commitments.",
    fear: "Unexpected immediate billing overheads.",
    blindSpot: "Low-yield deposits are safer than active assets."
  },
  TEAM_FOXTROT: {
    teamName: "TEAM PATEL",
    roleCaption: "The Conservative Asset Saver",
    age: 22,
    salary: "₹55,000",
    dream: "Lock in guaranteed financial stability.",
    pressure: "Rising local rent-tier costs.",
    fear: "Sudden cost hikes or economic drawdowns.",
    blindSpot: "Avoiding active financial markets guarantees capital protection."
  },
  TEAM_GOLF: {
    teamName: "TEAM KALAM",
    roleCaption: "The Skill Capitalist",
    age: 21,
    salary: "₹55,000",
    dream: "Invest in high-value developer certifications.",
    pressure: "Rapid tech obsolescence requiring constant training fees.",
    fear: "Stagnating professional earning capacity.",
    blindSpot: "Theoretical credentials automatically ensure higher income."
  },
  TEAM_HOTEL: {
    teamName: "TEAM VIVEKANANDA",
    roleCaption: "The Utility Optimizer",
    age: 22,
    salary: "₹55,000",
    dream: "Maximize value metrics of every single transaction.",
    pressure: "Choosing between immediate cash yields and deferred assets.",
    fear: "Wasting investment capital on bad-performing sectors.",
    blindSpot: "Every financial report is fully transparent."
  },
  TEAM_INDIA: {
    teamName: "TEAM SHIVAJI",
    roleCaption: "The High Leverage User",
    age: 23,
    salary: "₹55,000",
    dream: "Reach maximum net worth curves quickly using credit tools.",
    pressure: "Heavy revolving credit expenses.",
    fear: "Sudden drops in commercial borrowing authority.",
    blindSpot: "Using leverage is always a safe shortcut."
  },
  TEAM_JULIET: {
    teamName: "TEAM BOSE",
    roleCaption: "The Momentum Trader",
    age: 22,
    salary: "₹55,000",
    dream: "Capture active volatile market cycles.",
    pressure: "Constantly fluctuating micro-asset values.",
    fear: "Being left with zero margins during asset corrections.",
    blindSpot: "Following online trading forums ensures predictive security."
  }
};

interface Consequence {
  year1: string;
  year3: string;
  reflection: string;
}

const DECISION_CONSEQUENCES: Record<string, Record<string, Consequence>> = {
  TEAM_ALPHA: {
    Family: {
      year1: "Outstanding debt principal reduces by 25%. Your monthly recurring interest liability shrinks.",
      year3: "Your debt burden has dropped significantly, freeing up ₹8,000 in monthly disposable income. You feel financially lighter.",
      reflection: "Does clearing liabilities early provide a safer foundation than chasing short-term gains?"
    },
    Security: {
      year1: "You accumulate a basic liquid capital reserve. However, high-interest debt continues to compound at 14%.",
      year3: "Your bank balances look secure, but the outstanding liability principal has swelled, draining net financial worth.",
      reflection: "Is capital truly secure if background compounding liabilities are left unaddressed?"
    },
    Growth: {
      year1: "You allocate funds into equity market portfolios, expecting capital growth while liabilities compound.",
      year3: "Normal market volatility forces a premature portfolio liquidation when debt repayments command immediate liquidity.",
      reflection: "Can you afford to play the long game of market growth when baseline liabilities require immediate cash?"
    },
    Lifestyle: {
      year1: "You buy upgraded devices, adding heavy monthly installment charges (EMIs) to your budget.",
      year3: "Your technology has depreciated in value by 50% while recurring EMIs have continuously depleted your daily cash flow.",
      reflection: "Did immediate asset consumption increase your productivity or just increase your monthly expenses?"
    }
  },
  TEAM_BRAVO: {
    Family: {
      year1: "You focus capital on fast debt repayment, paying off high-interest personal balances immediately.",
      year3: "Your liability balances are completely cleared. Every rupee you earn now compounds in your own accounts.",
      reflection: "Did focusing on debt reduction unlock higher long-term compounding power?"
    },
    Security: {
      year1: "You stash cash in emergency accounts. Outstanding liability balances remain untouched, compounding.",
      year3: "While you hold stable cash reserves, the interest accumulated on your debt matches the size of those reserves.",
      reflection: "Is holding cash rational when your debt interest rate exceeds your deposit interest rate?"
    },
    Growth: {
      year1: "You invest in high-yield assets, expecting to outperform your background debt-servicing costs.",
      year3: "Fluctuations in asset returns create high anxiety. Interest charges on the debt continue to outpace yields.",
      reflection: "Is investing before clearing compounding liabilities mathematically sound?"
    },
    Lifestyle: {
      year1: "You acquire upmarket personal tools, deferring your active liability repayments.",
      year3: "The initial convenience of upgrades fades, but the principal liability remains unchanged and continues to compound.",
      reflection: "Did immediate consumption move you closer to financial flexibility or lock you into liabilities?"
    }
  },
  TEAM_CHARLIE: {
    Family: {
      year1: "You allocate excess capital to settle low-interest bonds early, keeping your assets liquid.",
      year3: "Your total debt levels are zero. However, your conservative allocation missed a major market growth cycle.",
      reflection: "Did excessive focus on clear liabilities prevent you from capturing wealth compound?"
    },
    Security: {
      year1: "You stash your salary in liquid savings, prioritizing asset safety but earning returns below inflation.",
      year3: "Your cash reserves are secure, but inflation has eroded the purchasing power of your uninvested capital.",
      reflection: "Does avoiding all market risk ultimately become a risk to your capital's actual purchasing value?"
    },
    Growth: {
      year1: "You allocate capital into diversified stock indexes, initiating passive compound growth early.",
      year3: "Your market portfolio has compounded by 18%, laying a robust foundation for long-term independence.",
      reflection: "What distinguishes sound systematic investing from volatile speculative trading?"
    },
    Lifestyle: {
      year1: "You buy premium productivity equipment, expecting immediate efficiency gains to pay off.",
      year3: "Upkeep and subscription costs diminish your liquid saving balances, with minimal real income improvement.",
      reflection: "Did buying status gear act as capital investment or simple depreciative expense?"
    }
  },
  TEAM_DELTA: {
    Family: {
      year1: "You strictly allocate funds to clear accumulated debt, resisting immediate upgrade desires.",
      year3: "With clear sheets, you hold superior cash flow positions to acquire high-quality assets with cash instead of EMI.",
      reflection: "Does delaying immediate gratification increase your long-term purchasing power?"
    },
    Security: {
      year1: "You hold cash in stable accounts, keeping lifestyle expenses down to standard student levels.",
      year3: "Your saving buffers are excellent, providing stable capital runway to handle sudden cost hikes easily.",
      reflection: "Can maintaining a low cost base serve as a powerful defensive asset?"
    },
    Growth: {
      year1: "You invest heavily in stock classes, maintaining extreme frugality in daily living costs.",
      year3: "Your equity assets have appreciated, but zero intermediate liquidity leaves you with restricted cash options.",
      reflection: "Did extreme asset building compromise your daily operational liquidity?"
    },
    Lifestyle: {
      year1: "You buy premium hardware and high-cost utility assets, upgrading your material standard.",
      year3: "Your cash savings remain near zero as recurring subscription fees and asset upkeep exhaust your earnings.",
      reflection: "When does immediate material upgrade transition from convenience to structural financial drag?"
    }
  },
  TEAM_ECHO: {
    Family: {
      year1: "You clear your outstanding short-term micro-loans, removing active interest drain.",
      year3: "Ending micro-loan interest saved significant cash, boosting your monthly saving capacity.",
      reflection: "Is removing small daily capital leakages the easiest way to compound wealth?"
    },
    Security: {
      year1: "You compile an emergency cash buffer in local low-yield deposit accounts.",
      year3: "Your cash cushion balances sudden equipment repairs easily, preserving capital continuity.",
      reflection: "Can holding liquid cash prevent you from having to sell assets at a loss?"
    },
    Growth: {
      year1: "You invest in automated index accounts, locking capital into passive global market baskets.",
      year3: "Your asset portfolio grows slowly but steadily, benefiting from consistent cost averaging.",
      reflection: "Does a systematic passive asset allocation build safer capital than trying to time the market?"
    },
    Lifestyle: {
      year1: "You upgrade your residence and workspace, increasing recurring monthly cash commitments.",
      year3: "The high fixed rent and utility overheads drain your monthly saving rate, leaving minimal surplus capital.",
      reflection: "Did workspace comfort enhance your yield or simply establish a higher baseline expense?"
    }
  },
  TEAM_FOXTROT: {
    Family: {
      year1: "You dedicate capital to repaying old university obligations, settling baseline balance sheets.",
      year3: "With all legacy bills fully settled, you operate with high disposable margins.",
      reflection: "Is starting your career with clean, non-leveraged balance sheets a vital safety asset?"
    },
    Security: {
      year1: "You stash surplus funds in safe treasury deposits, creating an impenetrable financial buffer.",
      year3: "You handle sudden market changes easily, but high inflation slightly decreases your net real wealth value.",
      reflection: "Does over-insulating your capital from market cycles limit your long-term wealth?"
    },
    Growth: {
      year1: "You allocate funds to high-risk volatile tech assets, chasing rapid speculative gains.",
      year3: "Severe market corrections draw down your asset balances by 30%, triggering defensive liquidations.",
      reflection: "Did chasing higher asset returns expose your core capital to market cycles?"
    },
    Lifestyle: {
      year1: "You upgrade personal items, spending capital on premium comforts and social experiences.",
      year3: "High depreciation on gadgets combined with no savings buffer leaves you with low credit capabilities.",
      reflection: "Did buying comfortable things now ruin your peace of mind later?"
    }
  },
  TEAM_GOLF: {
    Family: {
      year1: "You repay educational credits, clearing old financial leverage from your record.",
      year3: "Legacy obligations are settled. Your net personal equity is completely positive.",
      reflection: "How does removing credit liability from your sheets improve your financial choices?"
    },
    Security: {
      year1: "You stash cash in checking accounts, avoiding both personal training courses and investments.",
      year3: "Your bank statement holds basic reserves, but your lack of advanced technical skills keeps your income flat.",
      reflection: "Is saving cheap cash safer than active investment in high-yielding personal skill sets?"
    },
    Growth: {
      year1: "You invest capital in advanced technical skills and specialized credentials.",
      year3: "Your enhanced credentials double your market value, resulting in a major salary promotion.",
      reflection: "What makes investment in upgraded human skills compound faster than standard market assets?"
    },
    Lifestyle: {
      year1: "You spend on high-end gadgets and entertainment devices, postponing personal learning courses.",
      year3: "You possess high-tier hardware but basic skills, remaining stuck in entry-level salary tiers.",
      reflection: "Did upgrading your hardware distract you from upgrading your human capital?"
    }
  },
  TEAM_HOTEL: {
    Family: {
      year1: "You clear high-cost micro-debt, reducing background balance sheet liabilities.",
      year3: "With zero debt overhead, you retain total operational control over your earned capital.",
      reflection: "How does eliminating recurring debt liabilities enhance your structural flexibility?"
    },
    Security: {
      year1: "You accumulate emergency cash, creating a six-month survival buffer.",
      year3: "Your cash runway is robust, providing extreme stability through corporate changes.",
      reflection: "Is a deep cash runway a superior asset to speculative high-yield investments?"
    },
    Growth: {
      year1: "You place capital into long-term retirement accounts, locking funds for compound yields.",
      year3: "Compounds accumulate beautifully, though early withdrawal rules keep your capital completely illiquid.",
      reflection: "Can locking up funds for long-term compound growth limit your current cash flow options?"
    },
    Lifestyle: {
      year1: "You spend on trendy social habits and lifestyle experiences to match corporate cohorts.",
      year3: "Your spending eats your capital, leaving you with zero reserve cushions and low net asset value.",
      reflection: "Does matching your consumption to adjacent social circles drain your net financial worth?"
    }
  },
  TEAM_INDIA: {
    Family: {
      year1: "You pay off credit balances, maintaining a clean leverage profile.",
      year3: "Your outstanding liabilities are zero. Your borrowing score rises, offering clean credit options.",
      reflection: "Does eliminating revolving credit bills build stronger financial security?"
    },
    Security: {
      year1: "You accumulate emergency cash funds, refusing to use credit cards or take on debt.",
      year3: "With no liabilities, the rise in daily costs is fully absorbable without borrowing.",
      reflection: "What makes cash reserve safety superior to relying on credit limits?"
    },
    Growth: {
      year1: "You invest aggressively in speculative stocks, relying on credit lines for emergency needs.",
      year3: "Your stock portfolio grew, but sudden margin calls on credit commitments forced asset liquidation.",
      reflection: "What are the structural dangers of investing with leverage or no cash buffer?"
    },
    Lifestyle: {
      year1: "You utilize high credit limits and EMIs to acquire premium lifestyle assets immediately.",
      year3: "The compounding interest on revolving credit debts traps a main portion of your active income.",
      reflection: "Did utilizing debt to acquire consumer assets create long-term financial drag?"
    }
  },
  TEAM_JULIET: {
    Family: {
      year1: "You settle outstanding business lease accounts, clearing balance sheet notes.",
      year3: "Your clean records protect your capital from legal or administrative balance claims.",
      reflection: "Does clearing liabilities early outperform chasing speculative market momentum?"
    },
    Security: {
      year1: "You place capital in highly stable savings, ignoring high-risk speculative trends.",
      year3: "You missed the speculative bubble, but fully preserved capital while others faced liquidations.",
      reflection: "Is avoiding speculative gains a form of defensive capital preservation?"
    },
    Growth: {
      year1: "You invest capital in Early Stage high-risk digital assets.",
      year3: "Few initiatives succeed, while many collapse, teaching you the severe capital costs of unhedged diversification.",
      reflection: "Does a lack of clear valuation focus dilute your long-term compound potential?"
    },
    Lifestyle: {
      year1: "You spend heavily on trending gear and crypto-metaverse lifestyles, trying to live out your dream success before age 30.",
      year3: "Most of your investments crashed, and your upgraded gadgets are outdated. You have no cash runways left to capture the next wave.",
      reflection: "Did chasing the appearance of modern success cost you the actual capital to participate in it?"
    }
  }
};

const DECISION_2_CONSEQUENCES: Record<string, Record<'PREMIUM' | 'PRACTICAL', Consequence>> = {
  TEAM_ALPHA: {
    PREMIUM: {
      year1: "Life feels easier. Travel time reduces.",
      year3: "Your debt burden demands support. Savings are limited. You feel conflicted.",
      reflection: "Did comfort reduce your ability to build critical runway?"
    },
    PRACTICAL: {
      year1: "Long commute. Some frustration.",
      year3: "Savings helped during sudden capital demands.",
      reflection: "Can short-term sacrifice create long-term freedom?"
    }
  },
  TEAM_BRAVO: {
    PREMIUM: {
      year1: "Daily overhead feels high.",
      year3: "Loan repayment slows. Debt lasts longer.",
      reflection: "Did convenience delay freedom?"
    },
    PRACTICAL: {
      year1: "Life feels restrictive.",
      year3: "Loan reduces much faster.",
      reflection: "Can discipline accelerate opportunity?"
    }
  },
  TEAM_CHARLIE: {
    PREMIUM: {
      year1: "Lifestyle improves.",
      year3: "Less capital available for growth.",
      reflection: "What opportunity did comfort replace?"
    },
    PRACTICAL: {
      year1: "Higher monthly savings.",
      year3: "Additional opportunities appear.",
      reflection: "Can small decisions compound?"
    }
  },
  TEAM_DELTA: {
    PREMIUM: {
      year1: "Exactly what you wanted.",
      year3: "Lifestyle expectations increase. Expenses increase.",
      reflection: "When does lifestyle become a habit?"
    },
    PRACTICAL: {
      year1: "Feels disappointing.",
      year3: "Financial flexibility increases.",
      reflection: "Did you underestimate patience?"
    }
  },
  TEAM_ECHO: {
    PREMIUM: {
      year1: "Life becomes comfortable.",
      year3: "Monthly rent eats into savings, restricting options.",
      reflection: "Can comfort reduce long-term security?"
    },
    PRACTICAL: {
      year1: "Daily sacrifice.",
      year3: "Accumulated cash buffer becomes highly protective.",
      reflection: "What is structural capital worth?"
    }
  },
  TEAM_FOXTROT: {
    PREMIUM: {
      year1: "Life feels secure.",
      year3: "Emergency fund grows slowly.",
      reflection: "Did security create risk?"
    },
    PRACTICAL: {
      year1: "Lifestyle remains basic.",
      year3: "Financial shocks are easily absorbed.",
      reflection: "What does security really mean?"
    }
  },
  TEAM_GOLF: {
    PREMIUM: {
      year1: "Comfort improves.",
      year3: "Less money available for learning.",
      reflection: "What future did you delay?"
    },
    PRACTICAL: {
      year1: "More effort required.",
      year3: "Additional skills create new opportunities.",
      reflection: "Can learning outperform comfort?"
    }
  },
  TEAM_HOTEL: {
    PREMIUM: {
      year1: "Life feels balanced.",
      year3: "Purpose remains unchanged. Savings decrease.",
      reflection: "Did comfort move you closer to your optimal capital position?"
    },
    PRACTICAL: {
      year1: "Sacrifice increases.",
      year3: "More resources become available for meaningful goals.",
      reflection: "What deserves your resources?"
    }
  },
  TEAM_INDIA: {
    PREMIUM: {
      year1: "Work becomes easier.",
      year3: "Convenience creates comfort. Growth slows.",
      reflection: "Can convenience reduce hunger?"
    },
    PRACTICAL: {
      year1: "More difficult routine.",
      year3: "Greater resilience develops.",
      reflection: "What builds ambition?"
    }
  },
  TEAM_JULIET: {
    PREMIUM: {
      year1: "Life looks successful.",
      year3: "Less capital for future opportunities.",
      reflection: "What opportunities did comfort cost?"
    },
    PRACTICAL: {
      year1: "Less exciting lifestyle.",
      year3: "Greater ability to act on opportunities.",
      reflection: "What creates opportunity: appearance or preparation?"
    }
  }
};

const DECISION_3_CONSEQUENCES: Record<string, Record<'INVEST' | 'INVESTIGATE' | 'IGNORE', Consequence>> = {
  TEAM_ALPHA: {
    INVEST: {
      year1: "₹20,000 disappears. No response from organizer.",
      year3: "Unexpected capital demands arrive. You wish you had verified first.",
      reflection: "Did urgency replace judgment?"
    },
    INVESTIGATE: {
      year1: "You discover registration is missing. You do not invest.",
      year3: "Money remains available when needed.",
      reflection: "Can patience be a financial skill?"
    },
    IGNORE: {
      year1: "Nothing happens.",
      year3: "You avoid losses. You also learn nothing.",
      reflection: "Is avoiding risk the same as understanding risk?"
    }
  },
  TEAM_BRAVO: {
    INVEST: {
      year1: "Investment fails. Debt remains.",
      year3: "Loan repayment slows significantly.",
      reflection: "Did hope become a strategy?"
    },
    INVESTIGATE: {
      year1: "Warning signs appear. You stay away.",
      year3: "Debt decreases steadily.",
      reflection: "Can evidence create freedom?"
    },
    IGNORE: {
      year1: "You bypass the opportunity immediately.",
      year3: "Loan payments continue steadily, though you didn't look closely at the risk.",
      reflection: "Does simply avoiding risk make you smart with money?"
    }
  },
  TEAM_CHARLIE: {
    INVEST: {
      year1: "Excitement increases. Evidence decreases.",
      year3: "Opportunity proves fraudulent.",
      reflection: "Was the decision based on evidence or emotion?"
    },
    INVESTIGATE: {
      year1: "You identify missing information.",
      year3: "Capital remains available for better opportunities.",
      reflection: "What makes an opportunity worth pursuing?"
    },
    IGNORE: {
      year1: "You dismiss the opportunity instantly.",
      year3: "Capital is preserved, but no research skills were sharpened.",
      reflection: "Can omission be as strategic as active investigation?"
    }
  },
  TEAM_DELTA: {
    INVEST: {
      year1: "Dreams of quick success grow.",
      year3: "Money disappears. Lifestyle expectations remain.",
      reflection: "Did excitement hide risk?"
    },
    INVESTIGATE: {
      year1: "You pause before acting.",
      year3: "Financial flexibility remains.",
      reflection: "Can patience outperform excitement?"
    },
    IGNORE: {
      year1: "You ignore the prompt.",
      year3: "Financial flexibility remains, but you missed a chance to talk about risk.",
      reflection: "Does avoiding easy shortcuts teach passive patience?"
    }
  },
  TEAM_ECHO: {
    INVEST: {
      year1: "Loss affects baseline capital.",
      year3: "Commitments increase. Options decrease.",
      reflection: "Who carries the consequences of your decisions?"
    },
    INVESTIGATE: {
      year1: "No investment made.",
      year3: "Financial reserves remain intact.",
      reflection: "Does responsibility require verification?"
    },
    IGNORE: {
      year1: "You completely bypass the solicitation.",
      year3: "Operational capital remains safe from fraudulent schemes.",
      reflection: "Can passive avoidance maintain a secure pillar?"
    }
  },
  TEAM_FOXTROT: {
    INVEST: {
      year1: "Security is compromised.",
      year3: "Emergency fund shrinks.",
      reflection: "Did greed disguise itself as opportunity?"
    },
    INVESTIGATE: {
      year1: "You reject the offer.",
      year3: "Financial stability improves.",
      reflection: "What protects stability?"
    },
    IGNORE: {
      year1: "You dismiss the notifications.",
      year3: "Your security reserves remain stable, but without deliberate evaluation.",
      reflection: "What is the worth of security without diagnostic vigilance?"
    }
  },
  TEAM_GOLF: {
    INVEST: {
      year1: "Skill development is delayed.",
      year3: "Lost money means fewer learning opportunities.",
      reflection: "What future did you trade away?"
    },
    INVESTIGATE: {
      year1: "You keep the money.",
      year3: "You invest in learning instead.",
      reflection: "What compounds more: skills or shortcuts?"
    },
    IGNORE: {
      year1: "You filter out the high-yield scheme.",
      year3: "Learning reserves remain intact, though testing of temptation was bypassed.",
      reflection: "Can shortcuts teach anything of lasting compound worth?"
    }
  },
  TEAM_HOTEL: {
    INVEST: {
      year1: "Quick success becomes the focus.",
      year3: "Purpose gets replaced by chasing returns.",
      reflection: "Did money distract you from meaning?"
    },
    INVESTIGATE: {
      year1: "You pause and verify.",
      year3: "Decisions align with values.",
      reflection: "Can values improve judgment?"
    },
    IGNORE: {
      year1: "You disregard the messages entirely.",
      year3: "Priorities remain focused without predatory interference.",
      reflection: "Does deliberate detachment yield more value than caution?"
    }
  },
  TEAM_INDIA: {
    INVEST: {
      year1: "Speed feels productive.",
      year3: "The opportunity collapses.",
      reflection: "Can fast action become careless action?"
    },
    INVESTIGATE: {
      year1: "You delay action.",
      year3: "You avoid unnecessary losses.",
      reflection: "What deserves speed?"
    },
    IGNORE: {
      year1: "You treat the text as basic noise.",
      year3: "You avoid toxic losses purely by inaction.",
      reflection: "Does a quiet buffer build deliberate ambition?"
    }
  },
  TEAM_JULIET: {
    INVEST: {
      year1: "You chase the opportunity.",
      year3: "The opportunity disappears.",
      reflection: "Does every opportunity deserve attention?"
    },
    INVESTIGATE: {
      year1: "You demand evidence.",
      year3: "Better opportunities emerge.",
      reflection: "What separates opportunity from distraction?"
    },
    IGNORE: {
      year1: "You ignore the solicitation completely.",
      year3: "Resources remain untouched and alert for real entries.",
      reflection: "Does avoiding a distraction make you readier for real opportunities?"
    }
  }
};

export default function Screen08Briefing({
  userName,
  selectedTeamId,
  assignedRoleId,
  onComplete,
  isSim2Deployed = false
}: Screen08BriefingProps) {
  // Current Phase: 1 to 10
  const [phase, setPhase] = useState<number>(1);
  const [phase1Step, setPhase1Step] = useState<number>(0); // 0: Assigned, 1: Future not, 2: Decisions matter

  const profile = PROFILES[selectedTeamId] || PROFILES.TEAM_ALPHA;

  // Decision 1 states
  const [decision1, setDecision1] = useState<string | null>(null);
  const [decision1Why, setDecision1Why] = useState<string>('');

  // Decision 2 states
  const [decision2, setDecision2] = useState<'PREMIUM' | 'PRACTICAL' | null>(null);
  const [decision2Assumption, setDecision2Assumption] = useState<string>('');

  // Role Checkpoint & Spotlight States
  const [d1RoleApproved, setD1RoleApproved] = useState<boolean>(() => {
    return localStorage.getItem('reyou-d1-role-approved') === 'true';
  });
  const [d1RoleInput, setD1RoleInput] = useState<string>(() => {
    return localStorage.getItem('reyou-d1-role-input') || '';
  });
  const [d2RoleApproved, setD2RoleApproved] = useState<boolean>(() => {
    return localStorage.getItem('reyou-d2-role-approved') === 'true';
  });
  const [d2RoleInput, setD2RoleInput] = useState<string>(() => {
    return localStorage.getItem('reyou-d2-role-input') || '';
  });
  const [showSpotlightExchange, setShowSpotlightExchange] = useState<boolean>(false);
  const [spotlightReaction, setSpotlightReaction] = useState<string>(() => {
    return localStorage.getItem('reyou-spotlight-reaction') || '';
  });

  // Decision 3 states
  const [decision3, setDecision3] = useState<'INVEST' | 'INVESTIGATE' | 'IGNORE' | null>(null);
  const [decision3Evidence, setDecision3Evidence] = useState<string>('');
  const [showD3Details, setShowD3Details] = useState<boolean>(false);

  // Reflection states
  const [reflectionSurprised, setReflectionSurprised] = useState<string>('');
  const [reflectionFailed, setReflectionFailed] = useState<string>('');
  const [reflectionDifferently, setReflectionDifferently] = useState<string>('');
  const [reflectionCompleted, setReflectionCompleted] = useState<boolean>(false);

  // Facilitator real-time spotlight broadcast capture
  const [broadcastedReflection, setBroadcastedReflection] = useState<{ id: number; author: string; text: string } | null>(null);
  const [showBroadcastToast, setShowBroadcastToast] = useState<boolean>(false);

  // Persist decisions to local storage for Simulation 2 live outcomes and report generation
  useEffect(() => {
    if (decision1) localStorage.setItem('reyou-d1-choice', decision1);
    if (decision2) localStorage.setItem('reyou-d2-choice', decision2);
    if (decision3) localStorage.setItem('reyou-d3-choice', decision3);
    if (decision1Why) localStorage.setItem('reyou-d1-why', decision1Why);
    if (decision2Assumption) localStorage.setItem('reyou-d2-assumption', decision2Assumption);
    if (decision3Evidence) localStorage.setItem('reyou-d3-evidence', decision3Evidence);
    
    localStorage.setItem('reyou-d1-role-approved', d1RoleApproved ? 'true' : 'false');
    localStorage.setItem('reyou-d1-role-input', d1RoleInput);
    localStorage.setItem('reyou-d2-role-approved', d2RoleApproved ? 'true' : 'false');
    localStorage.setItem('reyou-d2-role-input', d2RoleInput);
    localStorage.setItem('reyou-spotlight-reaction', spotlightReaction);
  }, [decision1, decision2, decision3, decision1Why, decision2Assumption, decision3Evidence, d1RoleApproved, d1RoleInput, d2RoleApproved, d2RoleInput, spotlightReaction]);

  // Synchronize facilitator broadcast messages in real-time
  useEffect(() => {
    const saved = localStorage.getItem('reyou-broadcasted-reflection');
    if (saved) {
      try {
        setBroadcastedReflection(JSON.parse(saved));
        setShowBroadcastToast(true);
      } catch (e) {
        console.error("Failed to parse initial broadcasted reflection", e);
      }
    }

    const handleBroadcastEvent = (e: any) => {
      const refItem = e.detail;
      if (refItem) {
        setBroadcastedReflection(refItem);
        setShowBroadcastToast(true);
        sounds.playValidationChime();
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'reyou-broadcasted-reflection' && e.newValue) {
        try {
          const refItem = JSON.parse(e.newValue);
          setBroadcastedReflection(refItem);
          setShowBroadcastToast(true);
          sounds.playValidationChime();
        } catch (err) {
          console.error(err);
        }
      }
    };

    window.addEventListener('reyou-reflection-broadcasted', handleBroadcastEvent);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('reyou-reflection-broadcasted', handleBroadcastEvent);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Play dynamic validation chime when the Simulation 02 stage has been deployed live!
  useEffect(() => {
    if (isSim2Deployed && reflectionCompleted) {
      sounds.playValidationChime();
    }
  }, [isSim2Deployed, reflectionCompleted]);

  // Workshop countdown helper states
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerLabel, setTimerLabel] = useState<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Direct bypass interface state
  const [showObserverFeed, setShowObserverFeed] = useState<boolean>(false);

  // Auto transition for Phase 1
  useEffect(() => {
    if (phase === 1) {
      if (phase1Step === 0) {
        sounds.playTickingSound();
        const t1 = setTimeout(() => {
          setPhase1Step(1);
        }, 2000);
        return () => clearTimeout(t1);
      } else if (phase1Step === 1) {
        sounds.playTickingSound();
        const t2 = setTimeout(() => {
          setPhase1Step(2);
        }, 2000);
        return () => clearTimeout(t2);
      }
    }
  }, [phase, phase1Step]);

  // Handle active countdown timers
  useEffect(() => {
    if (timerActive && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            sounds.playTimerEndedChime();
            return 0;
          }
          if (prev <= 6 && prev > 1) {
            sounds.playTickingSound();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, secondsLeft]);

  const startTimer = (seconds: number, label: string) => {
    sounds.playValidationChime();
    setSecondsLeft(seconds);
    setTimerLabel(label);
    setTimerActive(true);
  };

  const toggleTimerPause = () => {
    sounds.playTickingSound();
    setTimerActive(!timerActive);
  };

  const resetTimer = () => {
    sounds.playTickingSound();
    setTimerActive(false);
    setSecondsLeft(0);
  };

  const handleNextPhase = () => {
    sounds.playValidationChime();
    setTimerActive(false);
    setSecondsLeft(0);
    setPhase((prev) => Math.min(prev + 1, 10));
  };

  const handlePrevPhase = () => {
    sounds.playTickingSound();
    setTimerActive(false);
    setSecondsLeft(0);
    setPhase((prev) => Math.max(prev - 1, 1));
  };

  const resetEngagement = () => {
    sounds.playOrbHum();
    setPhase(1);
    setPhase1Step(0);
    setDecision1(null);
    setDecision1Why('');
    setDecision2(null);
    setDecision2Assumption('');
    setDecision3(null);
    setDecision3Evidence('');
    setReflectionSurprised('');
    setReflectionFailed('');
    setReflectionDifferently('');
    setReflectionCompleted(false);
    resetTimer();
  };

  // Build Year Stories
  const getYearOneStory = () => {
    if (!decision1 || !decision2) return "No decisions recorded yet.";
    const teamRecord1 = DECISION_CONSEQUENCES[selectedTeamId] || DECISION_CONSEQUENCES.TEAM_ALPHA;
    const choiceRecord1 = teamRecord1[decision1] || teamRecord1.Family;

    const teamRecord2 = DECISION_2_CONSEQUENCES[selectedTeamId] || DECISION_2_CONSEQUENCES.TEAM_ALPHA;
    const choiceRecord2 = teamRecord2[decision2] || teamRecord2.PRACTICAL;

    return `[SALARY CONSEQUENCE] ${choiceRecord1.year1} — [APARTMENT CHOICE CONSEQUENCE] ${choiceRecord2.year1}`;
  };

  const getYearThreeStory = () => {
    if (!decision1 || !decision2) return "No decisions recorded yet.";
    const teamRecord1 = DECISION_CONSEQUENCES[selectedTeamId] || DECISION_CONSEQUENCES.TEAM_ALPHA;
    const choiceRecord1 = teamRecord1[decision1] || teamRecord1.Family;

    const teamRecord2 = DECISION_2_CONSEQUENCES[selectedTeamId] || DECISION_2_CONSEQUENCES.TEAM_ALPHA;
    const choiceRecord2 = teamRecord2[decision2] || teamRecord2.PRACTICAL;

    const isSecureState = decision2 === 'PRACTICAL' || decision1 === 'Security' || decision1 === 'Family';

    let base = decision2 === 'PRACTICAL'
      ? "Compound savings from rent trade-offs reached an impressive milestone, maximizing your cash reserves. "
      : "High rent commitments restricted your flexibility. When professional advancement bootcamps arose, you lacked the loose funds to pay. ";

    const shockerMessage = "Then, an unexpected capital demand of ₹30,000 for critical professional tools and license updates arrived. " + (
      isSecureState 
        ? "Because your baseline choices preserved liquid capital, you fully covered this expense with cash, reinforcing stability."
        : "Because your funds were completely locked up, you had to take high-interest revolving debt, causing major financial drag."
    );

    return `[SALARY PROGRESS] ${choiceRecord1.year3} — [APARTMENT TIMELINE] ${choiceRecord2.year3} | ${base}${shockerMessage}`;
  };

  const getReflectionQuestion = () => {
    if (!decision1 || !decision2 || !decision3) {
      return {
        d1: "Can helping everyone cause you to forget yourself?",
        d2: "Can short-term sacrifice create long-term freedom?",
        d3: "Did urgency replace judgment?"
      };
    }
    const teamRecord1 = DECISION_CONSEQUENCES[selectedTeamId] || DECISION_CONSEQUENCES.TEAM_ALPHA;
    const choiceRecord1 = teamRecord1[decision1] || teamRecord1.Family;

    const teamRecord2 = DECISION_2_CONSEQUENCES[selectedTeamId] || DECISION_2_CONSEQUENCES.TEAM_ALPHA;
    const choiceRecord2 = teamRecord2[decision2] || teamRecord2.PRACTICAL;

    const teamRecord3 = DECISION_3_CONSEQUENCES[selectedTeamId] || DECISION_3_CONSEQUENCES.TEAM_ALPHA;
    const choiceRecord3 = teamRecord3[decision3] || teamRecord3.IGNORE;

    return {
      d1: choiceRecord1.reflection,
      d2: choiceRecord2.reflection,
      d3: choiceRecord3.reflection
    };
  };

  const getYearFiveStory = () => {
    if (!decision3) return "No Decision 3 recorded.";
    const teamRecord3 = DECISION_3_CONSEQUENCES[selectedTeamId] || DECISION_3_CONSEQUENCES.TEAM_ALPHA;
    const choiceRecord3 = teamRecord3[decision3] || teamRecord3.IGNORE;
    return `[YEAR 1] ${choiceRecord3.year1} — [YEAR 3] ${choiceRecord3.year3}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col justify-between p-4 md:p-8 relative select-none font-sans">
      
      {/* Premium Institutional Grid Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.015)_0%,rgba(0,0,0,0)_70%)]" />
      </div>

      {/* PERSISTENT HEADER */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#D4AF37] uppercase font-bold">
            THE REYOU FELLOWSHIP
          </span>
        </div>
        
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
          <span>SIMULATION 1</span>
          <span className="text-neutral-700 font-bold">•</span>
          <span className="text-white font-bold">PHASE {phase} OF 10</span>
          <span className="text-neutral-700 font-bold">•</span>
          <span className="text-[#D4AF37] font-bold">{profile.teamName}</span>
        </div>

        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <button
            onClick={() => {
              sounds.playTickingSound();
              setShowObserverFeed(!showObserverFeed);
            }}
            className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] font-mono font-bold text-neutral-400 hover:text-white rounded-sm uppercase transition-all tracking-wider cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 inline mr-1.5" />
            {showObserverFeed ? "Hide Observer Panel" : "Observer Panel"}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 flex-1 w-full max-w-5xl mx-auto flex flex-col justify-center items-center">
        
        {/* FACILITATOR TIMER */}
        {secondsLeft > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-black border border-[#D4AF37]/30 rounded-sm p-4 mb-6 flex items-center justify-between font-mono text-xs shadow-[0_0_20px_rgba(212,175,55,0.06)]"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37] animate-pulse" />
              <div>
                <span className="text-[#D4AF37] font-bold uppercase mr-1">{timerLabel}</span>
                <span className="text-neutral-500 font-bold">TIMER</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold tracking-widest text-[#F5F5F5]">
                {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, '0')}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleTimerPause}
                  className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  {timerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={resetTimer}
                  className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          
          {/* PHASE 1: LIFE ACTIVATION */}
          {phase === 1 && (
            <motion.div
              key="phase-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl text-center space-y-12 py-16 flex flex-col items-center"
            >
              {/* Dynamic Golden Breathing Orb represents the live simulation loading and core initialization */}
              <div className="mb-4">
                <Canvas frameloop="demand" id="briefing-orb-canvas">
                  <Orb 
                    intensity={phase1Step === 0 ? 0.35 : phase1Step === 1 ? 0.75 : 0.5} 
                    turbulence={phase1Step === 0 ? 0.15 : phase1Step === 1 ? 0.65 : 0.3} 
                    color="#D4AF37" 
                  />
                </Canvas>
              </div>

              <div className="space-y-8 min-h-[140px] flex items-center justify-center">
                {phase1Step === 0 && (
                  <motion.h1
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight"
                  >
                    Your identity has been assigned.
                  </motion.h1>
                )}

                {phase1Step === 1 && (
                  <motion.h1
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight"
                  >
                    Your future has not.
                  </motion.h1>
                )}

                {phase1Step === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-10"
                  >
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight leading-relaxed max-w-xl mx-auto">
                      The decisions you make today will shape what happens next.
                    </h1>

                    <div className="pt-6">
                      <button
                        onClick={handleNextPhase}
                        className="border border-white hover:border-[#D4AF37] text-white font-mono hover:bg-white hover:text-black py-4 px-10 tracking-[0.25em] uppercase text-xs transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)] cursor-pointer font-bold"
                      >
                        ACTIVATE PROFILE
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* PHASE 2: LIFE PROFILE REVEAL */}
          {phase === 2 && (
            <motion.div
              key="phase-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl bg-[#090909] border border-white/10 rounded-sm p-6 md:p-10 shadow-2xl space-y-8 text-left"
            >
              <div className="text-center space-y-2 border-b border-white/10 pb-6">
                <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-bold block">
                  PHASE 02 : COGNITIVE IDENTITY DEPLOYED
                </span>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                  {profile.teamName}
                </h1>
                <p className="text-sm text-[#D4AF37] font-sans font-bold uppercase tracking-wider">
                  {profile.roleCaption}
                </p>
              </div>

              {/* Profile Table in FT style */}
              <div className="space-y-4 font-sans text-sm">
                
                {/* Common Instruction Bannered Box */}
                <div className="bg-neutral-900 border-l-2 border-[#D4AF37] p-4 font-sans text-xs leading-relaxed text-neutral-300 space-y-2">
                  <span className="font-mono text-[10px] text-[#D4AF37] tracking-widest uppercase font-bold block">
                    COMMON INSTRUCTION
                  </span>
                  <p className="font-sans font-bold text-white text-xs">
                    Students must act as this person. Not as themselves.
                  </p>
                  <p>
                    For the next 20 minutes, this is your reality. This is your pressure. This is your responsibility. This is your future. Every decision must be made from the perspective of your assigned profile.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t border-white/5">
                  <div className="border-b border-white/5 pb-2.5">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Age</span>
                    <strong className="text-base text-white font-bold">{profile.age}</strong>
                  </div>
                  <div className="border-b border-white/5 pb-2.5">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">First salary</span>
                    <strong className="text-base text-[#10B981] font-bold">{profile.salary}</strong>
                  </div>
                  <div className="border-b border-white/5 pb-2.5">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Dream</span>
                    <span className="text-white block font-sans text-sm leading-relaxed">{profile.dream}</span>
                  </div>
                  <div className="border-b border-white/5 pb-2.5">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Pressure</span>
                    <span className="text-white block font-sans text-sm leading-relaxed">{profile.pressure}</span>
                  </div>
                  <div className="border-b border-white/5 pb-2.5">
                    <span className="text-[10px] font-mono text-[#DB4455] uppercase tracking-wider block">Fear</span>
                    <strong className="text-[#DB4455] text-sm block font-bold leading-relaxed">{profile.fear}</strong>
                  </div>
                  <div className="border-b border-white/5 pb-2.5">
                    <span className="text-[10px] font-mono text-amber-500 uppercase tracking-wider block">Blind Spot</span>
                    <span className="text-amber-500 block text-sm leading-relaxed">{profile.blindSpot}</span>
                  </div>
                </div>
              </div>

              {/* Facilitator Setup Command */}
              <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-4 rounded-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-left space-y-0.5">
                  <span className="text-[9px] font-mono text-[#D4AF37] uppercase block tracking-widest font-bold">FACILITATOR SEQUENCE</span>
                  <p className="text-xs text-neutral-400">
                    Host huddle: Give teams <strong>2 Minutes</strong> to huddle and align on this perspective.
                  </p>
                </div>
                <button
                  onClick={() => startTimer(120, "TEAM SETUP & ALIGNMENT")}
                  className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-sm font-mono text-[10px] uppercase font-bold shrink-0 cursor-pointer"
                >
                  START 2 MINUTES
                </button>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={handlePrevPhase}
                  className="font-mono text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest font-bold cursor-pointer"
                >
                  ← BACK
                </button>
                <button
                  onClick={handleNextPhase}
                  className="px-8 py-3 bg-white hover:bg-[#D4AF37] hover:text-black text-black font-semibold tracking-wider text-xs uppercase rounded-sm transition-all cursor-pointer font-mono font-bold"
                >
                  ENTER DECISION 1
                </button>
              </div>
            </motion.div>
          )}

          {/* PHASE 3: DECISION 1 - THE FIRST SALARY */}
          {phase === 3 && (
            <motion.div
              key="phase-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl bg-[#090909] border border-white/10 rounded-sm p-6 md:p-8 shadow-2xl space-y-6 text-left"
            >
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.25em] font-bold block">
                  PHASE 03 : DECISION 1
                </span>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-white uppercase">
                  The First Salary
                </h1>
              </div>

              {/* Dynamic Apple-Ed + FT styled custom SVG Salary Notification vector */}
              <SVGSalaryNotification salary="₹55,000" />

              {/* Phone Notification card standard */}
              <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-sm p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">Notification Status</span>
                    <div className="text-sm font-sans font-bold text-white">Salary Credited</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-sans font-bold tracking-tight text-white block">₹55,000</span>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block tracking-wider font-bold">
                  Decision Choice:
                </span>
                <h2 className="text-xl font-display font-bold text-white leading-snug">
                  What matters most right now?
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { id: 'Family', tag: 'A', title: 'Debt Repayment', desc: 'Direct funds to outstanding credits or interest liability reduction.' },
                  { id: 'Security', tag: 'B', title: 'Capital Reserve', desc: 'Lock funds into a defensive, highly liquid emergency buffer.' },
                  { id: 'Growth', tag: 'C', title: 'Wealth Assets', desc: 'Allocate funds to diversified market indices and stock classes.' },
                  { id: 'Lifestyle', tag: 'D', title: 'Material Upgrades', desc: 'Enhance personal devices, tech gear, or lifestyle upgrades.' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sounds.playValidationChime();
                      setDecision1(opt.id);
                    }}
                    className={`p-4 text-left border rounded-sm transition-all focus:outline-none cursor-pointer ${
                      decision1 === opt.id
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-white shadow-[0_0_15px_rgba(212,175,55,0.08)]'
                        : 'bg-white/5 border-white/5 text-neutral-400 hover:border-neutral-500 hover:text-white'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-mono text-[#D4AF37] font-bold">Option {opt.tag}</span>
                      {decision1 === opt.id && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    </div>
                    <strong className="font-sans font-bold text-white text-base block mb-0.5">{opt.title}</strong>
                    <p className="text-xs text-neutral-400 leading-normal font-sans">{opt.desc}</p>
                  </button>
                ))}
              </div>

              {/* WHY QUESTION AS ASSUMPTION ENGINE */}
              {decision1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 border-t border-white/10 pt-4"
                >
                  <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-4 rounded-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                      <label className="text-[10px] font-mono text-[#D4AF37] uppercase block tracking-widest font-black">
                        🧠 TEAM ASSUMPTION ENGINE
                      </label>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-sans">
                      Every choice carries a hidden risk. Articulate your team's core belief:
                    </p>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-300 font-bold">
                      <span>We believe that</span>
                      <span className="border-b border-[#D4AF37]/45 flex-1 inline-block pb-0.5">
                        <input
                          type="text"
                          value={decision1Why.startsWith('We believe that ') ? decision1Why.substring(16) : decision1Why}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDecision1Why('We believe that ' + val);
                          }}
                          placeholder="e.g. comfort creates success / we will have no financial shock / savings can wait..."
                          className="w-full bg-transparent border-none text-white focus:outline-none placeholder-neutral-600 font-mono text-xs px-1"
                        />
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 pt-1">
                      <span>Maximum 20 Words. (Write carefully: Simulation 2 will attack your team assumption!)</span>
                      <span className={decision1Why.trim().split(/\s+/).filter(Boolean).length >= 18 ? 'text-amber-500 font-bold animate-pulse' : ''}>
                        {decision1Why.trim().split(/\s+/).filter(Boolean).length}/20 words
                      </span>
                    </div>
                  </div>

                  {/* HIGH AGENCY: STRATEGY LEAD ROLE CHECKPOINT */}
                  <div className="bg-black/45 border border-white/10 p-4 rounded-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${d1RoleApproved ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                        <span className="text-[10px] font-mono text-white uppercase tracking-widest font-bold">
                          🛡️ ROLE CHECKPOINT: STRATEGY LEAD
                        </span>
                      </div>
                      <span className="text-[9px] font-mono bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 px-2 py-0.5 rounded-sm uppercase tracking-wide">
                        Active Role: Big Picture Thinker
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-normal font-sans">
                      Before finalizing choice <strong className="text-white">"{decision1}"</strong>, the <strong className="text-[#D4AF37]">Strategy Lead</strong> must analyze: <span className="italic text-neutral-400">What crucial information is currently missing from our evaluation of this pathway?</span>
                    </p>

                    {assignedRoleId === 'STRATEGY_LEAD' ? (
                      <div className="space-y-3">
                        <textarea
                          rows={2}
                          value={d1RoleInput}
                          onChange={(e) => setD1RoleInput(e.target.value)}
                          placeholder="As Strategy Lead, write what is missing (e.g. 'We are missing real calculations of taxes and the exact costs of travel time...')"
                          className="w-full bg-neutral-950 border border-white/10 rounded-sm p-2.5 text-xs text-white focus:border-[#D4AF37] outline-none font-sans"
                        />
                        <button
                          onClick={() => {
                            if (d1RoleInput.trim().length >= 5) {
                              sounds.playValidationChime();
                              setD1RoleApproved(true);
                            }
                          }}
                          disabled={d1RoleInput.trim().length < 5}
                          className="w-full py-2 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-mono text-[11px] font-extrabold uppercase tracking-widest hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer rounded-xs"
                        >
                          {d1RoleApproved ? "✓ Decison Strategy Authorized" : "Authorize Strategic Path Decision"}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-black/60 p-3 border border-white/5 rounded text-neutral-400 font-mono text-[11.5px] italic leading-relaxed space-y-1">
                          <div>
                            Strategy Lead Analysis:
                          </div>
                          {d1RoleInput ? (
                            <p className="text-white text-xs not-italic">"{d1RoleInput}"</p>
                          ) : (
                            <p className="text-neutral-500 text-xs">Waiting for Strategy Lead to type their strategic checkpoint review...</p>
                          )}
                        </div>

                        {!d1RoleApproved ? (
                          <div className="flex gap-2">
                            <div className="flex-1 text-[10px] font-mono text-neutral-500 flex items-center justify-center italic bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-sm">
                              Consult team Big Picture Thinker to lock decision.
                            </div>
                            <button
                              onClick={() => {
                                sounds.playValidationChime();
                                setD1RoleInput("Strategic baseline review completed. Missing elements evaluated.");
                                setD1RoleApproved(true);
                              }}
                              className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37] text-[10.5px] font-mono text-neutral-300 hover:text-white rounded transition-colors uppercase tracking-wider font-bold cursor-pointer"
                            >
                              ⚡ Override Checkpoint
                            </button>
                          </div>
                        ) : (
                          <div className="text-center py-1.5 bg-emerald-950/20 border border-emerald-900/35 rounded text-[11px] font-mono font-bold text-emerald-400">
                            ✓ Strategy Lead Checkpoint Completed
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Team timers */}
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-sm flex flex-wrap gap-2 items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase block font-bold">ALLOTTED DEBATE</span>
                  <p className="text-xs text-neutral-400">Run a 60s Discussion followed by a 30s Consensus vote.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startTimer(60, "SALARY ALLOCATION STATEMENT")}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm font-mono text-[9px] font-bold text-white uppercase cursor-pointer"
                  >
                    60S DEBATE
                  </button>
                  <button
                    onClick={() => startTimer(30, "CONSENSUS VOTE")}
                    className="px-3 py-1.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/30 rounded-sm font-mono text-[9px] text-[#D4AF37] uppercase cursor-pointer font-bold"
                  >
                    30S VOTE
                  </button>
                </div>
              </div>

              {/* Navigation CTA */}
              <div className="pt-4 flex justify-between border-t border-white/10 pt-4">
                <button
                  onClick={handlePrevPhase}
                  className="font-mono text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest font-bold cursor-pointer"
                >
                  ← PROFILE
                </button>
                <button
                  onClick={handleNextPhase}
                  disabled={!decision1 || !decision1Why.trim() || !d1RoleApproved}
                  className={`px-8 py-3 rounded-sm font-bold tracking-wider text-xs uppercase transition-all font-mono cursor-pointer ${
                    decision1 && decision1Why.trim() && d1RoleApproved
                      ? 'bg-white hover:bg-[#D4AF37] hover:text-black text-black'
                      : 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                  }`}
                >
                  ENTER DECISION 2
                </button>
              </div>
            </motion.div>
          )}

          {/* PHASE 4: DECISION 2 - THE APARTMENT */}
          {phase === 4 && (
            <AnimatePresence mode="wait">
              {showSpotlightExchange ? (
                <motion.div
                  key="phase-4-spotlight"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full max-w-4xl bg-[#090909] border border-[#D4AF37]/35 rounded-sm p-6 md:p-8 shadow-[0_0_40px_rgba(212,175,55,0.1)] space-y-6 text-left"
                >
                  <div className="text-center space-y-1 border-b border-[#D4AF37]/20 pb-4">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.25em] font-black block">
                      ✦ THE APS MOMENT : SPOTLIGHT EXCHANGE ✦
                    </span>
                    <h1 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight">
                      Let's See How Other Teams Think
                    </h1>
                  </div>

                  <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                    A key lesson of building **Decision Intelligence** is observing alternative interpretations. 
                    Other cohorts made opposite decisions based on contrasting, yet valid mental models:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/5 p-5 rounded-sm space-y-2">
                      <span className="text-[9px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                        Team Kalam • Selected Practical Flat
                      </span>
                      <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                        "We prioritized capital safety above all else. Renting a premium flat with low savings leaves no margin for safety. If an emergency happens, you have no buffer and you are instantly trapped."
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/5 p-5 rounded-sm space-y-2">
                       <span className="text-[9px] font-mono bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">
                        Team Azad • Selected Premium Flat
                      </span>
                      <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                        "We chose mental well-being and space to focus. Traveling 1.5 hours in a hot bus every single day causes extreme cognitive fatigue. Burnout is a massive financial and emotional risk too."
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-white/10 pt-4">
                    <label className="text-[10px] font-mono text-[#D4AF37] uppercase block tracking-wider font-black">
                      Compare your team's model to theirs (Minimum 10 Characters)
                    </label>
                    <p className="text-[11px] text-neutral-400 font-sans">
                      Does seeing these opposing interpretations challenge or solidify your assumption? Write down your team's consensus:
                    </p>
                    <textarea
                      rows={3}
                      value={spotlightReaction}
                      onChange={(e) => setSpotlightReaction(e.target.value)}
                      placeholder="e.g. This solidifies our belief, because Team Kalam under-rates buses, or we see Team Kalam has a valid point about health risks..."
                      className="w-full bg-black border border-[#1A1A1A] rounded-sm p-3 text-xs text-white outline-none font-sans resize-none leading-relaxed"
                    />
                  </div>

                  {/* Spotlight Navigation */}
                  <div className="pt-4 flex justify-between border-t border-white/10">
                    <button
                      onClick={() => {
                        sounds.playTickingSound();
                        setShowSpotlightExchange(false);
                      }}
                      className="font-mono text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest font-bold cursor-pointer"
                    >
                      ← Back to Selection
                    </button>
                    <button
                      onClick={() => {
                        sounds.playValidationChime();
                        setShowSpotlightExchange(false);
                        handleNextPhase();
                      }}
                      disabled={spotlightReaction.trim().length < 10}
                      className={`px-8 py-3 rounded-sm font-bold tracking-wider text-xs uppercase transition-all font-mono cursor-pointer ${
                        spotlightReaction.trim().length >= 10
                          ? 'bg-[#D4AF37] hover:bg-yellow-500 text-black'
                          : 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                      }`}
                    >
                      LOCK REFLECTION & ENTER DECISION 3
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="phase-4-selection"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full max-w-4xl bg-[#090909] border border-white/10 rounded-sm p-6 md:p-8 shadow-2xl space-y-6 text-left"
                >
                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.25em] font-bold block">
                      PHASE 04 : DECISION 2
                    </span>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-white uppercase">
                      The Apartment Selection
                    </h1>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase block tracking-wider font-bold">
                      Split Comparison:
                    </span>
                    <h2 className="text-lg font-sans text-neutral-300 leading-normal">
                      Select where you will reside. High transit vs High financial load.
                    </h2>
                  </div>

                  {/* Dynamic Apple-Ed + FT styled custom SVG Apartment Comparison vector */}
                  <SVGApartmentComparison />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Premium */}
                    <button
                      onClick={() => {
                        sounds.playValidationChime();
                        setDecision2('PREMIUM');
                      }}
                      className={`p-5 text-left border rounded-sm transition-all focus:outline-none relative cursor-pointer ${
                        decision2 === 'PREMIUM'
                          ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-white shadow-[0_0_15px_rgba(212,175,55,0.08)]'
                          : 'bg-white/5 border-white/5 text-neutral-400 hover:border-neutral-500'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-mono text-[#D4AF37] border border-[#D4AF37]/35 px-2 py-0.5 rounded-sm uppercase font-bold">
                          Premium Option
                        </span>
                        {decision2 === 'PREMIUM' && <Check className="w-4 h-4 text-[#D4AF37]" />}
                      </div>
                      <h3 className="text-xl font-display font-bold text-white mb-2">Premium Apartment</h3>
                      
                      <div className="space-y-2 border-t border-white/5 pt-3 mb-3 text-xs font-sans">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Rent Charge:</span>
                          <strong className="text-white font-bold">Rent: ₹18,000</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Commute Time:</span>
                          <strong className="text-emerald-400 font-bold">10 Minutes From Office</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Standard:</span>
                          <strong className="text-white">Modern Lifestyle</strong>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans mt-2">
                        Secures physical comfort, networking readiness, robust sleep, and premium focus after tedious office shifts. Instantly structures a heavy monthly deficit.
                      </p>
                    </button>

                    {/* Practical */}
                    <button
                      onClick={() => {
                        sounds.playValidationChime();
                        setDecision2('PRACTICAL');
                      }}
                      className={`p-5 text-left border rounded-sm transition-all focus:outline-none relative cursor-pointer ${
                        decision2 === 'PRACTICAL'
                          ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-white shadow-[0_0_15px_rgba(212,175,55,0.08)]'
                          : 'bg-white/5 border-white/5 text-neutral-400 hover:border-neutral-500'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-mono text-[#D4AF37] font-bold border border-[#D4AF37]/20 px-2 py-0.5 rounded-sm uppercase">
                          Practical Option
                        </span>
                        {decision2 === 'PRACTICAL' && <Check className="w-4 h-4 text-[#D4AF37]" />}
                      </div>
                      <h3 className="text-xl font-display font-bold text-white mb-2">Practical Apartment</h3>
                      
                      <div className="space-y-2 border-t border-white/5 pt-3 mb-3 text-xs font-sans">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Rent Charge:</span>
                          <strong className="text-[#10B981] font-bold">Rent: ₹9,000</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Commute Time:</span>
                          <strong className="text-[#DB4455] font-bold">45 Minutes From Office</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Standard:</span>
                          <strong className="text-white">More Savings</strong>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans mt-2">
                        Saves crucial cash monthly. Generates a deep safety moat. However, subjects the young graduate to grueling, long transit exhaustion cycles.
                      </p>
                    </button>
                  </div>

                  {/* COGNITIVE ASSUMPTION TASK AS TEAM ASSUMPTION ENGINE */}
                  {decision2 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 border-t border-white/10 pt-4"
                    >
                      <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-4 rounded-sm space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                          <label className="text-[10px] font-mono text-[#D4AF37] uppercase block tracking-widest font-black">
                            🧠 TEAM ASSUMPTION ENGINE
                          </label>
                        </div>
                        <p className="text-[11px] text-neutral-400 font-sans">
                          Every housing choice makes severe demands on other resources. Articulate your team's belief:
                        </p>
                        <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-300 font-bold">
                          <span>We believe that</span>
                          <span className="border-b border-[#D4AF37]/45 flex-1 inline-block pb-0.5">
                            <input
                              type="text"
                              value={decision2Assumption.startsWith('We believe that ') ? decision2Assumption.substring(16) : decision2Assumption}
                              onChange={(e) => {
                                const val = e.target.value;
                                setDecision2Assumption('We believe that ' + val);
                              }}
                              placeholder="e.g. comfort offsets cash deficit / we will not face emergency / commuting exhaustion is manageable..."
                              className="w-full bg-transparent border-none text-white focus:outline-none placeholder-neutral-600 font-mono text-xs px-1"
                            />
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 pt-1">
                          <span>Write carefully: Simulation 2 will attack your team assumption directly!</span>
                        </div>
                      </div>

                      {/* HIGH AGENCY: RISK LEAD CHECKPOINT */}
                      <div className="bg-black/45 border border-white/10 p-4 rounded-sm space-y-3">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${d2RoleApproved ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                            <span className="text-[10px] font-mono text-white uppercase tracking-widest font-bold">
                              🛡️ ROLE CHECKPOINT: RISK LEAD
                            </span>
                          </div>
                          <span className="text-[9px] font-mono bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 px-2 py-0.5 rounded-sm uppercase tracking-wide">
                            Active Role: Hidden Danger Finder
                          </span>
                        </div>

                        <p className="text-xs text-neutral-300 leading-normal font-sans">
                          Before authorizing housing contract <strong className="text-white">"{decision2}"</strong>, the <strong className="text-[#D4AF37]">Risk Lead</strong> must evaluate: <span className="italic text-neutral-400">What could go wrong with this selection under extreme external stress?</span>
                        </p>

                        {assignedRoleId === 'RISK_LEAD' ? (
                          <div className="space-y-3">
                            <textarea
                              rows={2}
                              value={d2RoleInput}
                              onChange={(e) => setD2RoleInput(e.target.value)}
                              placeholder="As Risk Lead, analyze the danger (e.g. 'If a family member needs hospital support, our high rent will instantly trigger debt cascade...')"
                              className="w-full bg-neutral-950 border border-white/10 rounded-sm p-2.5 text-xs text-white focus:border-[#D4AF37] outline-none font-sans"
                            />
                            <button
                              onClick={() => {
                                if (d2RoleInput.trim().length >= 5) {
                                  sounds.playValidationChime();
                                  setD2RoleApproved(true);
                                }
                              }}
                              disabled={d2RoleInput.trim().length < 5}
                              className="w-full py-2 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-black font-mono text-[11px] font-extrabold uppercase tracking-widest hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer rounded-xs"
                            >
                              {d2RoleApproved ? "✓ Decison Risk Authorized" : "Authorize Risk Assessment"}
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="bg-black/60 p-3 border border-white/5 rounded text-neutral-400 font-mono text-[11.5px] italic leading-relaxed space-y-1">
                              <div>
                                Risk Lead Danger Evaluation:
                              </div>
                              {d2RoleInput ? (
                                <p className="text-white text-xs not-italic">"{d2RoleInput}"</p>
                              ) : (
                                <p className="text-neutral-500 text-xs">Waiting for Hidden Danger Finder (Risk Lead) to formulate risk analysis...</p>
                              )}
                            </div>

                            {!d2RoleApproved ? (
                              <div className="flex gap-2">
                                <div className="flex-1 text-[10px] font-mono text-neutral-500 flex items-center justify-center italic bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-sm">
                                  Consult team Hidden Danger Finder to lock choices.
                                </div>
                                <button
                                  onClick={() => {
                                    sounds.playValidationChime();
                                    setD2RoleInput("Risk analysis completed. Potential financial risk vectors flagged.");
                                    setD2RoleApproved(true);
                                  }}
                                  className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37] text-[10.5px] font-mono text-neutral-300 hover:text-white rounded transition-colors uppercase tracking-wider font-bold cursor-pointer"
                                >
                                  ⚡ Override Checkpoint
                                </button>
                              </div>
                            ) : (
                              <div className="text-center py-1.5 bg-emerald-950/20 border border-emerald-900/35 rounded text-[11px] font-mono font-bold text-emerald-400">
                                ✓ Risk Lead Checkpoint Completed
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Discussion controls */}
                  <div className="bg-white/5 border border-white/10 p-3.5 rounded-sm flex flex-wrap gap-2 items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase block font-bold">APARTMENT SELECTION HUDDLE</span>
                      <p className="text-xs text-neutral-400">Host guidance: Run 60 Seconds debate on lifestyle comfort vs. cash cushion.</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startTimer(60, "COMFORT VS CAPITAL DEBATE")}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm font-mono text-[9px] text-white font-bold uppercase cursor-pointer"
                      >
                        60S DEBATE
                      </button>
                      <button
                        onClick={() => startTimer(30, "LOCKED DECISION")}
                        className="px-3 py-1.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/30 rounded-sm font-mono text-[9px] text-[#D4AF37] font-bold uppercase cursor-pointer"
                      >
                        30S VOTE
                      </button>
                    </div>
                  </div>

                  {/* Bottom Nav */}
                  <div className="pt-4 flex justify-between border-t border-white/10">
                    <button
                      onClick={handlePrevPhase}
                      className="font-mono text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest font-bold cursor-pointer"
                    >
                      ← DECISION 1
                    </button>
                    <button
                      onClick={() => {
                        sounds.playValidationChime();
                        setShowSpotlightExchange(true);
                      }}
                      disabled={!decision2 || !decision2Assumption.trim() || !d2RoleApproved}
                      className={`px-8 py-3 rounded-sm font-bold tracking-wider text-xs uppercase transition-all font-mono cursor-pointer ${
                        decision2 && decision2Assumption.trim() && d2RoleApproved
                          ? 'bg-white hover:bg-[#D4AF37] hover:text-black text-black'
                          : 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                      }`}
                    >
                      ENTER DECISION 3
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* PHASE 5: DECISION 3 - THE OPPORTUNITY */}
          {phase === 5 && (
            <motion.div
              key="phase-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl bg-[#090909] border border-white/10 rounded-sm p-6 md:p-8 shadow-2xl space-y-6 text-left"
            >
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.25em] font-bold block">
                  PHASE 05 : DECISION 3 (4 MIN)
                </span>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-white uppercase">
                  The Fast Money Opportunity
                </h1>
                <p className="text-xs text-neutral-500 font-mono">SCENE: Six months have passed. You are settling into your new life. One evening you receive a message.</p>
              </div>

              {/* Dynamic Apple-Ed + FT styled custom SVG Fast Money Opportunity vector */}
              <SVGFastMoneyOpportunity />

              {/* Combined Scam Notification layout */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-sm p-4 space-y-3 font-sans relative">
                <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-red-500/10 px-2 py-0.5 rounded-sm border border-red-500/20 text-[8px] font-mono font-bold text-red-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  NEW MESSAGE
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-[#D4AF37] uppercase border-b border-white/5 pb-2">
                  <span className="font-bold">💬 SENDER: CLAN COUSIN / PEER</span>
                  <span className="text-neutral-500 mr-20">SECURED MESSAGE</span>
                </div>
                
                <div className="space-y-2 py-1">
                  <p className="text-neutral-400 text-xs font-mono">MESSAGE:</p>
                  <blockquote className="text-sm font-sans text-neutral-100 leading-relaxed font-semibold italic border-l-2 border-[#D4AF37] pl-3">
                    &ldquo;Hey! I invested ₹20,000. Now it's worth ₹60,000. My mentor has a private opportunity. Only a few spots left. Want me to add your name?&rdquo;
                  </blockquote>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <span className="text-[9px] font-mono text-[#DB4455] uppercase tracking-widest block font-bold">
                    ⚠️ INSTANT CAPITAL RISK DETECTED
                  </span>
                  
                  <button
                    onClick={() => {
                      sounds.playTickingSound();
                      setShowD3Details(!showD3Details);
                    }}
                    className="px-3 py-1 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-[9px] font-mono text-[#D4AF37] hover:text-white rounded-sm uppercase tracking-wide transition-all cursor-pointer font-bold"
                  >
                    {showD3Details ? "Hide Details" : "View Details"}
                  </button>
                </div>

                {/* VIEW DETAILS DRAWER */}
                <AnimatePresence>
                  {showD3Details && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 p-4 bg-black border border-[#D4AF37]/35 rounded-sm space-y-3 text-xs font-sans">
                        <span className="text-[9px] font-mono text-[#D4AF37] tracking-widest uppercase font-bold block pb-1 border-b border-white/5">
                          SOLICITATION DOSSIER (METRICS REVEAL)
                        </span>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-0.5">
                            <span className="text-neutral-500 font-mono text-[9px] block">Company Name</span>
                            <strong className="text-neutral-300 font-semibold uppercase font-bold text-red-400">[ Not Available ]</strong>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-neutral-500 font-mono text-[9px] block">Registration Status</span>
                            <strong className="text-neutral-300 font-semibold uppercase font-bold text-red-400">[ Not Mentioned ]</strong>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-neutral-500 font-mono text-[9px] block">Returns Rate</span>
                            <strong className="text-emerald-400 font-semibold font-bold uppercase">₹60,000 Guaranteed</strong>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-neutral-500 font-mono text-[9px] block">Risk Disclosure</span>
                            <strong className="text-neutral-300 font-semibold uppercase font-bold text-red-400">[ Not Mentioned ]</strong>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-neutral-500 font-mono text-[9px] block">Verification Proof</span>
                            <strong className="text-[#D4AF37] font-semibold font-bold">Screenshots Only</strong>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-neutral-500 font-mono text-[9px] block">Time Urgency</span>
                            <strong className="text-rose-500 font-semibold animate-pulse font-bold">Join Before Midnight (Midnight Urgent)</strong>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block tracking-wider font-bold">
                  QUESTION:
                </span>
                <h2 className="text-base font-sans text-neutral-300 font-bold">
                  What does your team do? Select Option:
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'INVEST', title: 'Option A : INVEST IMMEDIATELY', desc: 'Secure the limited slot immediately. Do not lose the hyper-yield window.' },
                  { id: 'INVESTIGATE', title: 'Option B : INVESTIGATE FIRST', desc: 'Hold commitment. Query registration numbers, risks, and credentials.' },
                  { id: 'IGNORE', title: 'Option C : IGNORE COMPLETELY', desc: 'Dismiss the pitch entirely. Keep base funds locked in stable buffers.' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sounds.playValidationChime();
                      setDecision3(opt.id as any);
                    }}
                    className={`p-4 text-left border rounded-sm transition-all focus:outline-none cursor-pointer ${
                      decision3 === opt.id
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-white shadow-[0_0_15px_rgba(212,175,55,0.08)]'
                        : 'bg-white/5 border-white/5 text-neutral-400 hover:border-neutral-500'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9.5px] font-mono text-[#D4AF37] font-bold">{opt.title}</span>
                      {decision3 === opt.id && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    </div>
                    <p className="text-xs text-neutral-400 leading-normal font-sans">{opt.desc}</p>
                  </button>
                ))}
              </div>

              {/* MANDATORY EVIDENCE */}
              {decision3 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2 border-t border-white/10 pt-4"
                >
                  <label className="text-[10px] font-mono text-[#D4AF37] uppercase block tracking-wide font-bold">
                    MANDATORY TEAM RESPONSE: How did you check the facts? (Maximum 20 Words)
                  </label>
                  <textarea
                    rows={2}
                    value={decision3Evidence}
                    onChange={(e) => {
                      const words = e.target.value.trim().split(/\s+/);
                      if (words.length <= 20 || e.target.value.length < decision3Evidence.length) {
                        setDecision3Evidence(e.target.value);
                      }
                    }}
                    placeholder="We didn't check any facts, we just saw a message from friends... Or we searched for registered credentials..."
                    className="w-full bg-black border border-white/15 focus:border-[#D4AF37] rounded-sm p-3 text-xs text-white outline-none font-sans resize-none leading-relaxed"
                  />
                  <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500">
                    <span>Write down what facts or proof you have. If you have no proof, write that honestly.</span>
                    <span className={decision3Evidence.trim().split(/\s+/).filter(Boolean).length >= 18 ? 'text-amber-500 font-bold animate-pulse' : ''}>
                      {decision3Evidence.trim().split(/\s+/).filter(Boolean).length}/20 words
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Timer widgets */}
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-sm flex flex-wrap gap-2 items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase block font-bold">DISCUSSION (90 SECONDS)</span>
                  <p className="text-xs text-neutral-400">Intelligent teams spend allocation time evaluating the lack of credible metrics.</p>
                </div>
                <button
                  onClick={() => startTimer(90, "RISK APPRAISAL HUDDLE")}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm font-mono text-[10px] font-bold text-white uppercase cursor-pointer"
                >
                  START 90S RUN
                </button>
              </div>

              {/* CTA */}
              <div className="pt-4 flex justify-between border-t border-white/10">
                <button
                  onClick={handlePrevPhase}
                  className="font-mono text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest font-bold cursor-pointer"
                >
                  ← DECISION 2
                </button>
                <button
                  onClick={handleNextPhase}
                  disabled={!decision3 || !decision3Evidence.trim()}
                  className={`px-8 py-3 rounded-sm font-bold tracking-wider text-xs uppercase transition-all font-mono cursor-pointer ${
                    decision3 && decision3Evidence.trim()
                      ? 'bg-white hover:bg-[#D4AF37] hover:text-black text-black shadow-[0_0_15px_rgba(215,175,55,0.1)]'
                      : 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                  }`}
                >
                  LOCK FUTURE
                </button>
              </div>
            </motion.div>
          )}

          {/* PHASE 6: FUTURE LOCK */}
          {phase === 6 && (
            <motion.div
              key="phase-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-xl bg-black border border-neutral-900 rounded-sm p-10 text-center space-y-10 shadow-2xl relative"
            >
              <div className="flex justify-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="p-6 bg-neutral-950 border border-neutral-800 rounded-full inline-flex text-white"
                >
                  <Lock className="w-8 h-8 text-[#D4AF37]" />
                </motion.div>
              </div>

              <div className="space-y-6 max-w-sm mx-auto font-mono text-sm leading-relaxed tracking-wider">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-neutral-300"
                >
                  Three decisions recorded.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="text-neutral-300"
                >
                  Three assumptions recorded.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.8 }}
                  className="text-[#D4AF37] font-bold"
                >
                  Your future has been created.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.8 }}
                  className="text-neutral-500 italic text-xs"
                >
                  Pause.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 4.8 }}
                  className="text-white font-bold tracking-[0.25em] uppercase text-xs"
                >
                  Life will now respond.
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
                  ENTER what matters now
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* PHASE 7: CONSEQUENCE REVEAL */}
          {phase === 7 && (
            <motion.div
              key="phase-7"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-3xl bg-[#090909] border border-white/10 rounded-sm p-6 md:p-10 shadow-2xl space-y-8 text-left"
            >
              <div className="text-center space-y-2 border-b border-white/10 pb-6">
                <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase font-bold block">
                  PHASE 07 : TIMELINE DEVIATION REVEAL
                </span>
                <h1 className="text-3xl font-display font-bold text-white">
                  The Consequence Reveal
                </h1>
                <p className="text-xs text-neutral-400 font-sans max-w-lg mx-auto">
                  Thinking deeply about how small choices affect your life years later is the best way to learn and make smarter moves next time.
                </p>
              </div>

              {/* Dynamic Apple-Ed + FT styled custom SVG Future Timeline vector */}
              <SVGFutureTimeline />

              {/* Chronological Timeline bento layout */}
              <div className="space-y-6">
                
                {/* Year 1 */}
                <div className="border border-white/5 hover:border-white/15 bg-black/40 p-5 rounded-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-sm">
                      YEAR 1
                    </span>
                    <span className="text-neutral-500 font-mono text-[10px]">COGNITIVE HORIZON 1</span>
                  </div>
                  <p className="font-sans text-neutral-300 text-sm leading-relaxed">
                    {getYearOneStory()}
                  </p>
                </div>

                {/* Year 3 */}
                <div className="border border-white/5 hover:border-white/15 bg-black/40 p-5 rounded-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-sm">
                      YEAR 3
                    </span>
                    <span className="text-neutral-500 font-mono text-[10px]">FINANCIAL STRESS INDUCTION</span>
                  </div>
                  <p className="font-sans text-neutral-300 text-sm leading-relaxed">
                    {getYearThreeStory()}
                  </p>
                </div>

                {/* Year 5 */}
                <div className="border border-white/5 hover:border-white/15 bg-black/40 p-5 rounded-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-sm">
                      YEAR 5
                    </span>
                    <span className="text-neutral-500 font-mono text-[10px]">SCAM PROTOCOL RESOLUTION</span>
                  </div>
                  <p className="font-sans text-neutral-300 text-sm leading-relaxed">
                    {getYearFiveStory()}
                  </p>
                </div>

                {/* FUTURE REVEAL INTRO */}
                <div className="bg-[#D4AF37]/5 border-y border-[#D4AF37]/20 p-5 text-center space-y-2 rounded-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(212,175,55,0.05)_0%,transparent_75%)] pointer-events-none" />
                  <span className="text-[9px] font-mono text-[#D4AF37] tracking-[0.2em] uppercase font-bold block">
                    OUR REVEAL: THE APARTMENT
                  </span>
                  <h2 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight leading-snug">
                    &ldquo;The apartment itself is not important. The assumption is.&rdquo;
                  </h2>
                  <p className="text-xs text-neutral-400 font-sans max-w-xl mx-auto leading-relaxed">
                    Your choice on where to live shows what your team values most. Whether you picked a cheap room or a fancy flat, you chose to give up something in return.
                  </p>
                </div>

                 {/* Team Reflective Inquiry Card */}
                <div className="border border-[#D4AF37]/35 bg-[#D4AF37]/5 p-6 rounded-sm space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
                  
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <HelpCircle className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-[#D4AF37] tracking-widest uppercase">
                      CRITICAL INTROSPECTIVE REFLECTIONS
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
                    {/* Reflection 1 */}
                    <div className="space-y-2 md:border-r md:border-white/5 md:pr-4 last:border-0 last:pr-0 text-left">
                      <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">
                        DECISION 1 : THE FIRST SALARY
                      </span>
                      <h3 className="font-display font-medium text-sm text-white leading-relaxed italic">
                        &ldquo;{getReflectionQuestion().d1}&rdquo;
                      </h3>
                    </div>

                    {/* Reflection 2 */}
                    <div className="space-y-2 md:border-r md:border-white/5 md:pr-4 last:border-0 last:pr-0 text-left">
                      <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold font-bold">
                        DECISION 2 : THE APARTMENT DECISION
                      </span>
                      <h3 className="font-display font-medium text-sm text-[#D4AF37] leading-relaxed italic">
                        &ldquo;{getReflectionQuestion().d2}&rdquo;
                      </h3>
                    </div>

                    {/* Reflection 3 */}
                    <div className="space-y-2 text-left">
                      <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">
                        DECISION 3 : FAST MONEY SOLICITATION
                      </span>
                      <h3 className="font-display font-medium text-sm text-emerald-400 leading-relaxed italic">
                        &ldquo;{getReflectionQuestion().d3}&rdquo;
                      </h3>
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-400 font-sans leading-relaxed pt-2 border-t border-white/5">
                    Take a moment with your teammates to talk about these questions. They will help you share what you learned with the class in the next phase.
                  </p>
                </div>

                {/* Core Learning Takeaway Card */}
                <div className="border border-white/10 bg-neutral-900/40 p-6 rounded-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-widest uppercase font-bold">
                      CORE SIMULATION TRUTHS
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-sans font-bold text-white tracking-tight leading-snug">
                      &ldquo;Every rupee spent today cannot be spent tomorrow. Every choice creates a trade-off.&rdquo;
                    </h3>
                    <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                      Your decisions have fixed financial consequences. By prioritizing early status / comfort or forcing a frugal daily grind, you directly altered your subsequent capacity to face economic, professional, or medical stresses.
                    </p>
                  </div>
                </div>

              </div>

              {/* Bottom Nav CTA */}
              <div className="pt-4 flex justify-between">
                <button
                  onClick={handlePrevPhase}
                  className="font-mono text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest font-bold cursor-pointer"
                >
                  ← BACK
                </button>
                <button
                  onClick={handleNextPhase}
                  className="px-8 py-3 bg-[#D4AF37] hover:bg-yellow-500 text-black font-semibold tracking-wider text-xs uppercase rounded-sm transition-all cursor-pointer font-mono font-bold"
                >
                  ENTER DECISION LENS (PHASE 8)
                </button>
              </div>
            </motion.div>
          )}

          {/* PHASE 8: EXPERT LESSON FINDER */}
          {phase === 8 && (
            <motion.div
              key="phase-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-3xl bg-[#090909] border border-white/10 rounded-sm p-6 md:p-8 shadow-2xl space-y-6 text-left"
            >
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.25em] font-bold block">
                  PHASE 08 : EXPERT LESSON FINDER (5 MIN)
                </span>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-white uppercase">
                  What We Learned From Today
                </h1>
                <p className="text-xs text-neutral-400 font-sans">
                  Here are the four common mistakes people make that get in the way of making good life decisions.
                </p>
              </div>

              {/* Dynamic Apple-Ed + FT styled custom SVG Expert Decision Intelligence Lens vector */}
              <SVGExpertDecisionLens />

              {/* 4 Concepts rigorously mapped */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-sans text-sm">
                
                {/* Concept 1 */}
                <div className="p-5 border border-white/5 bg-black/40 rounded-sm space-y-2">
                  <span className="text-[10px] font-mono text-[#D4AF37] block uppercase tracking-widest font-bold">
                    MISTAKE 01 : FOCUSING ONLY ON TODAY
                  </span>
                  <strong className="text-base text-white block font-sans font-bold">You focused on today.</strong>
                  <span className="text-neutral-500 block font-sans font-bold">You ignored tomorrow.</span>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans mt-2">
                    Our minds love immediate rewards (like a new gadget or fancy flat) and find it easy to ignore the long-term consequences that show up years later.
                  </p>
                </div>

                {/* Concept 2 */}
                <div className="p-5 border border-white/5 bg-black/40 rounded-sm space-y-2">
                  <span className="text-[10px] font-mono text-[#D4AF37] block uppercase tracking-widest font-bold">
                    MISTAKE 02 : FEAR OF MISSING OUT (FOMO)
                  </span>
                  <strong className="text-base text-white block font-sans font-bold">You feared missing out.</strong>
                  <span className="text-neutral-500 block font-sans font-bold">More than being wrong.</span>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans mt-2">
                    The panic of watching your friends grab something makes you want to jump in right away without checking if it is safe.
                  </p>
                </div>

                {/* Concept 3 */}
                <div className="p-5 border border-white/5 bg-black/40 rounded-sm space-y-2">
                  <span className="text-[10px] font-mono text-[#D4AF37] block uppercase tracking-widest font-bold">
                    MISTAKE 03 : FOLLOWING THE CROWD
                  </span>
                  <strong className="text-base text-white block font-sans font-bold">Others believed it.</strong>
                  <span className="text-neutral-500 block font-sans font-bold">So you believed it.</span>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans mt-2">
                    Just because everyone else in your circle is doing something, we assume it is the right move without checking the facts ourselves.
                  </p>
                </div>

                {/* Concept 4 */}
                <div className="p-5 border border-white/5 bg-black/40 rounded-sm space-y-2">
                  <span className="text-[10px] font-mono text-[#D4AF37] block uppercase tracking-widest font-bold">
                    MISTAKE 04 : TRUSTING WITHOUT PROOF
                  </span>
                  <strong className="text-base text-white block font-sans font-bold">You trusted the person.</strong>
                  <span className="text-neutral-500 block font-sans font-bold">Not the evidence.</span>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans mt-2">
                    We trust someone just because they are older or a family member, and we forget to ask basic questions or look at the actual facts.
                  </p>
                </div>

              </div>

              {/* Bottom huddle timers */}
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-sm flex flex-wrap gap-2 items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase block font-bold">LEADERSHIP HUDDLE TIME</span>
                  <p className="text-xs text-neutral-400 font-sans">Host recommendation: Dedicate 5 Minutes total for structured conceptual huddle.</p>
                </div>
                <button
                  onClick={() => startTimer(300, "EXPERT BIAS DEBRIEF")}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm font-mono text-[10px] text-white uppercase cursor-pointer font-bold"
                >
                  START 5 MINS DEBRIEF
                </button>
              </div>

              {/* Bottom Nav */}
              <div className="pt-4 flex justify-between border-t border-white/10">
                <button
                  onClick={handlePrevPhase}
                  className="font-mono text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest font-bold cursor-pointer"
                >
                  ← BACK
                </button>
                <button
                  onClick={handleNextPhase}
                  className="px-8 py-3 bg-white hover:bg-[#D4AF37] hover:text-black text-black font-semibold tracking-wider text-xs uppercase rounded-sm transition-all cursor-pointer font-mono font-bold"
                >
                  ENTER BOARDROOM DEFENSE (PHASE 9)
                </button>
              </div>
            </motion.div>
          )}

          {/* PHASE 9: BOARDROOM DEFENSE */}
          {phase === 9 && (
            <motion.div
              key="phase-9"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl bg-[#090909] border border-white/10 rounded-sm p-6 md:p-8 shadow-2xl space-y-6 text-left"
            >
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.25em] font-bold block">
                  PHASE 09 : SHARE AND EXPLAIN (30S PITCH)
                </span>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-white uppercase font-bold">
                  Explain Your Choice
                </h1>
                <p className="text-xs text-[#BCBCBC] font-sans">
                  Each team gets exactly 30 seconds to explain their final choice to the class.
                </p>
              </div>

              {/* Dynamic Apple-Ed + FT styled custom SVG Boardroom Defense tactical dome vector */}
              <SVGBoardroomDefense />

              {/* Presentation Board Template Block */}
              <div className="bg-neutral-950 border border-[#D4AF37]/35 rounded-sm p-6 space-y-5 font-sans relative shadow-[0_0_20px_rgba(212,175,55,0.04)]">
                
                <span className="absolute top-2 right-3 text-[8px] font-mono text-[#D4AF37] border border-[#D4AF37]/30 px-1.5 py-0.5 uppercase tracking-wide rounded-sm font-bold">
                  Team Presentation Guide
                </span>

                <div className="space-y-4 text-xs font-sans">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 block uppercase font-bold">We chose our focus:</span>
                    <strong className="text-[#F5F5F5] text-sm block border-b border-white/10 pb-1 font-bold">
                      {decision1 || "NOT LOCKED"}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 block uppercase font-bold">Because of this defense:</span>
                    <p className="text-neutral-300 text-xs block border-b border-white/10 pb-1 font-sans">
                      {decision1Why || "..."}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 block uppercase font-bold font-bold">Our underlying assumption was:</span>
                    <p className="text-neutral-300 text-xs block border-b border-white/10 pb-1 font-sans">
                      {decision2Assumption || "..."}
                    </p>
                  </div>
                </div>

              </div>

              {/* Pitch timers */}
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-sm flex flex-wrap gap-2 items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase block font-bold">INDIVIDUAL ROOM INTERVAL</span>
                  <p className="text-xs text-neutral-400">Trigger exactly 30 Seconds for high-intensity board pitch.</p>
                </div>
                <button
                  onClick={() => startTimer(30, "30S BOARDROOM PITCH")}
                  className="px-4 py-2 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/35 rounded-sm font-mono text-[9px] uppercase font-bold cursor-pointer"
                >
                  START 30S PITCH RUN
                </button>
              </div>

              {/* Bottom Nav */}
              <div className="pt-4 flex justify-between border-t border-white/10">
                <button
                  onClick={handlePrevPhase}
                  className="font-mono text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest font-bold cursor-pointer"
                >
                  ← BACK
                </button>
                <button
                  onClick={handleNextPhase}
                  className="px-8 py-3 bg-white hover:bg-[#D4AF37] hover:text-black text-black font-semibold tracking-wider text-xs uppercase rounded-sm transition-all cursor-pointer font-mono font-bold"
                >
                  ENTER REFLECTION
                </button>
              </div>
            </motion.div>
          )}

          {/* PHASE 10: REFLECTION JOURNAL */}
          {phase === 10 && (
            <motion.div
              key="phase-10"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl bg-[#090909] border border-white/10 rounded-sm p-6 md:p-8 shadow-2xl space-y-6 text-left"
            >
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.25em] font-bold block">
                  PHASE 10 : INDIVIDUAL DIARY PROTOCOL
                </span>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-white uppercase">
                  Personal Reflection
                </h1>
                <p className="text-xs text-neutral-400">
                  Reflect on the common traps and mistakes you noticed during this simulation.
                </p>
              </div>

              {!reflectionCompleted ? (
                <div className="space-y-4 font-sans text-sm">
                  
                  {/* Q1 */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wide block font-bold">
                      1. What surprised me?
                    </label>
                    <textarea
                      rows={2}
                      value={reflectionSurprised}
                      onChange={(e) => setReflectionSurprised(e.target.value)}
                      placeholder="E.g., I was surprised by how fast I agreed to the cousin's investment proposal..."
                      className="w-full bg-black border border-white/15 focus:border-[#D4AF37] rounded-sm p-3 text-xs text-white outline-none font-sans resize-none"
                    />
                  </div>

                  {/* Q2 */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wide block font-bold">
                      2. What assumption failed?
                    </label>
                    <textarea
                      rows={2}
                      value={reflectionFailed}
                      onChange={(e) => setReflectionFailed(e.target.value)}
                      placeholder="E.g., Believing that we could easily handle a super long commute every day..."
                      className="w-full bg-black border border-white/15 focus:border-[#D4AF37] rounded-sm p-3 text-xs text-white outline-none font-sans resize-none"
                    />
                  </div>

                  {/* Q3 */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wide block font-bold">
                      3. What would I do differently?
                    </label>
                    <textarea
                      rows={2}
                      value={reflectionDifferently}
                      onChange={(e) => setReflectionDifferently(e.target.value)}
                      placeholder="E.g., I would ask to check the actual facts and proof myself next time..."
                      className="w-full bg-black border border-white/15 focus:border-[#D4AF37] rounded-sm p-3 text-xs text-white outline-none font-sans resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        sounds.playValidationChime();
                        setReflectionCompleted(true);
                      }}
                      disabled={!reflectionSurprised.trim() || !reflectionFailed.trim() || !reflectionDifferently.trim()}
                      className={`w-full py-3 rounded-sm font-bold tracking-widest text-xs uppercase transition-all font-mono cursor-pointer ${
                        reflectionSurprised.trim() && reflectionFailed.trim() && reflectionDifferently.trim()
                          ? 'bg-[#D4AF37] hover:bg-yellow-500 text-black shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                          : 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                      }`}
                    >
                      COMMIT TO ARCHIVES
                    </button>
                  </div>

                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 text-center py-4"
                >
                  <div className="flex justify-center">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-full inline-flex text-emerald-400">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold block">
                      ARCHIVE PROTOCOL SECURE
                    </span>
                    <h2 className="text-2xl font-display font-semibold text-white">
                      Reflection Complete
                    </h2>
                  </div>

                  {/* SIMULATION 1 SUCCESS CRITERIA TEXT BOX */}
                  <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/30 p-6 rounded-sm space-y-4 max-w-lg mx-auto">
                    <strong className="text-sm font-sans text-neutral-300 font-bold block">
                      REYOU LEARNING SUCCESS VERDICT:
                    </strong>
                    <blockquote className="font-display font-bold text-lg md:text-xl text-[#F5F5F5] leading-relaxed">
                      &ldquo;I didn't realize my assumptions were driving my decisions.&rdquo;
                    </blockquote>
                    <p className="text-[11px] font-sans text-[#D4AF37] uppercase tracking-wider font-bold">
                      ★ IMMERSION SUCCESSFUL ★
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col gap-3.5 max-w-sm mx-auto">
                    {!isSim2Deployed ? (
                      <div className="w-full bg-neutral-900/40 border border-neutral-800/60 p-5 rounded-xs space-y-3.5 text-center shadow-[inset_0_1px_3px_rgba(255,255,255,0.02)] backdrop-blur-xs">
                        <div className="flex justify-center items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
                          <span className="font-mono text-[9px] text-[#D4AF37] uppercase tracking-[0.25em] font-extrabold">
                            AWAITING BATCH SIGNAL
                          </span>
                        </div>
                        <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider">
                          Simulation Compliant
                        </h3>
                        <p className="text-[10.5px] text-neutral-400 leading-relaxed font-sans max-w-xs mx-auto">
                          Your reflection journal is secure. Remaining cohort terminals are finalizing compliance reviews. Stand by for the facilitator's signal.
                        </p>
                        
                        {/* Custom calming animation */}
                        <div className="pt-2.5 flex flex-col items-center gap-2 border-t border-white/5">
                          <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest font-extrabold">
                            COGNITIVE CALM ZONE
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-[#D4AF37]/50 animate-bounce delay-100" />
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                            <span className="w-1 h-1 rounded-full bg-[#D4AF37]/50 animate-bounce delay-300" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      onComplete && (
                        <button
                          onClick={() => {
                            sounds.playValidationChime();
                            onComplete();
                          }}
                          className="w-full py-3.5 text-black bg-[#D4AF37] hover:bg-yellow-500 rounded-sm font-mono text-xs uppercase tracking-wider font-extrabold cursor-pointer text-center shadow-[0_0_15px_rgba(212,175,55,0.2)] animate-bounce"
                        >
                          PROCEED TO SIMULATION 2 →
                        </button>
                      )
                    )}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          sounds.playTickingSound();
                          setReflectionCompleted(false);
                        }}
                        className="flex-1 py-3 text-neutral-400 bg-white/5 border border-white/10 hover:bg-white/10 rounded-sm font-mono text-xs uppercase tracking-wider font-bold cursor-pointer text-center"
                      >
                        EDIT JOURNAL
                      </button>
                      <button
                        onClick={resetEngagement}
                        className="flex-1 py-3 text-black bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-sm font-mono text-xs uppercase tracking-wider font-bold cursor-pointer text-center"
                      >
                        RESET SYSTEM
                      </button>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* Bottom control */}
              {!reflectionCompleted && (
                <div className="pt-2 flex justify-between border-t border-white/10">
                  <button
                    onClick={handlePrevPhase}
                    className="font-mono text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest font-bold cursor-pointer"
                  >
                    ← BACK
                  </button>
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* PERSISTENT FACILITATOR DRAWER */}
      <AnimatePresence>
        {showObserverFeed && (
          <motion.div
            initial={{ opacity: 0, x: 260 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 260 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-[#070707] border-l border-white/15 z-50 p-6 flex flex-col justify-between shadow-2xl font-mono"
          >
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                  Observer Feed Panel
                </span>
                <button
                  onClick={() => {
                    sounds.playTickingSound();
                    setShowObserverFeed(false);
                  }}
                  className="text-neutral-500 hover:text-white transition-colors cursor-pointer text-xs"
                >
                  [CLOSE]
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="bg-white/5 p-2.5 rounded-sm">
                  <span className="text-[9px] text-neutral-500 uppercase block font-bold">Current Participant</span>
                  <strong className="text-white font-bold block mt-0.5">{userName || "Anonymous Guest"}</strong>
                </div>

                <div className="bg-white/5 p-2.5 rounded-sm">
                  <span className="text-[9px] text-[#D4AF37] uppercase block font-bold">Assigned Fellowship Profile</span>
                  <strong className="text-white font-bold block mt-0.5">{profile.teamName}</strong>
                </div>

                <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-3 rounded-sm space-y-1">
                  <span className="text-[9px] text-[#D4AF37] uppercase block tracking-wider font-bold">LOCKED BOARD VALUES:</span>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">1. Salary Allocation:</span>
                      <strong className="text-[#F5F5F5] font-bold">{decision1 || "PENDING..."}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">2. Living Selection:</span>
                      <strong className="text-[#F5F5F5] font-bold">{decision2 || "PENDING..."}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">3. Venture Proposal:</span>
                      <strong className="text-[#F5F5F5] font-bold">{decision3 || "PENDING..."}</strong>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <span className="text-[9px] text-neutral-500 uppercase block font-bold mb-2">SYSTEM CONSTRAINTS</span>
                  <p className="text-[11px] font-sans text-neutral-400 leading-normal">
                    This simulation lets you make 3 core Decisions and see what happens to your state in the future. Perfect for a 20-minute class session!
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/5">
              <button
                onClick={resetEngagement}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-sm border border-white/10 uppercase text-[9px] font-bold tracking-widest cursor-pointer font-mono"
              >
                Reset Simulation
              </button>
              <p className="text-[8px] text-neutral-700 text-center uppercase tracking-widest leading-none">
                BUILD REYOU-S1 v1.40
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROGRESS TRACKER NAV FOOTER */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-4 mt-6 text-[10px] font-mono tracking-widest text-[#D4AF37]">
        <div className="flex items-center gap-1.5 mb-2 md:mb-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-neutral-500 uppercase">SYS BROADROOM ENGAGED</span>
        </div>
        
        {/* Step dots */}
        <div className="flex items-center gap-1.5 mb-2 md:mb-0">
          {Array.from({ length: 10 }).map((_, i) => {
            const num = i + 1;
            return (
              <button
                key={i}
                onClick={() => {
                  sounds.playTickingSound();
                  setPhase(num);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  phase === num
                    ? 'w-8 bg-[#D4AF37]'
                    : phase > num
                    ? 'w-2.5 bg-white'
                    : 'w-2 bg-neutral-800 hover:bg-neutral-500'
                }`}
                title={`Jump to Phase ${num}`}
              />
            );
          })}
        </div>

        <div className="text-neutral-500 font-bold uppercase">
           First Paycheck Challenge
        </div>
      </footer>

      {/* REAL-TIME FACILITATOR BROADCAST BANNER (APPLE EDUCATION + FT STYLE) */}
      <AnimatePresence>
        {showBroadcastToast && broadcastedReflection && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-neutral-950/95 backdrop-blur-md border border-[#D4AF37] p-5 shadow-[0_12px_40px_rgba(212,175,55,0.2)] rounded-xs space-y-3 font-sans relative"
            id="facilitator-broadcast-card"
          >
            {/* Elegant Amber Glow corner accent */}
            <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none rounded-tr-xs overflow-hidden">
              <div className="absolute top-[-10px] right-[-10px] w-16 h-16 bg-[#D4AF37]/25 blur-md" />
            </div>

            <div className="flex justify-between items-center pb-1.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block font-black">
                  🚨 COHORT BROADCAST
                </span>
              </div>
              
              <button
                onClick={() => { sounds.playClickSound(); setShowBroadcastToast(false); }}
                className="text-neutral-500 hover:text-white transition-colors text-xs font-mono px-1.5 py-0.5 hover:bg-white/10 rounded-xs"
                title="Dismiss spotlight memo"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-100 font-medium italic leading-relaxed font-serif">
              "{broadcastedReflection.text}"
            </p>

            <div className="flex justify-between items-center text-[10px] font-mono pb-0.5">
              <span className="text-[#D4AF37] font-bold">
                💡 Peer Wisdom: {broadcastedReflection.author}
              </span>
              <span className="text-neutral-400 text-[8px] bg-white/5 px-1.5 py-0.5 rounded-sm">
                PROJECTED
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
