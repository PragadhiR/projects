import { Calendar, Hash, User, Users } from 'lucide-react';
import { useState } from 'react';
import type { Gender, PatientInfo } from '@/types';

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

function FieldError({ msg }: { msg: string }) {
  return <p className="mt-1.5 text-xs font-medium text-red-500">{msg}</p>;
}

function fieldClass(err?: string) {
  return [
    'w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink-800 placeholder:text-ink-400 transition',
    'focus:border-brand-500 focus:ring-2 focus:ring-brand-200',
    err ? 'border-red-300 bg-red-50/40' : 'border-ink-200 hover:border-ink-300',
  ].join(' ');
}

export function PatientScreen({
  initial,
  onNext,
  onBack,
}: {
  initial: PatientInfo;
  onNext: (info: PatientInfo) => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState<PatientInfo>(initial);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const today = new Date().toISOString().slice(0, 10);

  const errors: Partial<Record<keyof PatientInfo, string>> = {};
  if (!form.name.trim()) errors.name = 'Patient name is required';
  if (!form.age) errors.age = 'Age is required';
  else if (Number(form.age) < 0 || Number(form.age) > 120) errors.age = 'Enter a valid age (0–120)';
  if (!form.gender) errors.gender = 'Select a gender';
  if (!form.patientId.trim()) errors.patientId = 'Patient ID is required';
  if (!form.testDate) errors.testDate = 'Test date is required';

  const valid = Object.keys(errors).length === 0;

  const set = (key: keyof PatientInfo, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));
  const blur = (key: keyof PatientInfo) => setTouched((t) => ({ ...t, [key]: true }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, age: true, gender: true, patientId: true, testDate: true });
    if (valid) onNext(form);
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl px-5 pb-24 pt-8 sm:px-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">
          Patient Information
        </h1>
        <p className="mt-2 text-ink-600">
          Enter the demographic details for this audiometric evaluation. All fields are required.
        </p>
      </div>

      <div className="grid gap-5 animate-fade-in sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink-700">
            <User className="h-4 w-4 text-brand-600" /> Full Name
          </label>
          <input
            className={fieldClass(touched.name ? errors.name : '')}
            placeholder="e.g. Jordan Avery"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            onBlur={() => blur('name')}
            aria-invalid={!!errors.name}
          />
          {touched.name && errors.name && <FieldError msg={errors.name} />}
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink-700">
            <Hash className="h-4 w-4 text-brand-600" /> Age (years)
          </label>
          <input
            type="number"
            min={0}
            max={120}
            className={fieldClass(touched.age ? errors.age : '')}
            placeholder="e.g. 47"
            value={form.age}
            onChange={(e) => set('age', e.target.value)}
            onBlur={() => blur('age')}
            aria-invalid={!!errors.age}
          />
          {touched.age && errors.age && <FieldError msg={errors.age} />}
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink-700">
            <Users className="h-4 w-4 text-brand-600" /> Gender
          </label>
          <div className="grid grid-cols-3 gap-2">
            {GENDERS.map((g) => {
              const active = form.gender === g.value;
              return (
                <button
                  type="button"
                  key={g.value}
                  onClick={() => {
                    set('gender', g.value);
                    blur('gender');
                  }}
                  className={[
                    'rounded-xl border px-3 py-3 text-sm font-semibold transition',
                    active
                      ? 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-200'
                      : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300',
                  ].join(' ')}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
          {touched.gender && errors.gender && <FieldError msg={errors.gender} />}
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink-700">
            <Hash className="h-4 w-4 text-brand-600" /> Patient ID
          </label>
          <input
            className={fieldClass(touched.patientId ? errors.patientId : '')}
            placeholder="e.g. PT-2026-0481"
            value={form.patientId}
            onChange={(e) => set('patientId', e.target.value)}
            onBlur={() => blur('patientId')}
            aria-invalid={!!errors.patientId}
          />
          {touched.patientId && errors.patientId && <FieldError msg={errors.patientId} />}
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink-700">
            <Calendar className="h-4 w-4 text-brand-600" /> Test Date
          </label>
          <input
            type="date"
            max={today}
            className={fieldClass(touched.testDate ? errors.testDate : '')}
            value={form.testDate}
            onChange={(e) => set('testDate', e.target.value)}
            onBlur={() => blur('testDate')}
            aria-invalid={!!errors.testDate}
          />
          {touched.testDate && errors.testDate && <FieldError msg={errors.testDate} />}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-ink-200 bg-white px-6 py-3 text-sm font-semibold text-ink-700 transition hover:border-ink-300"
        >
          Back
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-7 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-700 active:scale-[0.98]"
        >
          Continue to Audiometry
        </button>
      </div>
    </form>
  );
}
