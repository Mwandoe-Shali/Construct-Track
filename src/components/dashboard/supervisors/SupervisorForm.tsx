import { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Typography,
  CircularProgress
} from '@mui/material';
import { supervisorService } from '../../../services/supervisor/supervisorService';
import { checkDatabaseSetup } from '../../../utils/dbCheck';

interface SupervisorFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function SupervisorForm({ onClose, onSuccess }: SupervisorFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check database setup when component mounts
    checkDatabaseSetup().catch(console.error);
  }, []);

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
      console.log('Attempting to create supervisor with email:', email);
      await supervisorService.createSupervisor(email);
      console.log('Supervisor creation successful');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Supervisor creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create supervisor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>Add New Supervisor</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" className="mb-4 mt-4">
            {error}
          </Alert>
        )}
        <div className="space-y-4 pt-4">
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            error={!!error}
            helperText="Format: name+supervisor@gmail.com"
            placeholder="john.doe+supervisor@gmail.com"
          />
          <Typography variant="body2" color="text.secondary">
            The supervisor will receive an email with login instructions.
          </Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            'Add Supervisor'
          )}
        </Button>
      </DialogActions>
    </form>
  );
}