
-- Create standup_reports table for daily standup and EOD reports
CREATE TABLE public.standup_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  org_id UUID NOT NULL REFERENCES public.organizations(id),
  report_type TEXT NOT NULL DEFAULT 'standup', -- 'standup' or 'eod'
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  yesterday TEXT DEFAULT '',
  today TEXT DEFAULT '',
  blockers TEXT DEFAULT '',
  accomplishments TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, org_id, report_type, report_date)
);

-- Enable RLS
ALTER TABLE public.standup_reports ENABLE ROW LEVEL SECURITY;

-- Users can view reports in their org
CREATE POLICY "Users can view reports in their org"
ON public.standup_reports FOR SELECT TO authenticated
USING (org_id IN (SELECT p.org_id FROM profiles p WHERE p.user_id = auth.uid()));

-- Users can insert their own reports
CREATE POLICY "Users can insert own reports"
ON public.standup_reports FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND org_id IN (SELECT p.org_id FROM profiles p WHERE p.user_id = auth.uid()));

-- Users can update their own reports
CREATE POLICY "Users can update own reports"
ON public.standup_reports FOR UPDATE TO authenticated
USING (user_id = auth.uid());

-- Add updated_at trigger
CREATE TRIGGER update_standup_reports_updated_at
  BEFORE UPDATE ON public.standup_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for standup_reports
ALTER PUBLICATION supabase_realtime ADD TABLE public.standup_reports;
