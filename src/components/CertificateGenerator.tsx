import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Award, Download, CheckCircle2, Shield, Calendar, User, Eye, Sparkles } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { RoleId, ROLES } from '../types';
import { sounds } from '../utils/audio';

interface CertificateGeneratorProps {
  userName: string;
  assignedRoleId: RoleId;
  selectedTeamId: string;
}

export default function CertificateGenerator({ userName, assignedRoleId, selectedTeamId }: CertificateGeneratorProps) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [customName, setCustomName] = useState(userName || '');
  const [useCustomName, setUseCustomName] = useState(false);

  // Derive role title
  const roleName = ROLES[assignedRoleId]?.title || 'HONORED FELLOW';
  const teamNameClean = selectedTeamId.replace('_', ' ').toUpperCase();

  const activeName = useCustomName ? customName : (userName || 'Honored Student');

  const handleDownloadPDF = () => {
    sounds.playValidationChime();
    setDownloadSuccess(true);

    try {
      // 1. Initialise landscape A4 PDF: 297mm width, 210mm height
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const width = 297;
      const height = 210;

      // 2. Draw Ivory Background
      doc.setFillColor(253, 252, 248); // off-white ivory
      doc.rect(0, 0, width, height, 'F');

      // 3. Draw Outer Royal Gold Border (thick)
      doc.setDrawColor(212, 175, 55); // #D4AF37 Royal Gold
      doc.setLineWidth(1.5);
      doc.rect(10, 10, width - 20, height - 20, 'S');

      // 4. Draw Inner Gold Border (thin)
      doc.setLineWidth(0.5);
      doc.rect(12, 12, width - 24, height - 24, 'S');

      // 5. Draw Decorative Corner Boxes
      const corners = [
        [10, 10], [width - 14, 10], [10, height - 14], [width - 14, height - 14]
      ];
      corners.forEach(([cx, cy]) => {
        doc.setFillColor(212, 175, 55);
        doc.rect(cx, cy, 4, 4, 'F');
      });

      // 6. Draw Subtle Filigree/Lines on top and bottom centers
      doc.setLineWidth(0.25);
      doc.line(40, 18, width - 40, 18);
      doc.line(40, height - 18, width - 40, height - 18);

      // 7. Academic Header Text (Times Bold, center aligned)
      doc.setFont('times', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(20, 26, 36); // Deep Slate Navy #141A24
      doc.text('FOUNDER ACADEMY HIGH SCHOOL COUNCIL', width / 2, 28, { align: 'center' });

      doc.setFont('times', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(115, 125, 140); // Subtle Slate
      doc.text('OECD EDUCATIONAL STANDARDS & COMPLIANCE BOARD', width / 2, 33, { align: 'center' });

      // Subtle gold separator line
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.75);
      doc.line(width / 2 - 30, 37, width / 2 + 30, 37);

      // 8. Main Certificate Title
      doc.setFont('times', 'bolditalic');
      doc.setFontSize(32);
      doc.setTextColor(180, 145, 30); // Antique gold
      doc.text('Certificate of Fellowship', width / 2, 52, { align: 'center' });

      // Sub-heading
      doc.setFont('times', 'italic');
      doc.setFontSize(12);
      doc.setTextColor(70, 80, 95);
      doc.text('This credential is state-certified and registered to certify that', width / 2, 63, { align: 'center' });

      // 9. STUDENT NAME (Large, Center, Deep Dark Blue/Black)
      doc.setFont('times', 'bold');
      doc.setFontSize(28);
      doc.setTextColor(15, 18, 25);
      doc.text(activeName, width / 2, 80, { align: 'center' });

      // Underlining Accent
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(1.0);
      doc.line(width / 2 - 45, 84, width / 2 + 45, 84);

      // 10. Fellowship Text Details
      doc.setFont('times', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(70, 80, 95);
      
      const line1 = `has honorably fulfilled all diagnostic credentials as an active fellow representing ${teamNameClean};`;
      const line2 = `demonstrating critical foresight, collaborative self-regulation, and adaptive resource oversight`;
      const line3 = `during the continuous, high-fidelity cognitive simulation challenge.`;

      doc.text(line1, width / 2, 94, { align: 'center' });
      doc.text(line2, width / 2, 100, { align: 'center' });
      doc.text(line3, width / 2, 106, { align: 'center' });

      // 11. Role Detail Section (in light shaded box)
      const rBoxW = 140;
      const rBoxH = 14;
      const rBoxX = width / 2 - rBoxW / 2;
      const rBoxY = 114;

      doc.setFillColor(242, 238, 228); // shaded box background
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.3);
      doc.rect(rBoxX, rBoxY, rBoxW, rBoxH, 'F');
      doc.rect(rBoxX, rBoxY, rBoxW, rBoxH, 'S');

      doc.setFont('times', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(20, 26, 36);
      doc.text('HONORED DESIGNATION WITH EXECUTIVE FOCUS:', width / 2, rBoxY + 5.5, { align: 'center' });

      doc.setFont('times', 'bolditalic');
      doc.setFontSize(12);
      doc.setTextColor(190, 85, 10); // Rust-gold color
      doc.text(roleName.toUpperCase(), width / 2, rBoxY + 10.5, { align: 'center' });

      // 12. Security Code & OECD Mapping stamps
      doc.setFont('courier', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(130, 140, 155);
      const uuidStr = `REYOU-SECURE-ID: ${Date.now()}-${selectedTeamId}`;
      doc.text(uuidStr, 18, 187);
      doc.text('OECD 2030 FRAMEWORK METRICS: METACLASS CERTIFIED', 18, 191);

      // 13. Draw Gold Seal Medallion Shape
      const sealX = width / 2;
      const sealY = 154;
      doc.setDrawColor(212, 175, 55);
      doc.setFillColor(250, 246, 230);
      doc.setLineWidth(1.5);
      doc.circle(sealX, sealY, 15, 'F');
      doc.circle(sealX, sealY, 15, 'S');

      doc.setLineWidth(0.35);
      doc.circle(sealX, sealY, 13, 'S');

      // Seal text or initials "FA"
      doc.setFont('times', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(212, 175, 55);
      doc.text('FA', sealX, sealY + 2, { align: 'center' });

      doc.setFont('times', 'normal');
      doc.setFontSize(5);
      doc.text('FOUNDERS', sealX, sealY - 6, { align: 'center' });
      doc.text('ACADEMY', sealX, sealY + 8, { align: 'center' });

      // Helper for ribbons/wings of seal
      doc.setLineWidth(0.5);
      doc.line(sealX - 25, sealY, sealX - 15, sealY);
      doc.line(sealX + 15, sealY, sealX + 25, sealY);

      // 14. Signature Marks
      const sigHeight = 168;
      
      // Signature Left
      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(20, 26, 36);
      doc.text('Rahul Roy Choudhury', 45, sigHeight, { align: 'center' });
      doc.setDrawColor(120, 130, 145);
      doc.setLineWidth(0.4);
      doc.line(20, sigHeight + 1.5, 70, sigHeight + 1.5);
      doc.setFont('times', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(115, 125, 140);
      doc.text('Lead Experience Academic Principal', 45, sigHeight + 5.5, { align: 'center' });

      // Signature Right
      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(20, 26, 36);
      doc.text('Dr. Sarah Lin-Davis', width - 45, sigHeight, { align: 'center' });
      doc.setDrawColor(120, 130, 145);
      doc.line(width - 70, sigHeight + 1.5, width - 20, sigHeight + 1.5);
      doc.setFont('times', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(115, 125, 140);
      doc.text('Global Education Regulatory Appraiser', width - 45, sigHeight + 5.5, { align: 'center' });

      // 15. Timestamp Date on Left
      const dateString = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.setFont('times', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(20, 26, 36);
      doc.text(dateString, width / 2 - 80, 154, { align: 'center' });
      doc.setFont('times', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(115, 125, 140);
      doc.text('Date of Conferral', width / 2 - 80, 158.5, { align: 'center' });

      // 16. Dynamic Verification Code on Right
      doc.setFont('courier', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(20, 26, 36);
      const randomCode = `FA-CPS-${Date.now().toString().slice(-6)}`;
      doc.text(randomCode, width / 2 + 80, 154, { align: 'center' });
      doc.setFont('times', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(115, 125, 140);
      doc.text('Verification Code', width / 2 + 80, 158.5, { align: 'center' });

      // 17. Save File with Student Name
      const fileSafeName = activeName.replace(/[^a-z0-h0-9]/gi, '_').toLowerCase();
      doc.save(`reyou_founder_fellowship_${fileSafeName}.pdf`);

      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      console.error('PDF Generation Failed:', err);
      alert('An issue occurred during PDF formatting. Please try renaming or downloading again.');
    }
  };

  return (
    <div className="border border-[#1A1A1A] bg-[#0E0F12] p-5 md:p-8 rounded-sm space-y-6 text-left relative overflow-hidden">
      
      {/* Visual Header Decoration */}
      <div className="absolute right-0 top-0 bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 text-[8.5px] font-mono border-b border-l border-[#D4AF37]/25 uppercase font-bold tracking-widest flex items-center gap-1.5 min-h-[24px]">
        <Shield className="w-3 h-3 text-[#D4AF37]" />
        Honorary Fellowship Dossier
      </div>

      <div className="space-y-2">
        <h3 className="text-md font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="w-5 h-5 text-[#D4AF37]" />
          CONFER DIGITAL FELLOWSHIP CREDENTIAL
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">
          By successfully anchoring group assumptions and mapping risk mitigation paradigms, you have completed the rigorous global simulation cycle. You are now eligible to claim your certified high-fidelity **Founder Fellowship Certificate**.
        </p>
      </div>

      {/* Interactive Form for Custom Name if preferred */}
      <div className="bg-[#14161D] p-4 rounded-sm border border-white/5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block font-bold">
              Verification Name Setting
            </span>
            <p className="text-[11px] text-neutral-400">
              Set how your name should appear on the official certificate registry.
            </p>
          </div>
          
          <button
            onClick={() => { sounds.playClickSound(); setUseCustomName(prev => !prev); }}
            className={`px-3 py-1.5 rounded-xs font-mono text-[9px] uppercase font-bold tracking-widest transition-all cursor-pointer ${
              useCustomName ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30' : 'bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700'
            }`}
          >
            {useCustomName ? '✏️ Editing Custom Name' : '⚙️ Change Default Name'}
          </button>
        </div>

        {useCustomName && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-neutral-400 uppercase">Custom Student Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Enter full name for professional certificate"
                className="w-full bg-black border border-white/10 rounded-sm py-2 pl-9 pr-4 text-xs text-white outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Stunning Live Vector preview within Student Console interface (Interactive Mockup card) */}
      <div className="border border-white/10 rounded-sm bg-[#FAF9F5] text-neutral-900 p-6 md:p-8 space-y-6 relative shadow-inner overflow-hidden max-w-2xl mx-auto border-double border-4">
        
        {/* Ivory theme borders */}
        <div className="absolute inset-2 border border-[#D4AF37]/30 pointer-events-none" />
        <div className="absolute inset-2.5 border border-[#D4AF37]/30 pointer-events-none" />

        {/* Traditional Certificate Elements representation */}
        <div className="text-center space-y-4 relative z-10 selection:bg-neutral-900 selection:text-white">
          <div className="space-y-1">
            <h5 className="font-serif text-[10px] font-bold tracking-widest text-neutral-800">
              FOUNDER ACADEMY HIGH SCHOOL COUNCIL
            </h5>
            <div className="h-0.5 w-16 bg-[#D4AF37] mx-auto" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl md:text-3xl font-serif italic text-[#B4911E] font-medium font-bold">
              Certificate of Fellowship
            </h1>
            <p className="text-[9px] text-neutral-500 italic">
              This credential is state-certified and registered to certify that
            </p>
          </div>

          <div className="py-2 border-b border-dashed border-[#D4AF37]/50 max-w-sm mx-auto">
            <h2 className="text-2xl font-serif text-neutral-900 font-bold tracking-wide">
              {activeName}
            </h2>
          </div>

          <div className="space-y-2 text-[9px] text-neutral-600 max-w-md mx-auto leading-relaxed">
            <p>
              has honorably fulfilled all diagnostic credentials as an active fellow representing <strong className="text-neutral-900">{teamNameClean}</strong>; demonstrating critical foresight, collaborative self-regulation, and adaptive resource oversight.
            </p>
          </div>

          <div className="py-1.5 px-3 bg-[#EFECE4] border border-[#D4AF37]/30 rounded-xs inline-block">
            <span className="text-[8px] font-mono text-neutral-500 block">EXECUTIVE FOCUS DESIGNATION</span>
            <span className="text-[11px] font-serif font-bold italic text-amber-900">
              {roleName.toUpperCase()}
            </span>
          </div>

          {/* Micro Row for signatures & seals */}
          <div className="grid grid-cols-3 gap-2 pt-4 items-center max-w-md mx-auto border-t border-neutral-200/50">
            <div className="text-left">
              <span className="font-serif text-[10px] text-neutral-900 leading-none block">Rahul Roy C.</span>
              <span className="text-[7px] text-neutral-400 block italic leading-none mt-1">Lead Academic Principal</span>
            </div>
            
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37]/60 flex items-center justify-center bg-[#FAF9F5] text-[#D4AF37] text-[8px] font-bold">
                FA
              </div>
            </div>

            <div className="text-right">
              <span className="font-serif text-[10px] text-neutral-900 leading-none block">Dr. Sarah L.</span>
              <span className="text-[7px] text-neutral-400 block italic leading-none mt-1">Global Regulator Appraiser</span>
            </div>
          </div>
        </div>

      </div>

      {/* Primary Print/Export controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#13151B] p-4 rounded-sm border border-neutral-900">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-[11px] font-mono text-neutral-400">
            Certified on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="w-full sm:w-auto px-6 py-3.5 bg-[#D4AF37] hover:bg-yellow-500 text-black font-mono font-black text-xs uppercase tracking-widest rounded-sm transition-all shadow-[0_4px_20px_rgba(212,175,55,0.25)] flex items-center justify-center gap-2 cursor-pointer border-none"
        >
          <Download className="w-4 h-4" />
          Download High-Resolution PDF
        </button>
      </div>

      {/* Floating success message feedback loop */}
      <AnimatePresence>
        {downloadSuccess && (
          <div className="mt-2 p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-sm flex items-center gap-2 text-emerald-400 text-[11px] font-mono tracking-wide animate-pulse">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            OFFICIAL SECURE ARCHIVE GENERATED! Fellowship Credential compiled into full-vector landscape PDF format.
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
