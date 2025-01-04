import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '../../../lib/supabase';
import { supervisorService } from '../supervisorService';

// Mock supabase client
vi.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
          order: vi.fn()
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn()
          }))
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn()
      }))
    }))
  }
}));

describe('supervisorService', () => {
  const mockEmail = 'test+supervisor@gmail.com';
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createSupervisor', () => {
    it('should successfully create a supervisor', async () => {
      const mockUser = { id: '123', email: mockEmail };
      const mockProfile = { id: '123', email: mockEmail, role: 'supervisor' };

      // Mock successful signup
      vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
        data: { user: mockUser },
        error: null
      });

      // Mock successful profile retrieval
      vi.mocked(supabase.from).mockImplementationOnce(() => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: mockProfile, error: null })
          })
        })
      }));

      const result = await supervisorService.createSupervisor(mockEmail);
      
      expect(result).toEqual({
        id: mockProfile.id,
        email: mockProfile.email,
        role: 'supervisor'
      });
    });

    it('should throw error on signup failure', async () => {
      vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Signup failed' }
      });

      await expect(supervisorService.createSupervisor(mockEmail))
        .rejects
        .toThrow('Signup failed');
    });
  });

  describe('getSupervisors', () => {
    it('should return list of supervisors', async () => {
      const mockSupervisors = [
        { id: '1', email: 'sup1@gmail.com', role: 'supervisor' },
        { id: '2', email: 'sup2@gmail.com', role: 'supervisor' }
      ];

      vi.mocked(supabase.from).mockImplementationOnce(() => ({
        select: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: mockSupervisors, error: null })
          })
        })
      }));

      const result = await supervisorService.getSupervisors();
      expect(result).toEqual(mockSupervisors);
    });
  });
});