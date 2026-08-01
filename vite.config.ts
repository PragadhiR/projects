export const FREQUENCIES = [250, 500, 1000, 2000, 4000, 8000] as const;
export type Frequency = (typeof FREQUENCIES)[number];

export type EarThresholds = Record<Frequency, number>;

// Bone conduction is only clinically tested 250Hz-4000Hz (no 8kHz) since bone
// oscillators can't reliably drive the skull at higher frequencies.
export const BC_FREQUENCIES = [250, 500, 1000, 2000, 4000] as const;
export type BCFrequency = (typeof BC_FREQUENCIES)[number];

export type BCEarThresholds = Record<BCFrequency, number>;

export interface AudiogramData {
  left: EarThresholds;
  right: EarThresholds;
  boneLeft: BCEarThresholds;
  boneRight: BCEarThresholds;
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
