import { useEffect, useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { Plus } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Site } from '../../../types';

interface SitesListProps {
  onSiteSelect: (site: Site) => void;
  selectedSiteId?: string;
}

export default function SitesList({ onSiteSelect, selectedSiteId }: SitesListProps) {
  const [sites, setSites] = useState<Site[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSite, setNewSite] = useState({
    name: '',
    location: '',
    building_type: '',
    size: 0
  });

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    const { data } = await supabase
      .from('sites')
      .select('*')
      .order('name');
    
    if (data) {
      setSites(data);
      if (data.length > 0 && !selectedSiteId) {
        onSiteSelect(data[0]);
      }
    }
  };

  const handleAddSite = async () => {
    const { data } = await supabase
      .from('sites')
      .insert([newSite])
      .select()
      .single();

    if (data) {
      setSites([...sites, data]);
      onSiteSelect(data);
      setIsAddDialogOpen(false);
      setNewSite({ name: '', location: '', building_type: '', size: 0 });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sites</h2>
        <Button
          startIcon={<Plus size={20} />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add Site
        </Button>
      </div>

      <List>
        {sites.map((site) => (
          <ListItem key={site.id} disablePadding>
            <ListItemButton
              selected={site.id === selectedSiteId}
              onClick={() => onSiteSelect(site)}
            >
              <ListItemText 
                primary={site.name}
                secondary={site.location}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogTitle>Add New Site</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <TextField
              fullWidth
              label="Site Name"
              value={newSite.name}
              onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Location"
              value={newSite.location}
              onChange={(e) => setNewSite({ ...newSite, location: e.target.value })}
            />
            <TextField
              fullWidth
              label="Building Type"
              value={newSite.building_type}
              onChange={(e) => setNewSite({ ...newSite, building_type: e.target.value })}
            />
            <TextField
              fullWidth
              type="number"
              label="Size (sq ft)"
              value={newSite.size}
              onChange={(e) => setNewSite({ ...newSite, size: Number(e.target.value) })}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSite} variant="contained">Add Site</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}