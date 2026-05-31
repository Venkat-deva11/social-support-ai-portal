// Application-wide constants

export const STEPS = {
  PERSONAL_INFO: 1,
  FAMILY_FINANCIAL: 2,
  SITUATION_DESCRIPTIONS: 3,
} as const;

export const STEP_NAMES = {
  [STEPS.PERSONAL_INFO]: 'Personal Information',
  [STEPS.FAMILY_FINANCIAL]: 'Family & Financial',
  [STEPS.SITUATION_DESCRIPTIONS]: 'Situation Description',
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  MIN_LENGTH: (min: number) => `Minimum ${min} characters required`,
  MAX_LENGTH: (max: number) => `Maximum ${max} characters allowed`,
  MIN_AGE: 'Applicant must be 18 years or older',
  ALPHANUMERIC: 'Only alphanumeric characters allowed',
  POSITIVE_NUMBER: 'Please enter a valid positive number',
} as const;

export const FORM_LIMITS = {
  FULL_NAME_MIN: 3,
  FULL_NAME_MAX: 100,
  NATIONAL_ID_MIN: 8,
  NATIONAL_ID_MAX: 20,
  ADDRESS_MIN: 10,
  TEXTAREA_MIN: 50,
  TEXTAREA_MAX: 2000,
} as const;

export const STORAGE_KEYS = {
  APPLICATION_DATA: 'social_support_application',
  CURRENT_STEP: 'social_support_current_step',
  LANGUAGE: 'social_support_language',
} as const;

export const API_TIMEOUT = 30000;
export const AI_ASSISTANCE_TIMEOUT = 60000;

export const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'] as const;

export const MARITAL_STATUS_OPTIONS = [
  'Single',
  'Married',
  'Divorced',
  'Widowed',
  'Separated',
] as const;

export const EMPLOYMENT_STATUS_OPTIONS = [
  'Employed',
  'Unemployed',
  'Self-employed',
  'Student',
  'Retired',
  'Disabled',
  'Other',
] as const;

export const HOUSING_STATUS_OPTIONS = [
  'Own',
  'Rent',
  'Live with family',
  'Homeless',
  'Other',
] as const;

export const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'Austria',
  'Japan',
  'India',
  'China',
  'Brazil',
  'Mexico',
  'Argentina',
  'South Korea',
  'Singapore',
  'Hong Kong',
  'Indonesia',
  'Malaysia',
  'Thailand',
  'Philippines',
  'Vietnam',
  'New Zealand',
  'South Africa',
  'Nigeria',
  'Kenya',
  'Ghana',
  'Ethiopia',
  'Tanzania',
  'Uganda',
  'Rwanda',
  'Senegal',
  'Ivory Coast',
  'Cameroon',
  'Saudi Arabia',
  'United Arab Emirates',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'Oman',
  'Egypt',
  'Jordan',
  'Lebanon',
  'Iraq',
  'Iran',
  'Turkey',
  'Israel',
  'Pakistan',
  'Bangladesh',
  'Sri Lanka',
  'Nepal',
  'Afghanistan',
  'Morocco',
  'Algeria',
  'Tunisia',
  'Libya',
  'Sudan',
  'Other',
] as const;

export const MAX_TEXT=2000