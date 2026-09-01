import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
import LandingPage from './components/LandingPage';
import WorkspacePage from './components/WorkspacePage';
import LoadingPage from './components/LoadingPage';
import ReportPage from './components/ReportPage';
import OptimizedResumePage from './components/OptimizedResumePage';
import { normalizeResponseData } from './utils/normalizeResponse';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'analyze' | 'loading' | 'report' | 'resume'
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [optimizedResume, setOptimizedResume] = useState(null);
  
  // Mobile navigation menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // API error state
  const [apiError, setApiError] = useState(null);

  const clearResultState = () => {
    setAnalysisData(null);
    setOptimizedResume(null);
    setApiError(null);
  };

  // Trigger analysis and webhook call
  const handleAnalyze = async (file, jd) => {
    setResumeFile(file);
    setJobDescription(jd);
    clearResultState();
    setCurrentPage('loading');

    try {
      if (!file) {
        throw new Error('Invalid PDF: please upload a valid PDF resume before submitting.');
      }

      if (!jd || jd.trim().length < 50) {
        throw new Error('Missing job description: please provide a complete target job description.');
      }

      const formData = new FormData();
      formData.append("resume", file);
      formData.append("job_description", jd);

      // Perform API call exactly as requested
      const response = await fetch(
        "http://localhost:5678/webhook-test/c70ddae3-b44a-42e7-a89d-4ba66be419d5",
        {
          method: "POST",
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`Webhook failed with HTTP ${response.status}: ${response.statusText}`);
      }

      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error('Invalid response: the server did not return valid JSON.');
      }

      const normalized = normalizeResponseData(result);
      const analysisPayload = normalized?.analysis || {};
      const hasValidResponse = Boolean(
        normalized.hasAnalysis &&
        (
          Array.isArray(analysisPayload.requirement_analysis) ||
          Array.isArray(analysisPayload.resume_improvements) ||
          Array.isArray(analysisPayload.relevant_projects) ||
          Array.isArray(analysisPayload.interview_questions) ||
          Array.isArray(analysisPayload.action_plan) ||
          normalized.optimizedResume && Object.keys(normalized.optimizedResume).length > 0
        )
      );

      if (!hasValidResponse) {
        throw new Error('Incomplete result: the webhook response is missing the expected analysis fields.');
      }

      setAnalysisData(normalized.analysis);
      setOptimizedResume(normalized.optimizedResume);
      setCurrentPage('report');
    } catch (err) {
      console.error("API error", err);

      let userMsg = "The analysis request could not be completed.";
      if (err?.message?.includes('Failed to fetch')) {
        userMsg = "Unable to connect to the n8n server. Please verify n8n is running locally on port 5678 and CORS is configured.";
      } else if (err?.message) {
        userMsg = err.message;
      }

      setApiError(userMsg);
      setCurrentPage('analyze');
    }
  };

  const resetAnalysis = () => {
    setAnalysisData(null);
    setOptimizedResume(null);
    setResumeFile(null);
    setJobDescription('');
    setApiError(null);
    setCurrentPage('analyze');
  };

  const hasResultData = !!analysisData || !!optimizedResume;

  // Safe navigation helper
  const navigateTo = (page) => {
    if ((page === 'report' || page === 'resume') && !hasResultData) {
      return; // Prevent navigating to report/resume if no data
    }
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Header / Navigation */}
      <header 
        className="no-print"
        style={{
          background: 'var(--bg-white)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1.25rem 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Typographic Logo */}
          <div 
            onClick={() => navigateTo('home')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.65rem', 
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <span style={{
              fontWeight: '700',
              fontSize: '1.2rem',
              letterSpacing: '0.05em',
              color: 'var(--accent-color)',
              display: 'inline-flex',
              alignItems: 'center'
            }}>
              BENCHMARK <span style={{ fontWeight: '300', opacity: 0.6, marginLeft: '0.25rem' }}>// CAREER</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
            {[
              { id: 'home', label: 'How It Works', requiresData: false },
              { id: 'analyze', label: 'Analyze', requiresData: false },
              { id: 'report', label: 'Report', requiresData: true },
              { id: 'resume', label: 'Optimized Resume', requiresData: true }
            ].map(link => {
              const isDisabled = link.requiresData && !hasResultData;
              const isActive = currentPage === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => !isDisabled && navigateTo(link.id)}
                  disabled={isDisabled}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: 'var(--font-family)',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? '600' : '400',
                    color: isDisabled 
                      ? 'var(--border-color-dark)' 
                      : isActive 
                      ? 'var(--accent-color)' 
                      : 'var(--text-secondary)',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    padding: '0.25rem 0',
                    position: 'relative',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  {link.label}
                  {isActive && (
                    <motion.span 
                      layoutId="nav-underline"
                      style={{
                        position: 'absolute',
                        bottom: -4,
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: 'var(--accent-color)'
                      }}
                    />
                  )}
                </button>
              );
            })}

            {analysisData && (
              <button 
                onClick={resetAnalysis}
                className="btn btn-secondary" 
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem' }}
              >
                Reset
              </button>
            )}
          </nav>

          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-nav-toggle"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              display: 'none' // Controlled by CSS media queries
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="no-print"
            style={{
              background: 'var(--bg-white)',
              borderBottom: '1px solid var(--border-color)',
              padding: '1rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              position: 'sticky',
              top: '64px',
              zIndex: 99,
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {[
              { id: 'home', label: 'How It Works', requiresData: false },
              { id: 'analyze', label: 'Analyze', requiresData: false },
              { id: 'report', label: 'Report', requiresData: true },
              { id: 'resume', label: 'Optimized Resume', requiresData: true }
            ].map(link => {
              const isDisabled = link.requiresData && !hasResultData;
              const isActive = currentPage === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => !isDisabled && navigateTo(link.id)}
                  disabled={isDisabled}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: 'var(--font-family)',
                    fontSize: '1rem',
                    textAlign: 'left',
                    fontWeight: isActive ? '600' : '400',
                    color: isDisabled 
                      ? 'var(--border-color-dark)' 
                      : isActive 
                      ? 'var(--accent-color)' 
                      : 'var(--text-secondary)',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    padding: '0.5rem 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  {link.label}
                  <ChevronRight size={16} style={{ opacity: isDisabled ? 0.2 : 0.6 }} />
                </button>
              );
            })}
            
            {analysisData && (
              <button 
                onClick={resetAnalysis}
                className="btn btn-secondary" 
                style={{ fontSize: '0.85rem', width: '100%', marginTop: '0.5rem' }}
              >
                Reset Analysis
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main style={{ flex: 1, position: 'relative' }}>
        
        {/* API Error Notification */}
        {apiError && (
          <div 
            className="no-print"
            style={{
              maxWidth: '800px',
              margin: '2rem auto 0 auto',
              padding: '1rem 1.5rem',
              display: 'flex',
              alignItems: 'start',
              gap: '0.75rem',
              background: 'var(--error-light)',
              color: 'var(--error-color)',
              border: '1px solid var(--error-border)',
              borderRadius: '4px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <AlertCircle size={18} style={{ marginTop: '2px', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <strong style={{ fontSize: '0.9rem', display: 'block', marginBottom: '0.25rem' }}>Connection Failed</strong>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>{apiError}</p>
            </div>
            <button
              onClick={() => setApiError(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--error-color)',
                fontSize: '0.75rem',
                fontWeight: '600',
                textDecoration: 'underline'
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Page Switcher */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {currentPage === 'home' && (
              <LandingPage onStartAnalysis={() => navigateTo('analyze')} />
            )}

            {currentPage === 'analyze' && (
              <WorkspacePage 
                onAnalyze={handleAnalyze} 
                initialResume={resumeFile}
                initialJobDescription={jobDescription}
              />
            )}

            {currentPage === 'loading' && (
              <LoadingPage />
            )}

            {currentPage === 'report' && (
              <ReportPage 
                analysis={analysisData}
                optimizedResume={optimizedResume}
                onNavigateToResume={() => navigateTo('resume')}
              />
            )}

            {currentPage === 'resume' && (
              <OptimizedResumePage 
                optimizedResume={optimizedResume} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer 
        className="no-print"
        style={{
          background: 'var(--bg-white)',
          borderTop: '1px solid var(--border-color)',
          padding: '2rem',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }} className="footer-layout">
          <span>© {new Date().getFullYear()} Benchmark. Evidence-based resume alignment workspace.</span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('home')}>How It Works</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('analyze')}>Analyze Workspace</span>
          </div>
        </div>
      </footer>

      {/* Injected Header Styles for Mobile Responsive Nav Menu */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav-toggle {
            display: block !important;
          }
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            text-align: center;
          }
          .hero-grid p {
            margin: 0 auto;
          }
          .hero-grid div {
            align-items: center;
            justify-content: center;
          }
          .process-step-row {
            grid-template-columns: 50px 1fr !important;
            gap: 1.5rem !important;
          }
          .step-svg-holder {
            display: none !important;
          }
          .trust-panel-grid {
            padding: 1.5rem !important;
          }
          .trust-examples-grid {
            grid-template-columns: 1fr !important;
          }
          .report-summary-layout {
            grid-template-columns: 1fr !important;
          }
          .req-row-header {
            grid-template-columns: 1fr 40px !important;
          }
          .req-row-header div:nth-child(2) {
            display: none !important;
          }
          .improvements-split {
            grid-template-columns: 1fr !important;
          }
          .what-changed-panel {
            grid-template-columns: 1fr !important;
          }
          .printable-resume {
            padding: 1.5rem !important;
          }
          .footer-layout {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
