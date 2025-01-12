import { useEffect, useState } from 'react';
import { CircularProgress, Alert, Typography, Paper } from '@mui/material';
import { supabase } from '../../lib/supabase';
import { supervisorService } from '../../services/supervisorService';
import SiteDetails from './sites/SiteDetails';
import type { Site } from '../../types';

export default function SupervisorDashboard() {
  const [loading, setLoading] = useState(true);
  const [assignedSite, setAssignedSite] = useState<Site | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAssignedSite = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('User not authenticated');
          return;
        }

        const site = await supervisorService.getAssignedSite(user.id);
        setAssignedSite(site);
      } catch (err) {
        setError('Failed to load assigned site');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAssignedSite();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  if (!assignedSite) {
    return (
      <div className="p-6">
        <Alert severity="info">
          No site assigned. Please contact your manager.
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Paper className="p-4">
        <Typography variant="h4" gutterBottom>
          Assigned Site
        </Typography>
        <Typography><strong>Name:</strong> {assignedSite.name}</Typography>
        <Typography><strong>Location:</strong> {assignedSite.location}</Typography>
        <Typography><strong>Building Type:</strong> {assignedSite.building_type}</Typography>
        <Typography><strong>Size:</strong> {assignedSite.size} sq ft</Typography>
      </Paper>
    </div>
  );
}