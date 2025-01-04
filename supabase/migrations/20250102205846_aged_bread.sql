-- Enable admin functions for managing users
CREATE POLICY "Enable admin functions for managers"
  ON profiles
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' LIKE '%+manager@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' LIKE '%+manager@gmail.com');

-- Grant necessary permissions
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow managers to manage profiles
CREATE POLICY "Managers can manage profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' LIKE '%+manager@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' LIKE '%+manager@gmail.com');