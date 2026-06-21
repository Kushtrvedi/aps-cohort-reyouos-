import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Radio, 
  Search, 
  PlusCircle, 
  Check, 
  User, 
  Tv, 
  Tv2,
  Volume2
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface ReflectionItem {
  id: number;
  author: string;
  text: string;
  timestamp?: string;
}

interface SpotlightFeedProps {
  reflections: ReflectionItem[];
  spotlightedReflection: ReflectionItem | null;
  onSpotlight: (refItem: ReflectionItem) => void;
  onSimulateNewReflection: () => void;
}

export default function SpotlightFeed({
  reflections,
  spotlightedReflection,
  onSpotlight,
  onSimulateNewReflection
}: SpotlightFeedProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [lastBroadcastedRefId, setLastBroadcastedRefId] = useState<number | null>(
    spotlightedReflection ? spotlightedReflection.id : null
  );
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Play audio chime and trigger broadcast
  const handleSingleClickBroadcast = (refItem: ReflectionItem) => {
    sounds.playValidationChime();
    
    // Select this reflection immediately
    onSpotlight(refItem);
    setLastBroadcastedRefId(refItem.id);
    
    // Pulse animation state
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
    }, 1500);
  };

  const filteredReflections = reflections.filter(ref => 
    ref.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ref.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="spotlight-feed-root" className="bg-[#0E0E0E] border border-[#1A1A1A] p-6 rounded-xs space-y-5">
      {/* HEADER WITH REALTIME STATUS */}
      <div className="border-b border-[#1A1A1A] pb-3 flex justify-between items-center">
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">
            COHORT INTERACTION
          </span>
          <h2 className="text-sm font-display font-bold text-white uppercase flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            Spotlight & Broadcast Feed
          </h2>
        </div>
        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 px-2 py-0.5 border border-emerald-950/30 rounded-xs font-bold uppercase">
          LIVE STREAM
        </span>
      </div>

      <p className="text-xs text-neutral-450 font-sans leading-relaxed text-neutral-400">
        Monitor student submissions in real time. <strong>Single-click the transmission icon</strong> to immediately broadcast a reflection to student views.
      </p>

      {/* FILTER & SIMULATE CONTROL ROW */}
      <div className="flex gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by student, team, key reflections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-[#1A1A1A] rounded-xs pl-8 pr-3 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition-all"
          />
        </div>
        <button
          onClick={() => {
            sounds.playClickSound();
            onSimulateNewReflection();
          }}
          className="px-3 py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 text-[#D4AF37] rounded-xs text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
          title="Simulate a new incoming student reflection instantly"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Simulate
        </button>
      </div>

      {/* INCOMING FEED BODY */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {filteredReflections.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-neutral-500 border border-dashed border-[#1A1A1A] rounded-xs">
            No matching reflections found.
          </div>
        ) : (
          filteredReflections.map((ref) => {
            const isProjected = spotlightedReflection && spotlightedReflection.id === ref.id;
            const isCurrentlyBroadcasted = lastBroadcastedRefId === ref.id;

            return (
              <div
                key={ref.id}
                onClick={() => onSpotlight(ref)}
                className={`p-3.5 rounded-xs border text-left text-xs cursor-pointer transition-all relative group ${
                  isProjected
                    ? 'bg-[#D4AF37]/5 border-[#D4AF37] text-white'
                    : 'bg-black border-[#1A1A1A] text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <div className="flex justify-between text-[9px] font-mono text-[#D4AF37] uppercase tracking-wider font-bold pb-1.5">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-neutral-500" />
                    {ref.author}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {isCurrentlyBroadcasted && (
                      <span className="text-emerald-400 text-[8.5px] font-black tracking-widest bg-emerald-950/50 px-1.5 py-0.5 border border-emerald-900/30 rounded-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        BROADCASTED
                      </span>
                    )}
                    {isProjected && !isCurrentlyBroadcasted && (
                      <span className="text-[#D4AF37] text-[8.5px] font-bold">
                        PREVIEWED
                      </span>
                    )}
                  </div>
                </div>

                <p className="font-sans text-neutral-200 leading-relaxed pr-10">
                  "{ref.text}"
                </p>

                {/* SINGLE-CLICK DIRECT TRANSMISSION / BROADCAST CHANNELER BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent duplicate clicks or previewing
                    handleSingleClickBroadcast(ref);
                  }}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xs transition-all pointer-events-auto border ${
                    isCurrentlyBroadcasted
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/40'
                      : 'bg-neutral-900/80 border-[#222] hover:border-[#D4AF37] text-neutral-400 hover:text-white group-hover:opacity-100'
                  }`}
                  title="Single-click to broadcast this reflection immediately to all student terminals"
                >
                  <Send className={`w-3.5 h-3.5 ${isCurrentlyBroadcasted ? 'animate-bounce' : ''}`} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* DETAILED BROADCAST HUD */}
      {spotlightedReflection && (
        <AnimatePresence mode="wait">
          <motion.div
            key={spotlightedReflection.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`p-4 bg-black border rounded-xs space-y-2.5 transition-all ${
              lastBroadcastedRefId === spotlightedReflection.id
                ? 'border-emerald-900/40'
                : 'border-amber-900/30'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className={`text-[9px] font-mono block tracking-widest font-black uppercase ${
                lastBroadcastedRefId === spotlightedReflection.id 
                  ? 'text-emerald-400' 
                  : 'text-amber-500'
              }`}>
                {lastBroadcastedRefId === spotlightedReflection.id ? '🌟 BROADCASTED TO MAIN STAGE' : '⚠️ PREVIEW STAGE CONSOLE'}
              </span>
              
              {/* Force Broadcast toggle if they clicked on the card to select/preview first */}
              {lastBroadcastedRefId !== spotlightedReflection.id && (
                <button
                  onClick={() => handleSingleClickBroadcast(spotlightedReflection)}
                  className="px-2 py-0.5 bg-[#D4AF37] text-black text-[9px] font-mono uppercase font-black tracking-widest rounded-xs hover:bg-yellow-500 cursor-pointer transition-all"
                >
                  Broadcast Now
                </button>
              )}
            </div>

            <p className="text-xs font-sans text-neutral-100 font-bold leading-normal">
              "{spotlightedReflection.text}"
            </p>
            <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
              <span className="font-bold">- {spotlightedReflection.author}</span>
              {lastBroadcastedRefId === spotlightedReflection.id && (
                <span className="text-emerald-450 text-[9px] font-bold tracking-widest flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  STUDENT CHANNELS ACTIVE
                </span>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
