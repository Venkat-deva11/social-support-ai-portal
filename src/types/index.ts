/**
 * Application Types - Barrel Export
 * Re-exports all types from their respective modules
 */

// Re-export from features/application
export type {
  PersonalInfo,
  FamilyFinancialInfo,
  SituationDescriptions,
  ApplicationFormData,
  ApplicationState,
  Language,
  LanguageOption,
  StoredApplication,
} from '../features/application/types';

// Re-export from features/ui
export type { UIState } from '../features/ui/types';

// Re-export from services/api
export type {
  ValidationError,
  ApiResponse,
  SubmissionData,
  MockSubmissionResponse,
} from '../services/api/types';

// Re-export from services/openai
export type {
  AIAuthoringField,
  OpenAIMessage,
  OpenAIRequest,
  OpenAIChoice,
  OpenAIResponse,
  TokenUsage,
  OpenAIConfigStatus,
  GenerateTextResponse,
} from '../services/openai/types';

// Re-export from sitecore types
export type {
  SitecoreField,
  SitecorePageContent,
  SitecoreLanguage,
  SitecoreContent,
  FieldConfig,
} from './sitecore';

// Re-export from components/forms
export type {
  PersonalInfoFormRef,
  PersonalInfoFormProps,
  PersonalInfoFormData,
  FamilyFinancialFormRef,
  FamilyFinancialFormProps,
  FamilyFinancialFormData,
  SituationDescriptionsFormRef,
  SituationDescriptionsFormProps,
  SituationDescriptionsFormData,
  FormFieldConfig,
  FormValidationState,
  FormStep,
} from '../components/forms/types';

// Re-export from components/layout
export type {
  HeaderProps,
  FooterProps,
  LayoutChildrenProps,
} from '../components/layout/types';

// Re-export from components/ai
export type {
  AIAssistanceModalProps,
  UserData,
} from '../components/ai/types';

// Re-export from components/wizard
export type {
  ApplicationStepperProps,
  WizardNavigationProps,
  StepConfig,
} from '../components/wizard/types';