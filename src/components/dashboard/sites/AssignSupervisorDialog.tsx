import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { profileService } from '../../../services/profileService';
import { siteAssignmentService } from '../../../services/siteAssignmentService';
import type { User } from '../../../types';

interface AssignSupervisorDialogProps {
  open: boolean;
  onClose: () => void;
  siteId: string;
  onAssign: () => void;
}

export default function AssignSupervisorDialog({
  open,
  onClose,
  siteId,
  onAssign,
}: AssignSupervisorDialogProps) {
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSupervisors = async () => {
      try {
        const data = await profileService.getSupervisors();
        setSupervisors(data);
      } catch (err) {
        setError('Failed to load supervisors');
      } finally {
        setLoading(false);
      }
    };

    loadSupervisors();
  }, []);

  const handleAssign = async () => {
    if (!selectedSupervisor) return;

    try {
      const success = await siteAssignmentService.assignSupervisor(
        siteId,
        selectedSupervisor
      );

      if (success) {
        onAssign();
        onClose();
      } else {
        setError('Failed to assign supervisor');
      }
    } catch (err) {
      setError('An error occurred while assigning supervisor');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Assign Supervisor</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Select Supervisor</InputLabel>
          <Select
            value={selectedSupervisor}
            onChange={(e) => setSelectedSupervisor(e.target.value)}
            label="Select Supervisor"
            disabled={loading}
          >
            {supervisors.map((supervisor) => (
              <MenuItem key={supervisor.id} value={supervisor.id}>
                {supervisor.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleAssign}
          variant="contained"
          disabled={!selectedSupervisor || loading}
        >
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
}