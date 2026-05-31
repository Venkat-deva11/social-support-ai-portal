/**
 * Application Feature Types
 * All types related to the application state and forms
 */

// Personal Information form data
export interface PersonalInfo {
  fullName: string;
  nationalId: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
}

// Family Financial Information form data
export interface FamilyFinancialInfo {
  maritalStatus: string;
  dependents: number;
  employmentStatus: string;
  monthlyIncome: number;
  housingStatus: string;
}

// Situation Descriptions form data
export interface SituationDescriptions {
  financialSituation: string;
  employmentCircumstances: string;
  reasonForApplying: string;
}

// Complete application form data structure
export interface ApplicationFormData {
  personalInfo: PersonalInfo;
  familyFinancialInfo: FamilyFinancialInfo;
  situationDescriptions: SituationDescriptions;
}

// Application state
export interface ApplicationState {
  currentStep: number;
  formData: ApplicationFormData;
  isSubmitted: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  language: Language;
}

// Supported languages
export type Language = 'en' | 'ar';

// Language option for UI
export interface LanguageOption {
  code: Language;
  name: string;
  direction: 'ltr' | 'rtl';
}

// Stored application data in localStorage
export interface StoredApplication {
  currentStep: number;
  formData: ApplicationFormData;
  language: Language;
  savedAt: string;
}
