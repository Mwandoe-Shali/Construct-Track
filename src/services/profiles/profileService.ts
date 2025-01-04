import { supabase } from '../../lib/supabase';
import type { User } from '../../types';

export class ProfileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProfileError';
  }
}

export const profileService = {
  async createProfile(userId: string, email: string, role: string) {
    const { data, error } = await supabase
      .from('profiles')
      .insert({ id: userId, email, role })
      .select()
      .single();

    if (error) {
      throw new ProfileError('Failed to create user profile');
    }

    return data;
  }
};