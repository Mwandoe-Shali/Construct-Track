import { useState } from 'react';
import { Grid, Paper, Button } from '@mui/material';
import { Users } from 'lucide-react';
import SitesList from './sites/SitesList';
import SiteDetails from './sites/SiteDetails';
import SupervisorsList from './supervisors/SupervisorsList';
import { Site } from '../../types';

export default function ManagerDashboard() {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [showSupervisors, setShowSupervisors] = useState(false);

  if (showSupervisors) {
    return (
      <div className="p-6">
        <Button 
          variant="outlined" 
          onClick={() => setShowSupervisors(false)}
          className="mb-4"
        >
          Back to Sites
        </Button>
        <SupervisorsList />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-end">
        <Button
          variant="contained"
          startIcon={<Users size={20} />}
          onClick={() => setShowSupervisors(true)}
        >
          View Supervisors
        </Button>
      </div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper className="p-4">
            <SitesList 
              onSiteSelect={setSelectedSite}
              selectedSiteId={selectedSite?.id}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          {selectedSite ? (
            <SiteDetails 
              site={selectedSite}
              onSiteUpdate={(updatedSite) => setSelectedSite(updatedSite)}
              isManager={true}
            />
          ) : (
            <Paper className="p-4 text-center text-gray-500">
              Select a site to view details
            </Paper>
          )}
        </Grid>
      </Grid>
    </div>
  );
}