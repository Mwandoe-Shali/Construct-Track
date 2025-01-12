import { supabase } from '../lib/supabase';

interface Supervisor {
  id: string;
  email: string;
  full_name?: string;
  role: string;
}

export const userService = {
  async getSupervisors(): Promise<Supervisor[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'supervisor');

    if (error) {
      console.error('Error fetching supervisors:', error);
      return [];
    }

    return data || [];
  }
};
