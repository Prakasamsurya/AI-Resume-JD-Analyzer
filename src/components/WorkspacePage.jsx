import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Trash2, AlertCircle, FileUp, Sparkles, CheckCircle2 } from 'lucide-react';

export default function WorkspacePage({ onAnalyze, initialResume, initialJobDescription }) {
  const [resumeFile, setResumeFile] = useState(initialResume || null);
  const [jobDescription, setJobDescription] = useState(initialJobDescription || '');
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [jobDescriptionError, setJobDescriptionError] = useState(null);

  const fileInputRef = useRef(null);

  // File drag & drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file) => {
    if (!file) return;
    
    // PDF validation
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setFileError('Invalid file format. Please upload a PDF document.');
      setResumeFile(null);
      return;
    }

    // Size limit check (e.g., 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File too large. Maximum allowed size is 10MB.');
      setResumeFile(null);
      return;
    }

    setFileError(null);
    setResumeFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setResumeFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFileError(null);
    setJobDescriptionError(null);

    if (!resumeFile) {
      setFileError('Invalid PDF: please upload a valid PDF resume before submitting.');
      return;
    }

    if (!jobDescription.trim()) {
      setJobDescriptionError('Missing job description: paste the target role requirements before analyzing.');
      return;
    }

    if (jobDescription.trim().length < 50) {
      setJobDescriptionError('Missing JD: please provide a more complete job description with at least 50 characters.');
      return;
    }

    onAnalyze(resumeFile, jobDescription);
  };

  const isFormValid = resumeFile && jobDescription.trim().length > 50;

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '3rem 2rem'
    }}>
      {/* Title */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>
          Analysis Workspace
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Upload your credentials and provide the target requirements to benchmark your alignment.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem',
          alignItems: 'stretch'
        }}>
          {/* Left Panel: Resume Upload */}
          <div style={{
            background: 'var(--bg-white)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} /> Resume Upload
            </h2>

            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={!resumeFile ? triggerFileInput : undefined}
              style={{
                flex: 1,
                border: resumeFile ? '1px solid var(--border-color)' : dragActive ? '2px dashed var(--accent-color)' : '1px dashed var(--border-color-dark)',
                borderRadius: '4px',
                padding: '2.5rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                backgroundColor: dragActive ? 'var(--accent-light)' : 'var(--bg-secondary)',
                cursor: resumeFile ? 'default' : 'pointer',
                transition: 'var(--transition-smooth)',
                minHeight: '260px'
              }}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange} 
                style={{ display: 'none' }}
              />

              <AnimatePresence mode="wait">
                {!resumeFile ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'var(--bg-white)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <FileUp size={20} />
                    </div>
                    <div>
                      <p style={{ fontWeight: '500', fontSize: '0.95rem' }}>
                        Drag & drop your PDF resume here
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        or click to browse local files
                      </p>
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      padding: '2px 8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-white)',
                      borderRadius: '2px'
                    }}>
                      PDF format only (Max 10MB)
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="filled"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      background: 'var(--bg-white)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '4px',
                        background: 'var(--accent-light)',
                        color: 'var(--accent-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FileText size={20} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          color: 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {resumeFile.name}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {formatFileSize(resumeFile.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'var(--transition-smooth)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error-color)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                        title="Remove file"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--success-color)',
                      fontSize: '0.825rem',
                      fontWeight: '500',
                      background: 'var(--success-light)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '4px',
                      border: '1px solid var(--success-border)'
                    }}>
                      <CheckCircle2 size={16} /> Ready for alignment matching.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {fileError && (
              <div style={{
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'start',
                gap: '0.5rem',
                color: 'var(--error-color)',
                fontSize: '0.825rem',
                background: 'var(--error-light)',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid var(--error-border)'
              }}>
                <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{fileError}</span>
              </div>
            )}

            {jobDescriptionError && (
              <div style={{
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'start',
                gap: '0.5rem',
                color: 'var(--error-color)',
                fontSize: '0.825rem',
                background: 'var(--error-light)',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid var(--error-border)'
              }}>
                <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{jobDescriptionError}</span>
              </div>
            )}
          </div>

          {/* Right Panel: Job Description Editor */}
          <div style={{
            background: 'var(--bg-white)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} /> Job Description
              </h2>
              {jobDescription && (
                <button
                  type="button"
                  onClick={() => setJobDescription('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Clear text
                </button>
              )}
            </div>

            <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <textarea
                value={jobDescription}
                onChange={(e) => {
                  setJobDescription(e.target.value);
                  if (e.target.value.trim().length >= 50) {
                    setJobDescriptionError(null);
                  }
                }}
                placeholder="Paste the job description or requirements section here (minimum 50 characters)..."
                style={{
                  width: '100%',
                  flex: 1,
                  minHeight: '260px',
                  padding: '1rem',
                  border: '1px solid var(--border-color-dark)',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-family)',
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-secondary)',
                  resize: 'vertical',
                  outline: 'none',
                  lineHeight: '1.6',
                  transition: 'var(--transition-smooth)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color-dark)'}
              />

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '0.5rem'
              }}>
                <span>Comfortable reading width</span>
                <span>{jobDescription.length} characters</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action button panel */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '1rem',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.5rem',
          marginTop: '1rem'
        }}>
          {!isFormValid && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {!resumeFile && !jobDescription.trim() 
                ? 'Please upload a PDF resume and add a job description.' 
                : !resumeFile 
                ? 'Please upload a PDF resume.' 
                : jobDescription.trim().length <= 50 
                ? 'Job description must be at least 50 characters long.' 
                : ''}
            </span>
          )}
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isFormValid}
            style={{ fontSize: '1rem', padding: '0.875rem 2.5rem' }}
          >
            <Sparkles size={16} /> Analyze Resume
          </button>
        </div>
      </form>
    </div>
  );
}
