import React from 'react';

// =========================================================================
// APPLE EDUCATION + FINANCIAL TIMES EDITORIAL SYSTEM ILLUSTRATIONS
// Color Palette: 
// - Neutral Dark Canvas: #090909 (Backdrops) & #0E0E0E (Panels)
// - Pristine Gold/Amber Focus: #D4AF37 (Highlight & Editorial Accent)
// - Eye-Safe Emerald Green: #10B981 (Stability & Wealth Accumulation)
// - Crimson Risk Warning: #EF4444 (Speculative Loss & Debt Diagnostics)
// - Crisp Editorial Typography, ultra-thin hairlines, and elegant micro-animations.
// =========================================================================

// ==========================================
// 1. TEAM REVEAL: ANIMATED SEALED ENVELOPE SVG
// ==========================================
export const SVGTeamReveal: React.FC = () => {
  return (
    <div className="w-full flex justify-center py-5 select-none" id="illustration-team-reveal">
      <svg
        viewBox="0 0 400 240"
        className="w-full max-w-sm h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`
          @keyframes openEnvelopeFlap {
            0% { transform: scaleY(1); }
            100% { transform: scaleY(-0.9); }
          }
          @keyframes sealWaxDrop {
            0% { transform: scale(0) rotate(15deg); opacity: 0; }
            50% { transform: scale(1.1) rotate(-5deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; filter: drop-shadow(0 4px 10px rgba(212,175,55,0.45)); }
          }
          @keyframes mandateScrollPulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 0.95; }
          }
          .envelope-top-flap {
            transform-origin: 200px 70px;
            animation: openEnvelopeFlap 2.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            animation-delay: 0.5s;
          }
          .envelope-wax-seal {
            transform-origin: 200px 125px;
            animation: sealWaxDrop 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            animation-delay: 2.1s;
            opacity: 0;
          }
          .letter-pulse-text {
            animation: mandateScrollPulse 2s ease-in-out infinite;
          }
        `}</style>

        <defs>
          <pattern id="editorialRevealDots" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.75" fill="rgba(255,255,255,0.04)" />
          </pattern>
          <radialGradient id="revealGoldGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#090909" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="metallicWax" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2AF" />
            <stop offset="40%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#AA7C11" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>

        {/* Backdrop dot grid */}
        <rect width="100%" height="100%" fill="url(#editorialRevealDots)" rx="4" />
        <circle cx="200" cy="120" r="130" fill="url(#revealGoldGlow)" />

        {/* Base envelope body outline */}
        <rect x="70" y="70" width="260" height="110" rx="3" fill="#0C0C0C" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* Core letter protruding from inside the envelope */}
        <g transform="translate(85, 45)">
          <rect x="0" y="0" width="230" height="90" rx="1" fill="#141414" stroke="rgba(212,175,55,0.18)" strokeWidth="1" />
          <line x1="15" y1="20" x2="215" y2="20" stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" />
          <line x1="15" y1="35" x2="165" y2="35" stroke="rgba(255,255,255,0.08)" strokeWidth="0.75" />
          <line x1="15" y1="50" x2="195" y2="50" stroke="rgba(212,175,55,0.25)" strokeWidth="1" className="letter-pulse-text" />
          <circle cx="200" cy="35" r="4" fill="#D4AF37" />
        </g>

        {/* Side folds of Envelope (Back-layer covers letter edges) */}
        <path d="M 70 70 L 195 125 L 70 180 Z" fill="#0E0E0E" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <path d="M 330 70 L 205 125 L 330 180 Z" fill="#0E0E0E" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

        {/* Bottom fold flap */}
        <path d="M 70 180 L 200 125 L 330 180 Z" fill="#0A0A0A" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

        {/* Animated Top Envelope Flap */}
        <path d="M 70 70 L 200 125 L 330 70 Z" fill="#121212" stroke="rgba(255,255,255,0.15)" strokeWidth="1" className="envelope-top-flap" />

        {/* The Golden Wax Decree Seal */}
        <g className="envelope-wax-seal" id="wax-seal-shield">
          {/* Detailed biological shell mold of wax */}
          <path d="
            M 200 95 Q 215 97 225 102 Q 235 99 243 108 Q 248 118 255 124 Q 262 128 262 138 Q 260 148 249 154 Q 239 160 231 166 L 200 167 
            Q 184 165 174 161 Q 163 162 153 154 Q 146 148 141 141 Q 138 131 138 122 L 143 111 Q 152 106 158 98 Q 170 96 182 95 Z" 
            fill="url(#metallicWax)" stroke="#AA7C11" strokeWidth="1.5" 
          />
          {/* Inner details of seal */}
          <circle cx="200" cy="125" r="22" fill="rgba(0,0,0,0.12)" stroke="#FFF2AF" strokeWidth="0.75" />
          <path d="M 200 112 L 204 122 L 214 122 L 206 128 L 209 138 L 200 132 L 191 138 L 194 128 L 186 122 L 196 122 Z" fill="#FFF2AF" />
        </g>

        {/* Tiny metadata texts */}
        <text x="32" y="32" fill="rgba(255,255,255,0.15)" fontSize="7" fontFamily="monospace" letterSpacing="1">MANDATE_CHARTER_SECURE</text>
        <text x="290" y="222" fill="#D4AF37" fontSize="7" fontFamily="monospace" letterSpacing="1">SEAL_AUTHENTIC</text>
      </svg>
    </div>
  );
};

// ==========================================
// 2. LIFE PROFILES: GOVERNMENT DOSSIER SVG
// ==========================================
export const SVGLifeProfiles: React.FC<{ profileId: string }> = ({ profileId }) => {
  return (
    <div className="w-full flex justify-center py-5 select-none" id="illustration-life-profile">
      <svg
        viewBox="0 0 400 240"
        className="w-full max-w-sm h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`
          @keyframes scannerGridDossier {
            0% { stroke-dashoffset: 80; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes biometricStampPulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; filter: drop-shadow(0 0 4px rgba(16,185,129,0.3)); }
          }
          .dossier-scanner-axis {
            stroke-dasharray: 4 8;
            animation: scannerGridDossier 4s linear infinite;
          }
          .confidential-stamp {
            animation: biometricStampPulse 3.5s ease-in-out infinite;
          }
        `}</style>

        <defs>
          <pattern id="dossierPapyrusGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <line x1="0" y1="20" x2="20" y2="20" stroke="rgba(255,255,255,0.015)" strokeWidth="0.5" />
            <line x1="20" y1="0" x2="20" y2="20" stroke="rgba(255,255,255,0.015)" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="scanSphereGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#090909" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Paper dossier container background */}
        <rect width="100%" height="100%" fill="url(#dossierPapyrusGrid)" rx="4" />
        <rect x="15" y="15" width="370" height="210" fill="#0C0C0E" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        
        {/* Soft target glow */}
        <circle cx="100" cy="120" r="80" fill="url(#scanSphereGlow)" />

        {/* Headshot Photo Frame area */}
        <g transform="translate(45, 45)">
          {/* Photo Border */}
          <rect x="0" y="0" width="110" height="130" fill="#060606" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          
          {/* Photo background texture */}
          <path d="M 0 110 L 110 30" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
          <path d="M 0 80 L 110 0" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

          {/* Biometric portrait silhouette (Government dossier profile style) */}
          <path d="M 20 115 C 20 85 35 75 55 75 C 75 75 90 85 90 115 Z" fill="#141416" stroke="rgba(255,255,255,0.2)" strokeWidth="0.75" />
          <circle cx="55" cy="48" r="18" fill="#141416" stroke="rgba(255,255,255,0.2)" strokeWidth="0.75" />
          
          {/* Targeting reticle inside portrait */}
          <circle cx="55" cy="48" r="3" fill="#10B981" />
          <line x1="55" y1="35" x2="55" y2="61" stroke="rgba(16,185,129,0.3)" strokeWidth="0.5" />
          <line x1="42" y1="48" x2="68" y2="48" stroke="rgba(16,185,129,0.3)" strokeWidth="0.5" />
        </g>

        {/* Crosshair lines */}
        <line x1="45" y1="120" x2="155" y2="120" stroke="rgba(16,185,129,0.25)" strokeWidth="1.2" className="dossier-scanner-axis" />

        {/* Technical Dossier data table in center-right */}
        <g transform="translate(180, 50)" fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily="monospace">
          <text x="0" y="0" fill="#EF4444" fontSize="10" fontWeight="bold">CLASSIFIED // DOSSIER FILE</text>
          
          <g transform="translate(0, 25)" fontSize="8">
            <text x="0" y="0" fill="rgba(255,255,255,0.4)">SUBJECT INTEL_ID:</text>
            <text x="110" y="0" fill="#FFF" fontWeight="bold">{profileId || "COHORT_UNKNOWN"}</text>
          </g>

          <g transform="translate(0, 42)">
            <text x="0" y="0" fill="rgba(255,255,255,0.4)">CRITICAL HORIZON:</text>
            <text x="110" y="0" fill="#D4AF37">3-STAGE_RISK</text>
          </g>

          <g transform="translate(0, 59)">
            <text x="0" y="0" fill="rgba(255,255,255,0.4)">CLEARANCE METRIC:</text>
            <text x="110" y="0" fill="#10B981">CLASS_STANDARD</text>
          </g>

          <g transform="translate(0, 76)">
            <text x="0" y="0" fill="rgba(255,255,255,0.4)">DEBATE STATUS:</text>
            <text x="110" y="0" fill="#10B981" fontWeight="bold">ACTIVE_TARGET</text>
          </g>
        </g>

        {/* Authentic Confidential Biometric Rubber Stamp stamp */}
        <g transform="translate(260, 160)" className="confidential-stamp">
          {/* Circular ink shield border */}
          <rect x="0" y="0" width="105" height="42" rx="3" fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="30 2" transform="rotate(-6 52 21)" />
          <text x="52" y="18" fill="#10B981" fontSize="9" fontFamily="sans-serif" fontWeight="black" textAnchor="middle" transform="rotate(-6 52 21)" letterSpacing="0.5">REYOU VERIFIED</text>
          <text x="52" y="32" fill="#10B981" fontSize="7" fontFamily="monospace" textAnchor="middle" transform="rotate(-6 52 21)">MEMBER_RECORD</text>
        </g>

        {/* Fine background details */}
        <line x1="180" y1="140" x2="350" y2="140" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <rect x="180" y="148" width="45" height="5" fill="#EF4444" fillOpacity="0.4" />
      </svg>
    </div>
  );
};

// ==========================================
// 3. SALARY SCREEN: ANIMATED SMARTPHONE SVG
// ==========================================
export const SVGSalaryNotification: React.FC<{ salary: string }> = ({ salary }) => {
  return (
    <div className="w-full flex justify-center py-5 select-none" id="illustration-salary-ledger">
      <svg
        viewBox="0 0 400 240"
        className="w-full max-w-sm h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`
          @keyframes mobileNotificationSlide {
            0% { transform: translateY(30px); opacity: 0; }
            20% { transform: translateY(0); opacity: 1; }
            70% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes salaryBeamFlow {
            0% { stroke-dashoffset: 40; }
            100% { stroke-dashoffset: 0; }
          }
          .phone-notification-bubble {
            animation: mobileNotificationSlide 3s cubic-bezier(0.25, 1, 0.5, 1) infinite alternate;
          }
          .salary-active-ray {
            stroke-dasharray: 8 16;
            animation: salaryBeamFlow 2.2s linear infinite;
          }
        `}</style>

        <defs>
          <radialGradient id="phoneGlowAccent" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#090909" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="100%" height="100%" fill="#090909" rx="4" />
        <circle cx="200" cy="120" r="120" fill="url(#phoneGlowAccent)" />

        {/* SMARTPHONE FRAME (APPLE + SYSTEM STYLE) */}
        <g transform="translate(140, 15)">
          {/* Smartphone outer body casing with corner curves */}
          <rect x="0" y="0" width="120" height="210" rx="16" fill="#0C0C0E" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
          {/* Inner Screen area */}
          <rect x="4" y="4" width="112" height="202" rx="12" fill="#040405" />
          
          {/* Upper Speaker Grill & Dynamic Island Camera mesh */}
          <rect x="40" y="10" width="40" height="7" rx="3.5" fill="#1A1A1E" />
          <circle cx="48" cy="13.5" r="1.5" fill="rgba(255,255,255,0.1)" />

          {/* Core Smartphone screen graphics */}
          {/* Time & Battery Status Bar */}
          <text x="12" y="24" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="sans-serif">09:41</text>
          <rect x="96" y="19" width="12" height="6" rx="1" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" fill="none" />
          <rect x="98" y="20.5" width="6" height="3" fill="#10B981" />

          {/* Animated Notification Card popping in apple style */}
          <g transform="translate(8, 38)" className="phone-notification-bubble">
            {/* Glossy alert bubble background */}
            <rect x="0" y="0" width="104" height="65" rx="6" fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.3)" strokeWidth="0.75" />
            
            {/* Alert Head */}
            <text x="8" y="12" fill="#10B981" fontSize="6.5" fontFamily="monospace" fontWeight="bold">🔒 DIRECT LEDGER ALERT</text>
            <text x="96" y="11" fill="rgba(255,255,255,0.3)" fontSize="5" fontFamily="monospace" textAnchor="end">1m ago</text>
            <line x1="8" y1="18" x2="96" y2="18" stroke="rgba(16,185,129,0.15)" strokeWidth="0.5" />

            {/* Notification content body */}
            <text x="8" y="28" fill="rgba(255,255,255,0.5)" fontSize="5.5" fontFamily="sans-serif">Year 1 Base Credited</text>
            <text x="8" y="43" fill="#10B981" fontSize="12" fontFamily="sans-serif" fontWeight="black">+{salary}</text>
            <text x="8" y="55" fill="rgba(255,255,255,0.3)" fontSize="5" fontFamily="monospace">BATCH: REYOU_VERIFIED_OK</text>
          </g>

          {/* Minimalist chart trace showing upward projection on the lockscreen */}
          <path d="M 12 180 Q 40 185 60 160 T 108 140" stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />
          <path d="M 12 180 Q 40 185 60 160 T 108 140" stroke="#10B981" strokeWidth="0.75" strokeLinecap="round" className="salary-active-ray" fill="none" />

          {/* Bottom Lock screen line marker bar */}
          <line x1="35" y1="198" x2="85" y2="198" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Ambient surrounding wire frame flows */}
        <path d="M 30 120 L 125 120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        <path d="M 30 120 L 125 120" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" className="salary-active-ray" />
        <path d="M 275 120 L 370 120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        <path d="M 275 120 L 370 120" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" className="salary-active-ray" />

        <text x="32" y="32" fill="rgba(255,255,255,0.15)" fontSize="7" fontFamily="monospace" letterSpacing="1">SECURE_CREDIT_NOTIF</text>
      </svg>
    </div>
  );
};

// ==========================================
// 4. APARTMENT COMPARISON: SPLIT-SCREEN ILLUSTRATED APARTMENTS
// ==========================================
export const SVGApartmentComparison: React.FC = () => {
  return (
    <div className="w-full flex justify-center py-5 select-none" id="illustration-apartment-comparison">
      <svg
        viewBox="0 0 400 240"
        className="w-full max-w-sm h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`
          @keyframes glowLuxuryWindows {
            0%, 100% { fill: rgba(212,175,55,0.6); }
            50% { fill: rgba(212,175,55,0.15); }
          }
          @keyframes dynamicTransitHustle {
            0% { stroke-dashoffset: 120; }
            100% { stroke-dashoffset: 0; }
          }
          .glowing-tower-window {
            animation: glowLuxuryWindows 3.5s ease-in-out infinite;
          }
          .commuter-train-segment {
            stroke-dasharray: 6 18;
            animation: dynamicTransitHustle 3s linear infinite;
          }
        `}</style>

        <rect width="100%" height="100%" fill="#090909" rx="4" />
        <rect width="100%" height="100%" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

        {/* Central comparison splitting hairline */}
        <line x1="200" y1="20" x2="200" y2="220" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />

        {/* LEFT COMPARTMENT: METROPOLIS PYRAMID TOWER */}
        <g transform="translate(10, 20)">
          <text x="15" y="15" fill="rgba(255,255,255,0.3)" fontSize="7.5" fontFamily="monospace">PREMIUM URBAN DOME</text>
          <text x="15" y="28" fill="#D4AF37" fontSize="10.5" fontFamily="sans-serif" fontWeight="black">₹28,000 / MO OUTFLOW</text>
          <line x1="15" y1="36" x2="175" y2="36" stroke="rgba(212,175,55,0.2)" strokeWidth="0.75" />

          {/* Illustrated Luxury High-rise Skyscraper */}
          <g transform="translate(60, 50)">
            {/* Sky Scraper Outline */}
            <rect x="0" y="0" width="45" height="142" rx="1.5" fill="#0C0C0E" stroke="rgba(212,175,55,0.4)" strokeWidth="1" />
            <polygon points="12,-15 33,-15 45,0 0,0" fill="#0A0A0B" stroke="rgba(212,175,55,0.4)" strokeWidth="1" />
            <line x1="22.5" y1="-15" x2="22.5" y2="0" stroke="rgba(212,175,55,0.3)" strokeWidth="0.75" />
            
            {/* Structured rows of illuminated windows representing urban housing */}
            <circle cx="9" cy="20" r="2.5" className="glowing-tower-window" fill="#D4AF37" />
            <circle cx="22" cy="20" r="2.5" className="glowing-tower-window" fill="#D4AF37" style={{ animationDelay: '0.4s' }} />
            <circle cx="35" cy="20" r="2.5" className="glowing-tower-window" fill="#D4AF37" style={{ animationDelay: '0.8s' }} />

            <circle cx="9" cy="40" r="2.5" className="glowing-tower-window" fill="#D4AF37" style={{ animationDelay: '1.2s' }} />
            <circle cx="22" cy="40" r="2.5" fill="rgba(255,255,255,0.05)" />
            <circle cx="35" cy="40" r="2.5" className="glowing-tower-window" fill="#D4AF37" style={{ animationDelay: '1.6s' }} />

            <circle cx="9" cy="60" r="2.5" fill="rgba(255,255,255,0.05)" />
            <circle cx="22" cy="60" r="2.5" className="glowing-tower-window" fill="#D4AF37" style={{ animationDelay: '2s' }} />
            <circle cx="35" cy="60" r="2.5" className="glowing-tower-window" fill="#D4AF37" style={{ animationDelay: '0.2s' }} />

            <circle cx="9" cy="80" r="2.5" className="glowing-tower-window" fill="#D4AF37" style={{ animationDelay: '0.7s' }} />
            <circle cx="22" cy="80" r="2.5" className="glowing-tower-window" fill="#D4AF37" style={{ animationDelay: '1.1s' }} />
            <circle cx="35" cy="80" r="2.5" fill="rgba(255,255,255,0.05)" />

            <circle cx="9" cy="100" r="2.5" className="glowing-tower-window" fill="#D4AF37" style={{ animationDelay: '1.5s' }} />
            <circle cx="22" cy="100" r="2.5" className="glowing-tower-window" fill="#D4AF37" style={{ animationDelay: '2.2s' }} />
            <circle cx="35" cy="100" r="2.5" className="glowing-tower-window" fill="#D4AF37" style={{ animationDelay: '0.5s' }} />

            <circle cx="9" cy="120" r="2.5" fill="rgba(255,255,255,0.05)" />
            <circle cx="22" cy="120" r="2.5" className="glowing-tower-window" fill="#D4AF37" style={{ animationDelay: '1s' }} />
            <circle cx="35" cy="120" r="2.5" fill="rgba(255,255,255,0.05)" />
          </g>

          {/* Rent Drain Indicator overlay */}
          <path d="M 140 100 L 140 120" stroke="#EF4444" strokeWidth="1" />
          <polygon points="140,120 137,115 143,115" fill="#EF4444" />
          <text x="145" y="113" fill="#EF4444" fontSize="6.5" fontFamily="monospace">DRAIN</text>
        </g>

        {/* RIGHT COMPARTMENT: PRAGMATIC SUBURBIA */}
        <g transform="translate(200, 20)">
          <text x="15" y="15" fill="rgba(255,255,255,0.3)" fontSize="7.5" fontFamily="monospace">PRACTICAL SUBURBAN</text>
          <text x="15" y="28" fill="#10B981" fontSize="10.5" fontFamily="sans-serif" fontWeight="black">₹12,000 / MO ACCUM</text>
          <line x1="15" y1="36" x2="175" y2="36" stroke="rgba(16,185,129,0.2)" strokeWidth="0.75" />

          {/* Illustrated Cute Cozy Suburban House built with shapes */}
          <g transform="translate(30, 115)">
            {/* The House Face */}
            <rect x="15" y="25" width="45" height="32" fill="#0C0E0C" stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
            {/* Triangular Roof styling */}
            <polygon points="10,25 37.5,7 65,25" fill="#090B09" stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
            <rect x="25" y="37" width="8" height="20" fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="0.75" /> {/* Door */}
            <rect x="42" y="33" width="10" height="10" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.4)" strokeWidth="0.75" /> {/* Window */}
            
            {/* Small garden elements / mini vector tree in context */}
            <path d="M 80 40 L 80 57" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
            <circle cx="80" cy="35" r="8" fill="#0C0E0C" stroke="rgba(16,185,129,0.4)" strokeWidth="0.75" />
          </g>

          {/* Long Suburban Commuter Transit Line */}
          <path d="M 20 85 Q 90 60 160 85" stroke="rgba(239,68,68,0.12)" strokeWidth="3" fill="none" />
          <path d="M 20 85 Q 90 60 160 85" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" className="commuter-train-segment" fill="none" />
          <text x="45" y="58" fill="#EF4444" fontSize="7.5" fontFamily="monospace" letterSpacing="0.2">⏱️ 90-MIN TRANSIT RISK</text>
        </g>
      </svg>
    </div>
  );
};

// ==========================================
// 5. FAST MONEY: INSTAGRAM-STYLE INTERFACE BUILT WITH CODE
// ==========================================
export const SVGFastMoneyOpportunity: React.FC = () => {
  return (
    <div className="w-full flex justify-center py-5 select-none" id="illustration-fast-speculation">
      <svg
        viewBox="0 0 400 240"
        className="w-full max-w-sm h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`
          @keyframes scrollingInstaWarning {
            0% { transform: translateY(-5px); opacity: 0.15; }
            50% { opacity: 0.95; }
            100% { transform: translateY(165px); opacity: 0.15; }
          }
          @keyframes dynamicGraphSway {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.04); }
          }
          .insta-scammed-radar {
            animation: scrollingInstaWarning 3.5s ease-in-out infinite;
          }
          .insta-rocket-glow {
            transform-origin: 200px 95px;
            animation: dynamicGraphSway 4s ease-in-out infinite;
          }
        `}</style>

        <defs>
          <linearGradient id="premiumInstaDeg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="#090909" rx="4" />
        <rect width="100%" height="100%" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

        {/* INSTAGRAM EDITORIAL PHONE SPEC FEED MOCKUP */}
        <g transform="translate(100, 10)">
          {/* Main Feed Card frame */}
          <rect x="0" y="0" width="200" height="220" rx="6" fill="#0C0E0F" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

          {/* Social Header details */}
          <circle cx="16" cy="18" r="8" fill="url(#premiumInstaDeg)" stroke="rgba(212,175,55,0.4)" strokeWidth="0.75" />
          <text x="28" y="19" fill="rgba(255,255,255,0.8)" fontSize="7" fontFamily="sans-serif" fontWeight="bold">rapid_shortcut_hq</text>
          
          {/* Verified tag */}
          <polygon points="123,13 125,16 128,16 126,18 127,21 125,19 123,21 124,18 122,16" fill="#D4AF37" />
          
          <text x="190" y="20" fill="rgba(255,255,255,0.3)" fontSize="8.5" fontFamily="sans-serif" textAnchor="end">•••</text>

          {/* Main Post Media Content Area */}
          <g transform="translate(10, 32)">
            {/* Styled "Instagram Ads" fake illustration */}
            <rect x="0" y="0" width="180" height="110" rx="2" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
            
            {/* Parabolic speculative up-trend line (looks like a financial scam ad template) */}
            <path d="M 12 90 Q 60 70 85 45 T 168 15" stroke="#10B981" strokeWidth="2.5" className="insta-rocket-glow" fill="none" />
            <circle cx="168" cy="15" r="3.5" fill="#10B981" />
            
            {/* Rockets symbols and exciting claims directly inside the mockup */}
            <text x="90" y="55" fill="#10B981" fontSize="10" fontFamily="sans-serif" fontWeight="black" textAnchor="middle">₹₹ QUICK APEX BOOST ₹₹</text>
            <text x="90" y="72" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.5">TAP TO RETIRE EARLY SECURELY</text>
            
            <g transform="translate(142, 60)" fill="#D4AF37">
              <path d="M 0 0 L 8 -12 L 16 0 Z" fill="#D4AF37" />
            </g>
          </g>

          {/* Interaction Icons (Like, Comment, Share) */}
          <g transform="translate(12, 148)" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1">
            {/* Heart shape */}
            <path d="M 6 4 C 3 1, 0 3, 0 6 C 0 9, 6 13, 6 13 C 6 13, 12 9, 12 6 C 12 3, 9 1, 6 4 Z" fill="#EF4444" stroke="#EF4444" strokeWidth="0" />
            <path d="M 5 4 C 2 1, 0 3, 0 6 C 0 9, 5 12, 5 12 C 5 12, 10 9, 10 6 C 10 3, 8 1, 5 4 Z" />
            {/* Bubble shape */}
            <rect x="18" y="2" width="10" height="7" rx="1.5" />
            <polygon points="20,9 18,12 23,9" />
          </g>

          {/* Social Caption details & likes Count */}
          <text x="12" y="168" fill="rgba(255,255,255,0.8)" fontSize="6.5" fontFamily="sans-serif" fontWeight="bold">92,482 likes</text>
          <text x="12" y="180" fill="rgba(255,255,255,0.6)" fontSize="6.5" fontFamily="sans-serif">
            <tspan fontWeight="bold" fill="#FFF">rapid_shortcut_hq</tspan> Quit the corporate trap!
          </text>
          <text x="12" y="190" fill="rgba(212,175,55,0.7)" fontSize="6" fontFamily="monospace">#passiveincome #autorobot #notax</text>

          {/* ReYou Diagnostic Diagnostic Red scanning light parsing this social trap */}
          <g className="insta-scammed-radar" transform="translate(0, 32)">
            <line x1="5" y1="0" x2="195" y2="0" stroke="rgba(239,68,68,0.7)" strokeWidth="1.5" />
            <line x1="5" y1="0" x2="195" y2="0" stroke="rgba(239,68,68,0.18)" strokeWidth="5" />
          </g>
        </g>

        {/* Warning annotations surrounding */}
        <text x="15" y="35" fill="#EF4444" fontSize="8" fontFamily="monospace" fontWeight="bold">⚠️ SCAM_DETECT</text>
        <line x1="15" y1="42" x2="90" y2="42" stroke="rgba(239,68,68,0.25)" strokeWidth="0.75" />
      </svg>
    </div>
  );
};

// ==========================================
// 6. FUTURE TIMELINE: ANIMATED ROADMAP SVG
// ==========================================
export const SVGFutureTimeline: React.FC = () => {
  return (
    <div className="w-full flex justify-center py-5 select-none" id="illustration-future-timeline">
      <svg
        viewBox="0 0 400 240"
        className="w-full max-w-sm h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`
          @keyframes highwayDottedMotion {
            0% { stroke-dashoffset: 40; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes activeMilestoneMarker {
            0%, 100% { r: 5; opacity: 0.7; }
            50% { r: 9; opacity: 1; filter: drop-shadow(0 0 4px #D4AF37); }
          }
          .highway-centerline-flow {
            stroke-dasharray: 6 12;
            animation: highwayDottedMotion 2s linear infinite;
          }
          .milestone-active-radar {
            animation: activeMilestoneMarker 2.5s ease-in-out infinite;
          }
        `}</style>

        <rect width="100%" height="100%" fill="#090909" rx="4" />
        <rect width="100%" height="100%" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

        {/* THE ROADMAP TRACKS (INTELLIGENT WINDING STRETCH) */}
        {/* Main Roadbed outer lanes */}
        <path d="M 30 180 C 130 160, 110 80, 240 60 S 330 200, 370 120" stroke="rgba(255,255,255,0.08)" strokeWidth="15" strokeLinecap="round" fill="none" />
        <path d="M 30 180 C 130 160, 110 80, 240 60 S 330 200, 370 120" stroke="#121214" strokeWidth="11" strokeLinecap="round" fill="none" />
        
        {/* Animated road dividers moving dynamically */}
        <path d="M 30 180 C 130 160, 110 80, 240 60 S 330 200, 370 120" stroke="#D4AF37" strokeWidth="0.75" className="highway-centerline-flow" strokeLinecap="round" fill="none" />

        {/* Branch trajectories (Flourishing vs Vulnerability path splits) */}
        {/* Flourishing path branching upward */}
        <path d="M 240 60 C 290 40, 340 30, 370 30" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
        <circle cx="370" cy="30" r="3.5" fill="#10B981" />
        <text x="365" y="22" fill="#10B981" fontSize="7" fontFamily="monospace" textAnchor="end">FLOURISHING_ACCUM</text>

        {/* Vulnerability path branching downward */}
        <path d="M 240 60 C 270 90, 320 210, 350 210" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
        <circle cx="350" cy="210" r="3.5" fill="#EF4444" />
        <text x="345" y="218" fill="#EF4444" fontSize="7" fontFamily="monospace" textAnchor="end">DEBT_FATALITY</text>

        {/* Milestones / Road Signs along the route */}
        {/* Milestone YR 1 - The Decision */}
        <g transform="translate(65, 120)">
          <line x1="0" y1="0" x2="0" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="0.75" />
          <circle cx="0" cy="0" r="3.5" fill="#D4AF37" />
          <rect x="-25" y="-18" width="50" height="12" rx="1" fill="#0C0E10" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
          <text x="0" y="-10" fill="rgba(255,255,255,0.7)" fontSize="5.5" fontFamily="monospace" textAnchor="middle">YR 1 START</text>
        </g>

        {/* Milestone YR 3 - The Exposure / Risk Trap */}
        <g transform="translate(185, 122)">
          <circle cx="0" cy="-40" r="4" fill="#D4AF37" stroke="#090909" strokeWidth="1.5" className="milestone-active-radar" />
          <line x1="0" y1="10" x2="0" y2="-30" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 2" />
          <rect x="-30" y="-58" width="60" height="12" rx="1" fill="#0C0E10" stroke="rgba(212,175,55,0.3)" strokeWidth="0.5" />
          <text x="0" y="-50" fill="#D4AF37" fontSize="5.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">YR 3 CRUX</text>
        </g>

        {/* Milestone YR 5 - The Outcome */}
        <g transform="translate(325, 110)">
          <line x1="0" y1="0" x2="0" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="0.75" />
          <circle cx="0" cy="0" r="3.5" fill="rgba(255,255,255,0.3)" />
          <rect x="-25" y="-18" width="50" height="12" rx="1" fill="#0C0E10" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
          <text x="0" y="-10" fill="rgba(255,255,255,0.5)" fontSize="5.5" fontFamily="monospace" textAnchor="middle">YR 5 CONSEQ</text>
        </g>

        {/* Educational Title Header */}
        <text x="32" y="32" fill="rgba(255,255,255,0.15)" fontSize="7" fontFamily="monospace" letterSpacing="1">ROADMAP_CRITICAL_TRAJECTORY</text>
      </svg>
    </div>
  );
};

// ==========================================
// 7. DECISION INTELLIGENCE LENS: TARGET QUADRANTS
// ==========================================
export const SVGExpertDecisionLens: React.FC = () => {
  return (
    <div className="w-full flex justify-center py-5 select-none" id="illustration-decision-lens">
      <svg
        viewBox="0 0 400 240"
        className="w-full max-w-sm h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`
          @keyframes radarRotationSweep {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .lens-laser-sweep {
            transform-origin: 200px 120px;
            animation: radarRotationSweep 9s linear infinite;
          }
        `}</style>

        <rect width="100%" height="100%" fill="#090909" rx="4" />
        <rect width="100%" height="100%" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

        <defs>
          <radialGradient id="targetSphere" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#090909" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="120" r="105" fill="url(#targetSphere)" />

        {/* Focus Reticles */}
        <circle cx="200" cy="120" r="90" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        <circle cx="200" cy="120" r="70" stroke="rgba(212,175,55,0.1)" strokeWidth="1.2" />
        <circle cx="200" cy="120" r="45" stroke="rgba(212,175,55,0.2)" strokeWidth="1" />
        <circle cx="200" cy="120" r="20" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 3" />

        {/* Dividing hair-cross axis */}
        <line x1="80" y1="120" x2="320" y2="120" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <line x1="200" y1="40" x2="200" y2="200" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

        {/* Sweep pointer line */}
        <line x1="200" y1="120" x2="200" y2="42" stroke="#D4AF37" strokeWidth="1.5" className="lens-laser-sweep" strokeLinecap="round" />

        {/* Biases categories labeled around axis quadrants */}
        <g fontSize="8.5" fontFamily="sans-serif" fontWeight="bold">
          {/* Q1: Immediate Gratification Present Bias */}
          <g transform="translate(145, 75)" textAnchor="end">
            <text x="0" y="0" fill="#FFF">Present Bias</text>
            <text x="0" y="10" fill="rgba(255,255,255,0.4)" fontStyle="italic" fontWeight="medium" fontSize="7">Immediate Gratification</text>
          </g>

          {/* Q2: FOMO bubble */}
          <g transform="translate(255, 75)" textAnchor="start">
            <text x="0" y="0" fill="#D4AF37">FOMO Trap</text>
            <text x="0" y="10" fill="rgba(212,175,55,0.6)" fontStyle="italic" fontWeight="medium" fontSize="7">Speculative Urgency</text>
          </g>

          {/* Q3: Social Group Proof Mimicry */}
          <g transform="translate(145, 160)" textAnchor="end">
            <text x="0" y="0" fill="#D4AF37">Social Mimicry</text>
            <text x="0" y="10" fill="rgba(212,175,55,0.6)" fontStyle="italic" fontWeight="medium" fontSize="7">Peer Group Passures</text>
          </g>

          {/* Q4: Blind trusting authority */}
          <g transform="translate(255, 160)" textAnchor="start">
            <text x="0" y="0" fill="#FFF">Authority Loss</text>
            <text x="0" y="10" fill="rgba(255,255,255,0.4)" fontStyle="italic" fontWeight="medium" fontSize="7">Unverified Trust</text>
          </g>
        </g>

        {/* Targeting frame corners */}
        <path d="M 30 50 L 30 30 L 50 30" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <path d="M 370 50 L 370 30 L 350 30" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <path d="M 30 190 L 30 210 L 50 210" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <path d="M 370 190 L 370 210 L 350 210" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

        <text x="32" y="25" fill="rgba(255,255,255,0.15)" fontSize="7" fontFamily="monospace">SMART_DECISION_LENS</text>
      </svg>
    </div>
  );
};

// ==========================================
// 8. BOARDROOM DEFENSE: OVERHEAD blueprints background 
// ==========================================
export const SVGBoardroomDefense: React.FC = () => {
  return (
    <div className="w-full flex justify-center py-5 select-none" id="illustration-boardroom-defense">
      <svg
        viewBox="0 0 400 240"
        className="w-full max-w-sm h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`
          @keyframes tacticalHologramPulse {
            0%, 100% { opacity: 0.12; fill-opacity: 0.04; }
            50% { opacity: 0.38; fill-opacity: 0.12; }
          }
          @keyframes advisorSeatPulse {
            0%, 100% { fill: #D4AF37; r: 3.5; }
            50% { fill: #FFF; r: 5; }
          }
          .boardroom-projection-ray {
            animation: tacticalHologramPulse 3s ease-in-out infinite;
          }
          .lead-active-chair {
            animation: advisorSeatPulse 2s ease-in-out infinite;
          }
        `}</style>

        <rect width="100%" height="100%" fill="#090909" rx="4" />
        <rect width="100%" height="100%" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

        {/* Back Screen projection panel */}
        <rect x="70" y="25" width="260" height="35" rx="1" fill="#0C0C0D" stroke="rgba(212,175,55,0.25)" strokeWidth="1" />
        <text x="200" y="44" fill="#D4AF37" fontSize="7.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          TEAM_DECISION_DEFENSE
        </text>

        {/* Overhead circular conference table blueprint drawing */}
        <polygon points="200,190 70,60 330,60" fill="url(#revealGoldGlow)" className="boardroom-projection-ray" fillOpacity="0.05" stroke="none" />
        <line x1="200" y1="190" x2="70" y2="60" stroke="rgba(212,175,55,0.08)" strokeWidth="0.75" />
        <line x1="200" y1="190" x2="330" y2="60" stroke="rgba(212,175,55,0.08)" strokeWidth="0.75" />

        {/* The Overhead Conference Table layout outline */}
        <path d="M 85 145 Q 200 220 315 145" stroke="rgba(255,255,255,0.12)" strokeWidth="5" fill="none" />
        <path d="M 85 145 Q 200 220 315 145" stroke="rgba(212,175,55,0.25)" strokeWidth="1" fill="none" strokeDasharray="3 3" />

        {/* Group Directors Seat positions */}
        {[
          { cx: 90, cy: 143, label: "Lead" },
          { cx: 135, cy: 174, label: "Strat" },
          { cx: 200, cy: 188, label: "Risk" },
          { cx: 265, cy: 174, label: "Comm" },
          { cx: 310, cy: 143, label: "You" }
        ].map((chair, i) => (
          <g key={chair.label}>
            {/* Outline nodes representing participants in academic simulation */}
            <circle cx={chair.cx} cy={chair.cy} r={3.5} fill="#090909" stroke="#D4AF37" strokeWidth="1.2" className={i === 4 ? "lead-active-chair" : ""} />
            <text x={chair.cx} y={chair.cy + 13} fill="rgba(255,255,255,0.35)" fontSize="6.5" fontFamily="monospace" textAnchor="middle">{chair.label}</text>
          </g>
        ))}

        {/* Presenter Podium outline */}
        <g transform="translate(192, 85)">
          <rect x="0" y="0" width="16" height="9" rx="1" fill="#0C0C0D" stroke="#D4AF37" strokeWidth="0.75" />
          <line x1="8" y1="9" x2="8" y2="16" stroke="#D4AF37" strokeWidth="1" />
        </g>
        <text x="200" y="112" fill="rgba(255,255,255,0.25)" fontSize="6.5" fontFamily="monospace" textAnchor="middle">PODIUM</text>

        <text x="32" y="222" fill="rgba(255,255,255,0.15)" fontSize="7" fontFamily="monospace">STAGE_DOME [TACTICAL_ROOM]</text>
      </svg>
    </div>
  );
};
