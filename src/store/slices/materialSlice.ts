import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Material } from '../../types';

interface MaterialState {
  materials: Record<string, Material[]>; // Key is site_id
  loading: boolean;
  error: string | null;
}

const initialState: MaterialState = {
  materials: {},
  loading: false,
  error: null,
};

const materialSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {
    setMaterials: (state, action: PayloadAction<{ siteId: string; materials: Material[] }>) => {
      const { siteId, materials } = action.payload;
      state.materials[siteId] = materials;
      state.error = null;
    },
    addMaterial: (state, action: PayloadAction<Material>) => {
      const siteId = action.payload.site_id;
      if (!state.materials[siteId]) {
        state.materials[siteId] = [];
      }
      state.materials[siteId].push(action.payload);
    },
    updateMaterial: (state, action: PayloadAction<Material>) => {
      const siteId = action.payload.site_id;
      const materials = state.materials[siteId];
      if (materials) {
        const index = materials.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          materials[index] = action.payload;
        }
      }
    },
    deleteMaterial: (state, action: PayloadAction<{ siteId: string; materialId: string }>) => {
      const { siteId, materialId } = action.payload;
      const materials = state.materials[siteId];
      if (materials) {
        state.materials[siteId] = materials.filter(m => m.id !== materialId);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setMaterials,
  addMaterial,
  updateMaterial,
  deleteMaterial,
  setLoading,
  setError,
} = materialSlice.actions;
export default materialSlice.reducer;