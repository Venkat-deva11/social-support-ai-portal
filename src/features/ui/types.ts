/**
 * UI Feature Types
 * All types related to UI state management
 */

export interface UIState {
  isRTL: boolean;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
}
