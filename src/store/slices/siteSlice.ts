import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Site } from '../../types';

interface SiteState {
  sites: Site[];
  selectedSite: Site | null;
  loading: boolean;
  error: string | null;
}

const initialState: SiteState = {
  sites: [],
  selectedSite: null,
  loading: false,
  error: null,
};

const siteSlice = createSlice({
  name: 'sites',
  initialState,
  reducers: {
    setSites: (state, action: PayloadAction<Site[]>) => {
      state.sites = action.payload;
      state.error = null;
    },
    setSelectedSite: (state, action: PayloadAction<Site | null>) => {
      state.selectedSite = action.payload;
    },
    addSite: (state, action: PayloadAction<Site>) => {
      state.sites.push(action.payload);
    },
    updateSite: (state, action: PayloadAction<Site>) => {
      const index = state.sites.findIndex(site => site.id === action.payload.id);
      if (index !== -1) {
        state.sites[index] = action.payload;
        if (state.selectedSite?.id === action.payload.id) {
          state.selectedSite = action.payload;
        }
      }
    },
    deleteSite: (state, action: PayloadAction<string>) => {
      state.sites = state.sites.filter(site => site.id !== action.payload);
      if (state.selectedSite?.id === action.payload) {
        state.selectedSite = null;
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
  setSites,
  setSelectedSite,
  addSite,
  updateSite,
  deleteSite,
  setLoading,
  setError,
} = siteSlice.actions;
export default siteSlice.reducer;