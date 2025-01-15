import { supabase } from '../lib/supabase';

export const siteAssignmentService = {
  async checkAssignment(siteId: string, supervisorId: string) {
    return await supabase
      .from('site_supervisors')
      .select('*')
      .eq('site_id', siteId)
      .eq('user_id', supervisorId);
  },

  async assignSupervisor(siteId: string, supervisorId: string) {
    try {
      // First, check if the supervisor is already assigned to any site
      const { data: existingAssignments } = await supabase
        .from('site_supervisors')
        .select('*')
        .eq('user_id', supervisorId);

      // If supervisor is already assigned somewhere, remove that assignment
      if (existingAssignments && existingAssignments.length > 0) {
        const { error: deleteError } = await supabase
          .from('site_supervisors')
          .delete()
          .eq('user_id', supervisorId);

        if (deleteError) throw deleteError;
      }

      // Create new assignment
      const { error } = await supabase
        .from('site_supervisors')
        .insert([
          {
            site_id: siteId,
            user_id: supervisorId
          }
        ]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error assigning supervisor:', error);
      return false;
    }
  },

  async unassignSupervisor(supervisorId: string) {
    try {
      const { error } = await supabase
        .from('site_supervisors')
        .delete()
        .eq('user_id', supervisorId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error unassigning supervisor:', error);
      return false;
    }
  },

  async getSupervisorAssignment(supervisorId: string) {
    const { data, error } = await supabase
      .from('site_supervisors')
      .select('site_id')
      .eq('user_id', supervisorId)
      .single();

    if (error) {
      console.error('Error getting supervisor assignment:', error);
      return null;
    }

    return data?.site_id;
  },

  async getCurrentSupervisor(siteId: string) {
    try {
      const { data, error } = await supabase
        .from('site_supervisors')
        .select(`
          user_id,
          profiles:user_id (
            id,
            email,
            full_name,
            role
          )
        `)
        .eq('site_id', siteId)
        .single();

      if (error) throw error;
      
      return {
        data: data ? [data.profiles] : [],
        error: null
      };
    } catch (error) {
      console.error('Error getting current supervisor:', error);
      return { data: [], error };
    }
  }
};