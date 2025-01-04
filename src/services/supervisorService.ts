import { supabase } from '../lib/supabase';
import type { User } from '../types';

export const supervisorService = {
  async createSupervisor(email: string) {
    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: 'Temp@123!', // More secure temporary password
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
          email,
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
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting supervisor:', error);
      throw new Error('Failed to delete supervisor');
    }
  }
};