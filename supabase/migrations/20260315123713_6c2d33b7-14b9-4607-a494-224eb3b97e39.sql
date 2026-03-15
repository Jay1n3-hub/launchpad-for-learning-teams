
-- Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view projects in their org" ON public.projects
  FOR SELECT TO authenticated
  USING (org_id IN (SELECT p.org_id FROM profiles p WHERE p.user_id = auth.uid()));

CREATE POLICY "Admins and PMs can manage projects" ON public.projects
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pm'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'pm'::app_role));

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'todo',
  priority TEXT NOT NULL DEFAULT 'medium',
  assigned_to UUID DEFAULT NULL,
  created_by UUID NOT NULL,
  due_date DATE DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tasks in their org" ON public.tasks
  FOR SELECT TO authenticated
  USING (org_id IN (SELECT p.org_id FROM profiles p WHERE p.user_id = auth.uid()));

CREATE POLICY "Authenticated users can create tasks in their org" ON public.tasks
  FOR INSERT TO authenticated
  WITH CHECK (org_id IN (SELECT p.org_id FROM profiles p WHERE p.user_id = auth.uid()));

CREATE POLICY "Users can update tasks assigned to them or admins" ON public.tasks
  FOR UPDATE TO authenticated
  USING (
    assigned_to = auth.uid()
    OR created_by = auth.uid()
    OR has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'pm'::app_role)
    OR has_role(auth.uid(), 'scrum_master'::app_role)
  );

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Attendance logs table
CREATE TABLE public.attendance_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  clock_in TIMESTAMPTZ NOT NULL DEFAULT now(),
  clock_out TIMESTAMPTZ DEFAULT NULL,
  location TEXT DEFAULT 'office',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own attendance" ON public.attendance_logs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all attendance in org" ON public.attendance_logs
  FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    AND org_id IN (SELECT p.org_id FROM profiles p WHERE p.user_id = auth.uid())
  );

CREATE POLICY "Mentors can view attendance in org" ON public.attendance_logs
  FOR SELECT TO authenticated
  USING (
    (has_role(auth.uid(), 'mentor'::app_role) OR has_role(auth.uid(), 'pm'::app_role))
    AND org_id IN (SELECT p.org_id FROM profiles p WHERE p.user_id = auth.uid())
  );

CREATE POLICY "Users can clock in" ON public.attendance_logs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can clock out" ON public.attendance_logs
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND clock_out IS NULL);

-- Activity feed table
CREATE TABLE public.activity_feed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID DEFAULT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view activity in their org" ON public.activity_feed
  FOR SELECT TO authenticated
  USING (org_id IN (SELECT p.org_id FROM profiles p WHERE p.user_id = auth.uid()));

CREATE POLICY "System can insert activity" ON public.activity_feed
  FOR INSERT TO authenticated
  WITH CHECK (org_id IN (SELECT p.org_id FROM profiles p WHERE p.user_id = auth.uid()));
