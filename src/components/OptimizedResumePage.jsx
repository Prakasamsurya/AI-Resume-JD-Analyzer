import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Printer, Copy, Download, Sparkles, Check, Info, FileEdit, AlertCircle } from 'lucide-react';

const safeStringify = (value) => {
  if (value == null) return '';
  if (Array.isArray(value)) {
    return value
      .map((item) => safeStringify(item))
      .filter(Boolean)
      .join(', ');
  }
  if (typeof value === 'object') {
    if (typeof value.label === 'string' && value.label) return value.label;
    if (typeof value.name === 'string' && value.name) return value.name;
    if (typeof value.title === 'string' && value.title) return value.title;
    if (typeof value.description === 'string' && value.description) return value.description;
    return Object.values(value)
      .map((item) => safeStringify(item))
      .filter(Boolean)
      .join(', ');
  }
  return String(value).trim();
};

const normalizeArray = (value) => Array.isArray(value) ? value : value ? [value] : [];

const displayValue = (value, fallback = 'Not available') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value.trim() || fallback;
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) {
    const safeItems = value.map((item) => displayValue(item, '')).filter(Boolean);
    return safeItems.join(', ') || fallback;
  }
  if (typeof value === 'object') {
    const resolved = Object.values(value)
      .map((item) => displayValue(item, ''))
      .filter(Boolean)
      .join(', ');
    return resolved || fallback;
  }
  return String(value) || fallback;
};

const flattenSkillEntries = (skills) => {
  if (!skills) return [];

  if (Array.isArray(skills)) {
    return skills.map((skill, index) => {
      if (typeof skill === 'string') {
        return { category: `Skill ${index + 1}`, value: skill };
      }
      if (skill && typeof skill === 'object') {
        const category = skill.category || skill.name || skill.label || skill.title || `Skill ${index + 1}`;
        const value = skill.skills || skill.items || skill.values || skill.value || skill.detail || skill.description || skill.summary || '';
        return {
          category,
          value: Array.isArray(value) ? value.map((entry) => safeStringify(entry)).filter(Boolean).join(', ') : safeStringify(value)
        };
      }
      return { category: `Skill ${index + 1}`, value: safeStringify(skill) };
    }).filter(entry => entry.value);
  }

  if (typeof skills === 'object') {
    return Object.entries(skills).map(([category, value]) => ({
      category,
      value: Array.isArray(value) ? value.map((entry) => safeStringify(entry)).filter(Boolean).join(', ') : safeStringify(value)
    })).filter(entry => entry.value);
  }

  return [{ category: 'Technical Skills', value: safeStringify(skills) }].filter(entry => entry.value);
};

