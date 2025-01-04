import { useState, useEffect } from 'react';
import { supervisorService } from '../services/supervisorService';
import type { User } from '../types';

export function useSupervisorManagement() {
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSupervisors = async () => {
    try {
      setLoading(true);
      const data = await supervisorService.getSupervisors();
      setSupervisors(data);
      setError(null);
    } catch (err) {
      setError('Failed to load supervisors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSupervisors();
  }, []);

  const addSupervisor = async ({ email }: { email: string }) => {
    try {
      await supervisorService.createSupervisor(email);
      await loadSupervisors();
    } catch (err) {
      throw new Error('Failed to create supervisor');
    }
  };

  const updateSupervisor = async (id: string, updates: Partial<User>) => {
    try {
      await supervisorService.updateSupervisor(id, updates);
      await loadSupervisors();
    } catch (err) {
      throw new Error('Failed to update supervisor');
    }
  };

  const deleteSupervisor = async (id: string) => {
    try {
      await supervisorService.deleteSupervisor(id);
      await loadSupervisors();
    } catch (err) {
      throw new Error('Failed to delete supervisor');
    }
  };

  return {
    supervisors,
    loading,
    error,
    addSupervisor,
    updateSupervisor,
    deleteSupervisor,
  };
}