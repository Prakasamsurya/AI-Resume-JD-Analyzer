import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown, Check, AlertTriangle, ShieldCheck, FileText, ArrowRightLeft, Sparkles, BookOpen } from 'lucide-react';

export default function LandingPage({ onStartAnalysis }) {
  const stepsRef = useRef(null);

  // Scroll animated line for the 4-step process
  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollToHowItWorks = () => {
    stepsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page" style={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <section style={{
        padding: '5rem 2rem 6rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '4rem',
        alignItems: 'center'
      }} className="hero-grid">
        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-color)' }}></span>
            Evidence-Based Assessment
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '700',
            lineHeight: '1.15',
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)'
          }}>
            Understand the Job.<br />
            <span style={{
              position: 'relative',
              display: 'inline-block',
              paddingBottom: '0.2rem'
            }}>
              Strengthen the Resume.
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '4px',
                backgroundColor: 'var(--accent-color)',
                opacity: 0.15
              }}></span>
            </span>
          </h1>
          
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            maxWidth: '540px',
            lineHeight: '1.6'
          }}>
            Compare a resume with any job description, identify evidence and gaps, and create a more targeted resume without inventing qualifications.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={onStartAnalysis} style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
              Start Analysis <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary" onClick={scrollToHowItWorks} style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
              How It Works <ChevronDown size={18} />
            </button>
          </div>
        </motion.div>

        {/* Hero Visual - Premium 3D document stack */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{
            position: 'relative',
            height: '450px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="perspective-container"
        >
          {/* Grid base background */}
          <div style={{
            position: 'absolute',
            width: '120%',
            height: '120%',
            backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.6,
            transform: 'rotateX(60deg) rotateY(0deg) rotateZ(-45deg) translateZ(-80px)',
            pointerEvents: 'none'
          }} />

          {/* 3D Stack */}
          <div style={{
            position: 'relative',
            width: '280px',
            height: '380px',
            transformStyle: 'preserve-3d'
          }}>
            {/* 1. Resume Sheet (Back/Left) */}
            <motion.div
              animate={{ y: [0, -12, 0], rotateZ: [1, 2, 1] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: '-20px',
                left: '-60px',
                width: '100%',
                height: '100%',
                padding: '24px',
                transformStyle: 'preserve-3d',
                transform: 'rotateX(20deg) rotateY(-20deg) rotateZ(2deg) translateZ(-40px)',
                zIndex: 1,
                cursor: 'default'
              }}
              className="document-3d-sheet"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', opacity: 0.85 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '80px', height: '12px', background: 'var(--text-primary)', borderRadius: '2px' }} />
                  <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)' }}>RESUME</span>
                </div>
                <div style={{ width: '100%', height: '1px', background: 'var(--border-color)' }} />
                <div style={{ width: '100%', height: '8px', background: 'var(--border-color-dark)', borderRadius: '1px' }} />
                <div style={{ width: '90%', height: '8px', background: 'var(--border-color-dark)', borderRadius: '1px' }} />
                <div style={{ width: '60%', height: '8px', background: 'var(--border-color-dark)', borderRadius: '1px' }} />
                <div style={{ width: '100%', height: '8px', background: 'var(--border-color-dark)', borderRadius: '1px', marginTop: '12px' }} />
                <div style={{ width: '40%', height: '8px', background: 'var(--border-color-dark)', borderRadius: '1px' }} />
                <div style={{ marginTop: 'auto', display: 'flex', gap: '6px' }}>
                  <div style={{ width: '32px', height: '14px', border: '1px solid var(--border-color-dark)', borderRadius: '2px' }} />
                  <div style={{ width: '32px', height: '14px', border: '1px solid var(--border-color-dark)', borderRadius: '2px' }} />
                </div>
              </div>
            </motion.div>

            {/* 2. Job Description Sheet (Back/Right) */}
            <motion.div
              animate={{ y: [0, -8, 0], rotateZ: [-2, -3, -2] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut', delay: 0.5 }}
              style={{
                position: 'absolute',
                top: '-40px',
                left: '60px',
                width: '100%',
                height: '100%',
                padding: '24px',
                transformStyle: 'preserve-3d',
                transform: 'rotateX(20deg) rotateY(-20deg) rotateZ(-3deg) translateZ(-60px)',
                zIndex: 0,
                cursor: 'default'
              }}
              className="document-3d-sheet"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', opacity: 0.7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '100px', height: '12px', background: 'var(--text-muted)', borderRadius: '2px' }} />
                  <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)' }}>REQ</span>
                </div>
                <div style={{ width: '100%', height: '1px', background: 'var(--border-color)' }} />
                <div style={{ width: '80%', height: '8px', background: 'var(--border-color-dark)', borderRadius: '1px' }} />
                <div style={{ width: '100%', height: '8px', background: 'var(--border-color-dark)', borderRadius: '1px' }} />
                <div style={{ width: '70%', height: '8px', background: 'var(--border-color-dark)', borderRadius: '1px' }} />
                <div style={{ width: '90%', height: '8px', background: 'var(--border-color-dark)', borderRadius: '1px', marginTop: '12px' }} />
                <div style={{ width: '50%', height: '8px', background: 'var(--border-color-dark)', borderRadius: '1px' }} />
              </div>
            </motion.div>

            {/* 3. Requirement Matching Connector (Middle Overlay) */}
            <motion.div
              animate={{ y: [0, -15, 0], scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
              style={{
                position: 'absolute',
                top: '60px',
                left: '0px',
                width: '100%',
                height: '80px',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid var(--border-color-dark)',
                borderRadius: '4px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                zIndex: 3,
                transform: 'rotateX(15deg) rotateY(-15deg) rotateZ(0deg) translateZ(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <div style={{ height: '6px', width: '80%', background: 'var(--text-muted)', borderRadius: '2px', opacity: 0.5 }} />
                <div style={{ height: '6px', width: '50%', background: 'var(--success-color)', borderRadius: '2px' }} />
              </div>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                background: 'var(--accent-color)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ArrowRightLeft size={16} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <div style={{ height: '6px', width: '90%', background: 'var(--text-muted)', borderRadius: '2px', opacity: 0.5 }} />
                <div style={{ height: '6px', width: '60%', background: 'var(--success-color)', borderRadius: '2px' }} />
              </div>
            </motion.div>

            {/* 4. Optimized Resume / Report Sheet (Front) */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 1.5 }}
              style={{
                position: 'absolute',
                top: '100px',
                left: '-10px',
                width: '100%',
                height: '100%',
                padding: '24px',
                transformStyle: 'preserve-3d',
                transform: 'rotateX(20deg) rotateY(-20deg) rotateZ(4deg) translateZ(60px)',
                zIndex: 4
              }}
              className="document-3d-sheet"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '90px', height: '12px', background: 'var(--accent-color)', borderRadius: '2px' }} />
                  <div style={{
                    fontSize: '0.6rem',
                    fontWeight: '700',
                    color: 'var(--success-color)',
                    background: 'var(--success-light)',
                    padding: '2px 6px',
                    borderRadius: '2px',
                    border: '1px solid var(--success-border)'
                  }}>
                    EVIDENCE SECURED
                  </div>
                </div>
                <div style={{ width: '100%', height: '1px', background: 'var(--border-color)' }} />
                
                {/* Simulated improvement block */}
                <div style={{
                  border: '1px dashed var(--success-border)',
                  background: 'var(--success-light)',
                  padding: '8px',
                  borderRadius: '3px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '35%', height: '6px', background: 'var(--success-color)', borderRadius: '1px' }} />
                    <span style={{ fontSize: '0.5rem', color: 'var(--success-color)', fontWeight: '600' }}>+ Highlighted</span>
                  </div>
                  <div style={{ width: '90%', height: '4px', background: 'var(--success-color)', opacity: 0.6, borderRadius: '1px' }} />
                </div>

                <div style={{ width: '100%', height: '8px', background: 'var(--border-color-dark)', borderRadius: '1px' }} />
                <div style={{ width: '85%', height: '8px', background: 'var(--border-color-dark)', borderRadius: '1px' }} />
                
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--accent-color)' }}>OPTIMIZED RESUME</span>
                  <Check size={14} style={{ color: 'var(--success-color)' }} />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 4-Step Process Section */}
      <section ref={stepsRef} style={{
        background: 'var(--bg-white)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        padding: '6rem 2rem'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
              How It Works
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
              Our structured matching pipeline is evidence-first, validating matches line-by-line.
            </p>
          </div>

          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '6rem' }}>
            {/* Scroll-animated line */}
            <div style={{
              position: 'absolute',
              left: '24px',
              top: '20px',
              bottom: '20px',
              width: '2px',
              background: 'var(--border-color)',
              zIndex: 0
            }} className="no-print">
              <motion.div style={{
                width: '100%',
                height: '100%',
                background: 'var(--accent-color)',
                scaleY,
                originY: 0
              }} />
            </div>

            {/* Step 1 */}
            <ProcessStep 
              num="01" 
              title="Upload Resume" 
              desc="Provide your current professional resume in PDF format. We safely extract your text, project histories, and verified credentials."
              svgType="upload"
            />

            {/* Step 2 */}
            <ProcessStep 
              num="02" 
              title="Add Job Description" 
              desc="Paste the job description of your target role. The analyzer parses requirements, core toolsets, and preferred qualifications."
              svgType="jd"
            />

            {/* Step 3 */}
            <ProcessStep 
              num="03" 
              title="Analyze Evidence" 
              desc="The matching engine benchmarks your achievements against job criteria, compiling matches, weaknesses, and key deficiencies."
              svgType="matching"
            />

            {/* Step 4 */}
            <ProcessStep 
              num="04" 
              title="Improve & Review" 
              desc="Review an interactive alignment scorecard alongside an optimized resume version, tailored using your exact professional history."
              svgType="improve"
            />
          </div>
        </div>
      </section>

      {/* Trust & Accuracy Section */}
      <section style={{
        padding: '6rem 2rem',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '3.5rem',
          background: 'var(--bg-white)',
          border: '1px solid var(--border-color)',
          borderRadius: '4px',
          padding: '3rem',
          boxShadow: 'var(--shadow-md)'
        }} className="trust-panel-grid">
          {/* Header text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: 'var(--success-color)'
            }}>
              <ShieldCheck size={18} />
              Professional Evidence Principle
            </div>
            
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.01em' }}>
              We Never Fabricate Credentials.
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '750px' }}>
              This platform operates on an <strong>evidence-based evaluation model</strong>. We analyze what you have actually written and map it explicitly to job requirements. Missing qualifications are highlighted so you can prepare for them, rather than filled with AI-generated filler.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="trust-examples-grid">
            {/* Example 1: Missing skill */}
            <div style={{
              border: '1px solid var(--border-color)',
              padding: '1.5rem',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-secondary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Case A</span>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  color: 'var(--error-color)',
                  background: 'var(--error-light)',
                  padding: '2px 6px',
                  borderRadius: '2px',
                  border: '1px solid var(--error-border)'
                }}>
                  <AlertTriangle size={12} /> Missing Skill
                </span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '600' }}>Target: AWS Architecture</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', minHeight: '60px' }}>
                If your resume shows no experience with AWS, it is flagged as a gap. We do not invent cloud claims on your sheet.
              </p>
              <div style={{
                marginTop: 'auto',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <span style={{ fontSize: '1.1rem', color: 'var(--error-color)' }}>•</span>
                Not automatically added to the resume.
              </div>
            </div>

            {/* Example 2: Existing evidence */}
            <div style={{
              border: '1px solid var(--border-color)',
              padding: '1.5rem',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-secondary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Case B</span>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  color: 'var(--success-color)',
                  background: 'var(--success-light)',
                  padding: '2px 6px',
                  borderRadius: '2px',
                  border: '1px solid var(--success-border)'
                }}>
                  <Check size={12} /> Existing Evidence
                </span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '600' }}>Target: Database Design</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', minHeight: '60px' }}>
                Your resume mentions "built relational schemas in SQL". We rewrite the bullet to align with the target JD's phrasing.
              </p>
              <div style={{
                marginTop: 'auto',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <span style={{ fontSize: '1.1rem', color: 'var(--success-color)' }}>•</span>
                Rewritten & highlighted clearly.
              </div>
            </div>
          </div>

          {/* Statement box */}
          <div style={{
            background: 'var(--accent-light)',
            borderLeft: '3px solid var(--accent-color)',
            padding: '1.25rem 1.5rem',
            fontSize: '0.95rem',
            color: 'var(--accent-color)',
            fontWeight: '500',
            lineHeight: '1.5'
          }}>
            "Your resume is improved using the evidence already present in it. Missing qualifications are never fabricated."
          </div>
        </div>
      </section>
    </div>
  );
}

// Subcomponent for Steps
function ProcessStep({ num, title, desc, svgType }) {
  const renderSvg = () => {
    // Premium editorial-style SVGs (clean strokes, gray grids, dark paths)
    switch (svgType) {
      case 'upload':
        return (
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="6" width="36" height="48" rx="2" stroke="var(--text-primary)" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M22 20H38" stroke="var(--border-color-dark)" strokeWidth="2" />
            <path d="M22 28H38" stroke="var(--border-color-dark)" strokeWidth="2" />
            <path d="M22 36H30" stroke="var(--border-color-dark)" strokeWidth="2" />
            <circle cx="30" cy="30" r="14" fill="var(--bg-white)" stroke="var(--text-primary)" strokeWidth="2" />
            <path d="M30 36V24M30 24L26 28M30 24L34 28" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'jd':
        return (
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="8" width="40" height="44" rx="2" stroke="var(--text-primary)" strokeWidth="2" />
            <rect x="18" y="16" width="24" height="2" fill="var(--text-primary)" />
            <rect x="18" y="24" width="24" height="2" fill="var(--border-color-dark)" />
            <rect x="18" y="32" width="24" height="2" fill="var(--border-color-dark)" />
            <rect x="18" y="40" width="14" height="2" fill="var(--border-color-dark)" />
            <path d="M42 42L48 48M48 48L52 44" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'matching':
        return (
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 20C8 12 12 8 20 8" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" />
            <path d="M52 20C52 12 48 8 40 8" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 40C8 48 12 52 20 52" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" />
            <path d="M52 40C52 48 48 52 40 52" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="20" cy="30" r="4" fill="var(--text-primary)" />
            <circle cx="40" cy="30" r="4" fill="var(--text-primary)" />
            <path d="M24 30H36" stroke="var(--text-primary)" strokeWidth="2" strokeDasharray="2 2" />
            <path d="M30 20L34 24L30 28" stroke="var(--success-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'improve':
        return (
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="6" width="32" height="48" rx="2" fill="var(--accent-light)" stroke="var(--text-primary)" strokeWidth="2" />
            <path d="M22 18H38" stroke="var(--text-primary)" strokeWidth="2" />
            <path d="M22 26H34" stroke="var(--text-primary)" strokeWidth="2" />
            <path d="M22 34H38" stroke="var(--text-primary)" strokeWidth="2" />
            <circle cx="42" cy="42" r="10" fill="var(--bg-white)" stroke="var(--success-color)" strokeWidth="2" />
            <path d="M38 42L41 45L46 39" stroke="var(--success-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'grid',
        gridTemplateColumns: '60px 1fr 120px',
        gap: '2.5rem',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}
      className="process-step-row"
    >
      {/* Step circle number */}
      <div style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'var(--bg-primary)',
        border: '2px solid var(--accent-color)',
        color: 'var(--accent-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem',
        fontWeight: '700',
        zIndex: 2,
        boxShadow: 'var(--shadow-sm)'
      }}>
        {num}
      </div>

      {/* Description text */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: '1.5' }}>{desc}</p>
      </div>

      {/* Custom Graphic illustration */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8px',
        background: 'var(--bg-secondary)',
        borderRadius: '4px',
        border: '1px solid var(--border-color)',
        width: '100px',
        height: '100px'
      }} className="step-svg-holder">
        {renderSvg()}
      </div>
    </motion.div>
  );
}
