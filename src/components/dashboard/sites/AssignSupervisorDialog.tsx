import { useState } from 'react';
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
  Alert
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { siteAssignmentService } from '../../../services/siteAssignmentService';
import { userService } from '../../../services/userService';

interface AssignSupervisorDialogProps {
  open: boolean;
  onClose: () => void;
  siteId: string;
  onAssign: () => void;
}

export function AssignSupervisorDialog({
  open,
  onClose,
  siteId,
  onAssign
}: AssignSupervisorDialogProps) {
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: supervisors } = useQuery(['supervisors'], () =>
    userService.getSupervisors()
  );

  const handleAssign = async () => {
    if (!selectedSupervisor) {
      setError('Please select a supervisor');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if the assignment already exists
      const { data: existingAssignment } = await siteAssignmentService.checkAssignment(siteId, selectedSupervisor);
      if (existingAssignment && existingAssignment.length > 0) {
        setError('This supervisor is already assigned to this site.');
        return;
      }

      const success = await siteAssignmentService.assignSupervisor(siteId, selectedSupervisor);
      
      if (success) {
        onAssign();
        onClose();
      } else {
        setError('Failed to assign supervisor. Please try again.');
      }
    } catch (err) {
      console.error('Error assigning supervisor:', err);
      setError('An error occurred while assigning the supervisor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign Supervisor</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Select Supervisor</InputLabel>
          <Select
            value={selectedSupervisor}
            onChange={(e) => setSelectedSupervisor(e.target.value)}
            label="Select Supervisor"
          >
            {supervisors?.map((supervisor) => (
              <MenuItem key={supervisor.id} value={supervisor.id}>
                {supervisor.full_name || supervisor.email}
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
          disabled={loading || !selectedSupervisor}
        >
          {loading ? 'Assigning...' : 'Assign'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}