import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Loader2, FileText, ArrowRightLeft, ShieldCheck, HelpCircle } from 'lucide-react';

const PIPELINE_STAGES = [
  { id: '01', label: 'Reading Resume', duration: 1500 },
  { id: '02', label: 'Extracting Evidence', duration: 2500 },
  { id: '03', label: 'Reading Job Requirements', duration: 2000 },
  { id: '04', label: 'Comparing Requirements', duration: 3000 },
  { id: '05', label: 'Identifying Gaps', duration: 2500 },
  { id: '06', label: 'Preparing Report', duration: 2000 },
  { id: '07', label: 'Building Improved Resume', duration: 2000 }
];

export default function LoadingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Progress through pipeline steps to give real feedback
  useEffect(() => {
    if (currentStep >= PIPELINE_STAGES.length - 1) return;

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, PIPELINE_STAGES[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep]);

  // Framer Motion Animation variants that respect prefers-reduced-motion
  const docTransition = shouldReduceMotion 
    ? { duration: 0 } 
    : { duration: 2, ease: [0.16, 1, 0.3, 1], repeat: Infinity, repeatType: "reverse" };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '4rem 2rem',
      display: 'grid',
      gridTemplateColumns: '1fr 1.2fr',
      gap: '4rem',
      alignItems: 'center',
      minHeight: '80vh'
    }} className="loading-grid">
      
      {/* LEFT COLUMN: 3D Compilation Visual */}
      <div 
        className="perspective-container no-print" 
        style={{
          height: '450px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {/* Compilation Area Background Grid */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.4,
          transform: 'rotateX(55deg) rotateY(0deg) rotateZ(-30deg) translateZ(-40px)',
          pointerEvents: 'none'
        }} />

        {/* 3D Scene */}
        {!shouldReduceMotion ? (
          <div style={{
            position: 'relative',
            width: '320px',
            height: '360px',
            transformStyle: 'preserve-3d'
          }}>
            {/* Resume Sheet - Enters from Left */}
            <motion.div
              initial={{ x: -150, opacity: 0, rotateY: -30 }}
              animate={{ x: currentStep >= 5 ? -20 : -90, opacity: currentStep >= 5 ? 0.3 : 0.85, rotateY: -20, y: [0, -10, 0] }}
              transition={{
                x: { duration: 1.5, ease: 'easeOut' },
                y: docTransition,
                opacity: { duration: 1 }
              }}
              style={{
                position: 'absolute',
                top: '40px',
                width: '120px',
                height: '160px',
                padding: '12px',
                transformStyle: 'preserve-3d',
                zIndex: 2
              }}
              className="document-3d-sheet"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', height: '100%' }}>
                <span style={{ fontSize: '0.5rem', fontWeight: '700', color: 'var(--text-muted)' }}>RESUME.pdf</span>
                <div style={{ width: '100%', height: '1px', background: 'var(--border-color)' }} />
                <div style={{ width: '90%', height: '6px', background: 'var(--border-color-dark)', borderRadius: '1px' }} />
                <div style={{ width: '80%', height: '6px', background: 'var(--border-color-dark)', borderRadius: '1px' }} />
                <div style={{ width: '60%', height: '6px', background: 'var(--border-color-dark)', borderRadius: '1px' }} />
              </div>
            </motion.div>

            {/* Job Description Sheet - Enters from Right */}
            <motion.div
              initial={{ x: 150, opacity: 0, rotateY: 30 }}
              animate={{ x: currentStep >= 5 ? 20 : 90, opacity: currentStep >= 5 ? 0.3 : 0.85, rotateY: -10, y: [0, -12, 0] }}
              transition={{
                x: { duration: 1.5, ease: 'easeOut' },
                y: { ...docTransition, delay: 0.3 },
                opacity: { duration: 1 }
              }}
              style={{
                position: 'absolute',
                top: '20px',
                width: '120px',
                height: '160px',
                padding: '12px',
                transformStyle: 'preserve-3d',
                zIndex: 1
              }}
              className="document-3d-sheet"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', height: '100%' }}>
                <span style={{ fontSize: '0.5rem', fontWeight: '700', color: 'var(--text-muted)' }}>TARGET_JD.txt</span>
                <div style={{ width: '100%', height: '1px', background: 'var(--border-color)' }} />
                <div style={{ width: '100%', height: '6px', background: 'var(--border-color-dark)', borderRadius: '1px' }} />
                <div style={{ width: '85%', height: '6px', background: 'var(--border-color-dark)', borderRadius: '1px' }} />
                <div style={{ width: '70%', height: '6px', background: 'var(--border-color-dark)', borderRadius: '1px' }} />
              </div>
            </motion.div>

            {/* Match Particles & Flow (Middle / Columns) */}
            {currentStep >= 3 && currentStep < 5 && (
              <>
                {/* Ray 1: Match Flow */}
                <motion.div
                  initial={{ x: -40, y: 80, opacity: 0, scale: 0.5 }}
                  animate={{ x: [ -40, 0, 50 ], y: [ 80, 100, 240 ], opacity: [0, 1, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--success-color)',
                    boxShadow: '0 0 8px var(--success-color)',
                    zIndex: 3
                  }}
                />

                {/* Ray 2: Gap Flow */}
                <motion.div
                  initial={{ x: 40, y: 70, opacity: 0, scale: 0.5 }}
                  animate={{ x: [ 40, 0, -50 ], y: [ 70, 90, 240 ], opacity: [0, 1, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut', delay: 0.4 }}
                  style={{
                    position: 'absolute',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--error-color)',
                    boxShadow: '0 0 8px var(--error-color)',
                    zIndex: 3
                  }}
                />
              </>
            )}

            {/* Column A: Verified Evidence (Left Bottom) */}
            <motion.div
              animate={{ opacity: currentStep >= 3 && currentStep < 6 ? 0.9 : 0 }}
              style={{
                position: 'absolute',
                bottom: '40px',
                left: '-80px',
                width: '100px',
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid var(--success-border)',
                borderRadius: '3px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                zIndex: 3,
                transform: 'rotateX(20deg) rotateY(-10deg) rotateZ(2deg)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--success-color)' }} />
                <span style={{ fontSize: '0.45rem', fontWeight: '700', color: 'var(--success-color)' }}>EVIDENCE FOUND</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'var(--success-color)', opacity: 0.2, borderRadius: '1px' }} />
              <div style={{ width: '70%', height: '4px', background: 'var(--success-color)', opacity: 0.2, borderRadius: '1px' }} />
            </motion.div>

            {/* Column B: Identified Gaps (Right Bottom) */}
            <motion.div
              animate={{ opacity: currentStep >= 4 && currentStep < 6 ? 0.9 : 0 }}
              style={{
                position: 'absolute',
                bottom: '60px',
                left: '100px',
                width: '100px',
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid var(--error-border)',
                borderRadius: '3px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                zIndex: 3,
                transform: 'rotateX(20deg) rotateY(-10deg) rotateZ(-2deg)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--error-color)' }} />
                <span style={{ fontSize: '0.45rem', fontWeight: '700', color: 'var(--error-color)' }}>GAPS IDENTIFIED</span>
              </div>
              <div style={{ width: '90%', height: '4px', background: 'var(--error-color)', opacity: 0.2, borderRadius: '1px' }} />
              <div style={{ width: '50%', height: '4px', background: 'var(--error-color)', opacity: 0.2, borderRadius: '1px' }} />
            </motion.div>

            {/* Final Centered Compiled Document (Forms at Step 6-7) */}
            {currentStep >= 5 && (
              <motion.div
                initial={{ scale: 0.2, opacity: 0, y: 150, z: 0 }}
                animate={{ scale: 1, opacity: 1, y: 80, z: 50, rotateX: 20, rotateY: -20, rotateZ: 3 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  left: '10px',
                  width: '140px',
                  height: '190px',
                  padding: '16px',
                  zIndex: 10
                }}
                className="document-3d-sheet"
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ width: '60px', height: '8px', background: 'var(--accent-color)', borderRadius: '1px' }} />
                    <Check size={10} style={{ color: 'var(--success-color)' }} />
                  </div>
                  <div style={{ width: '100%', height: '1px', background: 'var(--border-color)' }} />
                  <div style={{ width: '100%', height: '5px', background: 'var(--border-color-dark)', borderRadius: '1px' }} />
                  <div style={{ width: '90%', height: '5px', background: 'var(--border-color-dark)', borderRadius: '1px' }} />
                  <div style={{ width: '95%', height: '5px', background: 'var(--border-color-dark)', borderRadius: '1px' }} />
                  <div style={{ width: '80%', height: '5px', background: 'var(--border-color-dark)', borderRadius: '1px' }} />
                  <div style={{ marginTop: 'auto', width: '100%', height: '12px', background: 'var(--accent-light)', border: '1px dashed var(--accent-color)', opacity: 0.4 }} />
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          /* Reduced motion simple loader */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Loader2 className="animate-spin" size={40} style={{ animation: 'spin 2s linear infinite', color: 'var(--accent-color)' }} />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Compiling analysis data...</span>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Pipeline Process Steps */}
      <div style={{
        background: 'var(--bg-white)',
        border: '1px solid var(--border-color)',
        borderRadius: '4px',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <Loader2 style={{ animation: 'spin 2s linear infinite', color: 'var(--accent-color)', flexShrink: 0 }} size={20} />
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.01em' }}>
              Execution Pipeline
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Benchmarking credentials against requirement specs
            </p>
          </div>
        </div>

        {/* Step list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {PIPELINE_STAGES.map((stage, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            
            return (
              <div 
                key={stage.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  opacity: isCompleted || isActive ? 1 : 0.35,
                  transition: 'var(--transition-smooth)'
                }}
              >
                {/* Step indicator */}
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  background: isCompleted ? 'var(--success-light)' : isActive ? 'var(--accent-light)' : 'var(--bg-secondary)',
                  border: isCompleted ? '1px solid var(--success-border)' : isActive ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
                  color: isCompleted ? 'var(--success-color)' : isActive ? 'var(--accent-color)' : 'var(--text-muted)',
                  transition: 'var(--transition-smooth)'
                }}>
                  {isCompleted ? <Check size={14} /> : stage.id}
                </div>

                {/* Step label */}
                <span style={{
                  fontWeight: isActive ? '600' : '400',
                  fontSize: '0.925rem',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'var(--transition-smooth)'
                }}>
                  {stage.label}
                </span>

                {/* Pulse loading dot for active item */}
                {isActive && (
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-color)',
                    display: 'inline-block',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    marginLeft: 'auto'
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* CSS Keyframes for pulse/spin animations injected directly */}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(0.9); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
