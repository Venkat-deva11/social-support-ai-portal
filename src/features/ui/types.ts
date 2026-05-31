/**
 * UI Feature Types
 * All types related to UI state management
 */

export interface UIState {
  isRTL: boolean;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
}
export interface SuccessPageContent {
  title: string;
  description: string;
  mainMessage: string;
  subMessage: string;
  referenceNumber: string;
  nextSteps: string;
  nextStepsList: string[];
  backToHome: string;
}