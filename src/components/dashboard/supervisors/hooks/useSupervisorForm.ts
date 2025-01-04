import { useState } from 'react';
import { supervisorService } from '../../../../services/supervisor/supervisorService';
import type { User } from '../../../../types';

interface UseSupervisorFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function useSupervisorForm({ onSuccess, onClose }: UseSupervisorFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    if (!email) return 'Email is required';
    if (!email.includes('@gmail.com')) return 'Must be a Gmail address';
    if (!email.includes('+supervisor')) return 'Must include +supervisor in the email';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setLoading(true);
    try {
      await supervisorService.createSupervisor(email);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create supervisor');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    error,
    loading,
    handleSubmit
  };
}