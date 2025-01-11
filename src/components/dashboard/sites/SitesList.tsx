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
  TextField,
  IconButton,
} from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Site } from '../../../types';

interface SitesListProps {
  onSiteSelect: (site: Site | null) => void;
  selectedSiteId?: string;
  isManager?: boolean;
}

export default function SitesList({ onSiteSelect, selectedSiteId, isManager = true }: SitesListProps) {
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
    
    // Subscribe to real-time changes
    const subscription = supabase
      .channel('sites_channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'sites' 
        }, 
        (payload) => {
          console.log('Real-time update:', payload);
          loadSites(); // Reload sites when changes occur
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadSites = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      if (data) {
        setSites(data as Site[]);
        if (data.length > 0 && !selectedSiteId) {
          onSiteSelect(data[0] as Site);
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
          size: Number(newSite.size)
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newSiteData = data as Site;
        setSites([...sites, newSiteData]);
        onSiteSelect(newSiteData);
        setIsAddDialogOpen(false);
        setNewSite({ name: '', location: '', building_type: '', size: '' });
      }
    } catch (err) {
      console.error('Error adding site:', err);
      setError(err instanceof Error ? err.message : 'Failed to add site');
    }
  };

  const handleDeleteSite = async (siteId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      setError(null);

      // First, remove any supervisor assignments for this site
      const { error: assignmentError } = await supabase
        .from('site_supervisors')
        .delete()
        .eq('site_id', siteId);

      if (assignmentError) throw assignmentError;

      // Then delete the site itself
      const { error } = await supabase
        .from('sites')
        .delete()
        .eq('id', siteId);

      if (error) throw error;

      // Update local state
      const updatedSites = sites.filter(site => site.id !== siteId);
      setSites(updatedSites);
      
      // Handle selected site update
      if (selectedSiteId === siteId) {
        if (updatedSites.length > 0) {
          onSiteSelect(updatedSites[0]);
        } else {
          onSiteSelect(null);
        }
      }
      
      // Force reload to ensure consistency
      loadSites();
    } catch (err) {
      console.error('Error deleting site:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete site');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sites</h2>
        {isManager && (
          <Button
            startIcon={<Plus size={20} />}
            onClick={() => setIsAddDialogOpen(true)}
          >
            Add Site
          </Button>
        )}
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
            <ListItem 
              key={site.id} 
              disablePadding
              secondaryAction={
                isManager && (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => handleDeleteSite(site.id, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </IconButton>
                )
              }
              className="group"
            >
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