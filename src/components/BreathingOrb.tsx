import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Canvas Context for Performance and Redraw Coordination
interface CanvasContextType {
  frameloop: 'demand' | 'always';
  perfLevel: 'high' | 'medium' | 'low';
  getPerfReport: () => { drawTimeMs: number; fps: number };
  requestRender: () => void;
}

const CanvasContext = createContext<CanvasContextType | null>(null);

interface CanvasProps {
  children: React.ReactNode;
  frameloop?: 'demand' | 'always';
  className?: string;
  id?: string;
}

export function Canvas({
  children,
  frameloop = 'demand',
  className = '',
  id
}: CanvasProps) {
  const [perfLevel, setPerfLevel] = useState<'high' | 'medium' | 'low'>('high');
  const renderRequestsRef = useRef<number>(0);
  const drawTimesRef = useRef<number[]>([]);
  const fpsTimesRef = useRef<number[]>([]);

  // Performance Monitoring and Quality Degradation Metrics
  const getPerfReport = () => {
    const times = drawTimesRef.current;
    const avgDrawTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    
    const fpsTimes = fpsTimesRef.current;
    let computedFps = 60;
    if (fpsTimes.length > 1) {
      const elapsed = (fpsTimes[fpsTimes.length - 1] - fpsTimes[0]) / 1000;
      computedFps = elapsed > 0 ? (fpsTimes.length - 1) / elapsed : 60;
    }
    
    return {
      drawTimeMs: parseFloat(avgDrawTime.toFixed(2)),
      fps: Math.round(computedFps)
    };
  };

  const requestRender = () => {
    renderRequestsRef.current += 1;
  };

  // Adjust rendering fidelity if average frame draw times are too heavy
  useEffect(() => {
    const handlePerformanceAudit = () => {
      const times = drawTimesRef.current;
      if (times.length < 10) return;

      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      
      // Dynamic degradation thresholds (designed for non-blocking UI responsiveness)
      if (avgTime > 12) {
        setPerfLevel('low');
      } else if (avgTime > 5) {
        setPerfLevel('medium');
      } else {
        setPerfLevel('high');
      }

      // Keep sample arrays small to respond dynamically to system load changes
      drawTimesRef.current = times.slice(-10);
    };

    const interval = setInterval(handlePerformanceAudit, 4000);
    return () => clearInterval(interval);
  }, []);

  const value: CanvasContextType = {
    frameloop,
    perfLevel,
    getPerfReport,
    requestRender
  };

  return (
    <CanvasContext.Provider value={value}>
      <div id={id} className={`relative select-none pointer-events-none ${className}`}>
        {children}
      </div>
    </CanvasContext.Provider>
  );
}

// Custom hook to consume the canvas loop parameters
export function useCanvas() {
  const context = useContext(CanvasContext);
  if (!context) {
    // Fallback safe context if Orb is used outside of Canvas wrapper
    return {
      frameloop: 'always' as const,
      perfLevel: 'high' as const,
      getPerfReport: () => ({ drawTimeMs: 0.5, fps: 60 }),
      requestRender: () => {}
    };
  }
  return context;
}

export interface OrbProps {
  intensity: number;
  turbulence: number;
  color?: string;
  isHighFidelity?: boolean;
  transitionState?: "none" | "implosion" | "bloom";
  sanctuaryProgress?: number;
  isSlow?: boolean;
}

