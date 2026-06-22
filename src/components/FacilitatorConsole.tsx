import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Layers, 
  Activity, 
  Play, 
  Pause, 
  Compass, 
  MessageSquare, 
  Zap, 
  Send, 
  Sparkles, 
  Award, 
  ArrowRight,
  RefreshCw,
  Eye,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
  Radio,
  Lock,
  Unlock,
  AlertCircle,
  Terminal,
  Target,
  Clock,
  Volume2
} from 'lucide-react';
import { sounds } from '../utils/audio';
import PrincipalConsole from './PrincipalConsole';
import CohortImportCenter, { GeneratedCohortTeam } from './CohortImportCenter';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  saveFileToFolder, 
  findFolderByName, 
  createFolder, 
  listFilesFromFolder,
  DriveFile
} from '../utils/googleWorkspace';
import { generateSchoolReportHTML } from '../utils/reportGenerator';
import { User } from 'firebase/auth';
import {
  Cloud,
  Upload,
  Download,
  FolderPlus,
  Folder,
  Share2,
  ExternalLink
} from 'lucide-react';


// Extended Team interface representing cohesive psychological profile dimensions & interactive operations
interface FacilitatorTeam {
  id: string;
  name: string;
  profileName: string;
  status: 'Active' | 'Idle' | 'Reflecting';
  discussion: 'Low' | 'Moderate' | 'High';
  activeAssumption: string;
  activeBias: string;
  cuePrompt: string;
  
  // Custom metrics for the new Team Health Monitor & Nudge Engines
  healthStatus: 'Engaged' | 'Thinking' | 'Stuck' | 'Disconnected';
  lastActivityTime: number; // Unix epoch seconds
  timeline: { time: string; event: string }[];
}

const DEFAULT_TIMELINES: Record<string, { time: string; event: string }[]> = {
  TEAM_ALPHA: [
    { time: '11:05', event: 'Discussion Started' },
    { time: '11:07', event: 'Vote Submitted: Option A' },
    { time: '11:08', event: 'Assumption Recorded: Comfort creates success' },
    { time: '11:10', event: 'Reflection Submitted' }
  ],
  TEAM_BRAVO: [
    { time: '11:06', event: 'Discussion Started' },
    { time: '11:08', event: 'Budget Calculation Formulated' },
    { time: '11:11', event: 'Debt Risk Flag Encountered' }
  ],
  TEAM_CHARLIE: [
    { time: '11:05', event: 'Discussion Started' },
    { time: '11:07', event: 'Mathematical Scenario Formed' },
    { time: '11:12', event: 'Strategic Alignment Vote Locked' }
  ],
  TEAM_DELTA: [
    { time: '11:04', event: 'Discussion Started' },
    { time: '11:09', event: 'Action Prompt Triggered' }
  ],
  TEAM_ECHO: [
    { time: '11:05', event: 'Discussion Started' },
    { time: '11:10', event: 'Family Fallacy Question Debated' }
  ],
  TEAM_FOXTROT: [
    { time: '11:06', event: 'Discussion Started' },
    { time: '11:12', event: 'Defensive Strategy Active' }
  ],
  TEAM_GOLF: [
    { time: '11:05', event: 'Simulation Joined' },
    { time: '11:10', event: 'No activity detected (System Flagged)' }
  ],
  TEAM_HOTEL: [
    { time: '11:05', event: 'Discussion Started' },
    { time: '11:08', event: 'Value Paradigm Selected' }
  ],
  TEAM_INDIA: [
    { time: '11:05', event: 'Discussion Started' },
    { time: '11:06', event: 'Option B Pre-selected' },
    { time: '11:09', event: 'Assumption Submitted: Rapid Scaling' }
  ],
  TEAM_JULIET: [
    { time: '11:05', event: 'Discussion Started' },
    { time: '11:08', event: 'FOMO Counterbalance Active' }
  ],
};

const INITIAL_COHORT_TEAMS: FacilitatorTeam[] = [
  { 
    id: 'TEAM_ALPHA', name: 'Jhansi', profileName: 'Responsible Son', status: 'Active', discussion: 'Moderate', 
    activeAssumption: 'Comfort Creates Success', activeBias: 'Comfort Trap / Present Bias', cuePrompt: 'What happens if you are wrong?',
    healthStatus: 'Engaged', lastActivityTime: Date.now() - 5000, timeline: DEFAULT_TIMELINES.TEAM_ALPHA
  },
  { 
    id: 'TEAM_BRAVO', name: 'Bhagat', profileName: 'Education Loan Graduate', status: 'Active', discussion: 'High', 
    activeAssumption: 'Debt is Forever', activeBias: 'Hope Strategy / Optimism Bias', cuePrompt: 'What are you giving up?',
    healthStatus: 'Stuck', lastActivityTime: Date.now() - 50000, timeline: DEFAULT_TIMELINES.TEAM_BRAVO
  },
  { 
    id: 'TEAM_CHARLIE', name: 'Chanakya', profileName: 'Strategic Planner', status: 'Active', discussion: 'High', 
    activeAssumption: 'Capital Accumulation First', activeBias: 'Over-indexing on Math Heuristic', cuePrompt: 'Is numbers the only reality?',
    healthStatus: 'Engaged', lastActivityTime: Date.now() - 4000, timeline: DEFAULT_TIMELINES.TEAM_CHARLIE
  },
  { 
    id: 'TEAM_DELTA', name: 'Azad', profileName: 'Lifestyle Upgrader', status: 'Active', discussion: 'Low', 
    activeAssumption: 'Fast Decisions Create Fast Results', activeBias: 'Action Bias / Present Trap', cuePrompt: 'What evidence supports this?',
    healthStatus: 'Thinking', lastActivityTime: Date.now() - 25000, timeline: DEFAULT_TIMELINES.TEAM_DELTA
  },
  { 
    id: 'TEAM_ECHO', name: 'Netaji', profileName: 'Family Pillar', status: 'Active', discussion: 'Moderate', 
    activeAssumption: 'Security is Shared', activeBias: 'Sunk Cost Family Fallacy', cuePrompt: 'Have you verified with the group?',
    healthStatus: 'Engaged', lastActivityTime: Date.now() - 10000, timeline: DEFAULT_TIMELINES.TEAM_ECHO
  },
  { 
    id: 'TEAM_FOXTROT', name: 'Patel', profileName: 'Stability Seeker', status: 'Active', discussion: 'Low', 
    activeAssumption: 'I Can Save Later', activeBias: 'Vigilance Bias', cuePrompt: 'Is waiting the safest strategy?',
    healthStatus: 'Stuck', lastActivityTime: Date.now() - 45000, timeline: DEFAULT_TIMELINES.TEAM_FOXTROT
  },
  { 
    id: 'TEAM_GOLF', name: 'Kalam', profileName: 'Future Builder', status: 'Active', discussion: 'Low', 
    activeAssumption: 'Skills Outpound Money', activeBias: 'Frugal Stagnation Trap', cuePrompt: 'What resource is most limited here?',
    healthStatus: 'Disconnected', lastActivityTime: Date.now() - 85000, timeline: DEFAULT_TIMELINES.TEAM_GOLF
  },
  { 
    id: 'TEAM_HOTEL', name: 'Vivekananda', profileName: 'Purpose Driven', status: 'Active', discussion: 'Moderate', 
    activeAssumption: 'Meaning Generates Assets', activeBias: 'Avoidance of Math', cuePrompt: 'How do you measure value?',
    healthStatus: 'Thinking', lastActivityTime: Date.now() - 15000, timeline: DEFAULT_TIMELINES.TEAM_HOTEL
  },
  { 
    id: 'TEAM_INDIA', name: 'Shivaji', profileName: 'Ambitious Achiever', status: 'Active', discussion: 'High', 
    activeAssumption: 'Speed is Security', activeBias: 'Careless Acceleration Bias', cuePrompt: 'Are you overlooking small details?',
    healthStatus: 'Engaged', lastActivityTime: Date.now() - 2000, timeline: DEFAULT_TIMELINES.TEAM_INDIA
  },
  { 
    id: 'TEAM_JULIET', name: 'Bose', profileName: 'Opportunity Chaser', status: 'Active', discussion: 'Moderate', 
    activeAssumption: 'Catch Every Wave', activeBias: 'Fear of Missing Out (FOMO)', cuePrompt: 'Are you building or channelling?',
    healthStatus: 'Thinking', lastActivityTime: Date.now() - 30000, timeline: DEFAULT_TIMELINES.TEAM_JULIET
  },
];

const INITIAL_REFLECTIONS = [
  { id: 1, author: "Priya (Team Bhagat)", text: "I realized I was choosing comfort without thinking about consequences." },
  { id: 2, author: "Raj (Team Azad)", text: "I trusted the person instead of checking evidence." },
  { id: 3, author: "Sarah (Team Jhansi)", text: "Under pressure, urgency replaced checking. I made key decisions without verifying the papers." },
  { id: 4, author: "Amit (Team Chanakya)", text: "Numbers looked clean on paper, but real-world traps are hidden in the fine print." },
  { id: 5, author: "Kabir (Team Kalam)", text: "We were stagnating out of risk-aversion, but avoiding all exposure is itself a choice." }
];

