import { useState } from 'react';
import { 
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box
} from '@mui/material';
import { Edit, UserPlus } from 'lucide-react';
import MaterialsList from '../materials/MaterialsList';
import { AssignSupervisorDialog } from './AssignSupervisorDialog';
import { Site } from '../../../types';
import { supabase } from '../../../lib/supabase';

interface SiteDetailsProps {
  site: Site;
  onSiteUpdate: (site: Site) => void;
  isManager: boolean;
}

export default function SiteDetails({ site, onSiteUpdate, isManager }: SiteDetailsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editedSite, setEditedSite] = useState(site);

  const handleUpdateSite = async () => {
    const { data } = await supabase
      .from('sites')
      .update(editedSite)
      .eq('id', site.id)
      .select()
      .single();

    if (data) {
      onSiteUpdate(data);
      setIsEditDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <Paper className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <Typography variant="h4" gutterBottom>
              {site.name}
            </Typography>
            <div className="space-y-2">
              <Typography><strong>Location:</strong> {site.location}</Typography>
              <Typography><strong>Building Type:</strong> {site.building_type}</Typography>
              <Typography><strong>Size:</strong> {site.size} sq ft</Typography>
            </div>
          </div>
          {isManager && (
            <Box>
              <Button
                startIcon={<Edit size={20} />}
                onClick={() => setIsEditDialogOpen(true)}
                sx={{ mr: 1 }}
              >
                Edit Site
              </Button>
              <Button
                startIcon={<UserPlus size={20} />}
                onClick={() => setIsAssignDialogOpen(true)}
                variant="outlined"
              >
                Assign Supervisor
              </Button>
            </Box>
          )}
        </div>

        <MaterialsList siteId={site.id} isManager={isManager} />
      </Paper>

      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>Edit Site Details</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <TextField
              fullWidth
              label="Site Name"
              value={editedSite.name}
              onChange={(e) => setEditedSite({ ...editedSite, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Location"
              value={editedSite.location}
              onChange={(e) => setEditedSite({ ...editedSite, location: e.target.value })}
            />
            <TextField
              fullWidth
              label="Building Type"
              value={editedSite.building_type}
              onChange={(e) => setEditedSite({ ...editedSite, building_type: e.target.value })}
            />
            <TextField
              fullWidth
              type="number"
              label="Size (sq ft)"
              value={editedSite.size}
              onChange={(e) => setEditedSite({ ...editedSite, size: Number(e.target.value) })}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateSite} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      <AssignSupervisorDialog
        open={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        siteId={site.id}
        onAssign={() => {
          // Refresh site data if needed
          onSiteUpdate(site);
        }}
      />
    </div>
  );
}