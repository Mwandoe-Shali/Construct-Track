import { supabase } from '../lib/supabase';
import type { User } from '../types';

export const profileService = {
  async getCurrentProfile(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return data;
  },

  async getSupervisors(): Promise<User[]> {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'supervisor');

    return data || [];
  }
};