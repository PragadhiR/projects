import { useCallback, useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { StepIndicator } from '@/components/StepIndicator';
import { LandingScreen } from '@/screens/LandingScreen';
import { PatientScreen } from '@/screens/PatientScreen';
import { AudiometryScreen } from '@/screens/AudiometryScreen';
import { AnalysisScreen } from '@/screens/AnalysisScreen';
import { ReportScreen } from '@/screens/ReportScreen';
import { diagnose } from '@/lib/diagnosis';
import { supabase } from '@/lib/supabase';
import type {
  AudiogramData,
  DiagnosisResult,
  PatientInfo,
  ScreenName,
} from '@/types';

const EMPTY_PATIENT: PatientInfo = {
  name: '',
  age: '',
  gender: '',
  patientId: '',
  testDate: new Date().toISOString().slice(0, 10),
};

const EMPTY_AUDIOGRAM: AudiogramData = {
  left: { 250: 0, 500: 0, 1000: 0, 2000: 0, 4000: 0, 8000: 0 },
  right: { 250: 0, 500: 0, 1000: 0, 2000: 0, 4000: 0, 8000: 0 },
};

function App() {
  const [screen, setScreen] = useState<ScreenName>('landing');
  const [patient, setPatient] = useState<PatientInfo>(EMPTY_PATIENT);
  const [audiogram, setAudiogram] = useState<AudiogramData>(EMPTY_AUDIOGRAM);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [saving, setSaving] = useState(false);

  const goHome = useCallback(() => setScreen('landing'), []);

  const handleStart = useCallback(() => {
    setPatient(EMPTY_PATIENT);
    setAudiogram(EMPTY_AUDIOGRAM);
    setDiagnosis(null);
    setScreen('patient');
  }, []);

  const handlePatientNext = useCallback((info: PatientInfo) => {
    setPatient(info);
    setScreen('audiometry');
  }, []);

  const handleAudiometryNext = useCallback((data: AudiogramData) => {
    setAudiogram(data);
    setScreen('analysis');
  }, []);

  const handleAnalysisComplete = useCallback(async () => {
    const result = diagnose(audiogram);
    setDiagnosis(result);
    setScreen('report');

    setSaving(true);
    try {
      await supabase.from('audiometry_reports').insert({
        patient,
        audiogram,
        diagnosis: result,
      });
    } catch {
      // persistence is best-effort; the report still renders from in-memory state
    } finally {
      setSaving(false);
    }
  }, [audiogram, patient]);

  const handleRestart = useCallback(() => {
    setPatient(EMPTY_PATIENT);
    setAudiogram(EMPTY_AUDIOGRAM);
    setDiagnosis(null);
    setScreen('patient');
  }, []);

  return (
    <div className="min-h-screen bg-ink-50">
      <AppHeader onHome={goHome} />

      {screen !== 'landing' && (
        <div className="border-b border-ink-200/60 bg-white/60 py-5 backdrop-blur">
          <StepIndicator current={screen} />
        </div>
      )}

      <main className="py-8">
        {screen === 'landing' && <LandingScreen onStart={handleStart} />}
        {screen === 'patient' && (
          <PatientScreen initial={patient} onNext={handlePatientNext} onBack={goHome} />
        )}
        {screen === 'audiometry' && (
          <AudiometryScreen initial={audiogram} onNext={handleAudiometryNext} onBack={() => setScreen('patient')} />
        )}
        {screen === 'analysis' && <AnalysisScreen onComplete={handleAnalysisComplete} />}
        {screen === 'report' && diagnosis && (
          <ReportScreen
            patient={patient}
            audiogram={audiogram}
            diagnosis={diagnosis}
            onRestart={handleRestart}
            onHome={goHome}
          />
        )}
      </main>

      {saving && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-xs font-medium text-ink-600 shadow-card-lg">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
          Saving report to database…
        </div>
      )}
    </div>
  );
}

export default App;
