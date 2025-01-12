import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { supervisorService } from '../../../services/supervisorService';

interface SupervisorFormData {
  email: string;
  full_name: string;
  contact: string;
  password: string;
}

interface SupervisorFormProps {
  onClose: () => void;
}

export function SupervisorForm({ onClose }: SupervisorFormProps) {
  const [formData, setFormData] = useState<SupervisorFormData>({
    email: '',
    full_name: '',
    contact: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await supervisorService.createSupervisor(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create supervisor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogTitle>Add New Supervisor</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <TextField
            fullWidth
            label="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Contact Number"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Supervisor'}
        </Button>
      </DialogActions>
    </>
  );
}