export default function OptimizedResumePage({ optimizedResume }) {
  const [viewMode, setViewMode] = useState('improved'); // 'original' | 'improved'
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!optimizedResume) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No optimized resume data is available yet. Run a new analysis to generate the resume document.
      </div>
    );
  }

  const {
    candidate_name = '',
    professional_summary = '',
    technical_skills = [],
    experience = [],
    projects = [],
    education = [],
    certifications = [],
    achievements = [],
    soft_skills = [],
    changes_made = [],
    content_not_added = []
  } = optimizedResume;

  const technicalSkillEntries = flattenSkillEntries(technical_skills);
  const normalizedExperience = normalizeArray(experience);
  const normalizedProjects = normalizeArray(projects);
  const normalizedEducation = normalizeArray(education);
  const normalizedCertifications = normalizeArray(certifications);
  const normalizedAchievements = normalizeArray(achievements);
  const normalizedSoftSkills = normalizeArray(soft_skills);

  // Format resume for copying (Plaintext Markdown)
  const getResumeMarkdown = () => {
    let md = `# ${candidate_name || 'Candidate'}\n\n`;
    
    if (professional_summary) {
      md += `## Professional Summary\n${professional_summary}\n\n`;
    }
    
    if (technicalSkillEntries.length > 0) {
      md += `## Technical Skills\n`;
      technicalSkillEntries.forEach(({ category, value }) => {
        md += `- **${category}**: ${value}\n`;
      });
      md += `\n`;
    }
    
    if (normalizedExperience.length > 0) {
      md += `## Professional Experience\n`;
      normalizedExperience.forEach(exp => {
        const title = exp.title || exp.role || exp.position || 'Role';
        const company = exp.company || exp.employer || exp.organization || '';
        const location = exp.location || exp.city || exp.place || '';
        const dates = exp.dates || exp.duration || exp.period || exp.date_range || '';
        const bullets = Array.isArray(exp.bullets) ? exp.bullets : Array.isArray(exp.highlights) ? exp.highlights : Array.isArray(exp.responsibilities) ? exp.responsibilities : [];

        md += `### ${title}${company ? ` | ${company}` : ''}${location ? ` (${location})` : ''}\n`;
        if (dates) md += `*${dates}*\n`;
        bullets.forEach(b => {
          md += `- ${safeStringify(b)}\n`;
        });
        md += `\n`;
      });
    }

    if (normalizedProjects.length > 0) {
      md += `## Selected Projects\n`;
      normalizedProjects.forEach(p => {
        const name = p.title || p.name || p.project || 'Project';
        const description = p.description || p.summary || p.details || safeStringify(p);
        const technologies = p.technologies || p.tech_stack || p.stack || p.tools || '';
        const techStr = Array.isArray(technologies) ? technologies.map((item) => safeStringify(item)).filter(Boolean).join(', ') : safeStringify(technologies);
        md += `### ${name}\n`;
        md += `${description}\n`;
        if (techStr) {
          md += `*Technologies: ${techStr}*\n`;
        }
        md += `\n`;
      });
    }

    if (normalizedEducation.length > 0) {
      md += `## Education\n`;
      normalizedEducation.forEach(edu => {
        if (typeof edu === 'object' && edu !== null) {
          const degree = edu.degree || edu.program || '';
          const major = edu.major || edu.field || '';
          const school = edu.school || edu.institution || '';
          const date = edu.graduation_date || edu.graduationDate || edu.dates || '';
          md += `- **${[degree, major].filter(Boolean).join(' ')}**, ${school}${date ? ` (${date})` : ''}\n`;
        } else {
          md += `- ${safeStringify(edu)}\n`;
        }
      });
      md += `\n`;
    }

    if (normalizedCertifications.length > 0) {
      md += `## Certifications\n`;
      normalizedCertifications.forEach(c => md += `- ${safeStringify(c)}\n`);
      md += `\n`;
    }

    if (normalizedAchievements.length > 0) {
      md += `## Achievements\n`;
      normalizedAchievements.forEach(a => md += `- ${safeStringify(a)}\n`);
      md += `\n`;
    }

    if (normalizedSoftSkills.length > 0) {
      md += `## Professional Skills & Attributes\n`;
      md += normalizedSoftSkills.map((item) => safeStringify(item)).filter(Boolean).join(' • ') + '\n';
    }

    return md;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getResumeMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const fileName = (candidate_name || 'candidate').replace(/\s+/g, '_') || 'candidate';
    const element = document.createElement("a");
    const file = new Blob([getResumeMarkdown()], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${fileName}_optimized_resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to determine if a skill category has updates (used for highlights)
  const isSkillCategoryModified = (category) => {
    if (viewMode !== 'improved') return false;
    return changes_made.some(change => 
      change.toLowerCase().includes(category.toLowerCase())
    );
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' }}>
      
      {/* Page Header and Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }} className="no-print">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-0.01em', marginBottom: '0.25rem' }}>
            Optimized Credentials
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Review structured resume output optimized for the target requirements.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleCopy}>
            {copied ? <Check size={16} style={{ color: 'var(--success-color)' }} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy Text'}
          </button>
          
          <button className="btn btn-secondary" onClick={handleDownload}>
            {downloaded ? <Check size={16} style={{ color: 'var(--success-color)' }} /> : <Download size={16} />}
            {downloaded ? 'Downloaded' : 'Download .txt'}
          </button>
          
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Print Resume
          </button>
        </div>
      </div>

      {/* Selector: Original vs Improved */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-white)',
        border: '1px solid var(--border-color)',
        borderRadius: '4px',
        padding: '0.75rem 1.5rem',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem'
      }} className="original-toggle-controls no-print">
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setViewMode('original')}
            style={{
              padding: '0.4rem 1rem',
              background: viewMode === 'original' ? 'var(--accent-color)' : 'transparent',
              color: viewMode === 'original' ? 'var(--bg-white)' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '4px',
              fontWeight: '600',
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            Original Copy
          </button>
          <button
            onClick={() => setViewMode('improved')}
            style={{
              padding: '0.4rem 1.25rem',
              background: viewMode === 'improved' ? 'var(--accent-color)' : 'transparent',
              color: viewMode === 'improved' ? 'var(--bg-white)' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '4px',
              fontWeight: '600',
              fontSize: '0.825rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Sparkles size={13} /> Optimized Version
          </button>
        </div>

        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Info size={14} /> 
          {viewMode === 'improved' 
            ? 'Highlighting sections optimized with actual evidence.' 
            : 'Viewing resume layout before alignment optimization.'}
        </span>
      </div>

      {/* Main Resume Paper Visual */}
      <div 
        className="printable-resume"
        style={{
          background: 'var(--bg-white)',
          border: '1px solid var(--border-color)',
          borderRadius: '4px',
          padding: '4rem',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '3rem',
          fontSize: '0.95rem',
          color: '#111827',
          lineHeight: '1.6'
        }}
      >
        {/* Name Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '700', letterSpacing: '-0.03em', color: '#111827' }}>
            {displayValue(candidate_name, 'Professional Candidate')}
          </h2>
          <div style={{ width: '60px', height: '2px', background: 'var(--accent-color)', margin: '1rem auto 0 auto' }} />
        </div>

        {/* Summary */}
        {professional_summary && (
          <div className="resume-section" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
              Professional Summary
            </h3>
            <p style={{
              background: viewMode === 'improved' ? 'var(--success-light)' : 'transparent',
              padding: viewMode === 'improved' ? '0.5rem' : '0',
              borderRadius: '2px',
              borderLeft: viewMode === 'improved' ? '2px solid var(--success-border)' : 'none',
              transition: 'var(--transition-smooth)'
            }}>
              {professional_summary}
            </p>
          </div>
        )}

        {/* Technical Skills */}
        {technicalSkillEntries.length > 0 && (
          <div className="resume-section" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
              Technical Skills
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
              {technicalSkillEntries.map(({ category, value }, index) => {
                const isModified = isSkillCategoryModified(category);
                return (
                  <div 
                    key={`${category}-${index}`} 
                    style={{
                      background: isModified ? 'var(--success-light)' : 'transparent',
                      padding: isModified ? '0.25rem 0.5rem' : '0',
                      borderRadius: '2px',
                      borderLeft: isModified ? '2px solid var(--success-border)' : 'none',
                      fontSize: '0.925rem'
                    }}
                  >
                    <strong>{category}:</strong> {value}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {normalizedExperience.length > 0 && (
          <div className="resume-section" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
              Professional Experience
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {normalizedExperience.map((exp, index) => {
                const roleTitle = exp.title || exp.role || exp.position || 'Role';
                const companyName = exp.company || exp.employer || exp.organization || '';
                const dateRange = exp.dates || exp.duration || exp.period || exp.date_range || '';
                const location = exp.location || exp.city || exp.place || '';
                const bullets = Array.isArray(exp.bullets) ? exp.bullets : Array.isArray(exp.highlights) ? exp.highlights : Array.isArray(exp.responsibilities) ? exp.responsibilities : [];

                return (
                  <div key={`${roleTitle}-${index}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', fontWeight: '600' }}>
                      <span>{roleTitle}{companyName ? <span style={{ fontWeight: '400', color: 'var(--text-muted)' }}> at </span> : null}{companyName}</span>
                      <span style={{ fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{dateRange}</span>
                    </div>
                    {location && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '0.35rem' }}>
                        {location}
                      </div>
                    )}
                    {bullets.length > 0 && (
                      <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {bullets.map((bullet, bIndex) => {
                          const bulletText = safeStringify(bullet);
                          const isModified = viewMode === 'improved' && changes_made.some(c => c.toLowerCase().includes(bulletText.slice(0, 20).toLowerCase()));
                          
                          return (
                            <li 
                              key={`${bulletText}-${bIndex}`} 
                              style={{
                                background: isModified ? 'var(--success-light)' : 'transparent',
                                padding: isModified ? '0.15rem 0.35rem' : '0',
                                borderRadius: '2px',
                                borderLeft: isModified ? '2px solid var(--success-border)' : 'none',
                                fontSize: '0.9rem',
                                color: 'var(--text-secondary)'
                              }}
                            >
                              {bulletText}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Projects */}
        {normalizedProjects.length > 0 && (
          <div className="resume-section" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
              Key Projects
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {normalizedProjects.map((proj, index) => {
                const projectName = proj.title || proj.name || proj.project || 'Project';
                const description = proj.description || proj.summary || proj.details || safeStringify(proj);
                const technologies = proj.technologies || proj.tech_stack || proj.stack || proj.tools || '';
                const techString = Array.isArray(technologies) ? technologies.map((item) => safeStringify(item)).filter(Boolean).join(', ') : safeStringify(technologies);
                return (
                  <div key={`${projectName}-${index}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ fontWeight: '600' }}>{projectName}</div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{description}</p>
                    {techString && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        <strong>Technologies:</strong> {techString}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Education */}
        {normalizedEducation.length > 0 && (
          <div className="resume-section" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
              Education
            </h3>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {normalizedEducation.map((edu, index) => (
                <li key={`edu-${index}`}>
                  {typeof edu === 'object' && edu !== null ? (
                    <span>
                      <strong>{edu.degree || ''} {edu.major || ''}</strong> - {edu.school || edu.institution || ''}{edu.graduation_date || edu.graduationDate || edu.dates ? ` (${edu.graduation_date || edu.graduationDate || edu.dates})` : ''}
                    </span>
                  ) : (
                    <span>{safeStringify(edu)}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Certifications */}
        {normalizedCertifications.length > 0 && (
          <div className="resume-section" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
              Certifications
            </h3>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {normalizedCertifications.map((cert, index) => (
                <li key={`cert-${index}`}>
                  {safeStringify(cert)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Achievements */}
        {normalizedAchievements.length > 0 && (
          <div className="resume-section" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
              Achievements & Honors
            </h3>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {normalizedAchievements.map((ach, index) => (
                <li key={`ach-${index}`}>{safeStringify(ach)}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Soft Skills */}
        {normalizedSoftSkills.length > 0 && (
          <div className="resume-section">
            <h3 style={{ fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.25rem' }}>
              Professional Attributes
            </h3>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {normalizedSoftSkills.map((item) => safeStringify(item)).filter(Boolean).join(' • ')}
            </div>
          </div>
        )}

      </div>


    </div>
  );
}
