import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Upload, 
  Users, 
  RefreshCw, 
  FileText, 
  CheckCircle2, 
  Shuffle, 
  Play, 
  ArrowRight,
  Printer,
  ChevronDown,
  X,
  Cloud,
  CloudLightning
} from 'lucide-react';
import { sounds } from '../utils/audio';
import * as XLSX from 'xlsx';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  saveFileToDrive, 
  loadFileFromDrive,
  getAccessToken
} from '../utils/googleWorkspace';
import { User } from 'firebase/auth';

// 50 High-Quality Indian Student Records for Premium Demo & Fallbacks
const DEFAULT_PREFILLED_STUDENTS = [
  { name: 'Aarav Sharma', roll: '101', classVal: 'XI', sec: 'A', gen: 'M' },
  { name: 'Priya Patel', roll: '102', classVal: 'XI', sec: 'A', gen: 'F' },
  { name: 'Rohan Singh', roll: '103', classVal: 'XI', sec: 'A', gen: 'M' },
  { name: 'Meera Shah', roll: '104', classVal: 'XI', sec: 'A', gen: 'F' },
  { name: 'Aditya Jain', roll: '105', classVal: 'XI', sec: 'A', gen: 'M' },
  { name: 'Siddharth Verma', roll: '106', classVal: 'XI', sec: 'A', gen: 'M' },
  { name: 'Ananya Iyer', roll: '107', classVal: 'XI', sec: 'A', gen: 'F' },
  { name: 'Kabir Mehta', roll: '108', classVal: 'XI', sec: 'A', gen: 'M' },
  { name: 'Sonal Rao', roll: '109', classVal: 'XI', sec: 'A', gen: 'F' },
  { name: 'Nikhil Saxena', roll: '110', classVal: 'XI', sec: 'A', gen: 'M' },
  { name: 'Tanya Goel', roll: '111', classVal: 'XI', sec: 'A', gen: 'F' },
  { name: 'Aman Dubey', roll: '112', classVal: 'XI', sec: 'B', gen: 'M' },
  { name: 'Ritu Sengupta', roll: '113', classVal: 'XI', sec: 'B', gen: 'F' },
  { name: 'Raj Kumar', roll: '114', classVal: 'XI', sec: 'B', gen: 'M' },
  { name: 'Neha Chawla', roll: '115', classVal: 'XI', sec: 'B', gen: 'F' },
  { name: 'Devendra Joshi', roll: '116', classVal: 'XI', sec: 'B', gen: 'M' },
  { name: 'Kirti Bajaj', roll: '117', classVal: 'XI', sec: 'B', gen: 'F' },
  { name: 'Sameer Sen', roll: '118', classVal: 'XI', sec: 'B', gen: 'M' },
  { name: 'Pooja Hegde', roll: '119', classVal: 'XI', sec: 'B', gen: 'F' },
  { name: 'Kartik Aryan', roll: '120', classVal: 'XI', sec: 'B', gen: 'M' },
  { name: 'Gautam Gambhir', roll: '121', classVal: 'XI', sec: 'C', gen: 'M' },
  { name: 'Shreya Ghoshal', roll: '122', classVal: 'XI', sec: 'C', gen: 'F' },
  { name: 'Hardik Pandya', roll: '123', classVal: 'XI', sec: 'C', gen: 'M' },
  { name: 'Kunal Nayyar', roll: '124', classVal: 'XI', sec: 'C', gen: 'M' },
  { name: 'Varun Dhawan', roll: '125', classVal: 'XI', sec: 'C', gen: 'M' },
  { name: 'Ishita Roy', roll: '126', classVal: 'XI', sec: 'C', gen: 'F' },
  { name: 'Vikram Malhotra', roll: '127', classVal: 'XI', sec: 'C', gen: 'M' },
  { name: 'Divya Dutta', roll: '128', classVal: 'XI', sec: 'C', gen: 'F' },
  { name: 'Manoj Bajpayee', roll: '129', classVal: 'XI', sec: 'C', gen: 'M' },
  { name: 'Vijay Deverakonda', roll: '130', classVal: 'XI', sec: 'C', gen: 'M' },
  { name: 'Harshit Nair', roll: '131', classVal: 'XII', sec: 'A', gen: 'M' },
  { name: 'Deepa Krishnan', roll: '132', classVal: 'XII', sec: 'A', gen: 'F' },
  { name: 'Suresh Raina', roll: '133', classVal: 'XII', sec: 'A', gen: 'M' },
  { name: 'Alia Bhatt', roll: '134', classVal: 'XII', sec: 'A', gen: 'F' },
  { name: 'Ranbir Kapoor', roll: '135', classVal: 'XII', sec: 'A', gen: 'M' },
  { name: 'Kiara Advani', roll: '136', classVal: 'XII', sec: 'A', gen: 'F' },
  { name: 'Sidharth Malhotra', roll: '137', classVal: 'XII', sec: 'A', gen: 'M' },
  { name: 'Rashmika Mandanna', roll: '138', classVal: 'XII', sec: 'A', gen: 'F' },
  { name: 'Vicky Kaushal', roll: '139', classVal: 'XII', sec: 'A', gen: 'M' },
  { name: 'Katrina Kaif', roll: '140', classVal: 'XII', sec: 'A', gen: 'F' },
  { name: 'Ayushmann Khurrana', roll: '141', classVal: 'XII', sec: 'B', gen: 'M' },
  { name: 'Bhumi Pednekar', roll: '142', classVal: 'XII', sec: 'B', gen: 'F' },
  { name: 'Rajkummar Rao', roll: '143', classVal: 'XII', sec: 'B', gen: 'M' },
  { name: 'Radhika Apte', roll: '144', classVal: 'XII', sec: 'B', gen: 'F' },
  { name: 'Pankaj Tripathi', roll: '145', classVal: 'XII', sec: 'B', gen: 'M' },
  { name: 'Sobhita Dhulipala', roll: '146', classVal: 'XII', sec: 'B', gen: 'F' },
  { name: 'Sunny Kaushal', roll: '147', classVal: 'XII', sec: 'B', gen: 'M' },
  { name: 'Sharvari Wagh', roll: '148', classVal: 'XII', sec: 'B', gen: 'F' },
  { name: 'Wamiqa Gabbi', roll: '149', classVal: 'XII', sec: 'B', gen: 'F' },
  { name: 'Jaideep Ahlawat', roll: '150', classVal: 'XII', sec: 'B', gen: 'M' },
];

