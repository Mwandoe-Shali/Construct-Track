import { supabase } from '../lib/supabase';

export const siteAssignmentService = {
  async assignSupervisor(siteId: string, supervisorId: string): Promise<boolean> {
    const { error } = await supabase
      .from('site_supervisors')
      .insert([{ site_id: siteId, user_id: supervisorId }]);

    return !error;
  },

  async getSiteSupervisor(siteId: string) {
    const { data } = await supabase
      .from('site_supervisors')
      .select('user_id')
      .eq('site_id', siteId)
      .single();

    if (!data) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user_id)
      .single();

    return profile;
  }
};