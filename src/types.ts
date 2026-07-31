export const FREQUENCIES = [250, 500, 1000, 2000, 4000, 8000] as const;
export type Frequency = (typeof FREQUENCIES)[number];

export type EarThresholds = Record<Frequency, number>;

export interface AudiogramData {
  left: EarThresholds;
  right: EarThresholds;
}

export type Gender = 'male' | 'female' | 'other';

export interface PatientInfo {
  name: string;
  age: string;
  gender: Gender | '';
  patientId: string;
  testDate: string;
}

export type Degree =
  | 'Normal'
  | 'Mild'
  | 'Moderate'
  | 'Moderately Severe'
  | 'Severe'
  | 'Profound';

export type AudiogramPattern =
  | 'Flat'
  | 'Sloping'
  | 'Rising'
  | 'Cookie Bite'
  | 'Reverse Cookie Bite'
  | 'Noise Notch'
  | 'High Frequency Loss'
  | 'Low Frequency Loss'
  | 'Normal Pattern';

export interface PatternAnalysis {
  pattern: AudiogramPattern;
  explanation: string;
}

export interface DisabilityEstimate {
  rightEar: number;
  leftEar: number;
  binaural: number;
}

export interface EarAnalysis {
  pta: number;
  degree: Degree;
  configuration: string;
  highFrequencyLoss: boolean;
  noiseNotch: boolean;
  worst: { freq: Frequency; db: number } | null;
}

export interface DiagnosisResult {
  right: EarAnalysis;
  left: EarAnalysis;
  overall: {
    classification: string;
    bilateral: boolean;
    asymmetry: boolean;
  };
  pattern: PatternAnalysis;
  disability: DisabilityEstimate;
  findings: string[];
  recommendations: string[];
  severityScore: number;
  confidence: number;
  generatedAt: string;
}

export type ScreenName = 'landing' | 'patient' | 'audiometry' | 'analysis' | 'report';

export interface ReportRecord {
  id: string;
  created_at: string;
  patient: PatientInfo;
  audiogram: AudiogramData;
  diagnosis: DiagnosisResult;
}
