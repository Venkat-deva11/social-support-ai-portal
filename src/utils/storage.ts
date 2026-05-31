/**
 * LocalStorage utility for persisting application data
 * Provides type-safe storage operations with error handling
 */

import { STORAGE_KEYS } from '../constants';
import type { ApplicationFormData, Language, StoredApplication } from '../types';
import { safeJsonParse } from './common';

/**
 * Storage service for managing application persistence
 */
export const StorageService = {
  /**
   * Save application data to localStorage
   */
  saveApplication: (
    currentStep: number,
    formData: ApplicationFormData,
    language: Language
  ): void => {
    try {
      if (!formData) return;

      const data: StoredApplication = {
        currentStep,
        formData,
        language,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.APPLICATION_DATA, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save application to localStorage:', error);
    }
  },

  /**
   * Load application data from localStorage
   */
  loadApplication: (): StoredApplication | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATION_DATA);
      if (!data) return null;

      return safeJsonParse<StoredApplication | null>(data, null);
    } catch (error) {
      console.error('Failed to load application from localStorage:', error);
      return null;
    }
  },

  /**
   * Clear saved application data
   */
  clearApplication: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.APPLICATION_DATA);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
    } catch (error) {
      console.error('Failed to clear application from localStorage:', error);
    }
  },

  /**
   * Check if there is saved application data
   */
  hasSavedApplication: (): boolean => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATION_DATA);
      return data !== null && data.length > 0;
    } catch {
      return false;
    }
  },

  /**
   * Save current step separately for quick access
   */
  saveCurrentStep: (step: number): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, String(step));
    } catch (error) {
      console.error('Failed to save current step:', error);
    }
  },

  /**
   * Get saved current step
   */
  getCurrentStep: (): number | null => {
    try {
      const step = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
      if (!step) return null;

      const parsed = parseInt(step, 10);
      return isNaN(parsed) ? null : parsed;
    } catch {
      return null;
    }
  },

  /**
   * Save language preference
   */
  saveLanguage: (language: Language): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  },

  /**
   * Get saved language preference
   */
  getLanguage: (): Language | null => {
    try {
      const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      if (lang === 'en' || lang === 'ar') {
        return lang;
      }
      return null;
    } catch {
      return null;
    }
  },
};

export default StorageService;