export default function FacilitatorConsole() {
  const handleInteraction = () => {
    sounds.playClickSound();
  };

  const [activeTab, setActiveTab] = useState<'FACILITATOR' | 'PRINCIPAL'>('FACILITATOR');
  const [roomState, setRoomState] = useState<'NOMINAL' | 'STAGNANT' | 'DEBATING'>('STAGNANT');

  // Google Workspace State inside Facilitator Console
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [driveSyncStatus, setDriveSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [driveSyncMessage, setDriveSyncMessage] = useState<string>('');
  const [sharedFolderName, setSharedFolderName] = useState<string>('REYOU_Cohort_Performance_Hub');
  const [archivedFiles, setArchivedFiles] = useState<DriveFile[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastAutosaveTime, setLastAutosaveTime] = useState<string>('');

  // Fetch or find Folder & Files inside that Google Drive folder
  const fetchArchivedFiles = async (token: string, searchFolder: string = 'REYOU_Cohort_Performance_Hub') => {
    try {
      const folderId = await findFolderByName(searchFolder, token);
      if (folderId) {
        setCurrentFolderId(folderId);
        const files = await listFilesFromFolder(folderId, token);
        setArchivedFiles(files);
      } else {
        setArchivedFiles([]);
        setCurrentFolderId(null);
      }
    } catch (err) {
      console.error('Failed to pre-fetch files:', err);
    }
  };

  // Sync state with preflown storage setup on mount and track Google User
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
        fetchArchivedFiles(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
        setArchivedFiles([]);
        setCurrentFolderId(null);
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
        fetchArchivedFiles(result.accessToken);
        setTimeout(() => {
          setDriveSyncStatus('idle');
          setDriveSyncMessage('');
        }, 4000);
      }
    } catch (err: any) {
      console.error(err);
      setDriveSyncStatus('error');
      setDriveSyncMessage(`Authentication Failed: ${err.message || err}`);
    }
  };

  const handleGoogleLogOut = async () => {
    sounds.playClickSound();
    await logout();
    setGoogleUser(null);
    setGoogleToken(null);
    setArchivedFiles([]);
    setCurrentFolderId(null);
    setDriveSyncStatus('idle');
    setDriveSyncMessage('Successfully disconnected account.');
    setTimeout(() => setDriveSyncMessage(''), 4000);
  };



  
  // Cohort live metrics, load from cache if exists
  const [teams, setTeams] = useState<FacilitatorTeam[]>(() => {
    const cached = localStorage.getItem('reyou-imported-cohort-full');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Cache parsing exception in FacilitatorConsole", e);
      }
    }
    return INITIAL_COHORT_TEAMS;
  });
  const [selectedTeamId, setSelectedTeamId] = useState<string>('TEAM_GOLF'); // Select Kalam by default as it is Very Quiet
  const [simulationPaused, setSimulationPaused] = useState<boolean>(false);
  const [currentPhase, setCurrentPhase] = useState<number>(3); // Phase 3/10
  const [phaseTitle, setPhaseTitle] = useState<string>("THE APARTMENT DECISION");
  const [liveAlertMessage, setLiveAlertMessage] = useState<string | null>(null);
  
  // Reflection Stream
  const [reflections, setReflections] = useState(INITIAL_REFLECTIONS);
  const [spotlightedReflection, setSpotlightedReflection] = useState<any>(INITIAL_REFLECTIONS[0]);
  const [showEndScreen, setShowEndScreen] = useState<boolean>(false);

  // Inactivity alerts state
  const [inactivityAlerts, setInactivityAlerts] = useState<{
    id: string;
    teamId: string;
    teamName: string;
    stage: string;
    aiPrompt: string;
    loading: boolean;
  }[]>([]);

  // --- NVIDIA CO-PILOT SYSTEM INTEGRATION ---
  const [teamAnalysis, setTeamAnalysis] = useState<{
    discussionStatus: string;
    suggestedNudges: string[];
    coachAdvice: string;
    recoveryChallenge: string;
  } | null>(null);
  const [loadingTeamAnalysis, setLoadingTeamAnalysis] = useState<boolean>(false);

  const [phaseSummary, setPhaseSummary] = useState<{
    mostCommonChoice: string;
    mostCommonMistake: string;
    mostInterestingReflection: string;
    mostDividedTeam: string;
  } | null>(null);
  const [loadingPhaseSummary, setLoadingPhaseSummary] = useState<boolean>(false);

  const fetchTeamAnalysis = async (team: FacilitatorTeam) => {
    setLoadingTeamAnalysis(true);
    try {
      const response = await fetch("/api/reports/team-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName: team.name,
          healthStatus: team.healthStatus || 'Engaged',
          discussionLevel: team.discussion || 'Moderate',
          activeAssumption: team.activeAssumption,
          activeBias: team.activeBias,
          currentPhase: currentPhase
        })
      });
      const data = await response.json();
      if (data.success && data.report) {
        setTeamAnalysis(data.report);
      }
    } catch (err) {
      console.error("NVIDIA live team analysis failed:", err);
    } finally {
      setLoadingTeamAnalysis(false);
    }
  };

  const handleGeneratePhaseSummary = async () => {
    setLoadingPhaseSummary(true);
    try {
      const teamsSummaryStr = teams.map(t => `- Team ${t.name} (${t.profileName}): Status=${t.healthStatus}, Active Assumption="${t.activeAssumption}"`).join("\n");
      const response = await fetch("/api/reports/phase-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phaseIndex: currentPhase,
          phaseTitle: phaseTitle,
          teamsData: teamsSummaryStr
        })
      });
      const data = await response.json();
      if (data.success && data.report) {
        setPhaseSummary(data.report);
      }
    } catch (err) {
      console.error("NVIDIA phase summary failed:", err);
    } finally {
      setLoadingPhaseSummary(false);
    }
  };

  // Fetch on selection change
  useEffect(() => {
    const selectedTeam = teams.find(t => t.id === selectedTeamId);
    if (selectedTeam) {
      fetchTeamAnalysis(selectedTeam);
    }
  }, [selectedTeamId]);

  const handleFullCohortExportToDrive = async () => {
    if (!googleToken) {
      alert("Please connect Google Drive first.");
      return;
    }
    sounds.playClickSound();
    setDriveSyncStatus('syncing');
    setDriveSyncMessage('Scanning for/creating custom shared folder in your Google Drive...');

    try {
      // 1. Find or create the target folder
      let folderId = currentFolderId;
      if (!folderId) {
        folderId = await findFolderByName(sharedFolderName, googleToken);
        if (!folderId) {
          folderId = await createFolder(sharedFolderName, googleToken);
        }
        setCurrentFolderId(folderId);
      }

      // Formulate detailed export payload
      const exportTimestamp = new Date().toISOString();
      const exportId = `REYOU_COHORT_${Date.now()}`;
      
      const payload = {
        meta: {
          exportId,
          exportedAt: exportTimestamp,
          currentPhase,
          phaseTitle,
          totalTeams: teams.length,
          roomState
        },
        simulationResults: teams.map(t => ({
          teamId: t.id,
          teamName: t.name,
          profileName: t.profileName,
          status: t.status,
          discussion: t.discussion,
          activeAssumption: t.activeAssumption,
          activeBias: t.activeBias,
          healthStatus: t.healthStatus,
          lastActivityTime: new Date(t.lastActivityTime).toISOString(),
          cuePrompt: t.cuePrompt
        })),
        teamActivityLogs: teams.map(t => ({
          teamId: t.id,
          teamName: t.name,
          logCount: t.timeline?.length || 0,
          events: t.timeline || []
        })),
        reflectionsStream: reflections,
        copilotInsights: teamAnalysis || {
          note: "No live analysis chunk loaded at time of save"
        }
      };

      // 1. Save Programmatic JSON file
      const jsonFilename = `${exportId}.json`;
      await saveFileToFolder(folderId, jsonFilename, payload, googleToken);

      // 2. Save Stunning HTML Document Report
      const htmlFilename = `REYOU_Executive_School_Report_${Date.now()}.html`;
      const htmlContent = generateSchoolReportHTML(
        {
          exportId,
          exportedAt: exportTimestamp,
          currentPhase,
          phaseTitle,
          roomState,
          schoolName: "Founder Academy Global Council"
        },
        teams as any,
        reflections as any,
        teamAnalysis
      );
      const res = await saveFileToFolder(folderId, htmlFilename, htmlContent, googleToken);

      if (res.success) {
        setDriveSyncStatus('success');
        setDriveSyncMessage(`Both documents saved! Saved programmatic JSON and gorgeous academic HTML Briefing inside Folder '${sharedFolderName}'.`);
        sounds.playValidationChime();
        fetchArchivedFiles(googleToken, sharedFolderName);
        setTimeout(() => {
          setDriveSyncStatus('idle');
          setDriveSyncMessage('');
        }, 6000);
      } else {
        throw new Error("Folder save procedure returned unsuccessful status");
      }
    } catch (err: any) {
      console.error(err);
      setDriveSyncStatus('error');
      setDriveSyncMessage(`Drive Folder upload failed: ${err.message || err}`);
    }
  };

  // Continuous Cloud-Sync Auto-pilot effect (10-second idle debounce to protect rate limits and provide real-time assurance)
  useEffect(() => {
    if (!googleToken) return;

    setAutosaveStatus('saving');
    const delayTimer = setTimeout(async () => {
      try {
        let folderId = currentFolderId;
        if (!folderId) {
          folderId = await findFolderByName(sharedFolderName, googleToken);
          if (!folderId) {
            folderId = await createFolder(sharedFolderName, googleToken);
          }
          setCurrentFolderId(folderId);
        }

        const exportTimestamp = new Date().toISOString();
        const exportId = `REYOU_AUTOSAVE_${Date.now()}`;
        
        const payload = {
          meta: {
            exportId,
            exportedAt: exportTimestamp,
            currentPhase,
            phaseTitle,
            totalTeams: teams.length,
            roomState,
            autoSynced: true
          },
          simulationResults: teams.map(t => ({
            teamId: t.id,
            teamName: t.name,
            profileName: t.profileName,
            status: t.status,
            discussion: t.discussion,
            activeAssumption: t.activeAssumption,
            activeBias: t.activeBias,
            healthStatus: t.healthStatus,
            lastActivityTime: new Date(t.lastActivityTime).toISOString(),
            cuePrompt: t.cuePrompt
          })),
          teamActivityLogs: teams.map(t => ({
            teamId: t.id,
            teamName: t.name,
            logCount: t.timeline?.length || 0,
            events: t.timeline || []
          })),
          reflectionsStream: reflections,
          copilotInsights: teamAnalysis || {
            note: "Continuous evaluation matrix snapshot"
          }
        };

        // Sync direct programmatic metrics
        await saveFileToFolder(folderId, `REYOU_AutoSync_LATEST_METRICS.json`, payload, googleToken);

        // Sync visual HTML report in real-time
        const htmlContent = generateSchoolReportHTML(
          {
            exportId,
            exportedAt: exportTimestamp,
            currentPhase,
            phaseTitle,
            roomState,
            schoolName: "Founder Academy Global Council"
          },
          teams as any,
          reflections as any,
          teamAnalysis
        );
        await saveFileToFolder(folderId, `REYOU_Interactive_School_Report_LATEST.html`, htmlContent, googleToken);

        setAutosaveStatus('saved');
        setLastAutosaveTime(new Date().toLocaleTimeString());
        
        // Quietly update the ledger of stored files
        fetchArchivedFiles(googleToken, sharedFolderName);
      } catch (err) {
        console.error("Autosaving failed dynamically:", err);
        setAutosaveStatus('error');
      }
    }, 10000); // 10s debounce for perfect interaction-aware optimization

    return () => clearTimeout(delayTimer);
  }, [teams, reflections, currentPhase, googleToken, currentFolderId, sharedFolderName, roomState]);

  // Simulation 2 deployment controller
  const [isSim2Deployed, setIsSim2Deployed] = useState<boolean>(() => {
    return localStorage.getItem('reyou-sim2-deployed') === 'true';
  });

  useEffect(() => {
    const handleInactivityNotification = async (payload: { teamId: string; stage: string; timestamp: number }) => {
      const { teamId, stage } = payload;
      const teamObj = INITIAL_COHORT_TEAMS.find(t => t.id === teamId);
      const teamName = teamObj ? teamObj.name : teamId.replace("TEAM_", "");

      // Avoid duplicates
      setInactivityAlerts(prev => {
        if (prev.some(a => a.teamId === teamId && a.stage === stage)) {
          return prev;
        }
        return [
          ...prev,
          {
            id: `${teamId}-${Date.now()}`,
            teamId,
            teamName,
            stage,
            aiPrompt: "Synthesizing dynamic rebound prompt for Team...",
            loading: true
          }
        ];
      });

      try {
        const response = await fetch("/api/reports/inactivity-reflection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamName, stage })
        });
        const data = await response.json();
        if (data.success && data.prompt) {
          setInactivityAlerts(prev =>
            prev.map(alert =>
              alert.teamId === teamId && alert.stage === stage
                ? { ...alert, aiPrompt: data.prompt, loading: false }
                : alert
            )
          );
        } else {
          throw new Error("Service error");
        }
      } catch (err) {
        console.error("AI inactivity reflection synthesis failed, applying failsafe:", err);
        setInactivityAlerts(prev =>
          prev.map(alert =>
            alert.teamId === teamId && alert.stage === stage
              ? {
                  ...alert,
                  aiPrompt: `Team ${teamName}! Imagine your current decision faces a full market correction tomorrow. What critical cash buffer or flexibility is your group ignoring right now?`,
                  loading: false
                }
              : alert
          )
        );
      }
    };

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
      if (e.key === 'reyou-team-inactivity' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          handleInactivityNotification(parsed);
        } catch (err) {}
      }
    };
    
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsSim2Deployed(customEvent.detail);
    };

    const handleSim1LockedEvent = (e: Event) => {
      setSim1Locked((e as CustomEvent).detail);
    };

    const handleSim2LockedEvent = (e: Event) => {
      setSim2Locked((e as CustomEvent).detail);
    };

    const handleCohortEvents = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setTeams(customEvent.detail);
      }
    };

    const handleInactivityCustom = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        handleInactivityNotification(customEvent.detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('reyou-sim2-deployed-changed', handleCustomEvent);
    window.addEventListener('reyou-sim1-locked-changed', handleSim1LockedEvent);
    window.addEventListener('reyou-sim2-locked-changed', handleSim2LockedEvent);
    window.addEventListener('reyou-cohort-imported', handleCohortEvents);
    window.addEventListener('reyou-team-inactivity-dispatch', handleInactivityCustom);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('reyou-sim2-deployed-changed', handleCustomEvent);
      window.removeEventListener('reyou-sim1-locked-changed', handleSim1LockedEvent);
      window.removeEventListener('reyou-sim2-locked-changed', handleSim2LockedEvent);
      window.removeEventListener('reyou-cohort-imported', handleCohortEvents);
      window.removeEventListener('reyou-team-inactivity-dispatch', handleInactivityCustom);
    };
  }, []);

  const handleToggleSim2Deploy = () => {
    const nextState = !isSim2Deployed;
    setIsSim2Deployed(nextState);
    localStorage.setItem('reyou-sim2-deployed', String(nextState));
    window.dispatchEvent(new CustomEvent('reyou-sim2-deployed-changed', { detail: nextState }));
    
    // Play sound and trigger message
    sounds.playValidationChime();
    setLiveAlertMessage(nextState 
      ? "🚀 SIMULATION 2 DEPLOYED! Student devices can now access the surprise stage." 
      : "⏸️ SIMULATION 2 REFRACTED. Next phase entry suspended."
    );
    setTimeout(() => setLiveAlertMessage(null), 4000);
  };

  const handleSimulateNewReflection = () => {
    const studentPool = ["Siddharth", "Meera", "Arjun", "Tanya", "Rohan", "Sonal", "Nikhil", "Aarav"];
    const selectedStudent = studentPool[Math.floor(Math.random() * studentPool.length)];
    const teamNames = ['Jhansi', 'Bhagat', 'Chanakya', 'Azad', 'Netaji', 'Patel', 'Kalam', 'Vivekananda', 'Shivaji', 'Bose'];
    const randomTeamName = teamNames[Math.floor(Math.random() * teamNames.length)];
    const insights = [
      "I realized I was choosing comfort without thinking about consequences.",
      "I trusted the person instead of checking evidence.",
      "Urgency bypassed our logic layer; we skipped contract steps under pressure.",
      "Investing in our team's core skill set is our real compounding equity.",
      "We traded long-term optionality for immediate status points.",
      "Verification must outperform fear. We skipped validation papers."
    ];
    const text = insights[Math.floor(Math.random() * insights.length)];
    const newRef = {
      id: Date.now(),
      author: `${selectedStudent} (Team ${randomTeamName})`,
      text: text
    };
    setReflections(prev => [newRef, ...prev.slice(0, 5)]);
    
    sounds.playClickSound();
    setLiveAlertMessage(`New reflection arrived from Team ${randomTeamName}`);
    setTimeout(() => setLiveAlertMessage(null), 3000);
  };

  // Format timestamp helper
  const getFormattedTime = () => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  // One-Click Nudge Dispatches
  const dispatchNudge = (teamId: string, promptText: string) => {
    handleInteraction();
    sounds.playValidationChime();
    
    const pulseData = {
      teamId,
      timestamp: Date.now(),
      prompt: promptText,
      roleId: null
    };
    localStorage.setItem('reyou-active-nudge', JSON.stringify(pulseData));
    window.dispatchEvent(new CustomEvent('reyou-active-nudge-dispatched', { detail: pulseData }));

    setTeams(prevTeams => 
      prevTeams.map(t => {
        if (t.id === teamId) {
          return {
            ...t,
            healthStatus: 'Engaged',
            lastActivityTime: Date.now(),
            timeline: [
              ...t.timeline,
              { time: getFormattedTime(), event: `Facilitator nudge sent: "${promptText}"` }
            ]
          };
        }
        return t;
      })
    );

    const teamObj = teams.find(t => t.id === teamId);
    setLiveAlertMessage(`⚡ NUDGE DISPATCHED! Sent thinking prompt to Team ${teamObj?.name || 'Unknown'}.`);
    setTimeout(() => setLiveAlertMessage(null), 3500);
  };

  // Role Activation Nudger
  const dispatchRoleActivation = (teamId: string, roleTitle: string, rolePrompt: string) => {
    handleInteraction();
    sounds.playValidationChime();

    const pulseData = {
      teamId,
      timestamp: Date.now(),
      prompt: rolePrompt,
      roleId: roleTitle
    };
    localStorage.setItem('reyou-active-nudge', JSON.stringify(pulseData));
    window.dispatchEvent(new CustomEvent('reyou-active-nudge-dispatched', { detail: pulseData }));

    setTeams(prevTeams => 
      prevTeams.map(t => {
        if (t.id === teamId) {
          return {
            ...t,
            healthStatus: 'Engaged',
            lastActivityTime: Date.now(),
            timeline: [
              ...t.timeline,
              { time: getFormattedTime(), event: `Role Activated: ${roleTitle} ("${rolePrompt}")` }
            ]
          };
        }
        return t;
      })
    );

    const teamObj = teams.find(t => t.id === teamId);
    setLiveAlertMessage(`🎯 ROLE ACTIVATED! Sent focus challenge to ${roleTitle} of Team ${teamObj?.name || 'Unknown'}.`);
    setTimeout(() => setLiveAlertMessage(null), 3500);
  };

  // Dynamic phase managers
  const getPhaseNudges = (phaseIndex: number): string[] => {
    if (phaseIndex <= 2) {
      return [
        "What matters most right now: comfort, security, family, or future? Why?",
        "If you could only protect one thing, what would it be?"
      ];
    } else if (phaseIndex === 3) {
      return [
        "What are you giving up by choosing comfort?",
        "Which choice gives you more future options?"
      ];
    } else if (phaseIndex <= 5) {
      return [
        "What evidence do you have?",
        "Would you still invest if your best friend was not involved?"
      ];
    } else if (phaseIndex <= 8) {
      return [
        "What is the first problem you must solve?",
        "What happens if you do nothing?"
      ];
    } else {
      return [
        "Which assumption failed?",
        "Did life surprise you or did your assumptions?"
      ];
    }
  };

  const getPhaseNameLabel = (phaseIndex: number): string => {
    if (phaseIndex <= 2) return "Decision 1: What Matters Most";
    if (phaseIndex === 3) return "Apartment Phase";
    if (phaseIndex <= 5) return "Fast Money Phase";
    if (phaseIndex <= 8) return "Simulation 2: Crisis Phase";
    return "Consequence Phase";
  };

  // Custom simulation switcher and lockers state
  const [selectedSim, setSelectedSim] = useState<'SIM_1' | 'SIM_2'>(() => {
    return localStorage.getItem('reyou-selected-sim') as 'SIM_1' | 'SIM_2' || 'SIM_1';
  });
  const [sim1Locked, setSim1Locked] = useState<boolean>(() => {
    return localStorage.getItem('reyou-sim1-locked') === 'true';
  });
  const [sim2Locked, setSim2Locked] = useState<boolean>(() => {
    return localStorage.getItem('reyou-sim2-locked') === 'true';
  });

  const handleSetSelectedSim = (sim: 'SIM_1' | 'SIM_2') => {
    handleInteraction();
    setSelectedSim(sim);
    localStorage.setItem('reyou-selected-sim', sim);
  };

  // Dynamic automatic team status evaluator & background traffic generator
  useEffect(() => {
    if (simulationPaused || showEndScreen) return;

    const interval = setInterval(() => {
      const now = Date.now();
      
      setTeams((prevTeams) => 
        prevTeams.map((t) => {
          const secsSecSinceActivity = (now - t.lastActivityTime) / 1000;
          let nextHealth = t.healthStatus;

          // Automatically decay states according to the 60-90 second rule
          if (secsSecSinceActivity > 85) {
            nextHealth = 'Disconnected';
          } else if (secsSecSinceActivity > 45) {
            nextHealth = 'Stuck';
          } else if (secsSecSinceActivity > 20) {
            nextHealth = 'Thinking';
          }

          // Random background simulation updates 
          // (students submitting assumptions, comments, or voting)
          const hasBackgroundActivity = Math.random() > 0.85;
          if (hasBackgroundActivity && t.healthStatus !== 'Disconnected') {
            const simulatedEvents = [
              "Assumptions reassessed locally",
              "Synthesized decision metrics updated",
              "Peer agreement reached",
              "Core risk criteria recalculated",
              "Drafted new team argument"
            ];
            const chosenEvent = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)];
            return {
              ...t,
              healthStatus: 'Engaged',
              lastActivityTime: now,
              timeline: [
                ...t.timeline,
                { time: getFormattedTime(), event: chosenEvent }
              ]
            };
          }

          if (nextHealth !== t.healthStatus) {
            const timeStr = getFormattedTime();
            let warningEvent = '';
            let recoveryChallenge = '';
            
            if (nextHealth === 'Stuck') {
              warningEvent = '⚠️ Inactivity alert: Team is Stuck (Nudge available)';
              recoveryChallenge = '⚡ REYOU Advisor Nudge: "Imagine this decision fails. What is the most likely reason?"';
            } else if (nextHealth === 'Disconnected') {
              warningEvent = '🛑 Warning: Inactivity limit reached. Team Disconnected.';
              recoveryChallenge = '⚡ REYOU Deck Recovery Challenge: "What secondary cost is your group ignoring right now?"';
            }
              
            return {
              ...t,
              healthStatus: nextHealth,
              timeline: [
                ...t.timeline,
                ...(warningEvent ? [{ time: timeStr, event: warningEvent }] : []),
                ...(recoveryChallenge ? [{ time: timeStr, event: recoveryChallenge }] : [])
              ]
            };
          }

          return t;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [simulationPaused, showEndScreen]);

  const handleSpotlight = (refItem: any) => {
    handleInteraction();
    sounds.playValidationChime();
    setSpotlightedReflection(refItem);
    
    // Broadcast via localStorage
    localStorage.setItem('reyou-broadcasted-reflection', JSON.stringify(refItem));
    window.dispatchEvent(new CustomEvent('reyou-reflection-broadcasted', { detail: refItem }));
    
    setLiveAlertMessage(`Spotlight active: Broadcasted ${refItem.author}'s comment to main projector.`);
    setTimeout(() => setLiveAlertMessage(null), 3000);
  };

  const triggerRestartSession = () => {
    handleInteraction();
    setShowEndScreen(false);
    setCurrentPhase(3);
    setPhaseTitle("THE APARTMENT DECISION");
    setRoomState('NOMINAL');
    setTeams(INITIAL_COHORT_TEAMS);
    setIsSim2Deployed(false);
    setSelectedSim('SIM_1');
    setSim1Locked(false);
    setSim2Locked(false);
    localStorage.setItem('reyou-sim2-deployed', 'false');
    localStorage.setItem('reyou-sim1-locked', 'false');
    localStorage.setItem('reyou-sim2-locked', 'false');
    localStorage.setItem('reyou-selected-sim', 'SIM_1');
    localStorage.setItem('reyou-student-screen-index', '0');
    window.dispatchEvent(new CustomEvent('reyou-sim2-deployed-changed', { detail: false }));
    window.dispatchEvent(new CustomEvent('reyou-sim1-locked-changed', { detail: false }));
    window.dispatchEvent(new CustomEvent('reyou-sim2-locked-changed', { detail: false }));
    window.dispatchEvent(new CustomEvent('reyou-student-screen-index-changed', { detail: 0 }));
  };

  // Selected Team Details
  const selectedTeamDetails = teams.find(t => t.id === selectedTeamId) || teams[0];

  return (
    <div className="min-h-screen bg-[#070707] text-[#E0E0E0] font-sans antialiased pb-16">
      
      {/* BRAND HEADER & REAL-TIME STATE CONTEXT */}
      <header className="border-b border-[#1A1A1A] bg-[#0E0E0E] px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#D4AF37] uppercase font-bold">
                REYOU EDUCATION
              </span>
            </div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">
              APS FOUNDER COHORT
            </h1>
            <div className="inline-block bg-[#161616] border border-[#262626] rounded-xs px-2 py-0.5 text-[9px] font-mono text-neutral-400 uppercase tracking-widest font-semibold mt-1">
              Batch 01
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 bg-[#141414] px-4 py-2 border border-[#222] rounded-xs">
              <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-white font-bold">50 Students Live</span>
            </div>
            <div className="flex items-center gap-2 bg-[#141414] px-4 py-2 border border-[#222] rounded-xs">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-white font-bold">10 Teams Active</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 border rounded-xs ${selectedSim === 'SIM_1' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20' : 'bg-rose-950/10 text-rose-400 border-rose-900/20'}`}>
              <Layers className="w-3.5 h-3.5" />
              <span className="font-bold">{selectedSim === 'SIM_1' ? 'Simulation 1' : 'Simulation 2'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* REYOU ARCHITECTURAL SIMULATION SWITCHER (CHANGE 1) */}
      <div className="border-b border-[#1A1A1A] bg-[#0A0A0A] px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex flex-wrap items-center gap-1.5 bg-black p-1 border border-[#1A1A1A] rounded-xs">
            <button
              onClick={() => {
                handleSetSelectedSim('SIM_1');
              }}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold rounded-xs transition-all cursor-pointer ${
                selectedSim === 'SIM_1'
                  ? 'bg-neutral-800 text-white font-black border border-neutral-700'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Simulation 1
            </button>

            <button
              onClick={() => {
                handleSetSelectedSim('SIM_2');
              }}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold rounded-xs transition-all cursor-pointer ${
                selectedSim === 'SIM_2'
                  ? 'bg-neutral-800 text-[#D4AF37] font-black border border-neutral-700'
                  : 'text-neutral-450 hover:text-white'
              }`}
            >
              Simulation 2
            </button>
 
            <div className="w-px h-5 bg-[#222] mx-1" />
 
            <button
              onClick={() => { handleInteraction(); setActiveTab('FACILITATOR'); }}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold rounded-xs transition-all cursor-pointer ${
                activeTab === 'FACILITATOR'
                  ? 'bg-[#D4AF37] text-black font-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Facilitator View
            </button>
            <button
              onClick={() => { handleInteraction(); setActiveTab('PRINCIPAL'); }}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold rounded-xs transition-all cursor-pointer ${
                activeTab === 'PRINCIPAL'
                  ? 'bg-[#D4AF37] text-black font-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Principal View
            </button>
          </div>
 
          {/* SIMULATION LOCKING CTA CONTROL CONTAINER (CHANGE 1) */}
          <div className="flex items-center gap-3">
            <div className="flex flex-wrap items-center gap-4 bg-[#0F0F0F] px-4 py-2 border border-[#1E1E1E] rounded-xs font-mono text-[10px]">
              
              {/* Simulation 1 Controllers */}
              <div className="flex items-center gap-2 border-r border-[#1C1C1C] pr-4">
                <span className="text-[#D4AF37] font-black tracking-wider text-[9px] uppercase">SIM 1:</span>
                <button
                  onClick={() => {
                    handleInteraction();
                    sounds.playValidationChime();
                    setSim1Locked(false);
                    localStorage.setItem('reyou-sim1-locked', 'false');
                    window.dispatchEvent(new CustomEvent('reyou-sim1-locked-changed', { detail: false }));
                    setLiveAlertMessage("▶️ SIMULATION 1 RUNNING / UNLOCKED");
                    setTimeout(() => setLiveAlertMessage(null), 3000);
                  }}
                  className={`px-3 py-1 text-[9.5px] font-black tracking-widest rounded-xs cursor-pointer transition-all uppercase border ${
                    !sim1Locked
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/35 shadow-[0_0_8px_rgba(16,185,129,0.1)]'
                      : 'bg-neutral-900/60 text-neutral-500 border-transparent hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  START
                </button>
                <button
                  onClick={() => {
                    handleInteraction();
                    sounds.playValidationChime();
                    setSim1Locked(true);
                    localStorage.setItem('reyou-sim1-locked', 'true');
                    window.dispatchEvent(new CustomEvent('reyou-sim1-locked-changed', { detail: true }));
                    setLiveAlertMessage("🔒 SIMULATION 1 LOCKED / SUSPENDED");
                    setTimeout(() => setLiveAlertMessage(null), 3000);
                  }}
                  className={`px-3 py-1 text-[9.5px] font-black tracking-widest rounded-xs cursor-pointer transition-all uppercase border ${
                    sim1Locked
                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/35 shadow-[0_0_8px_rgba(244,63,94,0.1)]'
                      : 'bg-neutral-900/60 text-neutral-500 border-transparent hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  LOCK
                </button>
              </div>

              {/* Simulation 2 Controllers */}
              <div className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-black tracking-wider text-[9px] uppercase">SIM 2:</span>
                <button
                  onClick={() => {
                    handleInteraction();
                    sounds.playValidationChime();
                    setIsSim2Deployed(true);
                    setSim2Locked(false);
                    localStorage.setItem('reyou-sim2-deployed', 'true');
                    localStorage.setItem('reyou-sim2-locked', 'false');
                    window.dispatchEvent(new CustomEvent('reyou-sim2-deployed-changed', { detail: true }));
                    window.dispatchEvent(new CustomEvent('reyou-sim2-locked-changed', { detail: false }));
                    setLiveAlertMessage("🚀 SIMULATION 2 RUNNING / DEPLOYED");
                    setTimeout(() => setLiveAlertMessage(null), 3000);
                  }}
                  className={`px-3 py-1 text-[9.5px] font-black tracking-widest rounded-xs cursor-pointer transition-all uppercase border ${
                    isSim2Deployed && !sim2Locked
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/35 shadow-[0_0_8px_rgba(16,185,129,0.1)]'
                      : 'bg-neutral-900/60 text-neutral-500 border-transparent hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  START
                </button>
                <button
                  onClick={() => {
                    handleInteraction();
                    sounds.playValidationChime();
                    setSim2Locked(true);
                    localStorage.setItem('reyou-sim2-locked', 'true');
                    window.dispatchEvent(new CustomEvent('reyou-sim2-locked-changed', { detail: true }));
                    setLiveAlertMessage("🔒 SIMULATION 2 LOCKED / SUSPENDED");
                    setTimeout(() => setLiveAlertMessage(null), 3000);
                  }}
                  className={`px-3 py-1 text-[9.5px] font-black tracking-widest rounded-xs cursor-pointer transition-all uppercase border ${
                    sim2Locked
                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/35 shadow-[0_0_8px_rgba(244,63,94,0.1)]'
                      : 'bg-neutral-900/60 text-neutral-500 border-transparent hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  LOCK
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* EVENT TRANSMISSIONS NOTIFIER BAR */}
      <AnimatePresence>
        {liveAlertMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#D4AF37] text-black px-8 py-2.5 text-center text-xs font-mono font-black border-b border-[#AA8310]"
          >
            📢 INSTANT FEEDBACK: {liveAlertMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-8 py-8">
        
        {activeTab === 'FACILITATOR' && (
          <div>
            
            {showEndScreen ? (
              /* INDEPENDENT FACILITATOR END SCREEN */
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto bg-[#0E0E0E] border border-[#1A1A1A] p-8 rounded-xs space-y-8"
              >
                <div className="text-center space-y-2 border-b border-[#1A1A1A] pb-6">
                  <div className="inline-flex p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-full text-[#D4AF37] mb-2">
                    <Award className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-display font-black text-white tracking-widest uppercase">
                    Cohort End Session Card
                  </h2>
                  <p className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
                    REYOU EDUCATION • BATCH 01 DEBRIEFING INDEX
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="p-5 bg-black border border-[#1C1C1E] rounded-xs space-y-1.5">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block font-bold">Most Common Bias</span>
                    <h3 className="text-base font-display font-bold text-white uppercase">Present Bias (Urgency Trap)</h3>
                    <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                      Students overwhelmingly traded long-term optionality for immediate status points, skipping contract verification under simulated countdown pressure.
                    </p>
                  </div>

                  <div className="p-5 bg-black border border-[#1C1C1E] rounded-xs space-y-1.5">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block font-bold">Most Common Assumption</span>
                    <h3 className="text-base font-display font-bold text-white uppercase">Comfort Creates Success</h3>
                    <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                      Widespread expectation that upgrading standard-of-living directly correlates with performance outcomes, justifying risky, high-leverage liabilities early.
                    </p>
                  </div>

                  <div className="p-5 bg-black border border-[#1C1C1E] rounded-xs space-y-1.5">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block font-bold">Most Active Team</span>
                    <h3 className="text-base font-display font-bold text-white uppercase">Team Shivaji</h3>
                    <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                      Maintained an exceptional level of dialogue and verified risk projections multiple levels ahead of other active profiles.
                    </p>
                  </div>

                  <div className="p-5 bg-black border border-[#1C1C1E] rounded-xs space-y-1.5">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block font-bold">Most Powerful Reflection</span>
                    <h3 className="text-base font-display font-bold text-white uppercase">Priya (Team Bhagat)</h3>
                    <p className="text-xs text-neutral-300 font-sans font-medium italic">
                      "The artificial countdown replaced verification with emotional action. I realized I was prioritizing comfort without thinking about consequences."
                    </p>
                  </div>

                </div>

                <div className="pt-4 flex justify-center gap-4 text-xs font-mono">
                  <button
                    onClick={triggerRestartSession}
                    className="px-6 py-3 border border-[#222] hover:bg-[#141414] text-white font-bold tracking-widest uppercase rounded-xs cursor-pointer transition-all"
                  >
                    Reset Cohort Session
                  </button>
                  <button
                    onClick={() => { handleInteraction(); setActiveTab('PRINCIPAL'); }}
                    className="px-6 py-3 bg-[#D4AF37] text-black font-black tracking-widest uppercase rounded-xs cursor-pointer hover:bg-yellow-500 transition-all"
                  >
                    Launch Principal Reports
                  </button>
                </div>

              </motion.div>
            ) : (
              /* THE TRIPLE COMMAND CENTER MAIN VIEW */
              <div className="space-y-8">

                {/* INACTIVITY ALERTS & AI REBOUND PROMPTS PANEL */}
                {inactivityAlerts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-neutral-950 border border-[#D4AF37]/50 rounded-xs space-y-4"
                  >
                    <div className="flex items-center gap-2 border-l-2 border-[#D4AF37] pl-3">
                      <span className="text-[10px] font-mono font-black text-[#D4AF37] tracking-widest uppercase">
                        ⚠️ LIVE INACTIVITY DEVIANCES DETECTED (AI REBOUND ADVISOR)
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {inactivityAlerts.map((alert) => (
                        <div 
                          key={alert.id}
                          className="p-4 bg-red-950/10 border border-[#D4AF37]/25 rounded-xs space-y-3 relative overflow-hidden"
                        >
                          <div className="flex justify-between items-start gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
                                <span className="text-xs font-mono font-extrabold text-white">
                                  TEAM {alert.teamName.toUpperCase()} IS STAGNANT
                                </span>
                              </div>
                              <p className="text-[11px] text-neutral-400 font-mono">
                                Stage: {alert.stage}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                sounds.playClickSound();
                                setInactivityAlerts(prev => prev.filter(a => a.id !== alert.id));
                              }}
                              className="text-neutral-500 hover:text-white font-mono text-[9px] uppercase cursor-pointer transition-all border border-neutral-850 hover:border-neutral-600 px-2 py-0.5"
                            >
                              [Clear]
                            </button>
                          </div>

                          <div className="bg-[#0A0A0A] border border-neutral-900 p-3 rounded-xs font-mono text-[11px] leading-relaxed">
                            {alert.loading ? (
                              <div className="flex items-center gap-2 text-[#D4AF37]">
                                <span className="inline-block w-3 h-3 rounded-full border-2 border-t-transparent border-[#D4AF37] animate-spin" />
                                <span className="animate-pulse">Synthesizing AI Breakout Prompt...</span>
                              </div>
                            ) : (
                              <div>
                                <span className="text-[9px] text-[#D4AF37] font-black tracking-widest block uppercase mb-1">
                                  ✦ DYNAMIC REBOUND PROMPT
                                </span>
                                <p className="text-neutral-250 font-sans italic leading-normal">
                                  "{alert.aiPrompt}"
                                </p>
                              </div>
                            )}
                          </div>

                          {!alert.loading && (
                            <button
                              onClick={() => {
                                dispatchNudge(alert.teamId, alert.aiPrompt);
                                setInactivityAlerts(prev => prev.filter(a => a.id !== alert.id));
                              }}
                              className="w-full py-2 bg-[#D4AF37] hover:bg-yellow-500 text-black font-mono font-bold text-[10px] uppercase tracking-wider rounded-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <span>⚡</span>
                              <span>INJECT PROMPT TO TEAM {alert.teamName.toUpperCase()}</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {/* COHORT IMPORT CENTER - FIRST MODULE OF THE FACILITATOR HUB */}
                <CohortImportCenter 
                  onCohortActivated={(generatedTeams) => {
                    const transformed = generatedTeams.map((it, idx) => ({
                      id: it.id,
                      name: it.name,
                      profileName: it.profileName,
                      status: it.status,
                      discussion: it.discussion,
                      activeAssumption: it.activeAssumption,
                      activeBias: it.activeBias,
                      cuePrompt: it.cuePrompt,
                      healthStatus: (['Engaged', 'Thinking', 'Stuck', 'Disconnected'][idx % 4]) as any,
                      lastActivityTime: Date.now() - (idx * 16000),
                      timeline: [
                        { time: getFormattedTime(), event: "Student cohort imported successfully." },
                        { time: getFormattedTime(), event: `Balanced REYOU team "${it.name}" formulated.` }
                      ]
                    }));
                    setTeams(transformed);
                    setLiveAlertMessage("🚀 COHORT RE-ACTIVATED! 10 balanced REYOU founder teams successfully deployed.");
                    setTimeout(() => setLiveAlertMessage(null), 4000);
                  }}
                />
                
                {/* GOOGLE DRIVE COHORT AGGREGATOR & ACTIVITY ARCHIVER - SCHOOL BOARD BRANDED */}
                <div id="drive-aggregator-panel" className="bg-[#0c0d10] border border-[#D4AF37]/30 p-6 rounded-xs space-y-6 relative overflow-hidden">
                  {/* Decorative background vectors for premium academic feel */}
                  <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none rounded-full blur-3xl -mr-20 -mt-20" />
                  
                  <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative z-10">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="p-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xs">
                          <Cloud className="w-5 h-5 text-[#D4AF37]" strokeWidth={2.5} />
                        </div>
                        <span className="text-xs font-mono font-black text-[#D4AF37] tracking-widest uppercase pb-[2px]">
                          FOUNDER ACADEMY CLOUD ARCHIVAL PLATFORM
                        </span>
                        
                        {/* Interactive Autosave Engine indicator */}
                        {googleUser && (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#0e1610] border border-emerald-900/40 rounded-full font-mono text-[9px]">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              autosaveStatus === 'saving' ? 'bg-amber-400 animate-pulse' :
                              autosaveStatus === 'saved' ? 'bg-emerald-450 animate-ping' :
                              autosaveStatus === 'error' ? 'bg-red-400' : 'bg-emerald-400 animate-pulse'
                            }`} />
                            <span className="text-neutral-400 uppercase tracking-wider">
                              AUTOPILOT: {' '}
                              <strong className={
                                autosaveStatus === 'saving' ? 'text-amber-400' :
                                autosaveStatus === 'saved' ? 'text-emerald-450' :
                                autosaveStatus === 'error' ? 'text-red-400' : 'text-emerald-400'
                              }>
                                {autosaveStatus === 'saving' ? 'SYNCS_ENGAGED' :
                                 autosaveStatus === 'saved' ? 'SECURED_OK' :
                                 autosaveStatus === 'error' ? 'SUSPENDED' : 'ARMED'}
                              </strong>
                            </span>
                            {lastAutosaveTime && (
                              <span className="text-neutral-500 font-normal">({lastAutosaveTime})</span>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-[12.5px] text-neutral-350 font-sans leading-relaxed max-w-4xl">
                        Autonomous cloud replication. Every phase update, student reflection, and team bias resolution triggers a debounced background sync. The system automatically creates two beautiful school records: a raw program database for programmatic analysis, and an executive standalone HTML performance briefing.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5 items-center shrink-0">
                      {googleUser ? (
                        <>
                          <button
                            onClick={handleFullCohortExportToDrive}
                            disabled={driveSyncStatus === 'syncing'}
                            className="px-4 py-2.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50 hover:border-[#D4AF37] font-mono text-[10px] font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                          >
                            <Upload className="w-4 h-4 text-[#D4AF37]" strokeWidth={2.5} />
                            <span>Export snapshot manually</span>
                          </button>

                          <button
                            onClick={handleGoogleLogOut}
                            className="px-3 py-2 text-neutral-500 hover:text-red-400 hover:bg-red-950/20 border border-neutral-900 font-mono text-[9px] font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer"
                          >
                            Disconnect
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleGoogleSignIn}
                          className="gsi-material-button text-xs"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#0a0b0d',
                            border: '1px solid rgba(212,175,55,0.45)',
                            padding: '12px 20px',
                            borderRadius: '1px',
                            cursor: 'pointer',
                            color: '#fff',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 600,
                            letterSpacing: '0.05em'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ width: '18px', height: '18px' }}>
                              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                              <path fill="none" d="M0 0h48v48H0z"></path>
                            </svg>
                            <span className="font-mono text-[10.5px] uppercase tracking-wider text-neutral-300 font-extrabold">Connect School Google Drive Directory</span>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>

                  {googleUser && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-5 border-t border-neutral-850 relative z-10">
                      
                      {/* Left: configuration widget */}
                      <div className="space-y-4 md:col-span-1 border-r border-neutral-900 pr-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold block tracking-wider">
                            TARGET SHARED DIRECTORY:
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={sharedFolderName}
                              onChange={(e) => setSharedFolderName(e.target.value.replace(/[^a-zA-Z0-9_\- ]/g, ''))}
                              placeholder="REYOU_Cohort_Performance_Hub"
                              className="flex-1 bg-black border border-neutral-800 rounded-xs text-xs font-mono text-white p-2.5 focus:border-[#D4AF37] focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                sounds.playClickSound();
                                if (googleToken) fetchArchivedFiles(googleToken, sharedFolderName);
                              }}
                              className="bg-neutral-900 hover:bg-[#151515] text-xs text-zinc-300 font-mono px-3.5 border border-neutral-800 active:scale-95 transition-all rounded-xs cursor-pointer"
                              title="Update target folder destination"
                            >
                              Set
                            </button>
                          </div>
                        </div>

                        {/* Informative educational mapping list */}
                        <div className="space-y-2 bg-[#08090a] p-3 border border-neutral-900 rounded-xs">
                          <span className="text-[9px] font-mono text-neutral-450 uppercase font-black tracking-widest block">
                            REPORT EXPORT MATRIX:
                          </span>
                          <div className="space-y-1.5 text-[10.5px] text-neutral-400 font-sans">
                            <div className="flex justify-between items-center">
                              <span>• Programmatic JSON:</span>
                              <span className="text-[#D4AF37] font-mono font-bold">RAWSTATE_DB</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>• Standing Academic HTML:</span>
                              <span className="text-[#D4AF37] font-mono font-bold">OECD_PORTFOLIO</span>
                            </div>
                            <div className="text-[9px] text-neutral-500 italic mt-1 leading-normal">
                              Fully printable, inline-styled elements with radar mapping. Suitable for PDF rendering & board aggregation.
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: archived list with directory header */}
                      <div className="md:col-span-3 space-y-2.5">
                        <span className="text-[10px] font-mono text-neutral-450 uppercase font-black block tracking-widest">
                          FOLDER ARCHIVE SECTORS LEDGER ({archivedFiles.length} file streams)
                        </span>
                        
                        {archivedFiles.length === 0 ? (
                          <div className="text-[11px] font-mono text-neutral-500 italic p-6 border border-dashed border-neutral-850 bg-black/40 rounded-xs text-center">
                            No active performance reports or auto-synchronized structures discovered inside '{sharedFolderName}'. Export manually or let the autopilot secure the workspace to start aggregation.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[190px] overflow-y-auto pr-1">
                            {archivedFiles.map((file) => {
                              const isHtml = file.name.endsWith('.html');
                              const isLatest = file.name.includes('_LATEST');
                              
                              return (
                                <div
                                  key={file.id}
                                  className={`flex justify-between items-center p-3 rounded-xs border transition-all font-mono text-[10.5px] ${
                                    isLatest ? 'bg-[#0f1115] border-[#D4AF37]/30 hover:border-[#D4AF37]/60' : 'bg-black/60 border-neutral-900 hover:border-neutral-800'
                                  }`}
                                >
                                  <div className="space-y-1.5 min-w-0 flex-1 truncate pr-3">
                                    <div className="flex items-center gap-1.5">
                                      {isHtml ? (
                                        <span className="px-1.5 py-0.5 text-[8px] bg-[#D4AF37]/10 text-[#D4AF37] rounded-xs font-black uppercase text-center scale-90 tracking-wider">
                                          HTML REPORT
                                        </span>
                                      ) : (
                                        <span className="px-1.5 py-0.5 text-[8px] bg-neutral-800 text-neutral-400 rounded-xs font-black uppercase text-center scale-90 tracking-wider">
                                          JSON DATA
                                        </span>
                                      )}
                                      
                                      {isLatest && (
                                        <span className="px-1 py-0.5 text-[8px] bg-emerald-950 text-emerald-400 rounded-xs font-bold text-center scale-90 tracking-widest">
                                          LIVE SYNC
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-zinc-200 block truncate font-semibold" title={file.name}>
                                      {file.name}
                                    </span>
                                    <span className="text-[9.5px] text-neutral-500 block">
                                      Secured: {new Date(file.modifiedTime).toLocaleString()}
                                    </span>
                                  </div>
                                  <a
                                    href={`https://drive.google.com/open?id=${file.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => sounds.playClickSound()}
                                    className="p-1.5 px-2 bg-[#D4AF37]/5 hover:bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/25 hover:border-[#D4AF37]/50 rounded-xs flex items-center gap-1 cursor-pointer shrink-0 transition-all text-[10px] font-bold"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>OPEN IN DRIVE</span>
                                  </a>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {driveSyncMessage && (
                    <div className={`p-4 rounded-xs border font-mono text-[11px] flex items-center justify-between select-none animate-fadeIn relative z-10 ${
                      driveSyncStatus === 'syncing' ? 'bg-[#12110d] border-yellow-800/30 text-[#D4AF37] border-l-2 border-l-[#D4AF37]' :
                      driveSyncStatus === 'success' ? 'bg-emerald-950/10 border-emerald-900/30 text-emerald-450 border-l-2 border-l-emerald-500' :
                      driveSyncStatus === 'error' ? 'bg-red-950/15 border-red-900/30 text-red-100 border-l-2 border-l-red-500' : 'bg-neutral-900/50 border-neutral-800 text-neutral-300'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        {driveSyncStatus === 'syncing' ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                        ) : driveSyncStatus === 'success' ? (
                          <span className="text-emerald-450 font-bold text-sm">✓</span>
                        ) : driveSyncStatus === 'error' ? (
                          <span className="text-red-400 font-bold text-sm">✕</span>
                        ) : null}
                        <span>{driveSyncMessage}</span>
                      </div>
                      <button 
                        onClick={() => setDriveSyncMessage('')}
                        className="text-neutral-500 hover:text-white font-bold cursor-pointer transition-all px-1.5"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* 3-COLUMN LAYOUT ALIGNED TO ARCHITECTURE PRINCIPLES */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* COLUMN 1: LIVE LEDGERS (SECTION 1 & SECTION 3) */}
                  <div className="space-y-6 lg:col-span-1">
                    
                    {/* SECTION 1: LIVE COHORT MAP (CHANGE 2) */}
                    <div id="cohort-map-section" className="bg-[#0E0E0E] border border-[#1A1A1A] p-6 rounded-xs space-y-4">
                      
                      <div className="border-b border-[#1A1A1A] pb-3 flex justify-between items-center">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">SECTION 1</span>
                          <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                            LIVE COHORT STATUS
                          </h2>
                        </div>
                        <span className="text-[9px] font-mono text-[#D4AF37] bg-[#D4AF37]/5 px-2.5 py-0.5 border border-[#D4AF37]/20 rounded-xs font-semibold uppercase tracking-widest">
                          COHORT CORE
                        </span>
                      </div>

                      <div className="text-[11px] text-neutral-400 font-mono leading-relaxed pb-2 border-b border-[#111]">
                        Observe student team status feed in real time:
                      </div>

                      {/* NO CARDS. NO CHARTS. A CLEAN LEDGER. (CHANGE 2) */}
                      <div className="space-y-2.5 font-mono text-xs">
                        {teams.map((teamItem) => {
                          const isSelected = selectedTeamId === teamItem.id;
                          const health = teamItem.healthStatus || 'Engaged';
                          
                          return (
                            <div
                              key={teamItem.id}
                              onClick={() => { handleInteraction(); setSelectedTeamId(teamItem.id); }}
                              className={`flex justify-between items-center py-2.5 px-3 border transition-all cursor-pointer rounded-xs ${
                                isSelected
                                  ? 'bg-[#151515] border-[#D4AF37] text-white shadow-[inset_0_0_10px_rgba(212,175,55,0.05)]'
                                  : 'bg-[#0A0A0A] border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-[#111]'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  health === 'Engaged' ? 'bg-emerald-500 animate-pulse' :
                                  health === 'Thinking' ? 'bg-amber-400' :
                                  health === 'Stuck' ? 'bg-orange-500 animate-ping' :
                                  'bg-rose-500'
                                }`} />
                                <span className="font-bold">{teamItem.name}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                {health === 'Engaged' && (
                                  <span className="text-[10px] text-emerald-400 bg-emerald-950/15 py-0.5 px-2 rounded border border-emerald-900/30 font-bold uppercase tracking-wider">
                                    🟢 Engaged
                                  </span>
                                )}
                                {health === 'Thinking' && (
                                  <span className="text-[10px] text-amber-400 bg-amber-950/15 py-0.5 px-2 rounded border border-amber-900/30 font-bold uppercase tracking-wider">
                                    🟡 Thinking
                                  </span>
                                )}
                                {health === 'Stuck' && (
                                  <span className="text-[10px] text-orange-400 bg-orange-950/20 py-0.5 px-2 rounded border border-orange-900/30 font-black uppercase tracking-wider animate-pulse">
                                    🟠 Stuck
                                  </span>
                                )}
                                {health === 'Disconnected' && (
                                  <span className="text-[10px] text-rose-400 bg-rose-950/30 py-0.5 px-2 rounded border border-rose-900/40 font-bold uppercase tracking-wider">
                                    🔴 Disconnected
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>

                    {/* SECTION 3: DISCUSSION HEATMAP (CHANGE 2 & 3 LINKAGE) */}
                    <div id="discussion-heatmap-section" className="bg-[#0E0E0E] border border-[#1A1A1A] p-6 rounded-xs space-y-4">
                      
                      <div className="border-b border-[#1A1A1A] pb-3">
                        <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">SECTION 3</span>
                        <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                          REAL-TIME TEAM DISCUSSIONS
                        </h2>
                      </div>

                      <div className="text-[11px] text-neutral-400 font-mono leading-relaxed mb-1">
                        Monitoring authentic interactions (No scores or percentages):
                      </div>

                      <div className="space-y-2">
                        {teams.map((teamItem) => {
                          const health = teamItem.healthStatus || 'Engaged';
                          const isSelected = selectedTeamId === teamItem.id;
                          
                          return (
                            <div
                              key={teamItem.id}
                              onClick={() => { handleInteraction(); setSelectedTeamId(teamItem.id); }}
                              className={`flex justify-between items-center p-2.5 rounded-xs border cursor-pointer transition-all ${
                                health === 'Stuck' 
                                  ? 'bg-orange-950/10 border-orange-900/45 hover:bg-orange-950/20' 
                                  : health === 'Disconnected'
                                  ? 'bg-rose-950/10 border-rose-900/40 hover:bg-rose-950/15'
                                  : isSelected
                                  ? 'bg-[#151515] border-neutral-600'
                                  : 'bg-[#090909] border-transparent hover:border-neutral-850'
                              }`}
                            >
                              <div className="space-y-0.5">
                                <div className="text-xs font-mono font-bold text-neutral-250">
                                  Team {teamItem.name}
                                </div>
                                {health === 'Stuck' && (
                                  <div className="text-[9.5px] font-mono text-orange-400 font-extrabold animate-pulse uppercase tracking-wider">
                                    ⚠️ Stuck in Paralysis — Prompt Ready
                                  </div>
                                )}
                                {health === 'Disconnected' && (
                                  <div className="text-[9.5px] font-mono text-rose-400 font-bold uppercase tracking-wider">
                                    🔴 Disconnected for 80s+
                                  </div>
                                )}
                                {health === 'Engaged' && (
                                  <div className="text-[9.5px] font-mono text-emerald-450 uppercase tracking-widest">
                                    ✓ Active and Thinking
                                  </div>
                                )}
                                {health === 'Thinking' && (
                                  <div className="text-[9.5px] font-mono text-amber-500 uppercase">
                                    Weighing Decisions
                                  </div>
                                )}
                              </div>

                              <div>
                                <span className={`px-2 py-0.5 text-[9px] font-mono rounded font-black tracking-wider uppercase ${
                                  health === 'Stuck'
                                    ? 'bg-orange-950/40 text-orange-400 border border-orange-900/40'
                                    : health === 'Disconnected'
                                    ? 'bg-rose-950/40 text-rose-400 border border-rose-900/40'
                                    : teamItem.discussion === 'Low'
                                    ? 'bg-neutral-900 text-neutral-450 border border-neutral-800'
                                    : teamItem.discussion === 'Moderate'
                                    ? 'bg-amber-950/20 text-amber-400 border border-amber-900/20'
                                    : 'bg-emerald-950/25 text-emerald-450 border border-emerald-900/20'
                                }`}>
                                  {health === 'Stuck' ? 'Stagnant' : health === 'Disconnected' ? 'Disconnected' : `${teamItem.discussion} Discussion`}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>

                  </div>

                  {/* COLUMN 2: SELECTED TEAM DIRECTIVE CONTROL (CHANGE 3, 4, 6) */}
                  <div className="space-y-6 lg:col-span-1 border-r border-[#151515] pr-2">
                    
                    {/* MASTER SELECTED TEAM PANEL */}
                    <div className="bg-[#0E0E0E] border border-[#D4AF37]/50 p-6 rounded-xs space-y-4">
                      <div className="flex justify-between items-start border-b border-[#1A1A1A] pb-3">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">DIRECTIVE CENTER</span>
                          <h2 className="text-base font-display font-bold text-white tracking-tight uppercase">
                            Team: {selectedTeamDetails.name}
                          </h2>
                          <p className="text-[10px] font-mono text-neutral-400 capitalize underline">
                            Profile: {selectedTeamDetails.profileName}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-mono text-neutral-500 block uppercase font-bold">Status</span>
                          <span className="text-[10px] font-mono text-white font-bold bg-[#222] px-2 py-0.5 rounded border border-[#333] tracking-wider uppercase inline-block mt-0.5">
                            {selectedTeamDetails.healthStatus || 'Engaged'}
                          </span>
                        </div>
                      </div>

                      {/* CURRENT PARADIGM REVEAL */}
                      <div className="grid grid-cols-2 gap-3.5 pt-1.5 font-mono text-[11px] leading-relaxed">
                        <div className="bg-[#111] p-3 border border-neutral-900 rounded-xs">
                          <span className="text-[9px] text-[#D4AF37] block font-bold mb-1 uppercase tracking-wider">Underlying Belief</span>
                          <span className="text-white font-medium">{selectedTeamDetails.activeAssumption}</span>
                        </div>
                        <div className="bg-[#111] p-3 border border-neutral-900 rounded-xs">
                          <span className="text-[9px] text-red-400 block font-bold mb-1 uppercase tracking-wider">Spotted Trap / Mistake</span>
                          <span className="text-white font-medium">{selectedTeamDetails.activeBias}</span>
                        </div>
                      </div>
                    </div>

                    {/* REYOU CO-PILOT INTEL ENGAGEMENT MONITOR & COACH */}
                    <div className="bg-[#0E0E0E] p-6 border-2 border-[#D4AF37]/30 rounded-xs space-y-4">
                      <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-3">
                        <div className="space-y-0.5 border-l-2 border-[#D4AF37] pl-2">
                          <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">
                            ✦ REYOU DECK DIGITAL ASSIST
                          </span>
                          <h2 className="text-xs font-display font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                            TEAM COMPANION ANALYZER
                          </h2>
                        </div>
                        <button
                          onClick={() => {
                            handleInteraction();
                            fetchTeamAnalysis(selectedTeamDetails);
                          }}
                          disabled={loadingTeamAnalysis}
                          className="px-2.5 py-1 bg-black border border-neutral-800 hover:border-[#D4AF37] text-neutral-300 hover:text-white rounded text-[10px] font-mono cursor-pointer transition-all flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {loadingTeamAnalysis ? (
                            <>
                              <span className="inline-block w-2.5 h-2.5 rounded-full border-2 border-t-transparent border-[#D4AF37] animate-spin" />
                              <span>ANALYZING...</span>
                            </>
                          ) : (
                            <>
                              <span>⚡</span>
                              <span>RE-ANALYZE</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* TEAM ENGAGEMENT PROFILE */}
                      <div className="space-y-3 font-mono text-xs">
                        <div className="bg-black/50 p-3.5 border border-neutral-900 rounded-xs space-y-2">
                          <span className="text-[10px] text-neutral-400 font-extrabold block uppercase tracking-wider">
                            Live Discussion Analysis
                          </span>
                          {loadingTeamAnalysis ? (
                            <div className="py-2 text-[11px] text-[#D4AF37] opacity-80 animate-pulse">
                              Connecting to REYOU cohort analysis decks to assess team dynamics...
                            </div>
                          ) : (
                            <p className="text-[11.5px] leading-relaxed text-neutral-250 italic">
                              "{teamAnalysis?.discussionStatus || `Discussion profile holds moderate activity level with ${selectedTeamDetails.name} working on assumptions. Run live re-analysis to generate tailored learning guide notes.`}"
                            </p>
                          )}
                        </div>

                        {/* LIVE COACH QUESTION */}
                        <div className="bg-[#10100C] p-3.5 border border-dashed border-[#D4AF37]/25 rounded-xs space-y-1.5">
                          <span className="text-[10px] text-[#D4AF37] font-extrabold block uppercase tracking-widest flex items-center gap-1">
                            <span>💡</span> COACHING QUESTION ADVICE
                          </span>
                          <p className="text-[11.5px] leading-tight text-white font-medium">
                            {teamAnalysis?.coachAdvice || `Suggested Question advice: Guide team ${selectedTeamDetails.name} to write down their core beliefs explicitly before finalizing.`}
                          </p>
                        </div>

                        {/* COGNITIVE SMART NUDGES (Direct Send) */}
                        <div className="space-y-2 pt-1 border-t border-[#111]">
                          <span className="text-[10px] text-neutral-400 font-extrabold block uppercase tracking-wider">
                            Tailored Smart Nudge Injects
                          </span>
                          
                          {loadingTeamAnalysis ? (
                            <div className="space-y-1.5 animate-pulse">
                              <div className="h-8 bg-neutral-900 rounded" />
                              <div className="h-8 bg-neutral-900 rounded" />
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              {(teamAnalysis?.suggestedNudges && teamAnalysis.suggestedNudges.length > 0 ? teamAnalysis.suggestedNudges : [
                                `What option has your group not considered yet?`,
                                `What could go wrong with your current asset commitment?`
                              ]).map((nudge, nIdx) => (
                                <div key={nIdx} className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      handleInteraction();
                                      dispatchNudge(selectedTeamDetails.id, nudge);
                                    }}
                                    className="flex-1 p-2 text-left bg-black border border-neutral-900 hover:border-[#D4AF37]/50 rounded text-[11px] text-neutral-300 hover:text-white transition-all flex items-start gap-1 cursor-pointer"
                                  >
                                    <span className="text-[#D4AF37] font-bold">↳</span>
                                    <span>{nudge}</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleInteraction();
                                      dispatchNudge(selectedTeamDetails.id, nudge);
                                      setLiveAlertMessage(`Dispatched Nudge direct to Team ${selectedTeamDetails.name}!`);
                                      setTimeout(() => setLiveAlertMessage(null), 3000);
                                    }}
                                    className="px-2.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/35 text-[#D4AF37] text-[10px] font-bold rounded uppercase tracking-wider cursor-pointer transition-all"
                                  >
                                    SEND
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* DYNAMIC PHASE-ADAPTIVE NUDGE ENGINE (CHANGE 3) */}
                    <div className="bg-[#0E0E0E] border border-[#1A1A1A] p-6 rounded-xs space-y-4">
                      <div className="border-b border-[#1A1A1A] pb-3">
                        <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">SECTION 5 • NUDGE ENGINE</span>
                        <h2 className="text-xs font-display font-extrabold text-white uppercase tracking-wider">
                          ONE-CLICK THINKING INJECTS
                        </h2>
                        <span className="text-[10px] font-mono text-[#D4AF37] uppercase block tracking-wider mt-1">
                          Current: {getPhaseNameLabel(currentPhase)}
                        </span>
                      </div>

                      <div className="text-[11px] text-neutral-400 font-mono leading-relaxed mb-2">
                        Click to inject a highly targeted, phase-specific cognitive prompt directly to Team {selectedTeamDetails.name}:
                      </div>

                      <div className="space-y-2 font-mono text-xs">
                        {getPhaseNudges(currentPhase).map((nudgeText, nIdx) => (
                          <button
                            key={nIdx}
                            onClick={() => {
                              dispatchNudge(selectedTeamDetails.id, nudgeText);
                            }}
                            className="w-full p-3 bg-black border border-neutral-850 hover:bg-[#111] hover:border-[#D4AF37] text-left text-neutral-300 font-medium rounded-xs cursor-pointer transition-all leading-normal flex items-start gap-2.5"
                          >
                            <span className="text-[#D4AF37] font-black">{nIdx + 1}.</span>
                            <span className="text-[11px]">{nudgeText}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ROLE ACTIVATION CHALLENGES (CHANGE 4) */}
                    <div className="bg-[#0E0E0E] border border-[#1A1A1A] p-6 rounded-xs space-y-4">
                      <div className="border-b border-[#1A1A1A] pb-3">
                        <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">ROLE ACTIVATOR</span>
                        <h2 className="text-xs font-display font-extrabold text-white uppercase tracking-wider">
                          ROLE-SPECIFIC FOCUS NUDGES
                        </h2>
                      </div>

                      <div className="text-[11px] text-neutral-400 font-mono leading-relaxed mb-3">
                        Select a lead role within Team {selectedTeamDetails.name} to dispatch an immediate high-accountability challenge:
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 font-mono text-[10px]">
                        <button
                          onClick={() => {
                            dispatchRoleActivation(
                              selectedTeamDetails.id,
                              "What Could Go Wrong?",
                              "What Could Go Wrong?: What could go wrong?"
                            );
                          }}
                          className="p-2.5 bg-black border border-neutral-850 hover:border-red-500/50 hover:bg-rose-950/5 text-rose-400 font-bold uppercase rounded-xs tracking-wider cursor-pointer text-center transition-all block"
                        >
                          ⚡ What Could Go Wrong?
                        </button>
 
                        <button
                          onClick={() => {
                            dispatchRoleActivation(
                              selectedTeamDetails.id,
                              "Big Picture Thinker",
                              "Big Picture Thinker: What might happen next?"
                            );
                          }}
                          className="p-2.5 bg-black border border-neutral-850 hover:border-[#D4AF37]/50 hover:bg-amber-950/5 text-[#D4AF37] font-bold uppercase rounded-xs tracking-wider cursor-pointer text-center transition-all block"
                        >
                          ⚡ Big Picture Thinker
                        </button>
 
                        <button
                          onClick={() => {
                            dispatchRoleActivation(
                              selectedTeamDetails.id,
                              "Team Speaker",
                              "Team Speaker: Can you defend this decision to the class?"
                            );
                          }}
                          className="p-2.5 bg-black border border-neutral-850 hover:border-blue-500/50 hover:bg-blue-950/5 text-blue-400 font-bold uppercase rounded-xs tracking-wider cursor-pointer text-center transition-all block col-span-1"
                        >
                          ⚡ Team Speaker
                        </button>
 
                        <button
                          onClick={() => {
                            dispatchRoleActivation(
                              selectedTeamDetails.id,
                              "Lesson Finder",
                              "Lesson Finder: What did we believe that turned out to be wrong?"
                            );
                          }}
                          className="p-2.5 bg-black border border-neutral-850 hover:border-emerald-500/50 hover:bg-emerald-950/5 text-emerald-400 font-bold uppercase rounded-xs tracking-wider cursor-pointer text-center transition-all block col-span-1"
                        >
                          ⚡ Lesson Finder
                        </button>
 
                        <button
                          onClick={() => {
                            dispatchRoleActivation(
                              selectedTeamDetails.id,
                              "Team Lead",
                              "Team Lead: Move the team to a decision."
                            );
                          }}
                          className="p-2.5 bg-black border border-neutral-850 hover:border-purple-500/50 hover:bg-purple-950/5 text-purple-400 font-bold uppercase rounded-xs tracking-wider cursor-pointer text-center transition-all block col-span-2"
                        >
                          ⚡ Team Lead
                        </button>
                      </div>
                    </div>

                    {/* BEHAVIORAL OBSERVATION TIMELINE (CHANGE 6) */}
                    <div className="bg-[#0E0E0E] border border-[#1A1A1A] p-6 rounded-xs space-y-4">
                      <div className="border-b border-[#1A1A1A] pb-3 flex justify-between items-center">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">SECTION 6 • BEHAVIOR FEED</span>
                          <h2 className="text-xs font-display font-extrabold text-white uppercase tracking-wider">
                            OBSERVATION TIMELINE
                          </h2>
                        </div>
                        <span className="text-[9px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20 font-bold uppercase">
                          FEED
                        </span>
                      </div>

                      <div className="text-[11px] text-neutral-400 font-mono leading-relaxed mb-1">
                        Real-time behavioral stream (No grades or raw analytics):
                      </div>

                      {/* VERTICAL TIMELINE DESIGN */}
                      <div className="relative pl-4 border-l border-dashed border-[#222] space-y-4 pt-1 font-sans">
                        {(selectedTeamDetails.timeline || []).slice().reverse().map((ev, evIdx) => (
                          <div key={evIdx} className="relative group">
                            {/* Point node indicator */}
                            <span className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-[#D4AF37] border-2 border-black" />
                            
                            <div className="space-y-0.5">
                              <span className="text-[9.5px] font-mono text-neutral-500 group-hover:text-neutral-350 transition-colors">
                                [{ev.time}]
                              </span>
                              <p className="text-xs text-neutral-300 font-serif leading-relaxed">
                                {ev.event}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* COLUMN 3: REAL-TIME OVERVIEWS & SYSTEM LAUNCHERS (CHANGE 5, SECTION 6 & 7) */}
                  <div className="space-y-6 lg:col-span-1">
                    
                    {/* FACILITATOR INSIGHT PANEL (CHANGE 5) */}
                    <div id="facilitator-insight-panel" className="bg-[#0E0E0E] border border-[#D4AF37] p-6 rounded-xs space-y-4">
                      <div className="border-b border-[#1A1A1A] pb-3 flex justify-between items-center">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">SECTION 2 • COHORT GENOME</span>
                          <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                            FACILITATOR INSIGHTS
                          </h2>
                        </div>
                        <span className="text-[9px] font-mono text-[#D4AF37] bg-[#D4AF37]/5 px-2.5 py-0.5 border border-[#D4AF37]/20 rounded font-bold uppercase">
                          ACTIVE ENGINE
                        </span>
                      </div>

                      <div className="space-y-3 font-mono text-xs leading-normal">
                        
                        <div className="bg-[#080808] p-3 border border-neutral-900 rounded-xs space-y-1">
                          <span className="text-[9px] text-[#D4AF37] uppercase block font-bold tracking-wider">Most Active Team</span>
                          <div className="text-neutral-200 font-bold">Team Jhansi</div>
                          <span className="text-[10px] text-neutral-500 block">High-density verification loops</span>
                        </div>

                        <div className="bg-[#080808] p-3 border border-neutral-900 rounded-xs space-y-1">
                          <span className="text-[9px] text-amber-500 uppercase block font-bold tracking-wider">Most Challenged Assumption</span>
                          <div className="text-neutral-200 font-bold">Comfort Equals Security</div>
                        </div>

                        <div className="bg-[#080808] p-3 border border-neutral-900 rounded-xs space-y-1">
                          <span className="text-[9px] text-red-400 uppercase block font-bold tracking-wider">Most Common Bias</span>
                          <div className="text-neutral-200 font-bold">Careless Acceleration Bias</div>
                        </div>

                        <div className="bg-[#080808] p-3 border border-neutral-900 rounded-xs space-y-1">
                          <span className="text-[9px] text-emerald-400 uppercase block font-bold tracking-wider">Most Powerful Reflection</span>
                          <p className="text-[11px] text-neutral-300 font-serif leading-relaxed italic">
                            "We bypassed verifying because we wanted validation"
                          </p>
                        </div>

                        {/* TEAMS REQUIRING SUPPORT PORTLET (CHANGE 5 CORE) */}
                        <div className="bg-neutral-950/80 p-3.5 border border-[#1d1d1f] rounded-xs space-y-2.5">
                          <span className="text-[9px] text-[#D4AF37] uppercase block font-black tracking-widest">
                            🔥 TEAMS REQUIRING SUPPORT
                          </span>
                          
                          {teams.filter(t => t.healthStatus === 'Stuck' || t.healthStatus === 'Disconnected').length === 0 ? (
                            <div className="text-[10.5px] text-emerald-450 font-medium flex items-center gap-1.5 py-1">
                              <span>🟢 All teams highly responsive. Zero alerts.</span>
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-44 overflow-y-auto">
                              {teams.filter(t => t.healthStatus === 'Stuck' || t.healthStatus === 'Disconnected').map((st) => (
                                <div key={st.id} className="flex justify-between items-center bg-black p-2 border border-neutral-900 rounded-xs">
                                  <div className="flex items-center gap-1.5 font-mono text-xs">
                                    <span className={`w-1.5 h-1.5 rounded-full ${st.healthStatus === 'Stuck' ? 'bg-orange-500 animate-pulse' : 'bg-red-500'}`} />
                                    <span className="text-neutral-100 font-bold">Team {st.name}</span>
                                    <span className="text-[8px] text-neutral-500 font-bold uppercase">({st.healthStatus})</span>
                                  </div>

                                  <button
                                    onClick={() => {
                                      dispatchNudge(st.id, `Group ${st.name}, stop and look at your buffers. What underlying assumptions are guiding your team right now?`);
                                    }}
                                    className="px-2 py-0.5 bg-[#D4AF37] text-black hover:bg-yellow-500 text-[9px] font-mono font-black uppercase rounded-xs cursor-pointer transition-colors"
                                  >
                                    NUDGE
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* CURRENT SIMULATION CONTEXT PROGRESS */}
                    <div className="bg-[#0E0E0E] border border-neutral-900 p-6 rounded-xs space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                        <span className="font-bold tracking-widest text-neutral-500">EXPERIENCE TIMELINE</span>
                        <span className="text-white font-extrabold bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded-xs">Phase {currentPhase} of 10</span>
                      </div>
                      <h3 className="text-sm font-display text-white font-bold leading-tight uppercase">
                        {phaseTitle}
                      </h3>
                      <div className="h-1 bg-black rounded-full overflow-hidden border border-[#1F1F1F]">
                        <div 
                          className="bg-[#D4AF37] h-full transition-all duration-700 ease-out" 
                          style={{ width: `${(currentPhase / 10) * 100}%` }} 
                        />
                      </div>
                    </div>

                    {/* REYOU LIVE END-PHASE DEBRIEF */}
                    <div className="bg-[#0E0E0E] border-2 border-dashed border-[#D4AF37]/45 p-6 rounded-xs space-y-4">
                      <div className="flex justify-between items-start border-b border-[#1A1A1A] pb-3">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">
                            ✦ REYOU RESEARCH ADVISOR
                          </span>
                          <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                            PHASE {currentPhase} COHORT DEBRIEF GUIDE
                          </h2>
                        </div>
                        <button
                          onClick={() => {
                            handleInteraction();
                            handleGeneratePhaseSummary();
                          }}
                          disabled={loadingPhaseSummary}
                          className="px-2.5 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#D4AF37] hover:text-white rounded text-[9.5px] font-mono font-bold tracking-widest cursor-pointer uppercase transition-all"
                        >
                          {loadingPhaseSummary ? "SYNTHESIZING..." : "COMPILE REPORT"}
                        </button>
                      </div>

                      <p className="text-[11px] text-neutral-400 font-mono leading-relaxed">
                        Summarize active student choices, blind spots, and points of friction to support class discussion:
                      </p>

                      {loadingPhaseSummary ? (
                        <div className="space-y-2.5 font-mono text-xs animate-pulse">
                          <div className="h-10 bg-neutral-900 rounded border border-neutral-950" />
                          <div className="h-10 bg-neutral-900 rounded border border-neutral-950" />
                          <div className="h-10 bg-neutral-900 rounded border border-neutral-950" />
                        </div>
                      ) : phaseSummary ? (
                        <div className="space-y-3 font-mono text-xs">
                          <div className="bg-[#080808] p-3 border border-neutral-900 rounded-xs space-y-1">
                            <span className="text-[9.5px] text-emerald-450 uppercase block font-bold tracking-wider">
                              Most Common Choice
                            </span>
                            <p className="text-[11.5px] text-neutral-250 leading-relaxed font-sans">
                              {phaseSummary.mostCommonChoice}
                            </p>
                          </div>

                          <div className="bg-[#080808] p-3 border border-[#301111] rounded-xs space-y-1">
                            <span className="text-[9.5px] text-rose-450 uppercase block font-bold tracking-wider">
                              Most Common Mistake
                            </span>
                            <p className="text-[11.5px] text-neutral-250 leading-relaxed font-sans">
                              {phaseSummary.mostCommonMistake}
                            </p>
                          </div>

                          <div className="bg-[#080808] p-3 border border-neutral-900 rounded-xs space-y-1 border-l-2 border-[#D4AF37]/55 pl-2.5 animate-pulse">
                            <span className="text-[9.5px] text-[#D4AF37] uppercase block font-bold tracking-wider">
                              Most Interesting Reflection
                            </span>
                            <p className="text-[11.5px] text-neutral-250 leading-relaxed italic font-serif">
                              "{phaseSummary.mostInterestingReflection}"
                            </p>
                          </div>

                          <div className="bg-[#080808] p-3 border border-neutral-900 rounded-xs space-y-1 border-l-2 border-amber-500/55 pl-2.5">
                            <span className="text-[9.5px] text-amber-500 uppercase block font-bold tracking-wider">
                              Most Divided Team
                            </span>
                            <p className="text-[11.5px] text-neutral-250 leading-relaxed font-sans">
                              {phaseSummary.mostDividedTeam}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-black/60 rounded-xs border border-neutral-900 text-center text-neutral-500 font-mono text-[10.5px]">
                          Phase Summary empty. Click "COMPILE REPORT" to run live cohort debrief synthesis.
                        </div>
                      )}
                    </div>

                    {/* SECTION 6: REFLECTION STREAM */}
                    <div id="reflection-stream-section" className="bg-[#0E0E0E] border border-[#1A1A1A] p-6 rounded-xs space-y-4">
                      
                      <div className="border-b border-[#1A1A1A] pb-3 flex justify-between items-center">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">SECTION 6</span>
                          <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                            REFLECTION STREAM
                          </h2>
                        </div>
                        <span className="text-[9px] font-mono text-rose-450 bg-rose-950/20 px-2 py-0.5 border border-rose-950/30 rounded font-black animate-pulse">
                          LIVE FEED
                        </span>
                      </div>

                      <div className="text-[11.5px] text-neutral-400 leading-relaxed font-sans mb-1">
                        Pin and spotlight insightful peer reflections directly to the cohort projector view:
                      </div>

                      {/* Stream feed items */}
                      <div className="space-y-3">
                        {reflections.map((refItem) => {
                          const isSpotlighted = spotlightedReflection?.id === refItem.id;
                          return (
                            <div 
                              key={refItem.id}
                              className={`p-3 rounded-xs border transition-all text-xs flex flex-col justify-between gap-2.5 ${
                                isSpotlighted
                                  ? 'bg-[#121210] border-[#D4AF37]'
                                  : 'bg-black border-neutral-900 hover:border-neutral-800'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="font-mono text-[10px] font-bold text-neutral-400">
                                  Student • {refItem.author}
                                </div>
                                <div className="text-neutral-250 font-sans text-[11.5px] leading-relaxed">
                                  "{refItem.text}"
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-1 border-t border-neutral-950">
                                <span className="text-[8px] font-mono text-neutral-500">Live Submission</span>
                                <button
                                  onClick={() => handleSpotlight(refItem)}
                                  className={`text-[9px] font-mono px-2 py-1 rounded cursor-pointer transition-all ${
                                    isSpotlighted
                                      ? 'bg-[#D4AF37] text-black font-extrabold'
                                      : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-305'
                                  }`}
                                >
                                  {isSpotlighted ? "★ Spotlighted" : "Spotlight Reflection"}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Simulation Trigger button inside client view to receive new comments */}
                      <button
                        onClick={handleSimulateNewReflection}
                        className="w-full mt-2 py-2 border border-dashed border-neutral-800 hover:border-neutral-600 hover:text-white rounded text-[10px] font-mono text-neutral-400 uppercase tracking-widest cursor-pointer transition-all"
                      >
                        ⚡ Simulate Student Feedback Event
                      </button>

                    </div>

                    {/* SECTION 7: CONTROL PANEL */}
                    <div id="facilitator-control-panel" className="bg-[#0E0E0E] border border-[#1A1A1A] p-6 rounded-xs space-y-4">
                      
                      <div className="border-b border-[#1A1A1A] pb-3">
                        <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold font-bold">SECTION 7</span>
                        <h2 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                          CONTROL PANEL
                        </h2>
                      </div>

                      <p className="text-[11px] text-neutral-400 font-mono leading-relaxed mb-2">
                        Execute actions to manage flow, reveal parameters, or terminate the live workspace:
                      </p>

                      {/* NOTHING ELSE BUT THESE 6 BUTTONS ACCORDING TO STRICT CEILING SPEC */}
                      <div className="grid grid-cols-1 gap-2.5">
                        
                        {/* BUTTON 1 */}
                        <button
                          onClick={() => {
                            handleInteraction();
                            setSimulationPaused(!simulationPaused);
                            sounds.playValidationChime();
                            setLiveAlertMessage(!simulationPaused ? "STATION LOCK ACTIVE. Terminals suspended." : "STATION LOCK INACTIVE. Co-labs resumed.");
                            setTimeout(() => setLiveAlertMessage(null), 3000);
                          }}
                          className={`w-full py-3 px-4 font-mono text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer border transition-all text-left flex justify-between items-center ${
                            simulationPaused
                              ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-400'
                              : 'bg-black border-rose-900/40 hover:bg-[#120808] text-rose-400'
                          }`}
                        >
                          <span>Pause Simulation</span>
                          <span className="text-[9px] opacity-60">{simulationPaused ? "[ACTIVE]" : "[IDLE]"}</span>
                        </button>

                        {/* BUTTON 2 */}
                        <button
                          onClick={() => {
                            handleInteraction();
                            setRoomState('DEBATING');
                            sounds.playValidationChime();
                            setLiveAlertMessage("DISCUSSION STATE ACTIVATED. Dialogue streams unlocked.");
                            setTimeout(() => setLiveAlertMessage(null), 3000);
                          }}
                          className="w-full py-3 px-4 bg-black border border-neutral-800 hover:border-[#D4AF37]/50 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer text-left transition-all flex justify-between items-center"
                        >
                          <span>Start Discussion</span>
                          <span className="text-[9px] opacity-60">[ACTIVATE]</span>
                        </button>

                        {/* BUTTON 3 */}
                        <button
                          onClick={() => {
                            handleInteraction();
                            sounds.playValidationChime();
                            setCurrentPhase(4);
                            setPhaseTitle("REVEALED: CONSEQUENTIAL BURDENS");
                            setLiveAlertMessage("CONSEQUENCES UNLOCKED. Student terminals exposed to liability outcomes.");
                            setTimeout(() => setLiveAlertMessage(null), 3000);
                          }}
                          className="w-full py-3 px-4 bg-black border border-neutral-800 hover:border-[#D4AF37]/50 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer text-left transition-all flex justify-between items-center"
                        >
                          <span>Reveal Consequences</span>
                          <span className="text-[10px] text-[#D4AF37]">[LAUNCH]</span>
                        </button>

                        {/* BUTTON 4 */}
                        <button
                          onClick={() => {
                            handleInteraction();
                            sounds.playValidationChime();
                            setLiveAlertMessage("RAHUL LENS DEPLOYED: Strategic capability guidelines dispatched.");
                            setTimeout(() => setLiveAlertMessage(null), 3000);
                          }}
                          className="w-full py-3 px-4 bg-black border border-neutral-800 hover:border-[#D4AF37]/50 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer text-left transition-all flex justify-between items-center"
                        >
                          <span>Launch Rahul Lens</span>
                          <span className="text-[10px] text-[#D4AF37]">[LENS]</span>
                        </button>

                        {/* BUTTON 5 */}
                        <button
                          onClick={() => {
                            handleInteraction();
                            sounds.playValidationChime();
                            setLiveAlertMessage("REFLECTION STAGE TRIGGERED. Writing prompts opened on students devices.");
                            setTimeout(() => setLiveAlertMessage(null), 3000);
                          }}
                          className="w-full py-3 px-4 bg-black border border-neutral-800 hover:border-[#D4AF37]/50 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer text-left transition-all flex justify-between items-center"
                        >
                          <span>Launch Reflection</span>
                          <span className="text-[10px] text-[#D4AF37]">[REFLECT]</span>
                        </button>

                        {/* BUTTON 6: DEPLOY SIMULATION 2 CONTROL */}
                        <button
                          onClick={handleToggleSim2Deploy}
                          className={`w-full py-3.5 px-4 font-mono text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer border transition-all text-left flex justify-between items-center ${
                            isSim2Deployed
                              ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                              : 'border-dashed border-[#D4AF37]/45 hover:bg-[#D4AF37]/5 hover:border-[#D4AF37] text-white animate-pulse'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${isSim2Deployed ? 'bg-[#D4AF37] animate-pulse' : 'bg-neutral-600'}`} />
                            {isSim2Deployed ? 'Simulation 2: Active' : 'Deploy Surprise Simulation 2'}
                          </span>
                          <span className="text-[9px] font-black tracking-widest">{isSim2Deployed ? "[ONLINE]" : "[DEPLOY]"}</span>
                        </button>

                        {/* BUTTON 7 */}
                        <button
                          onClick={() => {
                            handleInteraction();
                            sounds.playValidationChime();
                            setShowEndScreen(true);
                          }}
                          className="w-full py-3 px-4 bg-red-950/20 border border-red-900/50 hover:bg-[#1A0A0A] text-red-400 font-mono text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer text-left transition-all flex justify-between items-center mt-3"
                        >
                          <span>End Session</span>
                          <span className="text-[9px] text-red-500 font-black">[TERMINATE]</span>
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            )}

          </div>
        )}

        {/* ACCESS TO PRINCIPAL DECK VIEW */}
        {activeTab === 'PRINCIPAL' && (
          <PrincipalConsole 
            currentPhase={currentPhase}
            phaseTitle={phaseTitle}
            showEndScreen={showEndScreen}
            spotlightedReflection={spotlightedReflection}
            onReset={triggerRestartSession}
          />
        )}

      </div>
    </div>
  );
}
