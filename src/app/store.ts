import { configureStore } from '@reduxjs/toolkit';
import applicationReducer from '../features/application/applicationSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    application: applicationReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['application/updateFormData'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;