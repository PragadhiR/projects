/*
# Create audiometry_reports table (single-tenant, no auth)

1. New Tables
- `audiometry_reports`
  - `id` (uuid, primary key, auto-generated)
  - `patient` (jsonb, not null) — patient demographics: name, age, gender, patientId, testDate
  - `audiogram` (jsonb, not null) — left/right ear thresholds for 250/500/1000/2000/4000/8000 Hz
  - `diagnosis` (jsonb, not null) — AI classification, per-ear analysis, findings, recommendations, scores
  - `created_at` (timestamptz, defaults to now())
2. Security
- Enable RLS on `audiometry_reports`.
- Allow anon + authenticated full CRUD because the app is intentionally single-tenant
  with no sign-in screen (USING (true) is appropriate here — data is shared/public).
3. Indexes
- Index on created_at for chronologically-ordered report listing.
4. Notes
- JSONB columns store the full structured report payload so the clinical report
  can be reconstructed entirely from one row (patient + audiogram + diagnosis).
- No user_id column or auth.users foreign key — there is no sign-in flow.
*/

CREATE TABLE IF NOT EXISTS audiometry_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient jsonb NOT NULL,
  audiogram jsonb NOT NULL,
  diagnosis jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audiometry_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_reports" ON audiometry_reports;
CREATE POLICY "anon_select_reports" ON audiometry_reports FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_reports" ON audiometry_reports;
CREATE POLICY "anon_insert_reports" ON audiometry_reports FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_reports" ON audiometry_reports;
CREATE POLICY "anon_update_reports" ON audiometry_reports FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_reports" ON audiometry_reports;
CREATE POLICY "anon_delete_reports" ON audiometry_reports FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS audiometry_reports_created_at_idx
  ON audiometry_reports (created_at DESC);
