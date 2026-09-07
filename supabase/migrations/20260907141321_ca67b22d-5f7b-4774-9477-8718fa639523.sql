ALTER TABLE public.projets ADD COLUMN IF NOT EXISTS qr_secret_key text NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex');

CREATE TABLE public.qr_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projets(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_qr_sessions_token ON public.qr_sessions(token);
GRANT ALL ON public.qr_sessions TO service_role;
ALTER TABLE public.qr_sessions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.attendances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES public.projets(id) ON DELETE CASCADE,
  timestamp timestamptz NOT NULL DEFAULT now(),
  type text NOT NULL CHECK (type IN ('check_in','check_out')),
  scanned_latitude double precision,
  scanned_longitude double precision,
  distance_meters numeric,
  device_fingerprint text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_attendances_employee ON public.attendances(employee_id, timestamp DESC);
CREATE INDEX idx_attendances_project ON public.attendances(project_id, timestamp DESC);
GRANT SELECT ON public.attendances TO authenticated;
GRANT ALL ON public.attendances TO service_role;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Employees read own attendances" ON public.attendances FOR SELECT TO authenticated USING (auth.uid() = employee_id);
CREATE POLICY "Staff read all attendances" ON public.attendances FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE TRIGGER trg_attendances_updated BEFORE UPDATE ON public.attendances FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.user_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_fingerprint text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id),
  UNIQUE (device_fingerprint)
);
GRANT SELECT ON public.user_devices TO authenticated;
GRANT ALL ON public.user_devices TO service_role;
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own device" ON public.user_devices FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Staff read all devices" ON public.user_devices FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE TRIGGER trg_user_devices_updated BEFORE UPDATE ON public.user_devices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();