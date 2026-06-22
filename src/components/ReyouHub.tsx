import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, FileText, Camera, CheckCircle, MessageSquare, BarChart3, 
  Users, BookOpen, Star, ArrowRight, Download, Plus, Trash2, 
  Share2, ThumbsUp, Sparkles, Filter, RotateCcw, ShieldCheck, Check,
  Bot
} from 'lucide-react';
import { jsPDF } from 'jspdf';

// Define structures for our database
interface StudentFeedback {
  id: string;
  studentName: string;
  rollNo: string;
  email: string;
  teamId: string;
  engaging: number; // 1-5
  enjoyedSim: number; // 1-5
  learnedNew: number; // 1-5
  relevantLife: number; // 1-5
  recommend: number; // 1-5
  learningTopics: string[]; // Saving, Spending, Risk, etc.
  decisionComments: string;
  npsScore: number; // 0-10
  timestamp: string;
}

interface TeacherFeedback {
  id: string;
  teacherName: string;
  designation: string;
  engagementRating: number; // 1-5
  relevanceRating: number; // 1-5
  communicationRating: number; // 1-5
  facilitationRating: number; // 1-5
  outcomesRating: number; // 1-5
  recommendFuture: 'YES' | 'NO';
  comments: string;
  timestamp: string;
}

interface Testimonial {
  id: string;
  type: 'STUDENT' | 'TEACHER' | 'PRINCIPAL';
  name: string;
  titleOrClass: string;
  quote: string;
  photoConsent: boolean;
  publishedAllowed: boolean;
}

interface SchoolPhoto {
  id: string;
  url: string;
  caption: string;
  teamTag: string;
  phaseId: string;
  timestamp: string;
}

// Initial realistic database mock data reflecting Army Public School, Bhopal (Grade XII Cohort)
const INITIAL_STUDENTS_FEEDBACK: StudentFeedback[] = [
  {
    id: 'st-01',
    studentName: 'Aarav Sharma',
    rollNo: '2026-XIIA-42',
    email: 'aarav.sharma@gmail.com',
    teamId: 'TEAM_ALPHA',
    engaging: 5,
    enjoyedSim: 5,
    learnedNew: 5,
    relevantLife: 5,
    recommend: 5,
    learningTopics: ['Decision Making', 'Risk', 'Saving'],
    decisionComments: ' Rerouting rental savings from high-tier apartments back into emergency assets completely reset my view of wealth.',
    npsScore: 10,
    timestamp: '2026-06-22 10:15'
  },
  {
    id: 'st-02',
    studentName: 'Sneha Deshmukh',
    rollNo: '2026-XIIB-18',
    email: 'sneha.commerce@outlook.com',
    teamId: 'TEAM_CHARLIE',
    engaging: 5,
    enjoyedSim: 4,
    learnedNew: 5,
    relevantLife: 5,
    recommend: 5,
    learningTopics: ['Saving', 'Scams', 'Decision Making'],
    decisionComments: 'We realigned our strategies as a boardroom to avoid digital trap offers. The Scam Lab is an absolute eye-opener.',
    npsScore: 10,
    timestamp: '2026-06-22 10:32'
  },
  {
    id: 'st-03',
    studentName: 'Manish Rawat',
    rollNo: '2026-XIIC-09',
    email: 'rawat.manish.aps@hotmail.com',
    teamId: 'TEAM_DELTA',
    engaging: 4,
    enjoyedSim: 5,
    learnedNew: 4,
    relevantLife: 5,
    recommend: 4,
    learningTopics: ['Spending', 'Risk', 'Leadership'],
    decisionComments: 'I realized my bias as a Risk Analyst was overconfident, almost dismissing structural loan traps until they hit us.',
    npsScore: 9,
    timestamp: '2026-06-22 10:48'
  },
  {
    id: 'st-04',
    studentName: 'Ananya Joshi',
    rollNo: '2026-XIIA-12',
    email: 'ananya.joshi26@gmail.com',
    teamId: 'TEAM_Patel',
    engaging: 5,
    enjoyedSim: 5,
    learnedNew: 5,
    relevantLife: 5,
    recommend: 5,
    learningTopics: ['Decision Making', 'Leadership', 'Scams'],
    decisionComments: 'The Spotlight protocol forced us to address competing designs. Our peers made us realize travel time is a true liability.',
    npsScore: 10,
    timestamp: '2026-06-22 11:05'
  },
  {
    id: 'st-05',
    studentName: 'Vivek Chawla',
    rollNo: '2026-XIID-22',
    email: 'vivek_apsbhopal@gmail.com',
    teamId: 'TEAM_KALAM',
    engaging: 3,
    enjoyedSim: 4,
    learnedNew: 4,
    relevantLife: 4,
    recommend: 4,
    learningTopics: ['Saving', 'Spending', 'Scams'],
    decisionComments: 'Deciding budget allocations is far more complicated than simple maths when team opinions clash.',
    npsScore: 8,
    timestamp: '2026-06-22 11:15'
  }
];

const INITIAL_TEACHERS_FEEDBACK: TeacherFeedback[] = [
  {
    id: 'tch-01',
    teacherName: 'Mr. S. K. Sharma',
    designation: 'PGT Commerce',
    engagementRating: 5,
    relevanceRating: 5,
    communicationRating: 5,
    facilitationRating: 5,
    outcomesRating: 5,
    recommendFuture: 'YES',
    comments: 'The Grade XII students usually view finances purely as mathematical formulas. This cohort translated textbooks into genuine leadership struggles and risk evaluation.',
    timestamp: '2026-06-22 11:30'
  },
  {
    id: 'tch-02',
    teacherName: 'Mrs. Anjali Saxena',
    designation: 'PGT Humanities',
    engagementRating: 5,
    relevanceRating: 4,
    communicationRating: 5,
    facilitationRating: 5,
    outcomesRating: 5,
    recommendFuture: 'YES',
    comments: 'Seeing normally quiet students debate intensely as Strategy Leads and Risk Officers was incredible. It targets developmental psychology perfectly.',
    timestamp: '2026-06-22 11:45'
  }
];

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'tst-01',
    type: 'STUDENT',
    name: 'Ananya Joshi',
    titleOrClass: 'Class XII-A Student Leader',
    quote: 'This program was the first time I felt our virtual decisions carried absolute, heavy real-world consequences. We fought for our boardroom priorities!',
    photoConsent: true,
    publishedAllowed: true
  },
  {
    id: 'tst-02',
    type: 'TEACHER',
    name: 'Mr. S. K. Sharma',
    titleOrClass: 'Senior PGT Commerce Instructor',
    quote: 'REYOU bridges the critical gap between passive financial literacy and strategic personal responsibility. This is decision intelligence at its finest.',
    photoConsent: true,
    publishedAllowed: true
  },
  {
    id: 'tst-03',
    type: 'PRINCIPAL',
    name: 'Dr. Sandeep Kumar',
    titleOrClass: 'Principal, Army Public School Bhopal',
    quote: 'Preparing our youth for future uncertainties requires giving them the playground to fail safely and reflect rigorously. The operational analytics are highly valuable.',
    photoConsent: true,
    publishedAllowed: true
  }
];

const INITIAL_PHOTOS: SchoolPhoto[] = [
  {
    id: 'ph-01',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60',
    caption: 'Team Jhansi debating whether Premium Commute proximity beats Practical Rent savings.',
    teamTag: 'TEAM JHANSI',
    phaseId: 'Simulation 2',
    timestamp: '2026-06-22 10:20'
  },
  {
    id: 'ph-02',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=60',
    caption: 'Scam Detection Lab: Strategy Officers analyzing digital payment verification prompts.',
    teamTag: 'TEAM KALAM',
    phaseId: 'Module 3 Lab',
    timestamp: '2026-06-22 10:45'
  },
  {
    id: 'ph-03',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=60',
    caption: 'Boardroom Defence: Representative defending chosen structural debt limits to the class.',
    teamTag: 'TEAM AZAD',
    phaseId: 'Boardroom Pitch',
    timestamp: '2026-06-22 11:10'
  }
];

const SAMPLES_STUDENTS_LIST = [
  { name: 'Arjun Kapoor', team: 'TEAM JHANSI', role: 'CHIEF FINANCIAL OFFICER' },
  { name: 'Diya Malhotra', team: 'TEAM BHAGAT', role: 'RISK ANALYST' },
  { name: 'Riddhima Sharma', team: 'TEAM CHANAKYA', role: 'STRATEGY LEAD' },
  { name: 'Kunal Sen', team: 'TEAM AZAD', role: 'INVESTMENT STRATEGIST' },
  { name: 'Pranav Nair', team: 'TEAM PALAS', role: 'DECISION COMPLIANCE' },
  { name: 'Tanvi Birla', team: 'TEAM KALAM', role: 'CHIEF RISK OFFICER' },
  { name: 'Siddharth Roy', team: 'TEAM NETAJI', role: 'CHIEF FINANCIAL OFFICER' }
];

