import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp, Copy, Check,
  BookOpen, Calendar, Award, User, Sparkles, Filter
} from 'lucide-react';
import { calculateRequirementScore, normalizeAnalysisData, normalizeText, normalizeStatusValue } from '../utils/normalizeResponse';

export default function ReportPage({ analysis, optimizedResume, onNavigateToResume }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [reqFilter, setReqFilter] = useState('ALL');
  const [expandedReq, setExpandedReq] = useState({});
  const [preparedQuestions, setPreparedQuestions] = useState({});
  const [copiedQuestion, setCopiedQuestion] = useState(null);

  const normalizedAnalysis = normalizeAnalysisData(analysis || {});
  const requirementItems = Array.isArray(normalizedAnalysis.requirement_analysis)
    ? normalizedAnalysis.requirement_analysis
    : [];
  const focusAreas = [...asArray(normalizedAnalysis.weak_matches), ...asArray(normalizedAnalysis.not_demonstrated)].map((item) => {
    if (typeof item === 'string' || typeof item === 'number') return String(item);
    if (item && typeof item === 'object') {
      return {
        requirement: normalizeText(item.requirement ?? item.title ?? item.name ?? item.label ?? item.skill ?? ''),
        resume_evidence: normalizeText(item.resume_evidence ?? item.evidence ?? item.details ?? item.reason ?? item.summary ?? '')
      };
    }
    return '';
  });

  const improvementItems = asArray(normalizedAnalysis.resume_improvements);
  const interviewQuestions = asArray(normalizedAnalysis.interview_questions);
  const actionPlan = asArray(normalizedAnalysis.action_plan);
  const relevantProjects = asArray(normalizedAnalysis.relevant_projects);
  const candidateName = optimizedResume?.candidate_name || optimizedResume?.candidateName || 'Candidate';
  const recommendation = normalizeText(normalizedAnalysis.recommendation || '');
  const rationale = normalizeText(normalizedAnalysis.why || '');
  const matchScore = calculateRequirementScore(requirementItems);

  const filteredRequirements = requirementItems.filter((req) => {
    if (reqFilter === 'ALL') return true;
    return normalizeStatusValue(req.status) === reqFilter;
  });

  const toggleReq = (index) => {
    setExpandedReq((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const togglePrepared = (index) => {
    setPreparedQuestions((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const copyQuestion = (text, index) => {
    if (!navigator?.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopiedQuestion(index);
    setTimeout(() => setCopiedQuestion(null), 2000);
  };

  const recBadge = getRecommendationBadge(recommendation);

  const isAnalysisEmpty = !hasAnyContent(analysis);
  const isResumeEmpty = !optimizedResume || Object.values(optimizedResume).every((value) => {
    if (Array.isArray(value)) return value.length === 0;
    if (value && typeof value === 'object') return Object.keys(value).length === 0;
    return !value;
  });

  if (isAnalysisEmpty && isResumeEmpty) {
    return (
      <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 2rem', textAlign: 'center' }}>
        <div style={{
          background: 'var(--bg-white)',
          border: '1px solid var(--border-color)',
          borderRadius: '4px',
          padding: '4rem 2rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)'
          }}>
            <BookOpen size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              No Analysis Results Available
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', maxWidth: '460px', margin: '0 auto', lineHeight: '1.6' }}>
              No dynamic data was parsed from the comparison service. Please verify your resume upload format (PDF) and job description details, then run the analysis again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{
        background: 'var(--bg-white)',
        border: '1px solid var(--border-color)',
        borderRadius: '4px',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.25rem' }}>
              <User size={14} /> CANDIDATE PROFILE
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              {candidateName}
            </h1>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1rem',
            borderRadius: '4px',
            fontSize: '0.875rem',
            fontWeight: '600',
            ...recBadge.style
          }}>
            {recBadge.icon}
            {recBadge.label}
          </div>
        </div>

        <div style={{ width: '100%', height: '1px', background: 'var(--border-color)' }} />

        <div>
          <h3 style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Executive Alignment Rationale
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem' }}>
            {rationale || 'Analysis report compiled successfully. Explore the matching analysis tab to identify credentials and evidence structure.'}
          </p>
        </div>
      </div>

      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '2rem',
        gap: '1.5rem',
        overflowX: 'auto',
        paddingBottom: '2px'
      }} className="tabs-container no-print">
        {[
          { id: 'summary', label: 'Match Summary' },
          { id: 'requirements', label: 'Requirement Matrix' },
          { id: 'improvements', label: 'Resume Improvements' },
          { id: 'projects', label: 'Relevant Projects' },
          { id: 'interview', label: 'Interview Preparation' },
          { id: 'action', label: 'Action Plan' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 0',
              border: 'none',
              background: 'none',
              fontSize: '0.9rem',
              fontWeight: activeTab === tab.id ? '600' : '400',
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent-color)' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'var(--transition-smooth)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-panels">
        {activeTab === 'summary' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }} className="report-summary-layout">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                background: 'var(--bg-white)',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Core Alignment Signal</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    ...recBadge.style
                  }}>
                    {recBadge.icon}
                    {recBadge.label}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {typeof matchScore === 'number' ? `Match score: ${matchScore}%` : 'Score unavailable'}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  {rationale || 'Recommendations and supporting rationale are available in the current analysis narrative.'}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Recommendation</div>
                    <div style={{ fontSize: '1rem', fontWeight: '600' }}>{recommendation || 'Review Required'}</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Resume Improvements</div>
                    <div style={{ fontSize: '1rem', fontWeight: '600' }}>{improvementItems.length}</div>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Skills to Prepare</div>
                    <div style={{ fontSize: '1rem', fontWeight: '600' }}>{asArray(normalizedAnalysis.skills_to_prepare).length}</div>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-white)',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '2rem'
              }}>
                <div>
                  <h4 style={{ fontWeight: '600', fontSize: '0.975rem', marginBottom: '0.25rem' }}>Optimized Resume Version Available</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Live optimized resume content is rendered directly from the current backend payload.</p>
                </div>
                <button className="btn btn-primary" onClick={onNavigateToResume} style={{ whiteSpace: 'nowrap' }}>
                  View Resume <Sparkles size={16} />
                </button>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-white)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={18} /> Focus Areas
              </h3>

              {focusAreas.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                  {focusAreas.map((item, index) => {
                    const title = typeof item === 'string' ? item : item.requirement || 'Focus area';
                    const evidence = typeof item === 'string' ? '' : item.resume_evidence || '';

                    return (
                      <div key={`${title}-${index}`} style={{
                        display: 'flex',
                        alignItems: 'start',
                        gap: '0.75rem',
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)'
                      }}>
                        <div style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          color: 'var(--text-muted)',
                          padding: '2px 6px',
                          background: 'var(--bg-white)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '2px',
                          marginTop: '2px'
                        }}>
                          {index + 1 < 10 ? `0${index + 1}` : index + 1}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{title}</strong>
                          {evidence && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{evidence}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  No focus areas were returned in the current analysis payload.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'requirements' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              background: 'var(--bg-white)',
              padding: '1rem 1.5rem',
              borderRadius: '4px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                <Filter size={16} /> Filters:
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'ALL', label: 'All Requirements' },
                  { id: 'STRONG', label: 'Strong Matches' },
                  { id: 'WEAK', label: 'Weak Matches' },
                  { id: 'MISSING', label: 'Not Demonstrated' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setReqFilter(f.id)}
                    style={{
                      padding: '0.4rem 0.875rem',
                      border: '1px solid',
                      borderColor: reqFilter === f.id ? 'var(--accent-color)' : 'var(--border-color)',
                      background: reqFilter === f.id ? 'var(--accent-color)' : 'var(--bg-white)',
                      color: reqFilter === f.id ? 'var(--bg-white)' : 'var(--text-secondary)',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: '4px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              {filteredRequirements.length > 0 ? (
                filteredRequirements.map((req, index) => {
                  const isExpanded = !!expandedReq[index];
                  const statusBadge = getStatusBadge(req.status);

                  return (
                    <div key={`${req.requirement}-${index}`} style={{ borderBottom: index < filteredRequirements.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                      <div
                        onClick={() => toggleReq(index)}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 160px 40px',
                          alignItems: 'center',
                          padding: '1.25rem 1.5rem',
                          cursor: 'pointer',
                          backgroundColor: isExpanded ? 'var(--bg-secondary)' : 'transparent',
                          transition: 'var(--transition-smooth)'
                        }}
                        className="req-row-header"
                      >
                        <strong style={{ fontSize: '0.925rem', fontWeight: '600' }}>{req.requirement}</strong>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            padding: '2px 8px',
                            borderRadius: '2px',
                            ...statusBadge.style
                          }}>
                            {statusBadge.label}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'var(--text-muted)' }}>
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{
                              padding: '1.5rem',
                              backgroundColor: 'var(--bg-primary)',
                              borderTop: '1px solid var(--border-color)',
                              fontSize: '0.875rem',
                              lineHeight: '1.6',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '1rem'
                            }}>
                              <div>
                                <div style={{ fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                                  Target JD Requirement
                                </div>
                                <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{req.requirement}</div>
                              </div>

                              <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '1rem' }}>
                                <div style={{ fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                                  Resume Evidence
                                </div>
                                <div style={{
                                  padding: '1rem',
                                  background: 'var(--bg-white)',
                                  border: '1px solid var(--border-color)',
                                  borderRadius: '4px',
                                  color: req.resume_evidence ? 'var(--text-primary)' : 'var(--text-muted)',
                                  fontStyle: req.resume_evidence ? 'normal' : 'italic'
                                }}>
                                  {req.resume_evidence || 'No supporting evidence was included in the current analysis payload.'}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No requirement matrix was included in the current backend response.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'improvements' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {improvementItems.length > 0 ? (
                improvementItems.map((item, index) => {
                  const title = getStructuredTitle(item, `Improvement ${index + 1}`);
                  const description = getStructuredDescription(item, 'No improvement details were included in the current analysis payload.');

                  return (
                    <div key={`${title}-${index}`} style={{
                      background: 'var(--bg-white)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      padding: '2rem',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{title}</h4>
                      </div>
                      <div style={{
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)',
                        minHeight: '80px'
                      }}>
                        {description}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{
                  padding: '3rem 1.5rem',
                  textAlign: 'center',
                  background: 'var(--bg-white)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  color: 'var(--text-muted)'
                }}>
                  No resume improvements were returned in the current analysis payload.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'interview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {interviewQuestions.length > 0 ? (
                interviewQuestions.map((item, index) => {
                  const isPrepared = !!preparedQuestions[index];
                  const questionText = getStructuredTitle(item, `Question ${index + 1}`);
                  const description = getStructuredDescription(item, '');

                  return (
                    <div key={`${questionText}-${index}`} style={{
                      background: 'var(--bg-white)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      padding: '1.5rem 2rem',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      opacity: isPrepared ? 0.75 : 1
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                          <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-muted)' }}>{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <strong style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{questionText}</strong>
                            {description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{description}</p>}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                          <button
                            onClick={() => copyQuestion(questionText, index)}
                            style={{ background: 'none', border: '1px solid var(--border-color)', padding: '6px', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Copy question text"
                          >
                            {copiedQuestion === index ? <Check size={14} style={{ color: 'var(--success-color)' }} /> : <Copy size={14} />}
                          </button>

                          <button
                            onClick={() => togglePrepared(index)}
                            style={{ border: '1px solid', borderColor: isPrepared ? 'var(--success-border)' : 'var(--border-color)', background: isPrepared ? 'var(--success-light)' : 'var(--bg-white)', color: isPrepared ? 'var(--success-color)' : 'var(--text-secondary)', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            {isPrepared ? 'Prepared' : 'Mark Prepared'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: '3rem 1.5rem', textAlign: 'center', background: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-muted)' }}>
                  No interview questions were returned in the current analysis payload.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'action' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '2.5rem 3rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} /> Step-by-Step Preparation Roadmap
              </h3>

              {actionPlan.length > 0 ? (
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingLeft: '2.5rem' }}>
                  <div style={{ position: 'absolute', left: '11px', top: '8px', bottom: '8px', width: '2px', background: 'var(--border-color)' }} />

                  {actionPlan.map((item, index) => {
                    const title = getStructuredTitle(item, `Step ${index + 1}`);
                    const description = getStructuredDescription(item, '');

                    return (
                      <div key={`${title}-${index}`} style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '-37px', top: '4px', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-white)', border: '2px solid var(--accent-color)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700' }}>{index + 1}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{title}</strong>
                          {description && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5', maxWidth: '800px' }}>{description}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: '1rem 0', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No action plan items were returned in the current analysis payload.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'projects' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '2.5rem 3rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} /> Relevant Projects
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                These are the key projects matching the job requirements in the current backend response.
              </p>

              {relevantProjects.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                  {relevantProjects.map((item, index) => {
                    const title = getStructuredTitle(item, `Project ${index + 1}`);
                    const description = getStructuredDescription(item, '');

                    return (
                      <div key={`${title}-${index}`} style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', padding: '2px 6px', background: 'var(--bg-white)', border: '1px solid var(--border-color)', borderRadius: '2px', marginTop: '2px' }}>
                          {index + 1 < 10 ? `0${index + 1}` : index + 1}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <strong style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '600' }}>{title}</strong>
                          {description && <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{description}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.9rem' }}>
                  No relevant projects were returned in the current analysis payload.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );

  function getRecommendationBadge(rec) {
    switch (rec.toUpperCase()) {
      case 'APPLY':
        return {
          label: 'Recommended to Apply',
          style: { color: 'var(--success-color)', background: 'var(--success-light)', border: '1px solid var(--success-border)' },
          icon: <CheckCircle2 size={16} />
        };
      case 'APPLY_AFTER_CHANGES':
        return {
          label: 'Apply After Recommended Edits',
          style: { color: 'var(--warning-color)', background: 'var(--warning-light)', border: '1px solid var(--warning-border)' },
          icon: <AlertTriangle size={16} />
        };
      case 'NOT_RECOMMENDED':
        return {
          label: 'Not Recommended for this Role',
          style: { color: 'var(--error-color)', background: 'var(--error-light)', border: '1px solid var(--error-border)' },
          icon: <XCircle size={16} />
        };
      default:
        return {
          label: 'Review Required',
          style: { color: 'var(--accent-color)', background: 'var(--accent-light)', border: '1px solid var(--border-color-dark)' },
          icon: <AlertTriangle size={16} />
        };
    }
  }

  function getStatusBadge(status) {
    const normalizedStatus = normalizeStatusValue(status);
    if (normalizedStatus === 'STRONG') {
      return { label: 'Strong Match', style: { color: 'var(--success-color)', background: 'var(--success-light)', border: '1px solid var(--success-border)' } };
    }
    if (normalizedStatus === 'WEAK') {
      return { label: 'Weak Match', style: { color: 'var(--warning-color)', background: 'var(--warning-light)', border: '1px solid var(--warning-border)' } };
    }
    return { label: 'Not Demonstrated', style: { color: 'var(--error-color)', background: 'var(--error-light)', border: '1px solid var(--error-border)' } };
  }

  function getStructuredTitle(item, fallback) {
    if (typeof item === 'string' || typeof item === 'number') return String(item);
    if (!item || typeof item !== 'object') return fallback;
    return normalizeText(item.title ?? item.requirement ?? item.name ?? item.label ?? item.question ?? item.step ?? item.project ?? item.skill ?? fallback) || fallback;
  }

  function getStructuredDescription(item, fallback = '') {
    if (typeof item === 'string' || typeof item === 'number') return String(item);
    if (!item || typeof item !== 'object') return fallback;
    return normalizeText(item.description ?? item.desc ?? item.summary ?? item.details ?? item.evidence ?? item.resume_evidence ?? item.technologies ?? item.reason ?? item.note ?? '') || fallback;
  }
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
}

function hasAnyContent(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(hasAnyContent);
  if (typeof value === 'object') return Object.values(value).some(hasAnyContent);
  return !!value;
}