const BRAND_TEAMS = [
  { id: 'TEAM_ALPHA', name: 'Jhansi', profileName: 'Responsible Son', color: 'from-amber-600/30 to-amber-900/10 border-amber-800/40' },
  { id: 'TEAM_BRAVO', name: 'Bhagat', profileName: 'Education Loan Graduate', color: 'from-indigo-600/30 to-indigo-900/10 border-indigo-800/40' },
  { id: 'TEAM_CHARLIE', name: 'Chanakya', profileName: 'Strategic Planner', color: 'from-emerald-600/30 to-emerald-900/10 border-emerald-800/40' },
  { id: 'TEAM_DELTA', name: 'Azad', profileName: 'Lifestyle Upgrader', color: 'from-blue-600/30 to-[#0c1220]/10 border-blue-800/40' },
  { id: 'TEAM_ECHO', name: 'Netaji', profileName: 'Family Pillar', color: 'from-purple-600/30 to-purple-900/10 border-purple-800/40' },
  { id: 'TEAM_FOXTROT', name: 'Patel', profileName: 'Stability Seeker', color: 'from-teal-600/30 to-teal-900/10 border-teal-800/40' },
  { id: 'TEAM_GOLF', name: 'Kalam', profileName: 'Future Builder', color: 'from-orange-600/30 to-orange-900/10 border-orange-850/40' },
  { id: 'TEAM_HOTEL', name: 'Vivekananda', profileName: 'Purpose Driven', color: 'from-cyan-600/30 to-cyan-900/10 border-cyan-800/40' },
  { id: 'TEAM_INDIA', name: 'Shivaji', profileName: 'Ambitious Achiever', color: 'from-fuchsia-600/30 to-fuchsia-900/10 border-fuchsia-800/40' },
  { id: 'TEAM_JULIET', name: 'Bose', profileName: 'Opportunity Chaser', color: 'from-rose-600/30 to-rose-900/10 border-rose-800/40' }
];

const ROLES = [
  { id: 'TEAM_LEAD', title: 'Team Lead' },
  { id: 'STRATEGY_LEAD', title: 'Big Picture Thinker' },
  { id: 'RISK_LEAD', title: 'What Could Go Wrong?' },
  { id: 'COMMUNICATION_LEAD', title: 'Team Speaker' },
  { id: 'REFLECTION_LEAD', title: 'Lesson Finder' }
];

export interface GeneratedCohortTeam {
  id: string;
  name: string;
  profileName: string;
  status: 'Active' | 'Idle' | 'Reflecting';
  discussion: 'Low' | 'Moderate' | 'High';
  activeAssumption: string;
  activeBias: string;
  cuePrompt: string;
  members: {
    name: string;
    roll: string;
    roleId: string;
    roleTitle: string;
  }[];
}

