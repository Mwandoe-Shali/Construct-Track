/*
  # Rebuild Schema and Policies for Construction Site Inventory Management
  
  1. Enable RLS on all tables
  2. Create policies for:
     - Sites access (Manager full access, Supervisor view assigned)
     - Materials management (Both roles can manage materials for their sites)
     - Site supervisors management (Manager assigns supervisors)
*/

-- First, enable RLS on all tables
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_supervisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Clear existing policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.tablename;
    END LOOP;
END $$;

-- Sites Policies
-- 1. Managers can do everything with sites
CREATE POLICY "managers_full_access_sites"
ON sites
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' LIKE '%+manager@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' LIKE '%+manager@gmail.com');

-- 2. Supervisors can view their assigned sites
CREATE POLICY "supervisors_view_assigned_sites"
ON sites
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM site_supervisors
    WHERE site_supervisors.site_id = sites.id
    AND site_supervisors.user_id = auth.uid()
  )
);

-- Materials Policies
-- 1. Managers can manage materials for all sites
CREATE POLICY "managers_manage_materials"
ON materials
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' LIKE '%+manager@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' LIKE '%+manager@gmail.com');

-- 2. Supervisors can manage materials for their assigned sites
CREATE POLICY "supervisors_manage_materials"
ON materials
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM site_supervisors
    WHERE site_supervisors.site_id = materials.site_id
    AND site_supervisors.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM site_supervisors
    WHERE site_supervisors.site_id = materials.site_id
    AND site_supervisors.user_id = auth.uid()
  )
);

-- Site Supervisors Policies
-- 1. Managers can manage site supervisors assignments
CREATE POLICY "managers_manage_site_supervisors"
ON site_supervisors
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' LIKE '%+manager@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' LIKE '%+manager@gmail.com');

-- 2. Supervisors can view their assignments
CREATE POLICY "supervisors_view_assignments"
ON site_supervisors
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Profiles Policies
-- 1. Everyone can view all profiles (needed for displaying user information)
CREATE POLICY "view_all_profiles"
ON profiles
FOR SELECT
TO authenticated
USING (true);

-- 2. Users can update their own profile
CREATE POLICY "update_own_profile"
ON profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- 3. Managers can manage all profiles
CREATE POLICY "managers_manage_profiles"
ON profiles
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' LIKE '%+manager@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' LIKE '%+manager@gmail.com'); 