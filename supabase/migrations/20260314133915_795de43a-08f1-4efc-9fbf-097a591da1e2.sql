
-- Fix WARN 1: Set search_path on generate_org_code
CREATE OR REPLACE FUNCTION public.generate_org_code()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Fix WARN 2: Replace overly permissive org insert policy
-- Organization inserts happen via the handle_new_user trigger (SECURITY DEFINER),
-- so we can restrict direct inserts. But since the trigger runs as definer,
-- we need to allow inserts for the signup flow.
-- The trigger uses SECURITY DEFINER so it bypasses RLS.
-- We can safely drop the permissive policy.
DROP POLICY IF EXISTS "Anyone can insert organizations" ON public.organizations;

-- Only admins can directly insert organizations (the trigger handles signup flow)
CREATE POLICY "Admins can insert organizations"
  ON public.organizations FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
