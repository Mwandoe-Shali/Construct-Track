import { useEffect, useState } from 'react';
import { CircularProgress, Alert, Typography, Paper, Grid } from '@mui/material';
import { supabase } from '../../lib/supabase';
import { supervisorService } from '../../services/supervisorService';
import MaterialsList from './materials/MaterialsList';
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
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className="p-6">
            <Typography variant="h4" gutterBottom color="primary">
              {assignedSite.name}
            </Typography>
            <Grid container spacing={3} className="mb-6">
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" color="textSecondary">Location</Typography>
                <Typography variant="body1">{assignedSite.location}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" color="textSecondary">Building Type</Typography>
                <Typography variant="body1">{assignedSite.building_type}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" color="textSecondary">Size</Typography>
                <Typography variant="body1">{assignedSite.size} sq ft</Typography>
              </Grid>
            </Grid>

            <Typography variant="h5" gutterBottom className="mt-8 mb-4">
              Site Materials
            </Typography>
            <MaterialsList 
              siteId={assignedSite.id} 
              isManager={false} 
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}