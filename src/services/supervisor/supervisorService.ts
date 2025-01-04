import { supabase } from '../../lib/supabase';
import { generateSecurePassword } from '../../utils/passwordUtils';
import type { User } from '../../types';

export class SupervisorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SupervisorError';
  }
}

export const supervisorService = {
  async createSupervisor(email: string): Promise<User> {
    try {
      // Generate a secure temporary password
      const tempPassword = generateSecurePassword();
      
      // Use standard signup flow
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: tempPassword,
        options: {
          data: {
            role: 'supervisor'
          },
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (signUpError) {
        throw new SupervisorError(signUpError.message);
      }

      if (!authData.user) {
        throw new SupervisorError('Failed to create supervisor account');
      }

      // Profile will be created automatically by the database trigger
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        throw new SupervisorError('Failed to retrieve supervisor profile');
      }

      return {
        id: profile.id,
        email: profile.email,
        role: 'supervisor'
      };
    } catch (error) {
      if (error instanceof SupervisorError) {
        throw error;
      }
      throw new SupervisorError('Failed to create supervisor');
    }
  },

  async getSupervisors(): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'supervisor')
      .order('email');

    if (error) {
      throw new SupervisorError('Failed to fetch supervisors');
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
      throw new SupervisorError('Failed to update supervisor');
    }

    return data;
  },

  async deleteSupervisor(id: string) {
    // Note: The user will be deleted from auth.users cascade to profiles
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) {
      throw new SupervisorError('Failed to delete supervisor');
    }
  }
};