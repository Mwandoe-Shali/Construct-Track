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
      console.log('Starting supervisor creation for:', email);
      
      // Generate a secure temporary password
      const tempPassword = generateSecurePassword();
      
      // Use standard signup flow with detailed error logging
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
        console.error('Auth signup error:', signUpError);
        throw new SupervisorError(`Auth signup failed: ${signUpError.message}`);
      }

      if (!authData.user) {
        console.error('No user data returned from auth signup');
        throw new SupervisorError('Failed to create supervisor account - no user data returned');
      }

      console.log('Auth user created successfully:', authData.user.id);

      // Profile will be created automatically by the database trigger
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Profile retrieval error:', profileError);
        
        // Check if profile exists despite error
        const { count, error: countError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('id', authData.user.id);
          
        if (countError) {
          console.error('Profile count check error:', countError);
        } else {
          console.log('Profile exists check:', count > 0);
        }
        
        throw new SupervisorError(`Failed to retrieve supervisor profile: ${profileError.message}`);
      }

      if (!profile) {
        console.error('No profile data returned');
        throw new SupervisorError('Failed to create supervisor profile - no profile data returned');
      }

      console.log('Supervisor creation completed successfully');
      
      return {
        id: profile.id,
        email: profile.email,
        role: 'supervisor'
      };
    } catch (error) {
      console.error('Supervisor creation failed:', error);
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