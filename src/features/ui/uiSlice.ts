import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isRTL: boolean;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
}

const initialState: UIState = {
  isRTL: false,
  sidebarOpen: false,
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setRTL: (state, action: PayloadAction<boolean>) => {
      state.isRTL = action.payload;
    },

    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
});

export const { setRTL, toggleSidebar, setSidebarOpen, setTheme } = uiSlice.actions;

export default uiSlice.reducer;