import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { sounds } from '../utils/audio';

interface Screen02WelcomeProps {
  userName: string;
  setUserName: (val: string) => void;
  onComplete: () => void;
}

const PSYCHOLOGICAL_TRAITS = [
  { id: 'leader', label: 'Leader', desc: 'Sovereign decision builder & team driver', icon: '👑' },
  { id: 'wealth', label: 'Wealth Builder', desc: 'Focuses on capital efficiency & dynamic compound growth', icon: '💰' },
  { id: 'innovator', label: 'Innovator', desc: 'Challenges legacy frameworks & leverages AI', icon: '💡' },
  { id: 'problem_solver', label: 'Problem Solver', desc: 'Deconstructs complex hurdles into actions', icon: '🧩' },
  { id: 'strategist', label: 'Strategist', desc: 'Traces high-level second-order consequences', icon: '📐' },
  { id: 'explorer', label: 'Explorer', desc: 'Tests extreme parameters & risk thresholds', icon: '✈️' },
  { id: 'creator', label: 'Creator', desc: 'Synthesizes novel value streams from empty status', icon: '🎨' }
];

export default function Screen02Welcome({ userName, setUserName, onComplete }: Screen02WelcomeProps) {
  const [name, setName] = useState(userName);
  const [stuClass, setStuClass] = useState(() => localStorage.getItem('reyou-student-class') || 'XII');
  const [stuSection, setStuSection] = useState(() => localStorage.getItem('reyou-student-section') || 'A');
  const [selectedTraits, setSelectedTraits] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('reyou-student-selected-traits');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleTrait = (id: string) => {
    sounds.playClickSound();
    setSelectedTraits(prev => {
      let next;
      if (prev.includes(id)) {
        next = prev.filter(x => x !== id);
      } else {
        if (prev.length >= 3) {
          // Replace first chosen trait to keep max 3
          next = [...prev.slice(1), id];
        } else {
          next = [...prev, id];
        }
      }
      localStorage.setItem('reyou-student-selected-traits', JSON.stringify(next));
      return next;
    });
  };

  const handleProceed = () => {
    if (!name.trim()) return;
    if (selectedTraits.length < 3) return;

    sounds.playValidationChime();
    setUserName(name.toUpperCase());
    localStorage.setItem('reyou-student-name', name.toUpperCase());
    localStorage.setItem('reyou-student-class', stuClass);
    localStorage.setItem('reyou-student-section', stuSection);
    // Auto-create a roll number if not existing
    const existingRoll = localStorage.getItem('reyou-student-roll');
    if (!existingRoll) {
      localStorage.setItem('reyou-student-roll', `APS-${stuClass}-${stuSection}-${Math.floor(Math.random() * 800) + 100}`);
    }
    const existingEmail = localStorage.getItem('reyou-student-email');
    if (!existingEmail) {
      localStorage.setItem('reyou-student-email', `${name.toLowerCase().replace(/\s+/g, '')}@apsbhopal.edu.in`);
    }

    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-white flex flex-col justify-between items-center p-6 md:p-12 relative overflow-hidden select-none font-sans">
      {/* Dynamic ambient background glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.03)_0%,transparent_70%)]" />
      </div>

      {/* Header element */}
      <div className="w-full flex justify-between items-center text-[10px] font-mono tracking-widest text-[#AAB2C8] z-10 select-none">
        <span className="uppercase text-[#D4AF37]">REYOU OPERATION COMMAND CENTRAL</span>
        <span className="uppercase font-bold">IDENTITY ACTIVATION • STAGE 02</span>
      </div>

      {/* Primary Workstage */}
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-4xl px-4 z-10 my-6">
        <div className="space-y-8 w-full">
          
          {/* Main heading */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-sans tracking-tight text-white uppercase font-black">
              IDENTITY ACTIVATION
            </h1>
            <p className="text-xs text-[#AAB2C8] max-w-lg mx-auto font-medium">
              Activate your simulated boardroom registry. Define your profile parameters to trigger team matching protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Section */}
            <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 p-6 rounded-sm space-y-5 relative backdrop-blur-xl">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
              
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] border-b border-white/5 pb-2 font-black">
                1. Registry Parameters
              </h2>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold uppercase text-[#AAB2C8] tracking-widest block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    className="w-full bg-[#050505]/40 border border-white/10 rounded-xs py-3 px-4 text-xs font-mono text-white tracking-widest uppercase focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/25 transition-all text-center placeholder-neutral-600 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono font-bold uppercase text-[#AAB2C8] tracking-widest block">
                      Class
                    </label>
                    <select
                      value={stuClass}
                      onChange={(e) => setStuClass(e.target.value)}
                      className="w-full bg-[#050505]/40 border border-white/10 rounded-xs py-3 px-3 text-xs font-mono text-white tracking-widest focus:outline-none focus:border-[#D4AF37] transition-all text-center font-bold"
                    >
                      <option value="XII">GRADE XII</option>
                      <option value="XI">GRADE XI</option>
                      <option value="X">GRADE X</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono font-bold uppercase text-[#AAB2C8] tracking-widest block">
                      Section
                    </label>
                    <select
                      value={stuSection}
                      onChange={(e) => setStuSection(e.target.value)}
                      className="w-full bg-[#050505]/40 border border-white/10 rounded-xs py-3 px-3 text-xs font-mono text-white tracking-widest focus:outline-none focus:border-[#D4AF37] transition-all text-center font-bold"
                    >
                      <option value="A">SECTION A</option>
                      <option value="B">SECTION B</option>
                      <option value="C">SECTION C</option>
                      <option value="D">SECTION D</option>
                      <option value="E">SECTION E</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 text-[9px] font-mono text-neutral-500 flex justify-between uppercase">
                <span>AtteSTATION: APPROVED</span>
                <span>SECURE INPUT</span>
              </div>
            </div>

            {/* Traits Selection Section (Apple Style Glassmorphism Card Grid) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h2 className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] font-black">
                  2. Choose exactly 3 core psychological drivers
                </h2>
                <span className={`text-[10px] font-mono font-extrabold uppercase py-0.5 px-2.5 rounded-full ${
                  selectedTraits.length === 3 
                    ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-400' 
                    : 'bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37]'
                }`}>
                  Selected {selectedTraits.length} / 3
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {PSYCHOLOGICAL_TRAITS.map((trait) => {
                  const isSelected = selectedTraits.includes(trait.id);
                  return (
                    <button
                      type="button"
                      key={trait.id}
                      onClick={() => toggleTrait(trait.id)}
                      className={`text-left p-4 rounded-sm border cursor-pointer transition-all duration-300 relative overflow-hidden flex items-start gap-3.5 group select-none ${
                        isSelected
                          ? 'bg-[#D4AF37]/10 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.08)]'
                          : 'bg-white/[0.01] border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="text-2xl pt-0.5 select-none">{trait.icon}</div>
                      <div className="space-y-1">
                        <h4 className={`text-sm font-sans font-black uppercase tracking-tight ${
                          isSelected ? 'text-[#D4AF37]' : 'text-white group-hover:text-white'
                        }`}>
                          {trait.label}
                        </h4>
                        <p className="text-[10.5px] text-[#AAB2C8] font-normal leading-normal">
                          {trait.desc}
                        </p>
                      </div>

                      {/* Small visual card corner indicator */}
                      {isSelected && (
                        <div className="absolute right-0 top-0 bg-[#D4AF37] text-neutral-950 px-2 py-0.5 text-[8px] font-mono font-black uppercase">
                          ACTIVE
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Footer controls */}
      <div className="w-full max-w-sm flex flex-col items-center gap-4 z-10">
        <button
          onClick={handleProceed}
          disabled={!name.trim() || selectedTraits.length !== 3}
          className={`w-full font-mono text-xs font-black tracking-widest py-4 px-8 uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 border cursor-pointer ${
            name.trim() && selectedTraits.length === 3
              ? 'bg-[#D4AF37] hover:bg-yellow-500 text-neutral-950 border-[#D4AF37] shadow-[0_4px_25px_rgba(212,175,55,0.2)]'
              : 'bg-neutral-900 text-neutral-500 border-white/5 cursor-not-allowed opacity-50'
          }`}
        >
          CONFIRM MEMBER PROFILE
        </button>
        <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
          TRANS-BIAS IDENTITY INTEGRATION SHIELDED
        </div>
      </div>
    </div>
  );
}
