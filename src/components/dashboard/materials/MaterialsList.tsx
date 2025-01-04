import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip
} from '@mui/material';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '../../../lib/supabase';
import { Material } from '../../../types';

interface MaterialsListProps {
  siteId: string;
  isManager: boolean;
}

export default function MaterialsList({ siteId, isManager }: MaterialsListProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [editedMaterial, setEditedMaterial] = useState({
    name: '',
    quantity: 0,
    unit: ''
  });

  useEffect(() => {
    loadMaterials();
  }, [siteId]);

  const loadMaterials = async () => {
    const { data } = await supabase
      .from('materials')
      .select('*')
      .eq('site_id', siteId)
      .order('name');
    
    if (data) {
      setMaterials(data);
    }
  };

  const handleAddMaterial = async () => {
    const { data } = await supabase
      .from('materials')
      .insert([{ ...editedMaterial, site_id: siteId }])
      .select()
      .single();

    if (data) {
      setMaterials([...materials, data]);
      setIsAddDialogOpen(false);
      setEditedMaterial({ name: '', quantity: 0, unit: '' });
    }
  };

  const handleUpdateMaterial = async () => {
    if (!selectedMaterial) return;

    const { data } = await supabase
      .from('materials')
      .update(editedMaterial)
      .eq('id', selectedMaterial.id)
      .select()
      .single();

    if (data) {
      setMaterials(materials.map(m => m.id === data.id ? data : m));
      setIsEditDialogOpen(false);
      setSelectedMaterial(null);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    await supabase
      .from('materials')
      .delete()
      .eq('id', id);

    setMaterials(materials.filter(m => m.id !== id));
  };

  const handleEditClick = (material: Material) => {
    setSelectedMaterial(material);
    setEditedMaterial({
      name: material.name,
      quantity: material.quantity,
      unit: material.unit
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Materials</h3>
        <Button
          startIcon={<Plus size={20} />}
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add Material
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Unit</TableCell>
              <TableCell align="right">Last Updated</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.map((material) => (
              <TableRow key={material.id}>
                <TableCell>{material.name}</TableCell>
                <TableCell align="right">{material.quantity}</TableCell>
                <TableCell align="right">{material.unit}</TableCell>
                <TableCell align="right">
                  <Tooltip title={new Date(material.updated_at).toLocaleString()}>
                    <span>
                      {formatDistanceToNow(new Date(material.updated_at), { addSuffix: true })}
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleEditClick(material)}
                  >
                    <Edit2 size={16} />
                  </IconButton>
                  {isManager && (
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteMaterial(material.id)}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Material Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogTitle>Add New Material</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <TextField
              fullWidth
              label="Material Name"
              value={editedMaterial.name}
              onChange={(e) => setEditedMaterial({ ...editedMaterial, name: e.target.value })}
            />
            <TextField
              fullWidth
              type="number"
              label="Quantity"
              value={editedMaterial.quantity}
              onChange={(e) => setEditedMaterial({ ...editedMaterial, quantity: Number(e.target.value) })}
            />
            <TextField
              fullWidth
              label="Unit"
              value={editedMaterial.unit}
              onChange={(e) => setEditedMaterial({ ...editedMaterial, unit: e.target.value })}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddMaterial} variant="contained">Add Material</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Material Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>Edit Material</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <TextField
              fullWidth
              label="Material Name"
              value={editedMaterial.name}
              onChange={(e) => setEditedMaterial({ ...editedMaterial, name: e.target.value })}
            />
            <TextField
              fullWidth
              type="number"
              label="Quantity"
              value={editedMaterial.quantity}
              onChange={(e) => setEditedMaterial({ ...editedMaterial, quantity: Number(e.target.value) })}
            />
            <TextField
              fullWidth
              label="Unit"
              value={editedMaterial.unit}
              onChange={(e) => setEditedMaterial({ ...editedMaterial, unit: e.target.value })}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateMaterial} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}