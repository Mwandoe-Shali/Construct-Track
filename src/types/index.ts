export interface Site {
  id: string;
  name: string;
  location: string;
  building_type: string;
  size: number;
  created_at: string;
  updated_at: string;
}

export interface Material {
  id: string;
  site_id: string;
  name: string;
  quantity: number;
  unit: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'manager' | 'supervisor';
  site_id?: string;
}