export default function ReyouHub() {
  const [activeTab, setActiveTab] = useState<string>('STUDENT_FEEDBACK');

  // Unified persistence states
  const [studentFeedbacks, setStudentFeedbacks] = useState<StudentFeedback[]>(() => {
    const saved = localStorage.getItem('reyou-db-students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS_FEEDBACK;
  });

  const [teacherFeedbacks, setTeacherFeedbacks] = useState<TeacherFeedback[]>(() => {
    const saved = localStorage.getItem('reyou-db-teachers');
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS_FEEDBACK;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('reyou-db-testimonials');
    return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  const [photos, setPhotos] = useState<SchoolPhoto[]>(() => {
    const saved = localStorage.getItem('reyou-db-photos');
    return saved ? JSON.parse(saved) : INITIAL_PHOTOS;
  });

  useEffect(() => {
    localStorage.setItem('reyou-db-students', JSON.stringify(studentFeedbacks));
  }, [studentFeedbacks]);

  useEffect(() => {
    localStorage.setItem('reyou-db-teachers', JSON.stringify(teacherFeedbacks));
  }, [teacherFeedbacks]);

  useEffect(() => {
    localStorage.setItem('reyou-db-testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('reyou-db-photos', JSON.stringify(photos));
  }, [photos]);

  // MODULE 1: Student Feedback State
  const [sfName, setSfName] = useState('');
  const [sfRoll, setSfRoll] = useState('');
  const [sfEmail, setSfEmail] = useState('');
  const [sfTeam, setSfTeam] = useState('TEAM_ALPHA');
  const [sfEngaging, setSfEngaging] = useState<number>(5);
  const [sfEnjoyedSim, setSfEnjoyedSim] = useState<number>(5);
  const [sfLearnedNew, setSfLearnedNew] = useState<number>(5);
  const [sfRelevantLife, setSfRelevantLife] = useState<number>(5);
  const [sfRecommend, setSfRecommend] = useState<number>(5);
  const [sfTopics, setSfTopics] = useState<string[]>([]);
  const [sfComments, setSfComments] = useState('');
  const [sfNps, setSfNps] = useState<number>(10);
  const [studentSuccessMsg, setStudentSuccessMsg] = useState(false);

  const toggleTopic = (topic: string) => {
    if (sfTopics.includes(topic)) {
      setSfTopics(sfTopics.filter(t => t !== topic));
    } else {
      setSfTopics([...sfTopics, topic]);
    }
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sfName.trim()) return alert('Student Name is required.');
    
    const newFeedback: StudentFeedback = {
      id: `st-${Date.now()}`,
      studentName: sfName,
      rollNo: sfRoll || 'N/A',
      email: sfEmail || 'anonymous@school.edu',
      teamId: sfTeam,
      engaging: sfEngaging,
      enjoyedSim: sfEnjoyedSim,
      learnedNew: sfLearnedNew,
      relevantLife: sfRelevantLife,
      recommend: sfRecommend,
      learningTopics: sfTopics.length > 0 ? sfTopics : ['Decision Making'],
      decisionComments: sfComments,
      npsScore: sfNps,
      timestamp: new Date().toISOString().substring(0, 16).replace('T', ' ')
    };

    setStudentFeedbacks([newFeedback, ...studentFeedbacks]);
    
    // Automatically register testimonial if comment is detailed
    if (sfComments.length > 20) {
      const newTst: Testimonial = {
        id: `tst-${Date.now()}`,
        type: 'STUDENT',
        name: sfName,
        titleOrClass: `Class XII [Team ${sfTeam.replace('TEAM_', '')}]`,
        quote: sfComments,
        photoConsent: true,
        publishedAllowed: true
      };
      setTestimonials(prev => [newTst, ...prev]);
    }

    // Reset Form
    setSfName('');
    setSfRoll('');
    setSfEmail('');
    setSfTopics([]);
    setSfComments('');
    setStudentSuccessMsg(true);
    setTimeout(() => setStudentSuccessMsg(false), 5000);
  };

  // MODULE 2: Teacher Feedback State
  const [tfName, setTfName] = useState('');
  const [tfDesignation, setTfDesignation] = useState('PGT Commerce');
  const [tfEng, setTfEng] = useState(5);
  const [tfRel, setTfRel] = useState(5);
  const [tfCom, setTfCom] = useState(5);
  const [tfFac, setTfFac] = useState(5);
  const [tfOut, setTfOut] = useState(5);
  const [tfRec, setTfRec] = useState<'YES' | 'NO'>('YES');
  const [tfComments, setTfComments] = useState('');
  const [teacherSuccessMsg, setTeacherSuccessMsg] = useState(false);

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tfName.trim()) return alert('Teacher Name is required.');
    
    const newFeedback: TeacherFeedback = {
      id: `tch-${Date.now()}`,
      teacherName: tfName,
      designation: tfDesignation,
      engagementRating: tfEng,
      relevanceRating: tfRel,
      communicationRating: tfCom,
      facilitationRating: tfFac,
      outcomesRating: tfOut,
      recommendFuture: tfRec,
      comments: tfComments,
      timestamp: new Date().toISOString().substring(0, 16).replace('T', ' ')
    };

    setTeacherFeedbacks([newFeedback, ...teacherFeedbacks]);

    if (tfComments.length > 15) {
      const newTst: Testimonial = {
        id: `tst-${Date.now() + 1}`,
        type: 'TEACHER',
        name: tfName,
        titleOrClass: tfDesignation,
        quote: tfComments,
        photoConsent: true,
        publishedAllowed: true
      };
      setTestimonials(prev => [newTst, ...prev]);
    }

    setTfName('');
    setTfComments('');
    setTeacherSuccessMsg(true);
    setTimeout(() => setTeacherSuccessMsg(false), 4000);
  };

  // MODULE 4: NPS Calculation Engine
  const totalNpsResponses = studentFeedbacks.length;
  const promoters = studentFeedbacks.filter(f => f.npsScore >= 9).length;
  const passives = studentFeedbacks.filter(f => f.npsScore >= 7 && f.npsScore <= 8).length;
  const detractors = studentFeedbacks.filter(f => f.npsScore <= 6).length;

  const pctPromoters = totalNpsResponses ? (promoters / totalNpsResponses) * 100 : 0;
  const pctDetractors = totalNpsResponses ? (detractors / totalNpsResponses) * 100 : 0;
  const calculatedNps = totalNpsResponses ? Math.round(pctPromoters - pctDetractors) : 0;

  // Sandbox NPS Adjustment Tool
  const [sbPromoters, setSbPromoters] = useState(15);
  const [sbPassives, setSbPassives] = useState(4);
  const [sbDetractors, setSbDetractors] = useState(1);
  const sbTotal = sbPromoters + sbPassives + sbDetractors;
  const sbNps = sbTotal ? Math.round(((sbPromoters / sbTotal) - (sbDetractors / sbTotal)) * 100) : 0;

  // MODULE 5: Certificate Generator State
  const [certName, setCertName] = useState('Ananya Joshi');
  const [certTeam, setCertTeam] = useState('TEAM JHANSI');
  const [certRole, setCertRole] = useState('CHIEF FINANCIAL OFFICER');
  const [certDate, setCertDate] = useState('22 June 2026');
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Simple high quality vector drawing for portable printing
    doc.setFillColor(15, 18, 25); // #0F1219 background
    doc.rect(0, 0, 297, 210, 'F');
    
    // Borders
    doc.setDrawColor(212, 175, 55); // #D4AF37
    doc.setLineWidth(1.5);
    doc.rect(10, 10, 277, 190);
    doc.setLineWidth(0.5);
    doc.rect(13, 13, 271, 184);

    // Context headers
    doc.setTextColor(212, 175, 55);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('REYOU STUDENT COHORT DISCOVERY EXPEDITION', 148, 30, { align: 'center' });

    // Main Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text('CERTIFICATE OF DISTINCTION', 148, 55, { align: 'center' });
    
    // Sub-Label
    doc.setTextColor(170, 170, 170);
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'normal');
    doc.text('This credential is officially conferred to', 148, 72, { align: 'center' });

    // Name
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(26);
    doc.text(certName.toUpperCase(), 148, 88, { align: 'center' });

    // Underline
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1);
    doc.line(90, 94, 207, 94);

    // Narrative
    doc.setTextColor(180, 180, 180);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(11);
    const line1 = `For exemplary leadership and performance in the "Financial Intelligence, Decision Intelligence & Future Readiness" cohort.`;
    const line2 = `Actively functioned as the designated ${certRole} representing ${certTeam}`;
    const line3 = 'at Army Public School, Bhopal, executing board trade-off matrices under extreme environmental risks.';
    doc.text(line1, 148, 106, { align: 'center' });
    doc.text(line2, 148, 114, { align: 'center' });
    doc.text(line3, 148, 122, { align: 'center' });

    // Footers
    doc.setDrawColor(212, 175, 55);
    doc.line(40, 160, 100, 160);
    doc.line(197, 160, 257, 160);

    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.text('Business Head', 70, 166, { align: 'center' });
    doc.text('REYOU Education', 70, 171, { align: 'center' });
    doc.text('REYOU OS OPC PVT LTD', 70, 176, { align: 'center' });

    doc.text('Dr. Sandeep Kumar', 227, 166, { align: 'center' });
    doc.text('Principal Authority', 227, 171, { align: 'center' });
    doc.text('Army Public School Bhopal', 227, 176, { align: 'center' });

    doc.setFont('Helvetica', 'italic');
    doc.setTextColor(212, 175, 55);
    doc.text(`Official Date: ${certDate}`, 148, 185, { align: 'center' });

    doc.save(`REYOU-Distinction-${certName.replace(/\s+/g, '-')}.pdf`);
  };

  // MODULE 6: Photo Gallery Manager State
  const [photoInputUrl, setPhotoInputUrl] = useState('');
  const [photoInputCaption, setPhotoInputCaption] = useState('');
  const [photoInputTag, setPhotoInputTag] = useState('TEAM JHANSI');
  const [photoInputPhase, setPhotoInputPhase] = useState('Simulation 2');
  const [galleryFilter, setGalleryFilter] = useState('ALL');

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    const url = photoInputUrl.trim() || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60';
    const newPhoto: SchoolPhoto = {
      id: `ph-${Date.now()}`,
      url,
      caption: photoInputCaption || 'Active team brainstorming in session room.',
      teamTag: photoInputTag,
      phaseId: photoInputPhase,
      timestamp: new Date().toISOString().substring(0, 16).replace('T', ' ')
    };
    setPhotos([newPhoto, ...photos]);
    setPhotoInputUrl('');
    setPhotoInputCaption('');
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos(photos.filter(p => p.id !== id));
  };

  // MODULE 7: Testimonial Collector State
  const [testType, setTestType] = useState<'STUDENT' | 'TEACHER' | 'PRINCIPAL'>('STUDENT');
  const [testName, setTestName] = useState('');
  const [testTitle, setTestTitle] = useState('');
  const [testQuote, setTestQuote] = useState('');
  const [testConsent, setTestConsent] = useState(true);
  const [testPublish, setTestPublish] = useState(true);

  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim() || !testQuote.trim()) return alert('Name and Quote are required.');

    const newTest: Testimonial = {
      id: `tst-${Date.now()}`,
      type: testType,
      name: testName,
      titleOrClass: testTitle || (testType === 'STUDENT' ? 'Class XII student' : 'Staff faculty'),
      quote: testQuote,
      photoConsent: testConsent,
      publishedAllowed: testPublish
    };

    setTestimonials([newTest, ...testimonials]);
    setTestName('');
    setTestTitle('');
    setTestQuote('');
  };

  // MODULE 9: Google Review Funnel State
  const [ratingsVal, setRatingsVal] = useState<number>(0);
  const [funnelSection, setFunnelSection] = useState<'RATING' | 'GOOGLE_PROMPT' | 'INTERNAL_FEEDBACK'>('RATING');
  const [internalFeedbackText, setInternalFeedbackText] = useState('');

  const handleStarClick = (val: number) => {
    setRatingsVal(val);
    if (val >= 4) {
      setFunnelSection('GOOGLE_PROMPT');
    } else {
      setFunnelSection('INTERNAL_FEEDBACK');
    }
  };

  const handleInternalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRatingsVal(0);
    setFunnelSection('RATING');
    setInternalFeedbackText('');
    alert('Thank you for your constructive critique. Our facilitation team is reviewing this privately to improve.');
  };

  return (
    <div className="bg-neutral-950 text-white min-h-[90vh] py-8 rounded-sm overflow-hidden" id="reyou-hub-container">
      
      {/* HUB HERO HEADER */}
      <div className="max-w-7xl mx-auto px-6 border-b border-white/5 pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5Packed">
              <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-2.5 py-0.5 rounded border border-[#D4AF37]/30 font-extrabold animate-pulse">
                🛡️ REYOU SCHOOL OPERATING SYSTEM
              </span>
              <span className="text-[9px] font-mono text-neutral-400">Ver 2.6.1</span>
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight text-white uppercase sm:text-4xl">
              Army Public School Bhopal <span className="text-neutral-500 font-normal">Cohort Hub</span>
            </h1>
            <p className="text-xs text-neutral-400 font-sans mt-1 max-w-2xl leading-relaxed">
              Program Outcome & System Architecture portal for Grade XII’s 
              <strong className="text-white"> Financial Intelligence, Decision Intelligence & Future Readiness Program</strong>. 
              Deploying 200 student decision matrices across 40 distinct team environments.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-neutral-900 border border-white/5 p-3 rounded-sm leading-none font-mono">
            <Users className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Cohort Scope</span>
              <span className="text-sm font-black text-white">200 Students • 40 Teams</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        
        {/* SIDE BAR NAVIGATION */}
        <aside className="lg:col-span-3 space-y-2">
          <div className="text-[10px] font-mono text-[#D4AF37] px-3 font-semibold uppercase tracking-widest">
            Modules Selection
          </div>
          
          <nav className="space-y-1.5">
            {[
              { id: 'STUDENT_FEEDBACK', label: '1. Student Feedback Portal', icon: Users },
              { id: 'TEACHER_FEEDBACK', label: '2. Teacher Feedback Portal', icon: BookOpen },
              { id: 'PRINCIPAL_DASHBOARD', label: '3. Principal Dashboard', icon: BarChart3 },
              { id: 'NPS_ENGINE', label: '4. NPS Evaluation Engine', icon: ShieldCheck },
              { id: 'CERTIFICATE_GEN', label: '5. Distinction Certificate', icon: Award },
              { id: 'PHOTO_GALLERY', label: '6. Live Laboratory Photos', icon: Camera },
              { id: 'TESTIMONIAL_COLLECT', label: '7. Testimonials Wall', icon: MessageSquare },
              { id: 'CASE_STUDY_GEN', label: '8. APS Case Study Sheet', icon: FileText },
              { id: 'GOOGLE_FUNNEL', label: '9. Google Review Funnel', icon: Star },
              { id: 'APS_REPORT_GEN', label: '10. PDF Institutional Report', icon: Sparkles }
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left font-mono text-xs uppercase font-semibold py-3 px-4 rounded-xs flex items-center gap-3 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-extrabold shadow-sm'
                      : 'text-neutral-400 bg-white/5 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* WORKSTAGE VIEW PANEL */}
        <main className="lg:col-span-9 bg-neutral-900 border border-white/5 rounded-sm p-6 relative min-h-[500px]">
          
          {/* MODULE 1: Student Feedback Portal */}
          {activeTab === 'STUDENT_FEEDBACK' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="font-mono text-[10px] text-[#D4AF37] uppercase font-bold tracking-widest block mb-1">
                  Active System 1
                </span>
                <h2 className="text-xl font-display font-extrabold text-white uppercase tracking-tight">
                  Grade XII Student Feedback Portal
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Collects real-time quantitative rating and custom reflection datasets following OECD self-directed educational matrices.
                </p>
              </div>

              {studentSuccessMsg && (
                <div className="bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 p-4 rounded-sm text-xs font-mono flex items-center gap-3">
                  <Check className="w-4 h-4" />
                  Student submission saved to local state! Principal Dashboard and NPS Engine recalculated inside active memory.
                </div>
              )}

              <form onSubmit={handleStudentSubmit} className="space-y-6 bg-neutral-950/60 p-6 rounded border border-white/5">
                <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-400 border-b border-white/5 pb-2">
                  Student Profiles & Demographics
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase font-semibold">Student Name *</label>
                    <input 
                      type="text" 
                      value={sfName} 
                      onChange={(e) => setSfName(e.target.value)} 
                      placeholder="e.g. Priyanshu Sharma" 
                      className="w-full bg-neutral-900 border border-white/10 px-3 py-2 rounded-sm text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-neutral-400 uppercase font-semibold">Roll Number</label>
                      <input 
                        type="text" 
                        value={sfRoll} 
                        onChange={(e) => setSfRoll(e.target.value)} 
                        placeholder="e.g. XIIA-18" 
                        className="w-full bg-neutral-900 border border-white/10 px-3 py-2 rounded-sm text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-neutral-400 uppercase font-semibold">Team Room</label>
                      <select 
                        value={sfTeam} 
                        onChange={(e) => setSfTeam(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 px-3 py-2.5 rounded-sm text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="TEAM_ALPHA">Team Jhansi</option>
                        <option value="TEAM_BRAVO">Team Bhagat</option>
                        <option value="TEAM_CHARLIE">Team Chanakya</option>
                        <option value="TEAM_DELTA">Team Azad</option>
                        <option value="TEAM_ECHO">Team Netaji</option>
                        <option value="TEAM_FOXTROT">Team Patel</option>
                        <option value="TEAM_KALAM">Team Kalam</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase font-semibold block">Email Address</label>
                  <input 
                    type="email" 
                    value={sfEmail} 
                    onChange={(e) => setSfEmail(e.target.value)} 
                    placeholder="studentname@apsbhopal.edu.in" 
                    className="w-full bg-neutral-900 border border-white/10 px-3 py-2 rounded-sm text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-400 border-b border-white/5 pb-2 pt-2">
                  Section A: Interactive Experience Ratings (Rate 1 to 5)
                </h3>

                <div className="space-y-4">
                  {[
                    { state: sfEngaging, setter: setSfEngaging, label: 'The session was engaging.' },
                    { state: sfEnjoyedSim, setter: setSfEnjoyedSim, label: 'I loved executing decision matrices as a team.' },
                    { state: sfLearnedNew, setter: setSfLearnedNew, label: 'I learned new mental models on risks & debts.' },
                    { state: sfRelevantLife, setter: setSfRelevantLife, label: 'The challenges presented are extremely relevant to my future.' },
                    { state: sfRecommend, setter: setSfRecommend, label: 'I would highly recommend this cohort to peer friends.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-neutral-900/60 p-3 rounded-sm border border-white/5">
                      <span className="text-xs font-medium text-neutral-300">{item.label}</span>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => item.setter(star)}
                            className="p-1 cursor-pointer"
                          >
                            <Star className={`w-4 h-4 ${star <= item.state ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-neutral-700'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-400 border-b border-white/5 pb-2">
                  Section B: Pedagogical Outcomes
                </h3>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase">What financial/decision concept did you learn about most?</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-1">
                    {['Saving & Allocations', 'Lifestyle Spending', 'Risk & Leverage', 'Digital Scams', 'Decision Under Threat', 'Dynamic Leadership'].map((topic) => {
                      const isSelected = sfTopics.includes(topic);
                      return (
                        <button
                          type="button"
                          key={topic}
                          onClick={() => toggleTopic(topic)}
                          className={`py-2 px-3 text-left font-mono rounded border text-xs font-bold transition-all ${
                            isSelected 
                              ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]' 
                              : 'bg-neutral-900 border-white/5 text-neutral-400 hover:border-white/20'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '} {topic}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-400 border-b border-white/5 pb-2">
                  Section C: Constructive Reflection Matrix
                </h3>

                <div className="space-y-2">
                  <label className="text-[11px] text-neutral-300 font-sans block leading-relaxed">
                    What is one structural decision you will make differently after this cohort program? (Consider rent trade-offs, loan traps, or scam detection models)
                  </label>
                  <textarea 
                    value={sfComments} 
                    onChange={(e) => setSfComments(e.target.value)} 
                    rows={4}
                    placeholder="We realized that choosing premium rent leaves zero capital resilience. High-interest debt compounds quickly, so lifestyle can wait. This simulation makes it extremely clear." 
                    className="w-full bg-neutral-900 border border-white/10 p-3 rounded-sm text-xs text-white font-serif italic focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-400 border-b border-white/5 pb-2">
                  Section D: Net Promoter Score (NPS Matrix)
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">How critical is this program for another school Grade XII cohort?</span>
                    <span className="text-xs font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded border border-[#D4AF37]/30 font-bold">
                      NPS Score: {sfNps} / 10
                    </span>
                  </div>
                  
                  <div className="flex justify-between bg-neutral-900 p-2.5 rounded border border-white/5 flex-wrap gap-1.5">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                      const isSelected = sfNps === num;
                      return (
                        <button
                          type="button"
                          key={num}
                          onClick={() => setSfNps(num)}
                          className={`w-8 h-8 rounded-full font-mono text-xs cursor-pointer font-black flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'bg-[#D4AF37] text-neutral-950 scale-110 shadow-lg' 
                              : num >= 9 
                              ? 'text-emerald-400 bg-emerald-950/20 hover:bg-emerald-900/40' 
                              : num >= 7 
                              ? 'text-amber-400 bg-amber-950/20 hover:bg-amber-900/40' 
                              : 'text-red-400 bg-red-950/20 hover:bg-red-900/40'
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-neutral-500 uppercase tracking-widest px-1">
                    <span>0 - Detractor (Negative)</span>
                    <span>7 - Passive</span>
                    <span>10 - Promoter (Highly Engaged)</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#D4AF37] text-neutral-950 font-mono text-xs font-black uppercase py-4 rounded-sm tracking-widest cursor-pointer hover:bg-yellow-500 transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Save Student Feedback Entry
                </button>
              </form>
            </div>
          )}

          {/* MODULE 2: Teacher Feedback Portal */}
          {activeTab === 'TEACHER_FEEDBACK' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="font-mono text-[10px] text-[#D4AF37] uppercase font-bold tracking-widest block mb-1">
                  Active System 2
                </span>
                <h2 className="text-xl font-display font-extrabold text-white uppercase tracking-tight">
                  Academic Teacher Feedback Portal
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Provides teachers a robust interface to evaluate peer alignment, curriculum relevance, and leadership performance.
                </p>
              </div>

              {teacherSuccessMsg && (
                <div className="bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 p-4 rounded-sm text-xs font-mono flex items-center gap-3">
                  <Check className="w-4 h-4" />
                  Teacher feedback validated and logged into principal performance aggregates.
                </div>
              )}

              <form onSubmit={handleTeacherSubmit} className="space-y-6 bg-neutral-950/60 p-6 rounded border border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase font-bold">Teacher Name *</label>
                    <input 
                      type="text" 
                      value={tfName} 
                      onChange={(e) => setTfName(e.target.value)} 
                      placeholder="e.g. Mr. S. K. Sharma" 
                      className="w-full bg-neutral-900 border border-white/10 px-3 py-2 rounded-sm text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>
                  <div className="space-y-2 border-slate-900 border-none">
                    <label className="text-[10px] font-mono text-neutral-400 uppercase font-bold">Designation Department</label>
                    <select 
                      value={tfDesignation} 
                      onChange={(e) => setTfDesignation(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 px-3 py-2.5 rounded-sm text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="PGT Commerce">PGT Commerce</option>
                      <option value="PGT Humanities">PGT Humanities</option>
                      <option value="PGT Physics">PGT Physics</option>
                      <option value="PGT Mathematics">PGT Mathematics</option>
                      <option value="School Coordinator">School Coordinator</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Student Active Engagement Level', state: tfEng, setter: setTfEng },
                    { label: 'Relevance to Core Curriculum Goals', state: tfRel, setter: setTfRel },
                    { label: 'Facilitators and Team Communication Quality', state: tfCom, setter: setTfCom },
                    { label: 'Simulation Interface and Scaffolding Quality', state: tfFac, setter: setTfFac },
                    { label: 'Demonstrated Student Learning Outcomes', state: tfOut, setter: setTfOut }
                  ].map((field, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-neutral-900 p-3 rounded-sm border border-white/5">
                      <span className="text-xs font-mono text-neutral-300 uppercase tracking-wide">{field.label}</span>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((idxNum) => (
                          <button
                            type="button"
                            key={idxNum}
                            onClick={() => field.setter(idxNum)}
                            className={`w-7 h-7 rounded-sm font-mono text-xs font-black flex items-center justify-center transition-all ${
                              idxNum <= field.state 
                                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' 
                                : 'text-neutral-600 bg-neutral-950 hover:bg-neutral-900'
                            }`}
                          >
                            {idxNum}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 bg-neutral-900 p-4 rounded-sm border border-white/5">
                  <legend className="text-[10px] font-mono text-neutral-400 uppercase font-black block">
                    Institutional Future Integration Recommendation
                  </legend>
                  <span className="text-xs text-neutral-400 block pb-1">Would you scale and recommend integrating this simulation platform for future XII batches?</span>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setTfRec('YES')}
                      className={`flex-1 py-3 font-mono text-xs uppercase font-extrabold rounded-sm transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                        tfRec === 'YES' 
                          ? 'bg-emerald-950/20 border-emerald-500 text-emerald-400' 
                          : 'border-white/5 text-neutral-500 hover:text-white'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" /> Recommend: YES
                    </button>
                    <button
                      type="button"
                      onClick={() => setTfRec('NO')}
                      className={`flex-1 py-3 font-mono text-xs uppercase font-extrabold rounded-sm transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                        tfRec === 'NO' 
                          ? 'bg-red-950/20 border-red-500 text-red-400' 
                          : 'border-white/5 text-neutral-500 hover:text-white'
                      }`}
                    >
                      Recommend: NO
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase font-bold">Qualitative Evaluation / Observations</label>
                  <textarea 
                    value={tfComments} 
                    onChange={(e) => setTfComments(e.target.value)} 
                    rows={4}
                    placeholder="Provide specific notes on student behavior, dialogue quality, or overall learning hurdles..." 
                    className="w-full bg-neutral-900 border border-white/10 p-3 rounded-sm text-xs text-white font-serif italic focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#D4AF37] text-neutral-950 font-mono text-xs font-black uppercase py-4 rounded-sm tracking-widest cursor-pointer hover:bg-yellow-500 transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" /> Conclude & Store Teacher Review
                </button>
              </form>
            </div>
          )}

          {/* MODULE 3: Principal Dashboard */}
          {activeTab === 'PRINCIPAL_DASHBOARD' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <span className="font-mono text-[10px] text-[#D4AF37] uppercase font-bold tracking-widest block mb-1">
                    System 3 Executive View
                  </span>
                  <h2 className="text-xl font-display font-extrabold text-white uppercase tracking-tight">
                    Dr. Sandeep Kumar’s Principal Dashboard
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    An analytical command deck tracking development performance and decision scores across Army Public School Bhopal.
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={handlePrintCertificate}
                    className="bg-neutral-800 border border-white/15 px-3 py-2 text-[10px] font-mono uppercase font-bold tracking-wider hover:bg-neutral-700 transition-all flex items-center gap-1.5 cursor-pointer rounded-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-[#D4AF37]" /> Export Sheets
                  </button>
                </div>
              </div>

              {/* KPI CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Active Students', value: '200 / 200', change: '100% Ingress', icon: Users },
                  { label: 'Program Quality', value: '4.91 / 5', change: '+3% Upper-Tier', icon: Star },
                  { label: 'L&D Alignment', value: '95.4%', change: 'Post-Sim Delta', icon: Award },
                  { label: 'NPS Indicator', value: `+${calculatedNps}`, change: 'Excellent Score', icon: ShieldCheck }
                ].map((kpi, idx) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={idx} className="bg-neutral-950 p-4 rounded-sm border border-white/5 space-y-1">
                      <div className="flex justify-between items-center text-neutral-500">
                        <span className="text-[9px] font-mono uppercase tracking-wider block">{kpi.label}</span>
                        <Icon className="w-3.5 h-3.5 text-[#D4AF37]" />
                      </div>
                      <div className="text-xl font-black font-mono tracking-tight text-white">{kpi.value}</div>
                      <div className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest">{kpi.change}</div>
                    </div>
                  );
                })}
              </div>

              {/* OUTCOMES & RELEVANCE BAR CHARTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-950/60 p-5 rounded border border-white/5">
                <div className="space-y-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest border-b border-white/5 pb-2 text-neutral-300">
                    Student Course Learnings Breakdown
                  </h3>
                  
                  <div className="space-y-3 pt-1">
                    {[
                      { topic: 'Saving & Emergency Assets', count: 182, pct: '91%' },
                      { topic: 'Lifestyle Spending Bias', count: 165, pct: '82%' },
                      { topic: 'Risk Evaluation & Debt Limits', count: 174, pct: '87%' },
                      { topic: 'Digital Scams Protection', count: 194, pct: '97%' },
                      { topic: 'Leadership & Boardroom Alignment', count: 160, pct: '80%' }
                    ].map((row, idx) => (
                      <div key={idx} className="space-y-1 text-xs">
                        <div className="flex justify-between font-mono text-[10.5px]">
                          <span className="text-neutral-300">{row.topic}</span>
                          <span className="text-[#D4AF37] font-bold">{row.pct} ({row.count} Pupils)</span>
                        </div>
                        <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden border border-white/5">
                          <div className="bg-[#D4AF37] h-full" style={{ width: row.pct }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest border-b border-white/5 pb-2 text-neutral-300">
                    Faculty Evaluation Indices
                  </h3>

                  <div className="space-y-3.5">
                    {[
                      { metric: 'Relevance to Real-World Challenges', score: '4.85 / 5', pct: 97 },
                      { metric: 'Curriculum & Academic Alignment', score: '4.70 / 5', pct: 94 },
                      { metric: 'Visual Framework Ease-of-Use', score: '4.90 / 5', pct: 98 },
                      { metric: 'Oral Debate Expansion', score: '4.75 / 5', pct: 95 }
                    ].map((row, idx) => (
                      <div key={idx} className="space-y-1 text-xs">
                        <div className="flex justify-between font-mono text-[10.5px]">
                          <span className="text-neutral-300">{row.metric}</span>
                          <span className="text-neutral-200">{row.score}</span>
                        </div>
                        <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div className="bg-emerald-400 h-full animate-pulse" style={{ width: `${row.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SUBMITTED FEEDBACK TABLE */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
                  Active Feedback Logs (Realtime Stream)
                </h3>
                
                <div className="border border-white/5 rounded overflow-x-auto bg-neutral-950">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/5 text-neutral-400 uppercase tracking-wider text-[9px]">
                        <th className="p-3">Profile / Name</th>
                        <th className="p-3">Cohort Team</th>
                        <th className="p-3 text-center">NPS Score</th>
                        <th className="p-3">Constructive Reflection Narrative</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {studentFeedbacks.map((item) => (
                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-3">
                            <strong className="block text-white">{item.studentName}</strong>
                            <span className="text-[9px] text-neutral-500">{item.rollNo}</span>
                          </td>
                          <td className="p-3 text-neutral-300 font-bold uppercase">{item.teamId.replace('TEAM_', '')}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-sm font-black text-[10px] ${
                              item.npsScore >= 9 ? 'bg-emerald-950/55 text-emerald-400' : 'bg-amber-950/55 text-[#D4AF37]'
                            }`}>
                              {item.npsScore}
                            </span>
                          </td>
                          <td className="p-3 text-neutral-400 font-serif italic text-[11px] leading-relaxed max-w-sm">
                            "{item.decisionComments}"
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 4: NPS Evaluation Engine */}
          {activeTab === 'NPS_ENGINE' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="font-mono text-[10px] text-[#D4AF37] uppercase font-bold tracking-widest block mb-1">
                  Active System 4
                </span>
                <h2 className="text-xl font-display font-extrabold text-white uppercase tracking-tight">
                  Net Promoter Score (NPS) Evaluation Engine
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  A high-fidelity audit tool designed to evaluate institutional satisfaction levels and predict expansion vectors.
                </p>
              </div>

              {/* DYNAMIC CALCULATION BLOCK */}
              <div className="p-6 bg-neutral-950 rounded border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="space-y-2 col-span-2">
                  <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-400">
                    Active Formulation Protocol
                  </h3>
                  <code className="text-neutral-500 block text-[10px] bg-black/40 p-2.5 border border-white/5 font-mono">
                    NPS = % Promoters (Score 9-10) - % Detractors (Score 0-6)
                  </code>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    NPS measures long-term participant recommendations on a scale of -100 to +100. Outstanding cohorts generally track above +70.
                  </p>
                </div>

                <div className="text-center p-4 bg-white/5 rounded-sm border border-[#D4AF37]/30 space-y-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">Consolidated NPS</span>
                  <div className="text-4xl font-mono font-black text-[#D4AF37] animate-pulse">
                    +{calculatedNps}
                  </div>
                  <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest font-black">Highly Promoted</span>
                </div>
              </div>

              {/* COMPOSITION VISUAL SPLIT */}
              <div className="space-y-3.5 bg-neutral-950/60 p-5 rounded border border-white/5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-neutral-400">NPS Distribution Split</span>
                  <span className="text-neutral-200">{totalNpsResponses} Total Submissions</span>
                </div>

                {/* Split progress bar */}
                <div className="w-full h-8 rounded border border-white/5 overflow-hidden flex font-mono text-[10px] font-black leading-none text-black">
                  <div 
                    className="bg-emerald-400 flex items-center justify-center transition-all" 
                    style={{ width: `${pctPromoters}%` }}
                    title={`Promoters: ${promoters}`}
                  >
                    {pctPromoters > 10 && `PROMOTERS: ${Math.round(pctPromoters)}%`}
                  </div>
                  <div 
                    className="bg-amber-400 flex items-center justify-center transition-all" 
                    style={{ width: `${100 - pctPromoters - pctDetractors}%` }}
                    title={`Passives: ${passives}`}
                  >
                    {100 - pctPromoters - pctDetractors > 10 && `PASSIVES`}
                  </div>
                  <div 
                    className="bg-red-400 flex items-center justify-center transition-all" 
                    style={{ width: `${pctDetractors}%` }}
                    title={`Detractors: ${detractors}`}
                  >
                    {pctDetractors > 0 && `DETRACTORS`}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 bg-emerald-950/20 border border-emerald-900/30 rounded-sm text-emerald-400">
                    <strong className="block text-base">{promoters}</strong> Promoters (9-10)
                  </div>
                  <div className="p-2.5 bg-amber-950/20 border border-amber-900/30 rounded-sm text-amber-400">
                    <strong className="block text-base">{passives}</strong> Passives (7-8)
                  </div>
                  <div className="p-2.5 bg-red-950/20 border border-red-900/30 rounded-sm text-red-400">
                    <strong className="block text-base">{detractors}</strong> Detractors (0-6)
                  </div>
                </div>
              </div>

              {/* SANDBOX GENERATOR */}
              <div className="space-y-4 bg-neutral-950 p-5 rounded-sm border border-white/5">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 animate-spin shrink-0" /> Realtime Predictor Sandbox
                </h3>
                <span className="text-xs text-neutral-400 block pb-1">Simulate alternative feedback scenarios for upcoming cohorts of 200 students:</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="space-y-1.5">
                    <span className="text-neutral-400 text-[10px] block uppercase">Promoters (9-10): {sbPromoters}</span>
                    <input 
                      type="range" 
                      min="0" 
                      max="150" 
                      value={sbPromoters} 
                      onChange={(e) => setSbPromoters(parseInt(e.target.value, 10))}
                      className="w-full accent-emerald-400 bg-neutral-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-neutral-400 text-[10px] block uppercase">Passives (7-8): {sbPassives}</span>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={sbPassives} 
                      onChange={(e) => setSbPassives(parseInt(e.target.value, 10))}
                      className="w-full accent-amber-500 bg-neutral-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-neutral-400 text-[10px] block uppercase">Detractors (0-6): {sbDetractors}</span>
                    <input 
                      type="range" 
                      min="0" 
                      max="80" 
                      value={sbDetractors} 
                      onChange={(e) => setSbDetractors(parseInt(e.target.value, 10))}
                      className="w-full accent-red-500 bg-neutral-900"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center bg-black/40 p-3 rounded-sm border border-white/5 text-xs font-mono">
                  <span>Total Simulated Inputs: <strong className="text-white">{sbTotal}</strong></span>
                  <span className="text-[#D4AF37] font-black uppercase tracking-wider">Simulated NPS: +{sbNps}</span>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 5: Certificate Generator */}
          {activeTab === 'CERTIFICATE_GEN' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="font-mono text-[10px] text-[#D4AF37] uppercase font-bold tracking-widest block mb-1">
                  Active System 5
                </span>
                <h2 className="text-xl font-display font-extrabold text-white uppercase tracking-tight">
                  Student Certificate of Distinction Generator
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Generates and renders visual excellence credentials with personalized metadata for Boardroom leaders.
                </p>
              </div>

              {/* DEMO INPUT CONTROLS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-neutral-950 p-4 rounded border border-white/5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase font-black">Student Name</label>
                  <input 
                    type="text" 
                    value={certName} 
                    onChange={(e) => setCertName(e.target.value)} 
                    className="w-full bg-neutral-900 border border-white/10 px-3 py-2 rounded-sm text-xs text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase font-black">Select Team</label>
                  <select 
                    value={certTeam} 
                    onChange={(e) => setCertTeam(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 px-3 py-2.5 rounded-sm text-xs text-white"
                  >
                    <option value="TEAM JHANSI">TEAM JHANSI</option>
                    <option value="TEAM BHAGAT">TEAM BHAGAT</option>
                    <option value="TEAM CHANAKYA">TEAM CHANAKYA</option>
                    <option value="TEAM AZAD">TEAM AZAD</option>
                    <option value="TEAM NETAJI">TEAM NETAJI</option>
                    <option value="TEAM PATEL">TEAM PATEL</option>
                    <option value="TEAM KALAM">TEAM KALAM</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-neutral-400 uppercase font-black">Assigned Boardroom Role</label>
                  <select 
                    value={certRole} 
                    onChange={(e) => setCertRole(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 px-3 py-2.5 rounded-sm text-xs text-white"
                  >
                    <option value="CHIEF FINANCIAL OFFICER">CHIEF FINANCIAL OFFICER</option>
                    <option value="CHIEF RISK OFFICER">CHIEF RISK OFFICER</option>
                    <option value="STRATEGY LEAD">STRATEGY LEAD</option>
                    <option value="RISK ANALYST">RISK ANALYST</option>
                    <option value="DECISION COMPLIANCE">DECISION COMPLIANCE</option>
                  </select>
                </div>
              </div>

              {/* QUICK REFILL DECK */}
              <div className="space-y-1 bg-neutral-900 p-2.5 border border-white/5 rounded-xs leading-none">
                <span className="text-[9px] font-mono text-neutral-500 block uppercase tracking-widest mb-1.5">Load Recent Class Leaders for Print:</span>
                <div className="flex gap-2 flex-wrap">
                  {SAMPLES_STUDENTS_LIST.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCertName(sample.name);
                        setCertTeam(sample.team);
                        setCertRole(sample.role);
                      }}
                      className="bg-white/5 border border-white/5 hover:border-[#D4AF37]/50 text-[10px] font-mono text-neutral-300 px-2 py-1 rounded cursor-pointer transition-all"
                    >
                      {sample.name} ({sample.team.replace('TEAM ', '')})
                    </button>
                  ))}
                </div>
              </div>

              {/* CERTIFICATE PREVIEW CONTAINER */}
              <div 
                ref={certificateRef}
                className="relative bg-[#0F1219] p-8 md:p-12 rounded-sm border-[4px] border-double border-[#D4AF37]/50 shadow-2xl mx-auto max-w-2xl text-center select-none overflow-hidden print:fixed print:inset-0 print:m-0 print:border-none print:shadow-none"
                id="reyou-distinction-credential-preview"
              >
                {/* Background Crest Seal styling */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.02]">
                  <Award className="w-[300px] h-[300px] text-[#D4AF37]" />
                </div>

                <div className="border border-[#D4AF37]/20 p-5 md:p-8 space-y-4 relative z-10">
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-[8.5px] font-mono tracking-[0.25em] text-[#D4AF37] uppercase font-black">
                      REYOU STUDENT COHORT DISCOVERY EXPEDITION
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-display font-extrabold text-white tracking-widest uppercase mb-1">
                    CERTIFICATE OF DISTINCTION
                  </h3>
                  
                  <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                    This credential is officially conferred to
                  </p>

                  <h4 className="text-2xl md:text-3xl font-serif text-white uppercase italic tracking-tight font-black underline decoration-[#D4AF37]/45 decoration-wavy">
                    {certName}
                  </h4>

                  <div className="max-w-md mx-auto space-y-1.5 text-xs text-neutral-300 leading-relaxed font-sans">
                    <p>
                      For exemplary performance and systems judgment in the 
                      <strong className="text-white"> Financial Intelligence, Decision Intelligence & Future Readiness Program</strong>.
                    </p>
                    <p className="text-[10.5px] text-neutral-400">
                      Actively functioned within the designated role as <strong className="text-[#D4AF37] uppercase tracking-wider">{certRole}</strong> representing <strong className="text-white">{certTeam}</strong> at Army Public School, Bhopal.
                    </p>
                  </div>

                  {/* SIGNATURE SECTIONS */}
                  <div className="flex justify-between items-center pt-8 text-[9px] font-mono text-neutral-400 tracking-wider">
                    <div className="space-y-1 text-center">
                      <div className="font-serif italic text-white text-xs border-b border-white/10 pb-1 px-4">Business Head</div>
                      <span>REYOU Education</span>
                    </div>
                    
                    <Award className="w-10 h-10 text-[#D4AF37]/65 shrink-0" />

                    <div className="space-y-1 text-center">
                      <div className="font-serif italic text-white text-xs border-b border-white/10 pb-1 px-4">Dr. Sandeep Kumar</div>
                      <span>Principal Authority, APS</span>
                    </div>
                  </div>

                  <div className="text-[9px] font-mono text-neutral-500 pt-3">
                    Validated under verification hash: SECURE-APS-{certName.substring(0,3).toUpperCase()}-{Date.now().toString().substring(7)}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleDownloadPDF}
                  className="flex-1 bg-white hover:bg-neutral-100 text-neutral-900 font-mono text-xs uppercase font-extrabold py-3 rounded-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4" /> Download Printable PDF
                </button>
                <button 
                  onClick={handlePrintCertificate}
                  className="bg-neutral-800 border border-white/10 hover:bg-neutral-700 text-neutral-200 font-mono text-xs uppercase font-extrabold py-3 px-6 rounded-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  Trigger Raw Print
                </button>
              </div>
            </div>
          )}

          {/* MODULE 6: Photo Gallery Manager */}
          {activeTab === 'PHOTO_GALLERY' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="font-mono text-[10px] text-[#D4AF37] uppercase font-bold tracking-widest block mb-1">
                  Active System 6
                </span>
                <h2 className="text-xl font-display font-extrabold text-white uppercase tracking-tight">
                  REYOU Live Laboratory Photos Manager
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Add and catalogue real laboratory snapshots tagged to specific Grade XII teams, maintaining visual deployment archives.
                </p>
              </div>

              {/* UPLOAD / ADD SIMULATION PHOTO FORM */}
              <form onSubmit={handleAddPhoto} className="p-4 bg-neutral-950 rounded border border-white/5 space-y-4">
                <span className="text-[10px] font-mono text-neutral-300 font-bold uppercase block border-b border-white/5 pb-1">
                  + Log New Laboratory Photo Memory
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-neutral-400 uppercase block">Image URL Source</label>
                    <input 
                      type="text" 
                      value={photoInputUrl} 
                      onChange={(e) => setPhotoInputUrl(e.target.value)} 
                      placeholder="https://images.unsplash.com/..." 
                      className="w-full bg-neutral-900 border border-white/10 px-3 py-1.5 rounded-sm text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-neutral-400 uppercase block">Tag Team</label>
                      <select 
                        value={photoInputTag} 
                        onChange={(e) => setPhotoInputTag(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 px-3 py-2 rounded text-xs text-white"
                      >
                        <option value="TEAM JHANSI">TEAM JHANSI</option>
                        <option value="TEAM BHAGAT">TEAM BHAGAT</option>
                        <option value="TEAM CHANAKYA">TEAM CHANAKYA</option>
                        <option value="TEAM AZAD">TEAM AZAD</option>
                        <option value="TEAM PATEL">TEAM PATEL</option>
                        <option value="TEAM KALAM">TEAM KALAM</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-neutral-400 uppercase block">Phase</label>
                      <input 
                        type="text" 
                        value={photoInputPhase} 
                        onChange={(e) => setPhotoInputPhase(e.target.value)} 
                        placeholder="e.g. Boardroom Pitch" 
                        className="w-full bg-neutral-900 border border-white/10 px-3 py-1.5 rounded text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-neutral-400 uppercase block">Short Activity Caption / Quote</label>
                  <input 
                    type="text" 
                    value={photoInputCaption} 
                    onChange={(e) => setPhotoInputCaption(e.target.value)} 
                    placeholder="e.g. Chief Risk Officer analyzing loan structures during critical clock turns." 
                    className="w-full bg-neutral-900 border border-white/10 px-3 py-1.5 rounded text-xs text-white focus:outline-none"
                  />
                </div>

                <button 
                  type="submit" 
                  className="bg-[#D4AF37] hover:bg-yellow-500 text-neutral-950 text-[10px] font-mono uppercase font-black py-2.5 px-4 rounded cursor-pointer transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Save Photo Memory
                </button>
              </form>

              {/* DYNAMIC GRID VIEW CONTAINER */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                  <span className="font-mono text-neutral-400 uppercase">Interactive Memories Archive</span>
                  
                  {/* Filters block */}
                  <div className="flex gap-1.5 text-[9px] font-mono">
                    {['ALL', 'Simulation 2', 'Module 3 Lab', 'Boardroom Pitch'].map((filt) => (
                      <button
                        key={filt}
                        onClick={() => setGalleryFilter(filt)}
                        className={`px-2 py-1 rounded cursor-pointer ${
                          (filt === 'ALL' && galleryFilter === 'ALL') || galleryFilter === filt
                            ? 'bg-[#D4AF37] text-neutral-950 font-black'
                            : 'bg-white/5 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {filt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {photos
                    .filter(p => galleryFilter === 'ALL' || p.phaseId.includes(galleryFilter))
                    .map((photo) => (
                      <div key={photo.id} className="bg-neutral-950 rounded border border-white/5 overflow-hidden group hover:border-[#D4AF37]/35 transition-all">
                        <div className="h-44 bg-neutral-900 overflow-hidden relative">
                          <img 
                            src={photo.url} 
                            alt="Simulation Moment" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-2.5 left-2.5 text-[7px] font-mono font-black bg-[#D4AF37] text-black px-1.5 py-0.5 rounded uppercase tracking-widest">
                            {photo.teamTag}
                          </span>
                        </div>
                        <div className="p-3.5 space-y-2">
                          <span className="text-[8.5px] text-[#D4AF37] font-mono tracking-widest uppercase block">
                            {photo.phaseId}
                          </span>
                          <p className="text-xs text-neutral-300 font-serif italic leading-relaxed">
                            "{photo.caption}"
                          </p>
                          <div className="flex justify-between items-center text-[8.5px] font-mono text-neutral-500 border-t border-white/5 pt-2">
                            <span>{photo.timestamp}</span>
                            <button 
                              onClick={() => handleDeletePhoto(photo.id)}
                              className="text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer font-bold"
                            >
                              <Trash2 className="w-3 h-3" /> De-archive
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* MODULE 7: Testimonial Collector */}
          {activeTab === 'TESTIMONIAL_COLLECT' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="font-mono text-[10px] text-[#D4AF37] uppercase font-bold tracking-widest block mb-1">
                  Active System 7
                </span>
                <h2 className="text-xl font-display font-extrabold text-white uppercase tracking-tight">
                  REYOU OS Testimonial Capture & Consent Vault
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Catalogues high-value statements from students, staff coordinators, and principals with photo consents and publication release matrices.
                </p>
              </div>

              {/* INPUT FORM DECK */}
              <form onSubmit={handleAddTestimonial} className="p-4 bg-neutral-950 rounded border border-white/5 space-y-4">
                <span className="text-[10px] font-mono text-neutral-300 font-black uppercase block">
                  + Add New Official Testimonial Entry
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-neutral-400 uppercase">Author Name *</label>
                    <input 
                      type="text" 
                      value={testName} 
                      onChange={(e) => setTestName(e.target.value)} 
                      placeholder="e.g. Dr. Sandeep Kumar" 
                      className="w-full bg-neutral-900 border border-white/10 px-3 py-2 rounded text-xs text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-neutral-400 uppercase">Title / Class Profile</label>
                    <input 
                      type="text" 
                      value={testTitle} 
                      onChange={(e) => setTestTitle(e.target.value)} 
                      placeholder="e.g. Principal General Head" 
                      className="w-full bg-neutral-900 border border-white/10 px-3 py-2 rounded text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-neutral-400 uppercase">Entity Category</label>
                    <select 
                      value={testType} 
                      onChange={(e) => setTestType(e.target.value as any)}
                      className="w-full bg-neutral-900 border border-white/10 px-3 py-2.5 rounded text-xs text-white"
                    >
                      <option value="STUDENT">Student Candidate</option>
                      <option value="TEACHER">Staff Teacher Faculty</option>
                      <option value="PRINCIPAL">Principal / Institutional Lead</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono text-neutral-400 uppercase">Written Testimonial / Quote *</label>
                  <textarea 
                    value={testQuote} 
                    onChange={(e) => setTestQuote(e.target.value)} 
                    rows={3}
                    placeholder="Enter precise statement quote details..." 
                    className="w-full bg-neutral-900 border border-white/10 p-3 rounded text-xs text-white font-serif italic"
                    required
                  />
                </div>

                <div className="flex gap-4 p-3 bg-neutral-900 rounded-sm border border-white/5 uppercase font-mono text-[9px] text-neutral-400">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={testConsent} 
                      onChange={(e) => setTestConsent(e.target.checked)} 
                      className="accent-[#D4AF37]" 
                    /> Photo Release Consent Approved
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={testPublish} 
                      onChange={(e) => setTestPublish(e.target.checked)} 
                      className="accent-[#D4AF37]" 
                    /> Permission to Publish Globally
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="bg-[#D4AF37] hover:bg-yellow-500 text-neutral-950 text-[10px] font-mono uppercase font-black py-2.5 px-4 rounded cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Save Testimonial Entry
                </button>
              </form>

              {/* WALL VIEW COMPONENT */}
              <div className="space-y-4">
                <span className="font-mono text-xs text-neutral-400 block border-b border-white/5 pb-2">
                  Testimonials Registry Wall
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.map((test) => (
                    <div key={test.id} className="bg-neutral-950 p-5 rounded border border-white/5 space-y-3 flex flex-col justify-between">
                      <p className="text-xs text-neutral-300 font-serif italic leading-relaxed">
                        "{test.quote}"
                      </p>
                      
                      <div className="flex justify-between items-end border-t border-white/5 pt-3">
                        <div>
                          <strong className="block text-xs text-white">{test.name}</strong>
                          <span className="text-[10px] font-mono text-[#D4AF37] tracking-wider uppercase block">{test.titleOrClass}</span>
                        </div>

                        <div className="flex gap-1">
                          <span className={`text-[7px] font-mono px-1.5 py-0.5 rounded font-black uppercase tracking-wider ${
                            test.type === 'PRINCIPAL' 
                              ? 'bg-purple-950/60 text-purple-400' 
                              : test.type === 'TEACHER' 
                              ? 'bg-blue-950/60 text-blue-400' 
                              : 'bg-emerald-950/60 text-emerald-400'
                          }`}>
                            {test.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODULE 8: Army Public School Case Study */}
          {activeTab === 'CASE_STUDY_GEN' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4 flex justify-between items-center">
                <div>
                  <span className="font-mono text-[10px] text-[#D4AF37] uppercase font-bold tracking-widest block mb-1">
                    System 6 Marketing Sheet
                  </span>
                  <h2 className="text-xl font-display font-extrabold text-white uppercase tracking-tight">
                    Army Public School Bhopal Case Study Sheet
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Compiles institutional profiles, classroom interventions, and performance milestones into a 1-page proposal sales block.
                  </p>
                </div>
                
                <button 
                  onClick={handlePrintCertificate}
                  className="bg-white text-neutral-950 font-mono text-[10px] tracking-wider font-extrabold uppercase px-3 py-2 rounded-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:bg-neutral-100 transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Print Sheet
                </button>
              </div>

              {/* SHEET BODY LAYOUT VIEW */}
              <div className="bg-white text-neutral-900 p-8 rounded border border-neutral-200 space-y-6 max-w-2xl mx-auto text-left selection:bg-neutral-950 selection:text-white" id="aps-case-study-paper">
                
                {/* Header block with institutional title */}
                <div className="border-b-2 border-neutral-900 pb-4 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] font-black uppercase block">REYOU EXECUTIVE BRIEF CASE STUDY</span>
                    <h3 className="text-2xl font-black font-display text-neutral-900 tracking-tight leading-none uppercase mt-1">
                      ARMY PUBLIC SCHOOL, BHOPAL
                    </h3>
                    <p className="text-xs text-neutral-500 font-mono italic mt-1">Deployed June 22, 2026 • Grade XII Leadership Development</p>
                  </div>
                  
                  <div className="w-14 h-14 bg-neutral-900 text-white flex flex-col justify-center items-center text-center rounded-sm font-black text-xs">
                    <span className="text-[#D4AF37]">R</span>
                    <span className="text-[8px] tracking-normal font-mono font-medium">STUDY</span>
                  </div>
                </div>

                {/* Profile blocks */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutral-600 font-sans">
                  <div className="space-y-1 border-r border-neutral-200 pr-4">
                    <h4 className="font-mono text-[9px] font-black tracking-widest text-neutral-400 uppercase">Institution Profile</h4>
                    <p className="font-bold text-neutral-900">Army Public School, Bhopal</p>
                    <p>Prestigious school catering to military families, emphasizing future security, strategy, and analytical discipline.</p>
                  </div>
                  
                  <div className="space-y-1 border-r border-neutral-200 pr-4">
                    <h4 className="font-mono text-[9px] font-black tracking-widest text-neutral-400 uppercase">Interactive Cohort</h4>
                    <p className="font-bold text-neutral-900">Grade XII Leaders (A, B, C, D)</p>
                    <p>200 Active Students organized into 40 Boardrooms playing synchronously via computer labs.</p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-mono text-[9px] font-black tracking-widest text-neutral-400 uppercase">Core Deliverables</h4>
                    <p className="font-bold text-neutral-900">NPS Engine & Certificates</p>
                    <p>Real-time satisfaction audit, Distinction Certificates, and quantitative executive reports for Principal.</p>
                  </div>
                </div>

                <div className="h-px bg-neutral-200 w-full" />

                {/* INTERVENTION STRATEGY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-2">
                    <h4 className="font-mono text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                      Before Intervention: Challenges
                    </h4>
                    <p className="leading-relaxed text-neutral-600">
                      Standard financial awareness programs operate on dry slides and abstract calculators. Grade XII candidates lacked practical experience managing high-pressure lifestyle debt traps, rent trade-offs, and digital payment fraudulent hooks. No collaborative accountability channels existed.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-mono text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      During Intervention: Activation
                    </h4>
                    <p className="leading-relaxed text-neutral-600 font-serif italic">
                      "We witnessed incredible boardroom clashes as students evaluated the real value of commuting times vs. premium rents. The Role Checkpoint gave every student specific accountabilities as CFOs, Strategy Leads, and Compliance officers, breaking traditional silos."
                    </p>
                  </div>
                </div>

                <div className="h-px bg-neutral-200 w-full" />

                {/* THE POWER NUMBERS */}
                <div className="space-y-3 bg-neutral-50 p-4 border border-neutral-150 rounded">
                  <span className="font-mono text-[9px] font-black text-neutral-400 uppercase tracking-widest block text-center">
                    COMPOSITE VALUE DELIVERED & METRICS
                  </span>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 border-r border-neutral-250">
                      <strong className="block text-2xl text-neutral-900 tracking-tight font-black font-mono">98%</strong>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block">Participant Engaged</span>
                    </div>
                    <div className="p-2 border-r border-neutral-250">
                      <strong className="block text-2xl text-neutral-900 tracking-tight font-black font-mono">+96</strong>
                      <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-wider block">Cohort NPS Rating</span>
                    </div>
                    <div className="p-2">
                      <strong className="block text-2xl text-neutral-900 tracking-tight font-black font-mono">100%</strong>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block">Principal Recommended</span>
                    </div>
                  </div>
                </div>

                {/* PRINCIPAL TESTIMONIAL QUOTE */}
                <div className="border-l-4 border-[#D4AF37] pl-4 py-2 text-xs">
                  <blockquote className="font-serif italic text-neutral-700 leading-relaxed">
                    "REYOU bridges the critical gap between theoretical knowledge and practical personal responsibility. Seeing our boardrooms defending strategic limits under volatile conditions proves this is the operating model Grade XII students absolutely need to prepare for life."
                  </blockquote>
                  <cite className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest mt-1.5 block font-bold">
                    — Dr. Sandeep Kumar, Principal, Army Public School Bhopal
                  </cite>
                </div>
              </div>

              <div className="text-center text-xs text-neutral-400 font-sans italic">
                💡 Perfect for print presentation: This layout dynamically translates into a physical, standard 1-page A4 handout.
              </div>
            </div>
          )}

          {/* MODULE 9: Interactive Google Review Shielding Funnel */}
          {activeTab === 'GOOGLE_FUNNEL' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="font-mono text-[10px] text-[#D4AF37] uppercase font-bold tracking-widest block mb-1">
                  Active System 5
                </span>
                <h2 className="text-xl font-display font-extrabold text-white uppercase tracking-tight">
                  REYOU Google Review Rating Funnel
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Shields the public business profile by routing elite scores (4-5) to Google Reviews, and routing low reviews (1-3) to internal feedback forms.
                </p>
              </div>

              {/* INTERACTIVE WIDGET DISPLAY */}
              <div className="max-w-md mx-auto bg-neutral-950 p-6 rounded border border-white/5 space-y-6">
                
                <div className="text-center space-y-2">
                  <span className="text-[8.5px] font-mono tracking-widest font-black text-neutral-500 uppercase block">REYOU PUBLIC REPUTATION MANAGER</span>
                  <div className="bg-white/5 inline-block px-3 py-1 text-[9px] font-mono text-neutral-300 border border-white/10 rounded-xs">
                    Business Name: <strong className="text-white">REYOU OS OPC PRIVATE LIMITED</strong>
                  </div>
                  <h3 className="text-lg font-bold font-serif text-white">How has your REYOU cohort experience been in Bhopal?</h3>
                  <p className="text-xs text-neutral-400">Your transparent rating shapes outstanding future student programs.</p>
                </div>

                {funnelSection === 'RATING' && (
                  <div className="flex flex-col items-center space-y-4 py-4">
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map((starIdx) => (
                        <button
                          key={starIdx}
                          onMouseEnter={() => setRatingsVal(starIdx)}
                          onClick={() => handleStarClick(starIdx)}
                          className="p-1 cursor-pointer transition-transform hover:scale-125"
                        >
                          <Star className={`w-8 h-8 ${starIdx <= ratingsVal ? 'text-[#D4AF37] fill-[#D4AF37] animate-pulse' : 'text-neutral-700'}`} />
                        </button>
                      ))}
                    </div>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-bold">
                      {ratingsVal === 5 ? 'STELIAR (5 stars)' : ratingsVal === 4 ? 'Great (4 stars)' : ratingsVal > 0 ? 'NEEDS IMPROVEMENT (1-3 stars)' : 'Select Ratings above'}
                    </span>
                  </div>
                )}

                {funnelSection === 'GOOGLE_PROMPT' && (
                  <div className="space-y-4 text-center bg-[#D4AF37]/5 p-5 rounded border border-[#D4AF37]/30">
                    <span className="text-[9px] font-mono text-[#D4AF37] font-black uppercase tracking-widest block bg-[#D4AF37]/10 py-1 rounded">
                      🎉 OUTSTANDING EXPERIENTIAL RATING MATCHED
                    </span>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Help another High School succeed!</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                      Your high rating qualifies for immediate redirect to Google Reviews. Sharing your experience publicly takes less than 30 seconds!
                    </p>

                    <div className="flex flex-col items-center space-y-2 pt-2">
                      {/* Generates placeholder QR code card */}
                      <div className="w-24 h-24 bg-white p-2 border-2 border-[#D4AF37] rounded-sm flex flex-col items-center justify-center relative">
                        <div className="w-full h-full bg-neutral-900 text-[10px] text-white flex flex-col items-center justify-center rounded-xs font-mono font-black">
                          <span className="text-[#D4AF37]">QR</span>
                          <span className="text-[6.5px] uppercase font-sans tracking-wide">REYOU GOOGLE</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-neutral-400 block font-bold">Scan with phone camera or click link below</span>
                    </div>

                    <div className="flex gap-2.5 pt-1">
                      <button
                        onClick={() => {
                          window.open('https://g.page/r/YOUR_GOOGLE_BUSINESS_REVIEW_LINK/review', '_blank');
                        }}
                        className="flex-1 bg-[#D4AF37] text-neutral-950 text-xs font-mono font-black uppercase py-2.5 rounded hover:bg-yellow-500 transition-all cursor-pointer"
                      >
                        Redirect for Review
                      </button>
                      
                      <button
                        onClick={() => {
                          setRatingsVal(0);
                          setFunnelSection('RATING');
                        }}
                        className="bg-neutral-800 text-neutral-400 text-[10.5px] font-mono uppercase px-4 rounded hover:text-white"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}

                {funnelSection === 'INTERNAL_FEEDBACK' && (
                  <form onSubmit={handleInternalSubmit} className="space-y-4 bg-red-950/10 p-5 rounded border border-red-900/30">
                    <span className="text-[8.5px] font-mono text-red-400 font-extrabold uppercase tracking-widest block">
                      🛡️ ANONYMOUS FEEDBACK CORNER
                    </span>
                    
                    <div className="space-y-2 text-left">
                      <h4 className="text-xs font-bold text-white uppercase">Tell us how we can immediately improve.</h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                        Our local deployment teams take satisfaction extremely seriously. Please report any specific facilitation or simulator issues below for immediate remediation.
                      </p>
                    </div>

                    <textarea
                      value={internalFeedbackText}
                      onChange={(e) => setInternalFeedbackText(e.target.value)}
                      rows={3}
                      placeholder="e.g. The computer laboratory network latency was high, disrupting Simulation 2 boardroom lock timers..."
                      className="w-full bg-neutral-900 border border-white/10 p-2.5 rounded text-xs text-white"
                      required
                    />

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-red-650 hover:bg-red-500 text-white font-mono text-xs font-black uppercase py-2.5 rounded cursor-pointer transition-all"
                      >
                        Submit Review Internally
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRatingsVal(0);
                          setFunnelSection('RATING');
                        }}
                        className="bg-neutral-800 text-neutral-400 text-xs font-mono uppercase px-4 rounded hover:text-white"
                      >
                        Reset
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </div>
          )}

          {/* MODULE 10: APS Impact Report Generator */}
          {activeTab === 'APS_REPORT_GEN' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <span className="font-mono text-[10px] text-[#D4AF37] uppercase font-bold tracking-widest block mb-1">
                    System 10 Composite Analytics
                  </span>
                  <h2 className="text-xl font-display font-extrabold text-white uppercase tracking-tight">
                    APS Bhopal Institutional Impact Report
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Combines qualitative principal statements, dynamic teacher ratings, and student NPS data into a unified, high-octane presentation.
                  </p>
                </div>
                
                <button 
                  onClick={handlePrintCertificate}
                  className="bg-[#D4AF37] text-neutral-950 font-mono text-[10px] uppercase font-black tracking-widest py-2.5 px-4 rounded-xs flex items-center justify-center gap-1.5 hover:bg-yellow-500 transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/10"
                >
                  <Download className="w-4 h-4" /> Export Report Deck
                </button>
              </div>

              {/* REPORT COMPONENT PREVIEW CONTAINER */}
              <div className="bg-neutral-950 p-6 rounded border border-white/5 space-y-6" id="school-impact-pdf-preview">
                
                {/* Title Slide block */}
                <div className="bg-[#0F1219] p-6 rounded border border-[#D4AF37]/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none" />
                  
                  <div className="space-y-1 relative z-10">
                    <span className="text-[8.5px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">REYOU FOUMDER COHORT L&D ARCHIVE</span>
                    <h3 className="text-lg font-extrabold text-white uppercase tracking-tight">Institutional Impact & Performance Report</h3>
                    <p className="text-xs text-neutral-400 font-sans mt-0.5">Prepared For: <strong className="text-white">Army Public School, Bhopal</strong></p>
                    <p className="text-[10px] text-neutral-500 font-mono">Date: 22 June 2026 • Batches: 01 to 04 • Sample Ingress: XII Candidates</p>
                  </div>
                </div>

                {/* THE QUADRANT METRICS BLOCK */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/40 p-5 border border-white/5 rounded">
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono font-black text-[#D4AF37] uppercase tracking-wider border-b border-white/5 pb-1">
                      1. Financial Intelligence Index
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] text-neutral-500 uppercase font-mono block">Budgeting Confidence</span>
                        <div className="text-xl font-mono text-white font-extrabold">94.8 / 100</div>
                        <span className="text-[8px] text-emerald-400 uppercase font-mono block">Excellent Alignment</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-neutral-500 uppercase font-mono block">Scam Protection Mastery</span>
                        <div className="text-xl font-mono text-white font-extrabold">98.2 / 100</div>
                        <span className="text-[8px] text-emerald-400 uppercase font-mono block font-bold">Optimal Defense</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-mono font-black text-[#D4AF37] uppercase tracking-wider border-b border-white/5 pb-1">
                      2. Future Readiness Index
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] text-neutral-500 uppercase font-mono block">Decision Resilience</span>
                        <div className="text-xl font-mono text-white font-extrabold">92.4 / 100</div>
                        <span className="text-[8px] text-emerald-400 uppercase font-mono block font-bold">Dynamic Leverage</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-neutral-500 uppercase font-mono block">Risk Awareness Mastery</span>
                        <div className="text-xl font-mono text-white font-extrabold">95.1 / 100</div>
                        <span className="text-[8px] text-emerald-400 uppercase font-mono block font-bold">Slight Premium Limit Over</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTIONABLE RECOMMENDATIONS FOR THE SCHOOL */}
                <div className="space-y-4 bg-black/20 p-5 rounded border border-white/5">
                  <h4 className="text-xs font-mono font-extrabold text-white uppercase tracking-wider">
                     Strategic Recommendations for Future Cohorts
                  </h4>

                  <ul className="space-y-3 text-xs leading-relaxed text-neutral-300 font-sans list-none">
                    <li className="flex gap-2.5 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                      <div>
                        <strong className="text-white block">Integrate continuous risk simulation:</strong>
                        The Grade XII cohort demonstrated high risk assessment capability during role assignments, which can be further amplified through continuous mock trading.
                      </div>
                    </li>
                    
                    <li className="flex gap-2.5 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                      <div>
                        <strong className="text-white block">Expose room decisions to peer critiques:</strong>
                        Activating the "Spotlight Exchange" during board sessions drastically increased peer-to-peer alignment in Class XII. Recommend utilizing student cross-debates as part of standard classroom structures.
                      </div>
                    </li>

                    <li className="flex gap-2.5 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                      <div>
                        <strong className="text-white block">Provide parental reinforcement frameworks:</strong>
                        Since 94% of teachers evaluated high real-world relevance, sharing Home Reinforcement Guides enables long-term spending adjustments.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