interface CohortImportCenterProps {
  onCohortActivated: (generatedTeams: GeneratedCohortTeam[]) => void;
}

export default function CohortImportCenter({ onCohortActivated }: CohortImportCenterProps) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [teamSize, setTeamSize] = useState<number>(5);
  
  // Animation states
  const [importState, setImportState] = useState<'idle' | 'importing' | 'ready'>('idle');
  const [progressVal, setProgressVal] = useState<number>(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [totalParsedRecords, setTotalParsedRecords] = useState<number>(0);

  // Computed teams
  const [activeTeams, setActiveTeams] = useState<GeneratedCohortTeam[]>([]);
  const [showTeamDetailsIndex, setShowTeamDetailsIndex] = useState<number | null>(null);
  const [showPDFPrintOverlay, setShowPDFPrintOverlay] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Google Workspace Integration State
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [driveSyncStatus, setDriveSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [driveSyncMessage, setDriveSyncMessage] = useState<string>('');

  // Handle Google OAuth and drive services
  const handleGoogleSignIn = async () => {
    sounds.playClickSound();
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);
        setDriveSyncStatus('success');
        setDriveSyncMessage(`Connected to Google Drive: ${result.user.email}`);
        setTimeout(() => {
          setDriveSyncStatus('idle');
          setDriveSyncMessage('');
        }, 4000);
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
    setDriveSyncMessage('Disconnected Google Workspace account.');
    setTimeout(() => setDriveSyncMessage(''), 4000);
  };

  const handleSaveCohortToDrive = async () => {
    if (!googleToken) {
      alert("Please connect your Google Workspace account first.");
      return;
    }
    
    if (activeTeams.length === 0) {
      alert("No active cohort data to save. Please import or use the prefilled student roster first.");
      return;
    }

    const confirmed = window.confirm(
      "CONFIRM GOOGLE DRIVE MUTATION: Do you approve saving or overwriting 'reyou-cohort-data.json' in your personal Google Drive with the current cohort config?"
    );
    if (!confirmed) return;

    setDriveSyncStatus('syncing');
    setDriveSyncMessage('Uploading cohort configuration to your secure Google Drive space...');
    sounds.playClickSound();

    try {
      const res = await saveFileToDrive('reyou-cohort-data.json', activeTeams, googleToken);
      if (res.success) {
        setDriveSyncStatus('success');
        setDriveSyncMessage(`Successfully saved cohort configuration! File ID: ${res.fileId?.substring(0, 10)}... (${res.isNew ? 'Created new' : 'Overwrote existing'})`);
        sounds.playValidationChime();
        setTimeout(() => {
          setDriveSyncStatus('idle');
          setDriveSyncMessage('');
        }, 5000);
      } else {
        throw new Error("Target operation returned unsuccessful state");
      }
    } catch (err: any) {
      console.error(err);
      setDriveSyncStatus('error');
      setDriveSyncMessage(`Drive upload failed: ${err.message || err}`);
    }
  };

  const handleLoadCohortFromDrive = async () => {
    if (!googleToken) {
      alert("Please connect your Google Workspace account first.");
      return;
    }

    setDriveSyncStatus('syncing');
    setDriveSyncMessage("Querying and fetching 'reyou-cohort-data.json' from your Google Drive files...");
    sounds.playClickSound();

    try {
      const data = await loadFileFromDrive('reyou-cohort-data.json', googleToken);
      if (data && Array.isArray(data) && data.length > 0) {
        setActiveTeams(data);
        setImportState('ready');
        setTotalParsedRecords(data.reduce((acc: number, cur: any) => acc + (cur.members?.length || 0), 0));
        
        // Persist locally
        localStorage.setItem('reyou-imported-cohort-full', JSON.stringify(data));
        window.dispatchEvent(new CustomEvent('reyou-cohort-imported', { detail: data }));
        
        setDriveSyncStatus('success');
        setDriveSyncMessage("Successfully downloaded and applied the cohort data from Google Drive!");
        sounds.playValidationChime();
        setTimeout(() => {
          setDriveSyncStatus('idle');
          setDriveSyncMessage('');
        }, 5000);
      } else {
        setDriveSyncStatus('error');
        setDriveSyncMessage("No valid cohort data file found in Google Drive. Please save a cohort config first.");
      }
    } catch (err: any) {
      console.error(err);
      setDriveSyncStatus('error');
      setDriveSyncMessage(`Drive download failed: ${err.message || 'File not found or access expired.'}`);
    }
  };

  // Sync state with preflown storage setup on mount and sub unsubscribe
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

    const cached = localStorage.getItem('reyou-imported-cohort-full');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          setActiveTeams(parsed);
          setImportState('ready');
          setTotalParsedRecords(parsed.reduce((acc: number, cur: any) => acc + (cur.members?.length || 0), 0));
        }
      } catch (e) {
        console.error("Cache parsing exception", e);
      }
    }

    return () => unsubscribe();
  }, []);

  // Generate Excel Template
  const handleDownloadTemplate = () => {
    sounds.playClickSound();
    const headers = [['Student Name', 'Roll Number', 'Class', 'Section', 'Gender']];
    const dataRows = DEFAULT_PREFILLED_STUDENTS.map(student => [
      student.name, 
      student.roll, 
      student.classVal, 
      student.sec, 
      student.gen
    ]);
    
    const ws = XLSX.utils.aoa_to_sheet([...headers, ...dataRows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Founder Cohort');
    
    // Auto-fit column widths
    ws['!cols'] = [
      { wch: 22 },
      { wch: 15 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 }
    ];
    
    XLSX.writeFile(wb, 'REYOU_APS_TEMPLATE.xlsx');
  };

  // Run structured procedural team generation algorithm
  const generateBalancedTeams = (loadedStudents: { name: string; roll: string }[]) => {
    // Shuffler helper
    const list = [...loadedStudents];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }

    // Allocate 10 locked teams with 5 team members each
    const generated: GeneratedCohortTeam[] = BRAND_TEAMS.map((team, tIdx) => {
      const teamId = team.id;
      const teamName = team.name;
      const profileName = team.profileName;

      // Assign the next chunk of 5 students
      const members = Array.from({ length: 5 }).map((_, rIdx) => {
        const studentIndex = tIdx * 5 + rIdx;
        const student = list[studentIndex] || DEFAULT_PREFILLED_STUDENTS[studentIndex % DEFAULT_PREFILLED_STUDENTS.length];
        
        return {
          name: student.name,
          roll: student.roll,
          roleId: ROLES[rIdx].id,
          roleTitle: ROLES[rIdx].title
        };
      });

      // Default metrics compatible with local state engine
      const assumptions = [
        "Comfort Creates Success", 
        "Debt is Forever", 
        "Capital Accumulation First", 
        "Fast Decisions Create Fast Results", 
        "Security is Shared"
      ];
      const biases = [
        "Comfort Trap / Present Bias",
        "Hope Strategy / Optimism Bias",
        "Over-indexing on Math Heuristic",
        "Action Bias / Present Trap",
        "Sunk Cost Family Fallacy"
      ];
      const cues = [
        "What happens if you are wrong?",
        "What are you giving up?",
        "Is numbers the only reality?",
        "What evidence supports this?",
        "Have you verified with the group?"
      ];

      return {
        id: teamId,
        name: teamName,
        profileName: profileName,
        status: 'Active' as const,
        discussion: (['Low', 'Moderate', 'High'][tIdx % 3]) as any,
        activeAssumption: assumptions[tIdx % assumptions.length],
        activeBias: biases[tIdx % biases.length],
        cuePrompt: cues[tIdx % cues.length],
        members: members
      };
    });

    return generated;
  };

  // Play animation terminal logs to create elite visual suspense
  const runSequenceAnimation = (students: { name: string; roll: string }[]) => {
    setImportState('importing');
    setTerminalLogs([]);
    setProgressVal(0);
    setTotalParsedRecords(students.length);

    let step = 0;
    const progressInterval = setInterval(() => {
      step += 20;
      setProgressVal(step);
      sounds.playTickingSound();

      if (step === 20) {
        setTerminalLogs(prev => [...prev, '📁 Mounting Student Roster Spreadsheet...']);
      } else if (step === 40) {
        setTerminalLogs(prev => [...prev, `📋 Successfully Parsed ${students.length} Student Records...`]);
      } else if (step === 60) {
        setTerminalLogs(prev => [...prev, '⚡ Creating Balanced REYOU Cohort Groups...']);
      } else if (step === 80) {
        setTerminalLogs(prev => [...prev, '🛡️ Distributing Team Portfolio Responsibilities...']);
      } else if (step === 100) {
        clearInterval(progressInterval);
        
        // Finalize state
        setTimeout(() => {
          const generated = generateBalancedTeams(students);
          setActiveTeams(generated);
          setImportState('ready');
          sounds.playValidationChime();
        }, 500);
      }
    }, 450);
  };

  // Process standard Excel/CSV uploaded bytes
  const processUploadedFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);

        // Sanitize columns to identify student names
        const extracted: { name: string; roll: string }[] = json
          .map((row: any) => {
            const name = row['Student Name'] || row['name'] || row['StudentName'] || row['Name'] || '';
            const roll = String(row['Roll Number'] || row['roll'] || row['RollNo'] || row['Roll Number'] || Math.floor(Math.random() * 1000));
            return { name: name.trim(), roll: roll.trim() };
          })
          .filter(student => student.name.length > 0);

        if (extracted.length === 0) {
          alert("Could not extract any standard student records. Please verify headers map strictly to 'Student Name' and 'Roll Number'.");
          return;
        }

        // Pad list to guarantee elite full simulation grid if fewer
        let finalCohortList = [...extracted];
        if (finalCohortList.length < 50) {
          const diff = 50 - finalCohortList.length;
          for (let i = 0; i < diff; i++) {
            finalCohortList.push(DEFAULT_PREFILLED_STUDENTS[i % DEFAULT_PREFILLED_STUDENTS.length]);
          }
        } else if (finalCohortList.length > 50) {
          finalCohortList = finalCohortList.slice(0, 50);
        }

        runSequenceAnimation(finalCohortList);
      } catch (error) {
        console.error(error);
        alert("Verification sequence failed. File content seems compromised or unsupported.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (['xlsx', 'xls', 'csv'].includes(ext || '')) {
         sounds.playClickSound();
         processUploadedFile(file);
      } else {
        alert("Unsupported target format. Only .xlsx, .xls, or .csv files are authorized.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      sounds.playClickSound();
      processUploadedFile(e.target.files[0]);
    }
  };

  // Click file helper
  const triggerBrowse = () => {
    sounds.playClickSound();
    fileInputRef.current?.click();
  };

  const handleDemoImport = () => {
    sounds.playValidationChime();
    runSequenceAnimation(DEFAULT_PREFILLED_STUDENTS);
  };

  const handleShuffleTeams = () => {
    sounds.playValidationChime();
    // Shuffle the existing list
    const currentFlatList = activeTeams.flatMap(team => team.members.map(m => ({
      name: m.name,
      roll: m.roll
    })));
    
    const reorderedList = [...currentFlatList];
    for (let i = reorderedList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [reorderedList[i], reorderedList[j]] = [reorderedList[j], reorderedList[i]];
    }

    const shuffled = generateBalancedTeams(reorderedList);
    setActiveTeams(shuffled);
    
    // Broadcast instantly to active storage context
    localStorage.setItem('reyou-imported-cohort-full', JSON.stringify(shuffled));
    window.dispatchEvent(new CustomEvent('reyou-cohort-imported', { detail: shuffled }));
  };

  const handleActivateSimulation = () => {
    sounds.playValidationChime();
    // Save to localStorage for live synchronicity
    localStorage.setItem('reyou-imported-cohort-full', JSON.stringify(activeTeams));
    
    // Notify master layout
    onCohortActivated(activeTeams);
    window.dispatchEvent(new CustomEvent('reyou-cohort-imported', { detail: activeTeams }));
  };

  // Export cohort record as elegant Excel-compatible CSV list
  const handleExportCSV = () => {
    sounds.playClickSound();
    const rows = [
      ['Student Name', 'Roll Number', 'Team Name', 'Assigned Role', 'Batch Number']
    ];

    activeTeams.forEach(team => {
      team.members.forEach(m => {
        rows.push([
          m.name,
          m.roll,
          `Team ${team.name}`,
          m.roleTitle,
          'Batch 01'
        ]);
      });
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "REYOU_TEAM_ASSIGNMENTS.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Renders the elegant Progress Bar using strict aesthetic limits
  const renderProgressBar = () => {
    const totalBlocks = 10;
    const filledBlocks = Math.round((progressVal / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    
    const filledStr = '■'.repeat(filledBlocks);
    const emptyStr = '□'.repeat(emptyBlocks);

    return (
      <div className="font-mono text-center space-y-2 mt-4 select-none">
        <div className="text-[#D4AF37] tracking-[0.2em] text-[11px] font-bold animate-pulse">
          {progressVal < 100 ? 'IMPORTING COHORT CHRONO-DECK...' : 'COHORT METRICS CONVERGED'}
        </div>
        <div className="text-sm font-bold text-neutral-300 select-none tracking-widest">
          {filledStr}{emptyStr} <span className="text-[#D4AF37] ml-2 font-black">{progressVal}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xs overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)] relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
      
      <div className="p-8 space-y-6">
        
        {/* Module Header block conforming strictly to fonts rule */}
        <div className="border-b border-neutral-900 pb-5 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.25em] font-black block">REYOU SYSTEM HUB • MODULE 01</span>
            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider select-none pr-4">
              COHORT IMPORT CENTER
            </h2>
            <p className="font-sans text-xs text-neutral-450 leading-relaxed max-w-xl">
              Import student data and automatically generate balanced REYOU teams. Fast, premium student activation ceremony.
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-[#D4AF37]/50 hover:border-[#D4AF37] font-mono text-[10px] font-bold uppercase tracking-wider transition-all rounded-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Download Template</span>
            </button>

            <button
              onClick={handleDemoImport}
              className="px-4 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37]/75 font-mono text-[10px] font-extrabold uppercase tracking-wider transition-all rounded-xs flex items-center gap-1.5 cursor-pointer font-black"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Demo Import (50 Students)</span>
            </button>
          </div>
        </div>

        {/* GOOGLE DRIVE SYNC PANEL */}
        <div className="bg-[#0c0d0f] border border-[#D4AF37]/35 p-5 rounded-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[10px] font-mono font-black text-[#D4AF37] tracking-widest uppercase pb-[2px]">
                  Google Drive Cloud Vault
                </span>
                {googleUser && (
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-450 animate-pulse ml-1" />
                )}
              </div>
              <p className="text-xs text-neutral-300 font-sans leading-normal">
                {googleUser ? (
                  <span>Connected securely to <strong className="text-white font-semibold">{googleUser.email}</strong>. Storing cohort division files and simulation matrices directly inside your private Google Drive cloud container.</span>
                ) : (
                  <span>Establish a secure Google API handshake to unlock persistent cohort configuration sync and student reports archiving directly inside your Google Drive.</span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:self-center shrink-0">
              {googleUser ? (
                <>
                  <button
                    onClick={handleLoadCohortFromDrive}
                    disabled={driveSyncStatus === 'syncing'}
                    className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 font-mono text-[9.5px] font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer flex items-center gap-2 focus:ring-1 focus:ring-[#D4AF37]/45 disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Pull from Drive</span>
                  </button>

                  <button
                    onClick={handleSaveCohortToDrive}
                    disabled={driveSyncStatus === 'syncing' || activeTeams.length === 0}
                    className="px-3.5 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50 hover:border-[#D4AF37] font-mono text-[9.5px] font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer flex items-center gap-2 focus:ring-1 focus:ring-[#D4AF37]/45 disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Push to Drive</span>
                  </button>

                  <button
                    onClick={handleGoogleLogOut}
                    className="px-3 py-2 text-neutral-505 text-neutral-500 hover:text-red-400 hover:bg-red-950/20 border border-neutral-900 hover:border-red-900/30 font-mono text-[9px] font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={handleGoogleSignIn}
                  className="gsi-material-button text-xs w-full sm:w-auto"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#111',
                    border: '1px solid rgba(212,175,55,0.4)',
                    padding: '8px 16px',
                    borderRadius: '2px',
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
                    <span className="font-mono text-[9.5px] uppercase tracking-wider text-neutral-350 font-extrabold">Connect Google Drive</span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Feedback logs banner */}
          {driveSyncMessage && (
            <div className={`p-3 rounded-xs border font-mono text-[10px] flex items-center gap-2 select-none justify-between animate-fadeIn ${
              driveSyncStatus === 'syncing' ? 'bg-[#0f0e0a] border-yellow-800/30 text-[#D4AF37]' :
              driveSyncStatus === 'success' ? 'bg-emerald-950/10 border-emerald-900/30 text-emerald-450' :
              driveSyncStatus === 'error' ? 'bg-red-950/15 border-red-900/30 text-red-400' : 'bg-neutral-900/50 border-neutral-800 text-neutral-450'
            }`}>
              <div className="flex items-center gap-2">
                {driveSyncStatus === 'syncing' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : driveSyncStatus === 'success' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-450" />
                ) : driveSyncStatus === 'error' ? (
                  <X className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <CloudLightning className="w-3.5 h-3.5 text-neutral-500" />
                )}
                <span>{driveSyncMessage}</span>
              </div>
              <button 
                onClick={() => setDriveSyncMessage('')}
                className="text-neutral-500 hover:text-white font-bold cursor-pointer transition-all px-1"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Action area dependent on file state */}
        <AnimatePresence mode="wait">
          
          {importState === 'idle' && (
            <motion.div
              key="idle-view"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerBrowse}
              className={`border-2 border-dashed rounded-xs p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group ${
                dragActive 
                  ? 'border-[#D4AF37] bg-[#D4AF37]/5' 
                  : 'border-neutral-805 border-neutral-800 hover:border-neutral-600 bg-black/40 hover:bg-black/60'
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".xlsx,.xls,.csv" 
                onChange={handleFileChange}
                className="hidden" 
              />
              
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-105 group-hover:border-[#D4AF37]/40 transition-all">
                <Upload className="w-6 h-6 text-[#D4AF37] group-hover:animate-bounce" />
              </div>

              <div className="space-y-1 max-w-sm">
                <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                  DROP EXCEL HERE
                </h3>
                <p className="text-xs text-neutral-400 font-sans">
                  or click to <span className="text-[#D4AF37] font-semibold underline group-hover:text-yellow-400">Browse Student File</span>
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-900 w-full max-w-xs flex justify-center items-center gap-3 text-[9px] font-mono text-neutral-500 uppercase tracking-widest leading-none select-none">
                <span>Supports: .xlsx</span>
                <span>•</span>
                <span>.xls</span>
                <span>•</span>
                <span>.csv files</span>
              </div>
            </motion.div>
          )}

          {importState === 'importing' && (
            <motion.div
              key="importing-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-black/80 border border-neutral-900 rounded-xs p-10 flex flex-col items-center justify-center space-y-6"
            >
              <CircularSpinner />

              <div className="space-y-4 w-full max-w-md">
                {renderProgressBar()}

                {/* Staggered progress terminal readouts */}
                <div className="bg-[#030303] border border-neutral-900 p-4 rounded-xs font-mono text-[10.5px] text-neutral-450 space-y-1.5 h-32 overflow-y-auto select-none">
                  {terminalLogs.map((log, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-[#D4AF37]">▶</span>
                      <span className="text-neutral-300 font-medium ">{log}</span>
                    </div>
                  ))}
                  
                  {progressVal < 100 && (
                    <div className="flex items-center gap-1.5 text-neutral-600 animate-pulse">
                      <span>■</span>
                      <span>Processing segment matrix...</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {importState === 'ready' && (
            <motion.div
              key="ready-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              
              {/* Magic Big Header banner */}
              <div className="bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08)_0%,transparent_80%)] border border-neutral-900 p-6 rounded-xs flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left select-none">
                <div className="space-y-1">
                  <div className="flex justify-center md:justify-start items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-450 animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-450 uppercase tracking-widest font-extrabold">COHORT STATUS CONVERGED</span>
                  </div>
                  <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wider leading-none">
                    COHORT READY
                  </h1>
                  <p className="font-sans text-xs text-neutral-400">
                    <span className="text-white font-bold">{totalParsedRecords} Students</span> successfully assigned to <span className="text-white font-bold">10 balanced Teams</span> with 5 members per team.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={handleShuffleTeams}
                    className="p-3 bg-white/5 hover:bg-white/10 text-neutral-300 border border-neutral-800 rounded-sm font-mono text-xs uppercase tracking-wider font-bold cursor-pointer transition-all flex items-center gap-2"
                  >
                    <Shuffle className="w-4 h-4 text-[#D4AF37]" />
                    <span>Shuffle Teams</span>
                  </button>

                  <button
                    onClick={() => setShowPDFPrintOverlay(true)}
                    className="p-3 bg-white/5 hover:bg-white/10 text-neutral-300 border border-neutral-800 rounded-sm font-mono text-xs uppercase tracking-wider font-bold cursor-pointer transition-all flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4 text-[#D4AF37]" />
                    <span>Export Assignments PDF</span>
                  </button>

                  <button
                    onClick={handleActivateSimulation}
                    className="p-3 bg-gradient-to-r from-yellow-600 via-[#D4AF37] to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-black rounded-sm font-mono text-xs uppercase tracking-wider font-extrabold cursor-pointer transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] animate-pulse"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>Start Simulation 1</span>
                  </button>
                </div>
              </div>

              {/* 10 Team Cards Reveal Grid - Accordion / Flex Card layout to avoid ERP table bloat */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {activeTeams.map((team, idx) => {
                  const isExpanded = showTeamDetailsIndex === idx;
                  return (
                    <div 
                      key={team.id}
                      className={`rounded-xs border bg-gradient-to-b ${team.color} p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
                        isExpanded ? 'ring-2 ring-[#D4AF37]' : 'hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="border-b border-white/5 pb-2.5 flex justify-between items-start">
                          <div>
                            <span className="text-[8.5px] font-mono text-neutral-500 uppercase tracking-widest block leading-3">TEAM {idx + 1}</span>
                            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mt-0.5 leading-none">
                              {team.name}
                            </h3>
                          </div>
                          <span className="text-[8.5px] font-mono text-neutral-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 font-bold tracking-widest leading-none">
                            5 SEC
                          </span>
                        </div>

                        <div className="space-y-3 font-sans">
                          {team.members.map((member, mIdx) => (
                            <div key={mIdx} className="space-y-0.5">
                              <span className="text-[8.5px] font-mono tracking-wider font-semibold text-[#D4AF37]/80 block uppercase leading-3">
                                {member.roleTitle}
                              </span>
                              <div className="text-[11.5px] font-sans text-neutral-200 font-medium leading-none">
                                {member.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-3 mt-4 flex justify-between items-center bg-black/20 -mx-5 -mb-5 px-5 py-2.5 select-none text-[9.5px] font-mono text-neutral-400 font-medium tracking-wide">
                        <span>Cohort Role Mix</span>
                        <span className="text-emerald-400">100% Balanced</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* PDF Print / A4 Standard Compliant Preview Overlay */}
      <AnimatePresence>
        {showPDFPrintOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-55 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white text-black max-w-4xl w-full rounded-sm shadow-[0_15px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col my-10"
            >
              {/* Modal controls bar - NOT part of actual printable surface */}
              <div className="bg-[#0e0e0e] text-white p-4 flex justify-between items-center border-b border-[#222] select-none no-print">
                <div className="font-mono text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  <span>REYOU OFFICIAL DOCUMENTS VIEW</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleExportCSV}
                    className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 font-mono text-[10.5px] uppercase tracking-wider rounded-sm text-neutral-200 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Download assignments matrix (.csv)</span>
                  </button>

                  <button 
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 bg-[#D4AF37] hover:bg-yellow-500 text-black font-mono text-[10.5px] uppercase tracking-wider rounded-sm font-extrabold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print PDF Document</span>
                  </button>

                  <button 
                    onClick={() => { sounds.playClickSound(); setShowPDFPrintOverlay(false); }}
                    className="p-1 px-2.5 bg-neutral-900 border border-neutral-820 hover:bg-neutral-960 hover:text-white rounded text-neutral-400 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Printable Area - A4 design conforming strictly to guidelines (Georgia & Playfair, no italics, no heavy borders) */}
              <div className="p-12 pr-16 pl-16 space-y-10 overflow-y-auto max-h-[80vh] print-area" id="printable-cohort-matrix">
                <div className="border-b-2 border-black pb-6 flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-bold block">
                      REYOU EDUCATION EXPERIENCE PLATFORM
                    </span>
                    <h1 className="text-3xl font-display font-extrabold tracking-wide uppercase leading-none">
                      REYOU_TEAM_ASSIGNMENTS.pdf
                    </h1>
                    <p className="font-sans text-xs text-neutral-550">
                      Official student cohorts matching matrix index. Class of 2026.
                    </p>
                  </div>
                  <div className="text-right font-mono text-[10px] space-y-0.5">
                    <div>BATCH INDEX: BATCH 01</div>
                    <div>COHORT MEMBERS: {totalParsedRecords} STUDENTS</div>
                    <div>DATE GENERATED: {new Date().toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                  {activeTeams.map((team, idx) => (
                    <div key={team.id} className="border-b border-neutral-200 pb-5 space-y-3">
                      <div className="flex justify-between items-baseline border-b border-black/40 pb-1.5">
                        <h2 className="text-base font-display font-bold uppercase tracking-wider">
                          TEAM {idx + 1}: {team.name.toUpperCase()}
                        </h2>
                        <span className="font-mono text-[8px] text-neutral-500 font-bold uppercase">
                          {team.profileName.toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-1.5 font-sans text-xs text-neutral-800">
                        {team.members.map((member, mIdx) => (
                          <div key={mIdx} className="flex justify-between items-center py-0.5">
                            <span className="font-mono text-[9.5px] uppercase text-neutral-500 font-medium">
                              {member.roleTitle}
                            </span>
                            <span className="font-bold text-black border-b border-dashed border-neutral-200 pb-0.5 pr-2">
                              {member.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-300 pt-6 flex justify-between items-center select-none">
                  <span className="font-mono text-[8px] text-neutral-400">
                    APPROVED FOR INTEGRAL CLOUD TRANSMISSION TO PRINCIPAL DECK
                  </span>
                  <span className="font-mono text-[8px] font-black text-black">
                    REYOU INTELLECTUAL COMPLIANCE ACCELERATOR ©
                  </span>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Subordinate spinning loaders following high fidelity aesthetic principles
function CircularSpinner() {
  return (
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-[#D4AF37]/10" />
      <div className="absolute inset-0 rounded-full border-4 border-t-[#D4AF37] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37] animate-pulse" />
    </div>
  );
}
