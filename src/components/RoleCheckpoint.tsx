import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RoleId, ROLES, TEAMS, Teammate } from '../types';
import { sounds } from '../utils/audio';
import { 
  ShieldCheck, 
  Sparkles, 
  User, 
  CheckCircle2, 
  HelpCircle, 
  TrendingUp, 
  AlertOctagon, 
  MessageSquare, 
  BookOpen, 
  Check, 
  RefreshCcw,
  Bot,
  Flame,
  ArrowRight
} from 'lucide-react';

interface RoleCheckpointProps {
  userName: string;
  assignedRoleId: RoleId;
  selectedTeamId: string;
  selectedOption: 'A' | 'B' | null;
  crisisTitle: string;
  onCheckpointStatusChange: (isApproved: boolean) => void;
}

interface MemberState {
  name: string;
  roleId: RoleId;
  userInput: string;
  aiAssistance: string;
  aiFeedback: string;
  isGenerating: boolean;
  isAssessing: boolean;
  score: number;
  isApproved: boolean;
  touched: boolean;
}

export default function RoleCheckpoint({
  userName,
  assignedRoleId,
  selectedTeamId,
  selectedOption,
  crisisTitle,
  onCheckpointStatusChange
}: RoleCheckpointProps) {
  // Get active team members
  const team = TEAMS.find(t => t.id === selectedTeamId) || TEAMS[0];
  
  // Initialize state for the team members
  const [members, setMembers] = useState<MemberState[]>([]);
  const [selectedMemberIndex, setSelectedMemberIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'A' | 'B'>('A');

  // Trigger setup on mount or team change
  useEffect(() => {
    const initializedMembers = team.members.map((member) => {
      const isPlayer = member.roleId === assignedRoleId;
      const displayName = isPlayer ? userName : member.name;
      
      return {
        name: displayName,
        roleId: member.roleId,
        userInput: '',
        aiAssistance: '',
        aiFeedback: '',
        isGenerating: false,
        isAssessing: false,
        score: 0,
        isApproved: false,
        touched: false
      };
    });
    setMembers(initializedMembers);
    
    // Find player index or default to 0
    const playerIdx = initializedMembers.findIndex(m => m.roleId === assignedRoleId);
    if (playerIdx !== -1) {
      setSelectedMemberIndex(playerIdx);
    }
  }, [team, assignedRoleId, userName]);

  // Track if all members are approved to notify parent component
  const allApproved = members.length > 0 && members.every(m => m.isApproved);

  useEffect(() => {
    onCheckpointStatusChange(allApproved);
  }, [allApproved, onCheckpointStatusChange]);

  // AI draft helpers tailored to Option choices
  const getTeammateDraftSuggestion = (roleId: RoleId, option: 'A' | 'B'): { text: string; feedback: string; enhanced: string } => {
    const optText = option === 'A' ? 'Priority Premium Liquidation' : 'Alternative Delay/Debt Extension';
    
    switch (roleId) {
      case 'TEAM_LEAD':
        return {
          text: `As Team Lead, I approve the move to select Option ${option}. We must ensure the family respects this major shift. We will set a tight weekly communication loop to keep everyone aligned.`,
          feedback: "The Team Lead's proposal provides structured leadership but lacks explicit measures for dealing with potential family friction under high stress.",
          enhanced: `As Team Lead, I officially authorize the transition to Option ${option} (${optText}) to resolve the ${crisisTitle || 'emergency'}. We will establish a bi-weekly transparent family budget audit council, creating unified operational goals across all members to de-escalate emotional friction and guarantee absolute commitment to the chosen debt trajectory.`
        };
      case 'STRATEGY_LEAD':
        return {
          text: `My analysis shows Option ${option} protects us in the immediate term, but we are sacrificing future developmental buffers. We should plan to pivot back to growth as soon as the debt is paid off.`,
          feedback: "Strategic reasoning is valid but ignores the precise timeline required to rebuild the asset cushions.",
          enhanced: `I validate selecting Option ${option} as a strategic necessity. However, to buffer the long-term, we must configure a strict post-repayment recovery framework. Every rupee saved immediately after the debt clearing will be auto-allocated to emergency high-yield liquid mutual reserves, compressing our asset recovery timeline from 24 months to 12 months.`
        };
      case 'RISK_LEAD':
        return {
          text: `Option ${option} exposes us to liquidity risk. If another emergency occurs in the next 180 days, we'll have zero cushion and face total default. We need a backup creditor line.`,
          feedback: "Spot-on risk profiling regarding liquid default. Extremely crucial for psychological safety.",
          enhanced: `From a structural risk perspective, Option ${option} poses a critical single-point of failure via liquidation or interest rate shocks. Therefore, I approve only on the condition that we establish an immediate secondary credit standby line with a trusted community cooperative up to ₹25,000, insulating our family from sudden default if a health relapse occurs.`
        };
      case 'COMMUNICATION_LEAD':
        return {
          text: `We will frame this Option ${option} decision carefully to the family. We'll present it as an active strategic sacrifice rather than a desperate failure to shield mental peace.`,
          feedback: "Constructive framing. It should explicitly detail how to communicate with parents/relations without breeding long-term anxiety.",
          enhanced: `To preserve collective psychological safety, I have designed a direct communication deck for the household. We will pitch Option ${option} as an active, deliberate portfolio reallocation rather than an emergency deficit. By explicitly demonstrating that we are taking absolute ownership of our future, we turn potential family shame into shared developmental agency.`
        };
      case 'REFLECTION_LEAD':
        return {
          text: `Choosing Option ${option} makes me reflect on our past bias. We assumed our regular cash flows would never be interrupted. This is a severe confirmation bias trap.`,
          feedback: "Excellent metacognitive audit. Highly aligned with OECD self-regulation expectations.",
          enhanced: `My self-regulation audit reveals we fell into a classic availability and optimism bias, assuming our health and regular cash streams were permanent. By selecting Option ${option}, we must institutionalize a 'Pre-Mortem' protocol for all future family financial expansions, ensuring structured counter-arguments are weighed before locks are applied.`
        };
      default:
        return {
          text: `I support Option ${option} and suggest we manage the impact together as a professional unit.`,
          feedback: "Somewhat generic. Needs deeper alignment with specific role responsibilities.",
          enhanced: `I approve the selected Option ${option}. I suggest setting up structured contingency protocols to maximize student consensus, ensuring all risk vectors are recursively audited by appropriate specialized roles.`
        };
    }
  };

  // Simulating teammate generation
  const handleTeammateRequest = (idx: number) => {
    sounds.playClickSound();
    const updated = [...members];
    updated[idx].isGenerating = true;
    setMembers(updated);

    setTimeout(() => {
      const currentOpt = selectedOption || 'A';
      const suggestions = getTeammateDraftSuggestion(updated[idx].roleId, currentOpt);
      
      const newMembers = [...members];
      newMembers[idx].userInput = suggestions.text;
      newMembers[idx].isGenerating = false;
      newMembers[idx].touched = true;
      setMembers(newMembers);
      sounds.playValidationChime();
    }, 1500);
  };

  // Simulating AI Assessment and Critique
  const handleAIAssess = (idx: number) => {
    sounds.playClickSound();
    const target = members[idx];
    if (!target.userInput || target.userInput.trim().length < 15) {
      alert("Please input a substantial reflection draft first (minimum 15 characters) so the AI can analyze.");
      return;
    }

    const updated = [...members];
    updated[idx].isAssessing = true;
    setMembers(updated);

    setTimeout(() => {
      const currentOpt = selectedOption || 'A';
      const suggestions = getTeammateDraftSuggestion(target.roleId, currentOpt);

      // Give high score if length is very good or if they used helper draft
      const baseScore = Math.min(100, 75 + Math.floor(Math.random() * 15) + (target.userInput.length > 50 ? 10 : 0));

      const finalMembers = [...members];
      finalMembers[idx].aiFeedback = suggestions.feedback;
      finalMembers[idx].aiAssistance = suggestions.enhanced;
      finalMembers[idx].score = baseScore;
      finalMembers[idx].isAssessing = false;
      setMembers(finalMembers);
      sounds.playValidationChime();
    }, 2000);
  };

  // Apply AI Enhanced Text and Approve
  const handleApplyEnhancement = (idx: number) => {
    sounds.playValidationChime();
    const updated = [...members];
    updated[idx].userInput = updated[idx].aiAssistance;
    updated[idx].isApproved = true;
    updated[idx].aiFeedback = '';
    updated[idx].aiAssistance = '';
    setMembers(updated);
  };

  // Manual approval of current state
  const handleManualApprove = (idx: number) => {
    sounds.playValidationChime();
    const updated = [...members];
    updated[idx].isApproved = true;
    setMembers(updated);
  };

  // Reset member state if they want to edit
  const handleReset = (idx: number) => {
    sounds.playClickSound();
    const updated = [...members];
    updated[idx].isApproved = false;
    updated[idx].aiFeedback = '';
    updated[idx].aiAssistance = '';
    updated[idx].score = 0;
    setMembers(updated);
  };

  // Trigger quick validation logic to check if they completed
  const activeOptClean = selectedOption || 'A';

  if (!selectedOption) {
    return (
      <div id="role-checkpoint-placeholder" className="border border-dashed border-[#D4AF37]/30 bg-[#0E0F12] p-8 rounded-sm text-center space-y-4 my-6">
        <Bot className="w-8 h-8 text-[#D4AF37] mx-auto animate-pulse" />
        <h5 className="font-mono font-bold text-white text-xs uppercase tracking-widest">
          Awaiting Consensus Option Selection
        </h5>
        <p className="text-[11px] text-neutral-400 max-w-sm mx-auto leading-relaxed">
          Select one of the Consensus Decision alternatives above to mount the Specialized Team Role Checkpoints.
        </p>
      </div>
    );
  }

  return (
    <div id="role-checkpoint-container" className="border border-[#D4AF37]/35 bg-[#0F1219] rounded-sm relative overflow-hidden text-left selection:bg-amber-500 selection:text-black">
      
      {/* Decorative Golden Corner Seals */}
      <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
        <div className="absolute top-[-25px] right-[-25px] w-12 h-12 bg-[#D4AF37]/15 rotate-45 border-b border-[#D4AF37]/40" />
      </div>
      <div className="absolute top-0 left-0 w-12 h-12 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15px] left-[-15px] w-8 h-8 bg-neutral-800 rotate-45 border-r border-[#D4AF37]/10" />
      </div>

      {/* Header Unit */}
      <div className="p-5 md:p-6 border-b border-[#D4AF37]/25 bg-gradient-to-r from-neutral-900 to-[#141822] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-mono font-black text-[#D4AF37] uppercase tracking-widest">
              Gated Peer-Social Consent Protocol
            </span>
          </div>
          <h3 className="text-lg font-serif font-bold text-white tracking-wide uppercase flex items-center gap-2">
            <ShieldCheck className="w-5.5 h-5.5 text-[#D4AF37]" />
            COGNITIVE ROLE CHECKPOINT MODULE
          </h3>
          <p className="text-[11px] text-neutral-400">
            Before submitting the chosen alternative, all team roles must declare and secure AI consensus for their specialized focus areas.
          </p>
        </div>

        {/* Unified Team Roster Progress */}
        <div className="bg-black/40 border border-white/5 px-4 py-2 rounded-sm text-right flex flex-col items-end">
          <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">
            Consensus Quorum
          </span>
          <span className="text-xl font-mono font-bold text-white">
            {members.filter(m => m.isApproved).length} <span className="text-neutral-500">/</span> {members.length}
          </span>
          <div className="w-28 bg-neutral-800 h-1 rounded-full mt-1.5 overflow-hidden">
            <div 
              className="bg-[#D4AF37] h-full transition-all duration-500" 
              style={{ width: `${(members.filter(m => m.isApproved).length / Math.max(1, members.length)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Roster Grid Selector tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/5 bg-black/20 select-none">
        {members.map((m, idx) => {
          const isSelected = selectedMemberIndex === idx;
          const isPlayer = m.roleId === assignedRoleId;
          const roleDef = ROLES[m.roleId];
          
          return (
            <button
              key={m.roleId}
              onClick={() => { sounds.playClickSound(); setSelectedMemberIndex(idx); }}
              className={`p-4 text-left border-r border-b md:border-b-0 border-white/5 transition-all text-xs focus:outline-none flex flex-col justify-between items-start cursor-pointer relative ${
                isSelected ? 'bg-[#181C26] border-b-2 border-b-[#D4AF37]!' : 'hover:bg-white/2'
              }`}
            >
              <div className="flex justify-between w-full items-center mb-2">
                <span className={`text-[8.5px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm ${
                  isPlayer ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 font-black' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {isPlayer ? 'YOU' : 'PEER'}
                </span>
                {m.isApproved ? (
                  <span className="text-emerald-400 flex items-center gap-0.5 text-[9px] font-mono uppercase font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> SECURED
                  </span>
                ) : (
                  <span className="text-amber-500/80 flex items-center gap-0.5 text-[9px] font-mono uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> PENDING
                  </span>
                )}
              </div>
              
              <div className="space-y-0.5">
                <h4 className="font-mono font-bold text-white uppercase text-[11px] tracking-wide truncate max-w-[125px]">
                  {m.name}
                </h4>
                <p className="text-[9px] text-neutral-400 font-serif italic truncate max-w-[125px]">
                  {roleDef?.title || 'Team Member'}
                </p>
              </div>

              {/* Status subtle overlay bar */}
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                m.isApproved ? 'bg-emerald-500' : isSelected ? 'bg-[#D4AF37]' : 'bg-transparent'
              }`} />
            </button>
          );
        })}
      </div>

      {/* Selected Member Detail Workspace */}
      {members[selectedMemberIndex] && (() => {
        const m = members[selectedMemberIndex];
        const roleDef = ROLES[m.roleId];
        const isPlayer = m.roleId === assignedRoleId;

        return (
          <div className="p-5 md:p-6 space-y-6 bg-gradient-to-b from-[#121620] to-[#0A0D14]">
            
            {/* Persona card banner */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-sm bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-serif text-lg font-bold">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold">
                    Specialized Focus Assignment
                  </span>
                  <h4 className="text-sm font-mono font-bold text-white uppercase flex items-center gap-2">
                    {m.name} &mdash; <span className="text-[#D4AF37] font-serif italic font-normal text-xs lowercase first-letter:uppercase">({roleDef?.title})</span>
                  </h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed mt-1 italic max-w-xl">
                    &ldquo;{roleDef?.detailedDescription}&rdquo;
                  </p>
                </div>
              </div>

              {/* Action helper badge */}
              {!isPlayer && !m.isApproved && (
                <button
                  onClick={() => handleTeammateRequest(selectedMemberIndex)}
                  disabled={m.isGenerating}
                  className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 hover:text-white text-[9.5px] font-mono text-[#D4AF37] uppercase tracking-wider rounded-sm transition-all border border-[#D4AF37]/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {m.isGenerating ? 'Drafting...' : 'Request Teammate Proposal'}
                </button>
              )}
            </div>

            {/* Reflection Text Input Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Draft Entry Panel */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex justify-between items-center bg-black/20 p-2 border-b border-white/5">
                  <span className="text-[9.5px] font-mono text-neutral-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Foresight & Action Risk Statement
                  </span>
                  <span className="text-[9.5px] font-mono text-neutral-500">
                    Draft Length: <strong className="text-white">{m.userInput.length}</strong> characters
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    value={m.userInput}
                    disabled={m.isApproved || m.isGenerating || m.isAssessing}
                    onChange={(e) => {
                      const updated = [...members];
                      updated[selectedMemberIndex].userInput = e.target.value;
                      updated[selectedMemberIndex].touched = true;
                      setMembers(updated);
                    }}
                    placeholder={
                      isPlayer 
                        ? `Focus on your role responsibilities. E.g., How does choosing Option ${activeOptClean} protect our family, what are we ignoring, and how do we secure backup emergency funds?`
                        : `Await colleague input draft or select "Request Teammate Proposal" above...`
                    }
                    rows={4}
                    className="w-full bg-black/60 border border-white/10 rounded-sm p-4 text-xs text-white leading-relaxed outline-none focus:border-[#D4AF37] transition-all disabled:opacity-75 font-mono"
                  />
                  
                  {m.isApproved && (
                    <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[1px] flex items-center justify-center pointer-events-auto rounded-sm select-none">
                      <div className="bg-[#181C26] border border-emerald-500/30 px-5 py-3 rounded-xs flex items-center gap-3 text-emerald-400 font-mono text-xs shadow-xl tracking-wider">
                        <CheckCircle2 className="w-5 h-5 animate-bounce" />
                        SPECIALIST ROLE STATEMENT LOCKED & APPROVED
                      </div>
                    </div>
                  )}

                  {m.isGenerating && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-sm text-neutral-400 text-xs">
                      <Bot className="w-8 h-8 text-[#D4AF37] animate-spin mb-2" />
                      <span className="font-mono tracking-widest text-[#D4AF37]">ENGAGING AI AGENT FEED...</span>
                    </div>
                  )}
                </div>

                {/* Submit to AI audit row */}
                {!m.isApproved && (
                  <div className="flex gap-3 justify-end items-center">
                    {/* Clear/Reset button */}
                    {m.userInput && (
                      <button
                        onClick={() => {
                          const updated = [...members];
                          updated[selectedMemberIndex].userInput = '';
                          setMembers(updated);
                        }}
                        className="px-3 py-2 text-neutral-500 hover:text-white font-mono text-[10px] uppercase cursor-pointer"
                      >
                        RESET DRAFT
                      </button>
                    )}

                    <button
                      onClick={() => handleAIAssess(selectedMemberIndex)}
                      disabled={m.isAssessing || !m.userInput || m.userInput.trim().length < 15}
                      className={`px-5 py-3 rounded-sm font-mono text-[10.5px] uppercase font-bold tracking-widest transition-all flex items-center gap-2 cursor-pointer ${
                        m.userInput && m.userInput.trim().length >= 15
                          ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37] hover:bg-[#D4AF37]/20 shadow-[0_4px_15px_rgba(212,175,55,0.08)]'
                          : 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                      }`}
                    >
                      {m.isAssessing ? (
                        <>
                          <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                          Analyzing draft...
                        </>
                      ) : (
                        <>
                          <Bot className="w-4 h-4" />
                          Evaluate with AI Auditor
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* AI Assistance Feedback Section */}
              <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/5 pt-5 lg:pt-0 lg:pl-6 space-y-4">
                
                {/* Score and Critique layout */}
                {m.score > 0 || m.isAssessing ? (
                  <div className="space-y-4 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">
                        AI COGNITIVE ASSESSMENT BRIEF
                      </span>
                      {m.score > 0 && (
                        <div className="bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-sm flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span className="text-[10px] font-mono font-bold text-amber-500">
                            Foresight Score: {m.score}%
                          </span>
                        </div>
                      )}
                    </div>

                    {m.isAssessing ? (
                      <div className="space-y-3 py-6 text-center text-neutral-400">
                        <div className="flex justify-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce" />
                        </div>
                        <p className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">
                          Analyzing structural policy resilience...
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-black/40 p-3 rounded-sm border border-orange-500/10 text-[11px] leading-relaxed text-amber-100/90 italic">
                          <strong className="text-[#D4AF37] font-mono text-[9px] uppercase tracking-wider block mb-1">
                            ⚠️ LATENT HAZARD OBSERVATION
                          </strong>
                          &ldquo;{m.aiFeedback}&rdquo;
                        </div>

                        <div className="bg-black/40 p-3 rounded-sm border border-emerald-500/10 text-[11px] leading-relaxed text-emerald-100/90">
                          <strong className="text-emerald-400 font-mono text-[9px] uppercase tracking-wider block mb-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> DESIGNATED AI FELLOWSHIP AUGMENTATION
                          </strong>
                          &ldquo;{m.aiAssistance}&rdquo;
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-black/20 rounded-sm border border-white/5 p-5 text-center flex flex-col items-center justify-center gap-3 py-8 flex-1">
                    <Bot className="w-8 h-8 text-neutral-600 mb-1" />
                    <h5 className="font-mono font-bold text-white text-[11px] uppercase tracking-wider">
                      Foresight Evaluation Inactive
                    </h5>
                    <p className="text-[11px] text-neutral-500 leading-relaxed max-w-xs">
                      Type your specialist statement draft and click **"Evaluate with AI Auditor"** to generate metacognitive critiques and high-fidelity text enhancements.
                    </p>
                  </div>
                )}

                {/* Actions bottom alignment */}
                {m.score > 0 && !m.isApproved && (
                  <div className="space-y-2 pt-4 border-t border-white/5 select-none">
                    <button
                      onClick={() => handleApplyEnhancement(selectedMemberIndex)}
                      className="w-full py-3 bg-[#D4AF37] hover:bg-yellow-500 text-black font-mono text-[10.5px] uppercase font-black tracking-wider rounded-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Apply AI Enhancement & Approve
                    </button>
                    
                    <button
                      onClick={() => handleManualApprove(selectedMemberIndex)}
                      className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 hover:text-white text-neutral-400 font-mono text-[10px] uppercase tracking-wider rounded-sm transition-all border border-neutral-700 cursor-pointer"
                    >
                      Directly Approve Current Draft
                    </button>
                  </div>
                )}

                {/* Locked back-controls */}
                {m.isApproved && (
                  <div className="pt-2">
                    <button
                      onClick={() => handleReset(selectedMemberIndex)}
                      className="w-full py-2 bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-white font-mono text-[9px] uppercase tracking-wider hover:border-neutral-700 transition-all cursor-pointer"
                    >
                      ⚙️ Reset Roster Node to Edit
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
        );
      })()}

      {/* Progress Footer Panel */}
      <div className="bg-black/60 p-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 text-neutral-400">
          <Bot className="w-4 h-4 text-[#D4AF37]" />
          <span>OECD Self-Regulation compliance mapping auto-active.</span>
        </div>
        
        {allApproved ? (
          <div className="text-emerald-400 font-bold uppercase flex items-center gap-1.5 tracking-wider text-[11px]">
            <Check className="w-4 h-4 text-emerald-400" />
            ALL STATIONS SECURED: CONSENSUS GATES ARE OPEN
          </div>
        ) : (
          <div className="text-amber-500 font-bold uppercase flex items-center gap-2 text-[10.5px] tracking-wide animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            GATES LOCKED — Awaiting Specialized Approvals
          </div>
        )}
      </div>

    </div>
  );
}
