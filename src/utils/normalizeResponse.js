export function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  if (typeof value === 'object') return [value];
  return [value];
}

export function normalizeText(value) {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) {
    return value.map(normalizeText).filter(Boolean).join(', ');
  }
  if (typeof value === 'object') {
    if (typeof value.label === 'string' && value.label.trim()) return value.label.trim();
    if (typeof value.title === 'string' && value.title.trim()) return value.title.trim();
    if (typeof value.name === 'string' && value.name.trim()) return value.name.trim();
    if (typeof value.requirement === 'string' && value.requirement.trim()) return value.requirement.trim();
    if (typeof value.description === 'string' && value.description.trim()) return value.description.trim();
    return Object.values(value)
      .map(normalizeText)
      .filter(Boolean)
      .join(', ');
  }
  return String(value).trim();
}

export function normalizeStatusValue(value) {
  const raw = String(value ?? '').trim().toUpperCase();
  if (!raw) return 'MISSING';
  if (raw.includes('STRONG')) return 'STRONG';
  if (raw.includes('WEAK')) return 'WEAK';
  if (raw.includes('NOT') || raw.includes('MISSING') || raw.includes('DEMONSTRATED') || raw.includes('GAP') || raw.includes('UNMET')) return 'MISSING';
  return 'MISSING';
}

export function normalizeRequirementItem(item) {
  if (typeof item === 'string') {
    return {
      requirement: item,
      status: 'MISSING',
      resume_evidence: item
    };
  }

  const record = item && typeof item === 'object' ? item : {};
  const requirement = normalizeText(
    record.requirement ?? record.title ?? record.name ?? record.label ?? record.skill ?? record.criteria ?? record.summary ?? record.description ?? ''
  );
  const resumeEvidence = normalizeText(
    record.resume_evidence ?? record.evidence ?? record.details ?? record.notes ?? record.reason ?? record.justification ?? record.summary ?? record.description ?? ''
  );
  const status = normalizeStatusValue(record.status ?? record.match_status ?? record.matchStatus ?? record.level ?? record.result ?? record.state ?? '');

  return {
    requirement: requirement || 'Requirement',
    status,
    resume_evidence: resumeEvidence || 'No evidence provided in the current analysis payload.'
  };
}

export function normalizeGenericItem(item) {
  if (typeof item === 'string' || typeof item === 'number') {
    return item;
  }
  if (item && typeof item === 'object') {
    return {
      ...item
    };
  }
  return item;
}

export function normalizeQuestionItem(item) {
  if (typeof item === 'string' || typeof item === 'number') {
    return { question: String(item), description: '' };
  }
  if (item && typeof item === 'object') {
    return {
      question: normalizeText(item.question ?? item.title ?? item.prompt ?? item.label ?? item.name ?? item.requirement ?? ''),
      description: normalizeText(item.description ?? item.desc ?? item.summary ?? item.details ?? item.reason ?? '')
    };
  }
  return { question: '', description: '' };
}

export function normalizeActionItem(item) {
  if (typeof item === 'string' || typeof item === 'number') {
    return { title: String(item), description: '' };
  }
  if (item && typeof item === 'object') {
    return {
      title: normalizeText(item.title ?? item.name ?? item.step ?? item.label ?? item.requirement ?? ''),
      description: normalizeText(item.description ?? item.desc ?? item.summary ?? item.details ?? item.note ?? '')
    };
  }
  return { title: '', description: '' };
}

export function normalizeProjectItem(item) {
  if (typeof item === 'string' || typeof item === 'number') {
    return { title: String(item), details: '' };
  }
  if (item && typeof item === 'object') {
    return {
      title: normalizeText(item.title ?? item.name ?? item.project ?? item.label ?? item.requirement ?? ''),
      details: normalizeText(item.description ?? item.desc ?? item.summary ?? item.details ?? item.technologies ?? item.tech_stack ?? item.stack ?? '')
    };
  }
  return { title: '', details: '' };
}

export function normalizeAnalysisData(rawAnalysis = {}) {
  const requirementAnalysis = asArray(rawAnalysis.requirement_analysis).map(normalizeRequirementItem);

  return {
    recommendation: normalizeText(rawAnalysis.recommendation),
    why: normalizeText(rawAnalysis.why),
    requirement_analysis: requirementAnalysis,
    strong_matches: asArray(rawAnalysis.strong_matches),
    weak_matches: asArray(rawAnalysis.weak_matches),
    not_demonstrated: asArray(rawAnalysis.not_demonstrated),
    resume_improvements: asArray(rawAnalysis.resume_improvements).map(normalizeGenericItem),
    relevant_projects: asArray(rawAnalysis.relevant_projects).map(normalizeGenericItem),
    skills_to_prepare: asArray(rawAnalysis.skills_to_prepare).map(normalizeGenericItem),
    interview_questions: asArray(rawAnalysis.interview_questions).map(normalizeQuestionItem),
    action_plan: asArray(rawAnalysis.action_plan).map(normalizeActionItem)
  };
}

export function normalizeOptimizedResume(rawResume = {}) {
  return {
    candidate_name: normalizeText(rawResume.candidate_name ?? rawResume.candidateName ?? rawResume.name ?? ''),
    professional_summary: normalizeText(rawResume.professional_summary ?? rawResume.summary ?? rawResume.professionalSummary ?? ''),
    technical_skills: rawResume.technical_skills ?? [],
    experience: asArray(rawResume.experience),
    projects: asArray(rawResume.projects),
    education: asArray(rawResume.education),
    certifications: asArray(rawResume.certifications),
    achievements: asArray(rawResume.achievements),
    soft_skills: asArray(rawResume.soft_skills),
    changes_made: asArray(rawResume.changes_made),
    content_not_added: asArray(rawResume.content_not_added)
  };
}

export function normalizeResponseData(result = {}) {
  const analysis = normalizeAnalysisData(result.analysis || {});
  const optimizedResume = normalizeOptimizedResume(result.optimized_resume || {});

  return {
    analysis,
    optimizedResume,
    hasAnalysis: !!(result.analysis || result.optimized_resume)
  };
}

export function calculateRequirementScore(requirements = []) {
  if (!Array.isArray(requirements) || requirements.length === 0) {
    return null;
  }

  const strongCount = requirements.filter((req) => normalizeStatusValue(req?.status) === 'STRONG').length;
  const weakCount = requirements.filter((req) => normalizeStatusValue(req?.status) === 'WEAK').length;
  const total = requirements.length;

  if (total === 0) return null;

  const score = ((strongCount + weakCount * 0.5) / total) * 100;
  return Math.round(score);
}

export function buildFocusAreas(analysisData = {}) {
  const weakItems = asArray(analysisData.weak_matches);
  const missingItems = asArray(analysisData.not_demonstrated);
  return [...weakItems, ...missingItems].map((item) => normalizeText(item));
}
