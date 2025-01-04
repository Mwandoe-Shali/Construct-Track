/*
  # Fix RLS policies for sites table

  1. Changes
    - Update manager policies to check for +manager@ in email instead of @manager.com
    - Update supervisor policies to use proper email format check
  
  2. Security
    - Maintains proper access control based on user roles
    - Uses correct email format checking for Gmail plus addressing
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Managers can do everything with sites" ON sites;
DROP POLICY IF EXISTS "Supervisors can view assigned sites" ON sites;
DROP POLICY IF EXISTS "Managers can do everything with materials" ON materials;
DROP POLICY IF EXISTS "Supervisors can manage materials for assigned sites" ON materials;

-- Create updated policies for sites
CREATE POLICY "Managers can do everything with sites"
  ON sites
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' LIKE '%+manager@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' LIKE '%+manager@gmail.com');

CREATE POLICY "Supervisors can view assigned sites"
  ON sites
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM site_supervisors
      WHERE site_id = sites.id
      AND user_id = auth.uid()
    )
    OR
    auth.jwt() ->> 'email' LIKE '%+supervisor@gmail.com'
  );

-- Create updated policies for materials
CREATE POLICY "Managers can do everything with materials"
  ON materials
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' LIKE '%+manager@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' LIKE '%+manager@gmail.com');

CREATE POLICY "Supervisors can manage materials for assigned sites"
  ON materials
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM site_supervisors
      WHERE site_id = materials.site_id
      AND user_id = auth.uid()
    )
    OR
    auth.jwt() ->> 'email' LIKE '%+supervisor@gmail.com'
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM site_supervisors
      WHERE site_id = materials.site_id
      AND user_id = auth.uid()
    )
    OR
    auth.jwt() ->> 'email' LIKE '%+supervisor@gmail.com'
  );