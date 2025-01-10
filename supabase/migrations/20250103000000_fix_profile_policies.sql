/*
  # Fix profiles table policies to prevent infinite recursion
  
  1. Changes
    - Drop conflicting policies
    - Create simplified policy structure
    - Maintain proper access control
*/

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable admin functions for managers" ON profiles;
DROP POLICY IF EXISTS "Managers can manage profiles" ON profiles;

-- Create new simplified policies
CREATE POLICY "Allow managers full access"
  ON profiles
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' LIKE '%+manager@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' LIKE '%+manager@gmail.com');

CREATE POLICY "Allow users to view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow users to update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id); 