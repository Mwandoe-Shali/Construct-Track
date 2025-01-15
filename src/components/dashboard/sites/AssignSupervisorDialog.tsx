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
  SelectChangeEvent,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Edit2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { siteAssignmentService } from '../../../services/siteAssignmentService';
import { userService } from '../../../services/userService';

interface Supervisor {
  id: string;
  email: string;
  full_name?: string;
  role: string;
}

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
  const [currentSupervisor, setCurrentSupervisor] = useState<Supervisor | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { data: supervisors } = useQuery<Supervisor[]>({
    queryKey: ['supervisors'],
    queryFn: userService.getSupervisors,
    initialData: []
  });

  useEffect(() => {
    const fetchCurrentSupervisor = async () => {
      try {
        const { data } = await siteAssignmentService.getCurrentSupervisor(siteId);
        if (data && data.length > 0) {
          const supervisor = data[0];
          setCurrentSupervisor(supervisor);
          setSelectedSupervisor(supervisor.id);
        }
      } catch (err) {
        console.error('Error fetching current supervisor:', err);
      }
    };

    if (open) {
      fetchCurrentSupervisor();
    }
  }, [siteId, open]);

  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectedSupervisor(event.target.value);
  };

  const handleAssign = async () => {
    if (!selectedSupervisor) {
      setError('Please select a supervisor');
      return;
    }

    setLoading(true);
    setError(null);

    try {
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
      <DialogTitle>Site Supervisor</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {!isEditing && currentSupervisor && (
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1">
              Current Supervisor: {currentSupervisor.full_name || currentSupervisor.email}
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => setIsEditing(true)}
              sx={{ ml: 1 }}
            >
              <Edit2 size={16} />
            </IconButton>
          </Box>
        )}

        {(isEditing || !currentSupervisor) && (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Supervisor</InputLabel>
            <Select
              value={selectedSupervisor}
              onChange={handleSelectChange}
              label="Select Supervisor"
            >
              {supervisors.map((supervisor) => (
                <MenuItem key={supervisor.id} value={supervisor.id}>
                  {supervisor.full_name || supervisor.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {(isEditing || !currentSupervisor) && (
          <Button
            onClick={handleAssign}
            variant="contained"
            disabled={loading || !selectedSupervisor}
          >
            {loading ? 'Assigning...' : 'Assign'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}