/*
  # Initial Schema Setup for Construction Inventory System

  1. Tables
    - sites: Stores construction site information
    - materials: Stores material inventory for each site
    - site_supervisors: Links supervisors to sites

  2. Security
    - RLS policies for both manager and supervisor access
    - Email-based role verification
*/

-- Create sites table
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  building_type TEXT NOT NULL,
  size NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create materials table
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create site_supervisors table
CREATE TABLE site_supervisors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(site_id, user_id)
);

-- Enable RLS
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_supervisors ENABLE ROW LEVEL SECURITY;

-- Create policies for sites
CREATE POLICY "Managers can do everything with sites"
  ON sites
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' LIKE '%@manager.com')
  WITH CHECK (auth.jwt() ->> 'email' LIKE '%@manager.com');

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
  );

-- Create policies for materials
CREATE POLICY "Managers can do everything with materials"
  ON materials
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' LIKE '%@manager.com')
  WITH CHECK (auth.jwt() ->> 'email' LIKE '%@manager.com');

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
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM site_supervisors
      WHERE site_id = materials.site_id
      AND user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_sites_updated_at
  BEFORE UPDATE ON sites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_updated_at
  BEFORE UPDATE ON materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();