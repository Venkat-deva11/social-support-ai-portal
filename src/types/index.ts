// Application Types

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

export interface FamilyFinancialInfo {
  maritalStatus: string;
  dependents: number;
  employmentStatus: string;
  monthlyIncome: number;
  housingStatus: string;
}

export interface SituationDescriptions {
  financialSituation: string;
  employmentCircumstances: string;
  reasonForApplying: string;
}

export interface ApplicationFormData {
  personalInfo: PersonalInfo;
  familyFinancialInfo: FamilyFinancialInfo;
  situationDescriptions: SituationDescriptions;
}

export interface ApplicationState {
  currentStep: number;
  formData: ApplicationFormData;
  isSubmitted: boolean;
  isSubmitting: boolean;
  submitError: string | null;
}

export interface ValidationError {
  message: string;
  field?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SitecoreField {
  label: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
}

export interface SitecorePageContent {
  componentId: string;
  title: string;
  description?: string;
  fields: Record<string, SitecoreField | Record<string, SitecoreField>>;
}

export interface SitecoreContent {
  en: {
    pages: Record<string, SitecorePageContent>;
    common: Record<string, string>;
  };
  ar: {
    pages: Record<string, SitecorePageContent>;
    common: Record<string, string>;
  };
}

export type Language = 'en' | 'ar';

export interface LanguageOption {
  code: Language;
  name: string;
  direction: 'ltr' | 'rtl';
}