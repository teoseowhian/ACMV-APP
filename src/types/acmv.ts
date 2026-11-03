export type NavigationTab = 
  | 'home'
  | 'lab'
  | 'worksheets'
  | 'pdf-library'
  | 'quiz';

export interface LessonSection {
  id: string;
  title: string;
  subtitle: string;
  readingTime: string;
  summary: string;
  contentMarkdown: string[];
  keyFormulas?: {
    name: string;
    formula: string;
    explanation: string;
    example: string;
  }[];
  interactiveType?: 'refrigeration-cycle' | 'chilled-water-loop' | 'ahu-airflow' | 'ventilation-rates' | 'green-mark-scale';
  standardsRef?: string[];
  practicalTips?: string[];
}

export interface LessonModule {
  id: string;
  moduleNumber: string;
  title: string;
  tagline: string;
  category: 'Thermodynamics' | 'Hydronics' | 'Air Systems' | 'Ventilation' | 'Energy & Controls';
  sections: LessonSection[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  topic: string;
  explanation: string;
  formulaUsed?: string;
  standardsNote?: string;
}

export interface TroubleshootingCase {
  id: string;
  caseNumber: string;
  title: string;
  facilityType: string;
  symptom: string;
  bmsReadings: {
    label: string;
    value: string;
    normal: string;
    status: 'normal' | 'warning' | 'critical';
  }[];
  probableCauses: {
    id: string;
    label: string;
    isCorrect: boolean;
    feedback: string;
    resolutionSteps: string;
  }[];
}

export interface GlossaryTerm {
  term: string;
  acronym?: string;
  definition: string;
  category: 'Air Distribution' | 'Refrigeration' | 'Hydronics' | 'Standards' | 'Ventilation';
  formula?: string;
}
