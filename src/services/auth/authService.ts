import { supabase } from '../../lib/supabase';

export class AuthServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthServiceError';
  }
}

export const authService = {
  async createUser(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role: 'supervisor'
        }
      });

      if (error) {
        throw new AuthServiceError(error.message);
      }

      if (!data?.user) {
        throw new AuthServiceError('Failed to create user');
      }

      return data.user;
    } catch (error) {
      if (error instanceof AuthServiceError) {
        throw error;
      }
      throw new AuthServiceError('Failed to create user account');
    }
  }
};