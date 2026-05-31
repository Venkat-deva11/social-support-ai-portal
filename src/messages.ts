/**
 * Messages
 * Centralized hardcoded text messages for the application
 */

// Validation Messages - Personal Information
export const VALIDATION_MESSAGES = {
  // Personal Information
  FULL_NAME_REQUIRED: 'Full name is required',
  FULL_NAME_MIN: (min: number) => `Full name must be at least ${min} characters`,
  FULL_NAME_MAX: (max: number) => `Full name cannot exceed ${max} characters`,
  FULL_NAME_ALPHANUMERIC: 'Only alphanumeric characters allowed',

  NATIONAL_ID_REQUIRED: 'National ID is required',
  NATIONAL_ID_MIN: (min: number) => `National ID must be at least ${min} characters`,
  NATIONAL_ID_MAX: (max: number) => `National ID cannot exceed ${max} characters`,
  NATIONAL_ID_ALPHANUMERIC: 'Only alphanumeric characters allowed',

  DATE_OF_BIRTH_REQUIRED: 'Date of birth is required',
  DATE_OF_BIRTH_INVALID: 'Please enter a valid date',
  AGE_18_REQUIRED: 'Applicant must be 18 years or older',

  GENDER_REQUIRED: 'Gender is required',

  ADDRESS_REQUIRED: 'Address is required',
  ADDRESS_MIN: (min: number) => `Address must be at least ${min} characters`,

  CITY_REQUIRED: 'City is required',
  STATE_REQUIRED: 'State/Province is required',
  COUNTRY_REQUIRED: 'Country is required',

  PHONE_REQUIRED: 'Phone number is required',
  PHONE_INVALID: 'Please enter a valid phone number',

  EMAIL_REQUIRED: 'Email address is required',
  EMAIL_INVALID: 'Please enter a valid email address',

  // Family Financial
  MARITAL_STATUS_REQUIRED: 'Marital status is required',
  DEPENDENTS_REQUIRED: 'Number of dependents is required',
  DEPENDENTS_INVALID: 'Please enter a valid number (0 or more)',
  EMPLOYMENT_STATUS_REQUIRED: 'Employment status is required',
  MONTHLY_INCOME_REQUIRED: 'Monthly income is required',
  MONTHLY_INCOME_INVALID: 'Please enter a valid positive number',
  HOUSING_STATUS_REQUIRED: 'Housing status is required',

  // Situation Descriptions
  FINANCIAL_SITUATION_REQUIRED: 'Please describe your current financial situation',
  FINANCIAL_SITUATION_MIN: (min: number) => `Description must be at least ${min} characters`,
  FINANCIAL_SITUATION_MAX: (max: number) => `Description cannot exceed ${max} characters`,

  EMPLOYMENT_CIRCUMSTANCES_REQUIRED: 'Please describe your employment circumstances',
  EMPLOYMENT_CIRCUMSTANCES_MIN: (min: number) => `Description must be at least ${min} characters`,
  EMPLOYMENT_CIRCUMSTANCES_MAX: (max: number) => `Description cannot exceed ${max} characters`,

  REASON_FOR_APPLYING_REQUIRED: 'Please explain your reason for applying',
  REASON_FOR_APPLYING_MIN: (min: number) => `Description must be at least ${min} characters`,
  REASON_FOR_APPLYING_MAX: (max: number) => `Description cannot exceed ${max} characters`,
} as const;

// OpenAI Service Messages
export const OPENAI_MESSAGES = {
  API_KEY_NOT_CONFIGURED:
    'OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your environment.',
  EMPTY_RESPONSE: 'Received an empty response from the AI. Please try again.',
  INVALID_RESPONSE: 'Received an invalid response from the AI service.',
  INVALID_API_KEY: 'Invalid OpenAI API key. Please check your configuration.',
  TOO_MANY_REQUESTS: 'Too many requests. Please wait a moment and try again.',
  SERVICE_UNAVAILABLE: 'OpenAI service is experiencing issues. Please try again later.',
  SERVICE_ERROR: (status: number) => `AI service error: ${status}`,
  REQUEST_TIMEOUT: 'Request timed out. The AI took too long to respond. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  UNEXPECTED_ERROR: 'An unexpected error occurred while generating content. Please try again.',
} as const;

// API Service Messages
export const API_MESSAGES = {
  INVALID_SUBMISSION_DATA: 'Invalid submission data: full name is required',
  SERVER_ERROR: (status: number) => `Server error: ${status}`,
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again.',
} as const;
