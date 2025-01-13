import { supabase } from '../lib/supabase';
import { roles } from './roles';

export interface AuthError {
  message: string;
  code?: string;
}

export const authService = {
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: {
          message: error.message === 'Invalid login credentials'
            ? 'Invalid email or password. Please try again.'
            : 'An error occurred during sign in. Please try again.',
          code: error.code
        }
      };
    }
  },

  async signUp(email: string, password: string, fullName: string, contact: string) {
    try {
      if (!roles.isValidRoleEmail(email)) {
        throw new Error('Please use your Gmail address with +manager or +supervisor (e.g., your.email+manager@gmail.com)');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: roles.getRoleFromEmail(email),
            full_name: fullName,
            contact: contact
          },
          emailRedirectTo: `${window.location.origin}/auth`,
          // Disable email confirmation for development
          emailConfirmTo: null
        }
      });

      if (error) throw error;
      
      return { 
        data, 
        error: null,
        message: 'Account created successfully! You can now sign in.' 
      };
    } catch (error: any) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.code
        }
      };
    }
  }
};