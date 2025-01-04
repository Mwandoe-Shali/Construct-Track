import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import siteReducer from './slices/siteSlice';
import materialReducer from './slices/materialSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sites: siteReducer,
    materials: materialReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;