import { supabase } from '../lib/supabase';

export const userService = {
  async getSupervisors() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'supervisor');

    if (error) {
      console.error('Error fetching supervisors:', error);
      return [];
    }

    return data || [];
  },
};