export function Orb({
  intensity,
  turbulence,
  color = "#daa520",
  isHighFidelity = true,
  transitionState = "none",
  sanctuaryProgress = 0,
  isSlow = false
}: OrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { frameloop, perfLevel, requestRender } = useCanvas();
  const stateRef = useRef({
    time: 0,
    intensity,
    turbulence,
    scale: 0.45,
    opacity: 1
  });

  // Track props changes and request frames for 'demand' loop
  useEffect(() => {
    stateRef.current.intensity = intensity;
    stateRef.current.turbulence = turbulence;
    requestRender();
  }, [intensity, turbulence, requestRender]);

  // Handle transition state animations smoothly (with high-performance fallback frame loops)
  useEffect(() => {
    let transitionDuration = 1200; // ms
    let start: number | null = null;
    let animFrame: number;

    const animateTransition = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / transitionDuration, 1);

      if (transitionState === "implosion") {
        // Expo in ease curve
        const ease = Math.pow(2, 10 * (progress - 1));
        stateRef.current.scale = 0.45 * (1 - ease);
        stateRef.current.opacity = 1 - ease;
      } else if (transitionState === "bloom") {
        // Expo out ease curve
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        stateRef.current.scale = 0.45 * ease;
        stateRef.current.opacity = ease;
      } else {
        stateRef.current.scale = 0.45;
        stateRef.current.opacity = 1;
      }

      requestRender();

      if (progress < 1) {
        animFrame = requestAnimationFrame(animateTransition);
      }
    };

    if (transitionState !== "none") {
      animFrame = requestAnimationFrame(animateTransition);
    }

    return () => cancelAnimationFrame(animFrame);
  }, [transitionState, requestRender]);

  // Comprehensive custom drawing routine rendered directly on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let lastTime = performance.now();

    const draw = () => {
      const now = performance.now();
      const elapsed = now - lastTime;
      lastTime = now;

      // Only increment clock if simulation is active
      const speedMultiplier = isSlow ? 0.08 : Math.max(0.2, 1 - (sanctuaryProgress * 0.75));
      stateRef.current.time += (elapsed / 1000) * speedMultiplier;

      const width = canvas.width;
      const height = canvas.height;
      
      // Clear with precise alpha layering to leave pristine dark environment behind
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = Math.min(width, height) * 0.38;

      // Add fluid breathing overlay
      const breathingPeriod = isSlow ? 12 : 7;
      const breath = Math.sin(stateRef.current.time * (Math.PI * 2 / breathingPeriod)) * 0.05 + 1.0;
      const currentRadius = baseRadius * breath * stateRef.current.scale;

      ctx.save();
      ctx.globalAlpha = stateRef.current.opacity;

      // Primary inner ambient lighting radial glow
      const glowGrad = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, currentRadius * 1.5
      );
      glowGrad.addColorStop(0, '#FFFFFF');
      glowGrad.addColorStop(0.15, color);
      glowGrad.addColorStop(0.40, '#8A6E10');
      glowGrad.addColorStop(0.75, 'rgba(10, 8, 4, 0.2)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Liquid golden core utilizing Perlin-style displacement noise algorithm
      ctx.beginPath();
      const numPoints = perfLevel === 'high' ? 140 : perfLevel === 'medium' ? 80 : 40;
      const localIntensity = stateRef.current.intensity;
      const localTurbulence = stateRef.current.turbulence;
      
      for (let i = 0; i < numPoints; i++) {
        const theta = (i / numPoints) * Math.PI * 2;
        
        // Staggered sine waves simulation of high-fidelity shaders
        let waveDisplacement = Math.sin(theta * 3 + stateRef.current.time * 2.5) * 6;
        waveDisplacement += Math.cos(theta * 7 - stateRef.current.time * 4) * 4;
        waveDisplacement += Math.sin(theta * 11 + stateRef.current.time * 6) * 2;
        
        const finalDisplacement = waveDisplacement * (0.8 + localTurbulence * 1.2) * (localIntensity * 0.9);
        const radiusAtPoint = currentRadius + finalDisplacement;

        const x = centerX + Math.cos(theta) * radiusAtPoint;
        const y = centerY + Math.sin(theta) * radiusAtPoint;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();

      // Premium gold core fill gradient
      const coreGrad = ctx.createRadialGradient(
        centerX - currentRadius * 0.2, centerY - currentRadius * 0.2, 0,
        centerX, centerY, currentRadius
      );
      coreGrad.addColorStop(0, '#FFFCE8');
      coreGrad.addColorStop(0.35, color);
      coreGrad.addColorStop(0.70, '#5C4308');
      coreGrad.addColorStop(1, '#0C0902');

      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Outer holographic halo ring
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = stateRef.current.opacity * 0.35;
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius * 0.98, 0, Math.PI * 2);
      ctx.stroke();

      // Constellation alignment indicators revolving around active boundary
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.globalAlpha = stateRef.current.opacity * 0.15;
      ctx.setLineDash([4, 12]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius * 1.06, stateRef.current.time * 0.15, stateRef.current.time * 0.15 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();

      // Performance profiling timestamp evaluation
      const drawTime = performance.now() - now;
      // We push this directly to the context to enable seamless system adjustment
      requestRender();
    };

    const tick = () => {
      // In demand mode we only step are if transitionState is active or frame requested
      if (frameloop === 'demand') {
        const isTransitioning = transitionState !== 'none';
        if (isTransitioning || Math.random() < 0.15) {
          draw();
        }
      } else {
        draw();
      }
      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [color, isSlow, sanctuaryProgress, frameloop, perfLevel, transitionState]);

  return (
    <div className="relative flex justify-center items-center select-none pointer-events-none min-h-[180px] w-full z-10 my-8">
      {/* Underlying layout context wrapper */}
      <canvas
        ref={canvasRef}
        width={360}
        height={360}
        className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] block max-w-full"
      />
    </div>
  );
}
