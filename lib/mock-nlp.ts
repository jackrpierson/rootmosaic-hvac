/**
 * Mock NLP functions for extracting insights from job notes
 * These simulate more advanced text analysis without external dependencies
 */

/**
 * Extract key symptoms from job notes
 */
export function extractSymptoms(notes: string): string[] {
  const symptomKeywords = [
    'not cooling', 'not heating', 'no heat', 'no cool', 'loud noise', 'strange noise',
    'leaking', 'leak', 'short cycling', 'won\'t start', 'not starting', 'intermittent',
    'high bills', 'energy bills', 'poor airflow', 'low airflow', 'water damage',
    'strange smell', 'burning smell', 'overheating', 'freezing up', 'icing up'
  ];
  
  const found: string[] = [];
  const lowerNotes = notes.toLowerCase();
  
  symptomKeywords.forEach(keyword => {
    if (lowerNotes.includes(keyword)) {
      found.push(keyword);
    }
  });
  
  return Array.from(new Set(found)); // Remove duplicates
}

/**
 * Extract parts mentioned in job notes
 */
export function extractParts(notes: string): string[] {
  const partKeywords = [
    'compressor', 'evaporator', 'condenser', 'fan motor', 'blower motor',
    'capacitor', 'contactor', 'relay', 'thermostat', 'filter', 'coil',
    'refrigerant', 'belt', 'pulley', 'heat exchanger', 'txv', 'expansion valve',
    'drain line', 'ductwork', 'electrical', 'wiring', 'fuse', 'breaker'
  ];
  
  const found: string[] = [];
  const lowerNotes = notes.toLowerCase();
  
  partKeywords.forEach(keyword => {
    if (lowerNotes.includes(keyword)) {
      found.push(keyword);
    }
  });
  
  return Array.from(new Set(found));
}

/**
 * Extract repair actions from job notes
 */
export function extractActions(notes: string): string[] {
  const actionKeywords = [
    'replaced', 'repaired', 'cleaned', 'adjusted', 'calibrated', 'tested',
    'sealed', 'recharged', 'lubricated', 'tightened', 'installed', 'upgraded',
    'cleared', 'flushed', 'balanced', 'commissioned', 'diagnosed', 'inspected'
  ];
  
  const found: string[] = [];
  const lowerNotes = notes.toLowerCase();
  
  actionKeywords.forEach(keyword => {
    if (lowerNotes.includes(keyword)) {
      found.push(keyword);
    }
  });
  
  return Array.from(new Set(found));
}

/**
 * Determine if a job was emergency/urgent based on notes
 */
export function isEmergencyJob(notes: string): boolean {
  const emergencyKeywords = [
    'emergency', 'urgent', 'no heat', 'no cool', 'complete failure',
    'safety', 'dangerous', 'carbon monoxide', 'gas leak', 'electrical hazard'
  ];
  
  const lowerNotes = notes.toLowerCase();
  return emergencyKeywords.some(keyword => lowerNotes.includes(keyword));
}

/**
 * Extract probable root cause from callback notes
 */
export function extractRootCause(notes: string, callbackReason: string): string {
  const causes: Record<string, string[]> = {
    workmanship: [
      'improper installation', 'incorrect wiring', 'loose connections',
      'inadequate sealing', 'poor workmanship', 'installation error'
    ],
    part_failure: [
      'defective part', 'premature failure', 'manufacturing defect',
      'component failure', 'faulty component', 'bad part'
    ],
    misdiagnosis: [
      'missed diagnosis', 'incorrect diagnosis', 'symptom masking',
      'multiple issues', 'complex problem', 'underlying issue'
    ],
    documentation: [
      'missing documentation', 'incomplete notes', 'unclear instructions',
      'communication error', 'handoff issue', 'follow-up missed'
    ]
  };
  
  const lowerNotes = notes.toLowerCase();
  const possibleCauses = causes[callbackReason] || [];
  
  for (const cause of possibleCauses) {
    if (lowerNotes.includes(cause)) {
      return cause;
    }
  }
  
  return 'General ' + callbackReason.replace('_', ' ');
}

/**
 * Generate summary keywords from job notes
 */
export function generateSummaryKeywords(notes: string): string[] {
  const symptoms = extractSymptoms(notes);
  const parts = extractParts(notes);
  const actions = extractActions(notes);
  
  // Combine and limit to most relevant
  const allKeywords = [...symptoms, ...parts, ...actions];
  return allKeywords.slice(0, 5); // Top 5 most relevant
}

/**
 * Classify job complexity based on notes
 */
export function classifyJobComplexity(notes: string, laborHours: number): 'simple' | 'moderate' | 'complex' {
  const complexityIndicators = [
    'multiple issues', 'complex', 'difficult', 'challenging', 'extensive',
    'major repair', 'system replacement', 'custom', 'coordination required'
  ];
  
  const lowerNotes = notes.toLowerCase();
  const hasComplexIndicators = complexityIndicators.some(indicator => 
    lowerNotes.includes(indicator)
  );
  
  if (laborHours > 8 || hasComplexIndicators) return 'complex';
  if (laborHours > 4) return 'moderate';
  return 'simple';
}

/**
 * Extract equipment age indicators from notes
 */
export function extractAgeIndicators(notes: string): string[] {
  const ageKeywords = [
    'old', 'aging', 'outdated', 'worn', 'deteriorated', 'end of life',
    'vintage', 'legacy', 'obsolete', 'ancient', 'needs replacement'
  ];
  
  const found: string[] = [];
  const lowerNotes = notes.toLowerCase();
  
  ageKeywords.forEach(keyword => {
    if (lowerNotes.includes(keyword)) {
      found.push(keyword);
    }
  });
  
  return Array.from(new Set(found));
}

/**
 * Extract efficiency concerns from notes
 */
export function extractEfficiencyConcerns(notes: string): string[] {
  const efficiencyKeywords = [
    'high bills', 'energy bills', 'inefficient', 'poor performance',
    'low efficiency', 'wasteful', 'upgrade recommended', 'energy saving'
  ];
  
  const found: string[] = [];
  const lowerNotes = notes.toLowerCase();
  
  efficiencyKeywords.forEach(keyword => {
    if (lowerNotes.includes(keyword)) {
      found.push(keyword);
    }
  });
  
  return Array.from(new Set(found));
}