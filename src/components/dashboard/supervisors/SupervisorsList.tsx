import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { UserPlus, Edit2, Trash2 } from 'lucide-react';
import { User } from '../../../types';
import { SupervisorForm } from './SupervisorForm';
import { useSupervisorManagement } from '../../../hooks/useSupervisorManagement';

export default function SupervisorsList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<User | null>(null);
  const { supervisors, loading, deleteSupervisor } = useSupervisorManagement();
  const [supervisorSites, setSupervisorSites] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSupervisorSites = async () => {
      try {
        const { data, error } = await supabase
          .from('site_supervisors')
          .select(`
            user_id,
            sites (
              id,
              name
            )
          `);

        if (error) {
          console.error('Error fetching supervisor sites:', error);
          return;
        }

        const siteMap: Record<string, string> = {};
        data?.forEach(item => {
          if (item.sites) {
            siteMap[item.user_id] = item.sites.name;
          }
        });
        setSupervisorSites(siteMap);
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchSupervisorSites();
  }, []);

  const handleEdit = (supervisor: User) => {
    setSelectedSupervisor(supervisor);
    setIsFormOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Supervisors</h2>
        <Button
          variant="contained"
          startIcon={<UserPlus size={20} />}
          onClick={() => setIsFormOpen(true)}
        >
          Add Supervisor
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Assigned Site</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {supervisors.map((supervisor) => (
              <TableRow key={supervisor.id}>
                <TableCell>{supervisor.email}</TableCell>
                <TableCell>{supervisorSites[supervisor.id] || 'Not assigned'}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit Supervisor">
                    <IconButton onClick={() => handleEdit(supervisor)}>
                      <Edit2 size={20} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Supervisor">
                    <IconButton 
                      onClick={() => deleteSupervisor(supervisor.id)}
                      color="error"
                    >
                      <Trash2 size={20} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={isFormOpen} 
        onClose={() => {
          setIsFormOpen(false);
          setSelectedSupervisor(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <SupervisorForm
          supervisor={selectedSupervisor}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedSupervisor(null);
          }}
        />
      </Dialog>
    </div>
  );
}