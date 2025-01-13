import { supabase } from '../lib/supabase';
import type { User, Site } from '../types';

interface SupervisorFormData {
  email: string;
  full_name: string;
  contact: string;
  password: string;
}

export const supervisorService = {
  async createSupervisor(formData: SupervisorFormData) {
    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: 'supervisor'
          },
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (authError) {
        console.error('Auth creation error:', authError);
        throw new Error(authError.message);
      }

      if (!authData.user?.id) {
        throw new Error('No user ID returned from auth signup');
      }

      // Create the profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: formData.email,
          full_name: formData.full_name,
          contact: formData.contact,
          role: 'supervisor'
        })
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error('Failed to create supervisor profile');
      }

      return profileData;
    } catch (error: any) {
      console.error('Supervisor creation failed:', error);
      throw new Error(error.message || 'Failed to create supervisor');
    }
  },

  async getSupervisors() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'supervisor')
      .order('email');

    if (error) {
      console.error('Error fetching supervisors:', error);
      throw new Error('Failed to fetch supervisors');
    }

    return data || [];
  },

  async updateSupervisor(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating supervisor:', error);
      throw new Error('Failed to update supervisor');
    }

    return data;
  },

  async deleteSupervisor(id: string) {
    try {
      // Delete related entries in site_supervisors
      const { error: siteError } = await supabase
        .from('site_supervisors')
        .delete()
        .eq('user_id', id);

      if (siteError) {
        console.error('Error deleting related site supervisors:', siteError);
        throw new Error('Failed to delete related site supervisors');
      }

      // Delete the supervisor from profiles
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting supervisor:', error);
        throw new Error('Failed to delete supervisor');
      }
    } catch (err) {
      console.error('Error in deleteSupervisor:', err);
      throw new Error('Failed to delete supervisor');
    }
  },

  async getAssignedSite(userId: string): Promise<Site[] | null> {
    try {
      const { data, error } = await supabase
        .from('site_supervisors')
        .select('sites(*)')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching assigned site:', error);
        return null;
      }

      // Map the data to extract the sites array
      return data ? data.map(item => item.sites) : null;
    } catch (err) {
      console.error('Error in getAssignedSite:', err);
      return null;
    }
  }
};