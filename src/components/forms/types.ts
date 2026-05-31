/**
 * Form Component Types
 * All types related to form components
 */

import type { UseFormReturn } from 'react-hook-form';
import type { PersonalInfo, FamilyFinancialInfo, SituationDescriptions } from '../../features/application/types';

// Personal Info Form
export interface PersonalInfoFormRef {
  triggerValidation: () => Promise<boolean>;
}

export interface PersonalInfoFormProps {
  defaultValues?: Partial<PersonalInfo>;
}

export type PersonalInfoFormData = PersonalInfo;

// Family Financial Form
export interface FamilyFinancialFormRef {
  triggerValidation: () => Promise<boolean>;
}

export interface FamilyFinancialFormProps {
  defaultValues?: Partial<FamilyFinancialInfo>;
}

export type FamilyFinancialFormData = FamilyFinancialInfo;

// Situation Descriptions Form
export interface SituationDescriptionsFormRef {
  triggerValidation: () => Promise<boolean>;
}

export interface SituationDescriptionsFormProps {
  defaultValues?: Partial<SituationDescriptions>;
}

export type SituationDescriptionsFormData = SituationDescriptions;

// Common Form Field configuration
export interface FormFieldConfig {
  label: string;
  placeholder: string;
  helperText: string;
  errorMessage: Record<string, string>;
}

// Form validation state
export interface FormValidationState {
  isValid: boolean;
  errors: Record<string, string>;
}

// Wizard Form steps
export interface FormStep {
  id: number;
  label: string;
  componentId: string;
}