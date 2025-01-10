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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSite, setNewSite] = useState({
    name: '',
    location: '',
    building_type: '',
    size: ''
  });

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching sites...');
      const { data, error } = await supabase
        .from('sites')
        .select('id, name, location, building_type, size')
        .order('name');
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Sites data:', data);
      if (data) {
        setSites(data);
        if (data.length > 0 && !selectedSiteId) {
          onSiteSelect(data[0]);
        }
      }
    } catch (err) {
      console.error('Error loading sites:', err);
      setError(err instanceof Error ? err.message : 'Failed to load sites');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSite = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('sites')
        .insert([{
          ...newSite,
          size: newSite.size.toString()
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setSites([...sites, data]);
        onSiteSelect(data);
        setIsAddDialogOpen(false);
        setNewSite({ name: '', location: '', building_type: '', size: '' });
      }
    } catch (err) {
      console.error('Error adding site:', err);
      setError(err instanceof Error ? err.message : 'Failed to add site');
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

      {error && (
        <div className="text-red-500 mb-4">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div>Loading sites...</div>
      ) : (
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
      )}

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
              onChange={(e) => setNewSite({ ...newSite, size: e.target.value })}
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