/**
 * Validation Schemas
 * Yup schemas for form validation
 */

import * as yup from 'yup';
import { FORM_LIMITS } from '../constants';

// Personal Information Schema
export const personalInfoSchema = yup.object({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(
      FORM_LIMITS.FULL_NAME_MIN,
      `Full name must be at least ${FORM_LIMITS.FULL_NAME_MIN} characters`
    )
    .max(
      FORM_LIMITS.FULL_NAME_MAX,
      `Full name cannot exceed ${FORM_LIMITS.FULL_NAME_MAX} characters`
    )
    .matches(/^[a-zA-Z0-9\s]+$/, 'Only alphanumeric characters allowed'),

  nationalId: yup
    .string()
    .required('National ID is required')
    .min(
      FORM_LIMITS.NATIONAL_ID_MIN,
      `National ID must be at least ${FORM_LIMITS.NATIONAL_ID_MIN} characters`
    )
    .max(
      FORM_LIMITS.NATIONAL_ID_MAX,
      `National ID cannot exceed ${FORM_LIMITS.NATIONAL_ID_MAX} characters`
    )
    .matches(/^[a-zA-Z0-9]+$/, 'Only alphanumeric characters allowed'),

  dateOfBirth: yup
    .string()
    .required('Date of birth is required')
    .test('valid-date', 'Please enter a valid date', (value) => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test('age-18', 'Applicant must be 18 years or older', (value) => {
      if (!value) return false;
      const dob = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      return age >= 18;
    }),

  gender: yup.string().required('Gender is required'),

  address: yup
    .string()
    .required('Address is required')
    .min(
      FORM_LIMITS.ADDRESS_MIN,
      `Address must be at least ${FORM_LIMITS.ADDRESS_MIN} characters`
    ),

  city: yup.string().required('City is required'),

  state: yup.string().required('State/Province is required'),

  country: yup.string().required('Country is required'),

  phone: yup
    .string()
    .required('Phone number is required')
    .matches(
      /^\+?[\d\s-()]{10,}$/,
      'Please enter a valid phone number'
    ),

  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address'),
});

// Family Financial Schema
export const familyFinancialSchema = yup.object({
  maritalStatus: yup.string().required('Marital status is required'),

  dependents: yup
    .number()
    .required('Number of dependents is required')
    .min(0, 'Please enter a valid number (0 or more)'),

  employmentStatus: yup.string().required('Employment status is required'),

  monthlyIncome: yup
    .number()
    .required('Monthly income is required')
    .min(0, 'Please enter a valid positive number'),

  housingStatus: yup.string().required('Housing status is required'),
});

// Situation Descriptions Schema
export const situationDescriptionsSchema = yup.object({
  financialSituation: yup
    .string()
    .required('Please describe your current financial situation')
    .min(
      FORM_LIMITS.TEXTAREA_MIN,
      `Description must be at least ${FORM_LIMITS.TEXTAREA_MIN} characters`
    )
    .max(
      FORM_LIMITS.TEXTAREA_MAX,
      `Description cannot exceed ${FORM_LIMITS.TEXTAREA_MAX} characters`
    ),

  employmentCircumstances: yup
    .string()
    .required('Please describe your employment circumstances')
    .min(
      FORM_LIMITS.TEXTAREA_MIN,
      `Description must be at least ${FORM_LIMITS.TEXTAREA_MIN} characters`
    )
    .max(
      FORM_LIMITS.TEXTAREA_MAX,
      `Description cannot exceed ${FORM_LIMITS.TEXTAREA_MAX} characters`
    ),

  reasonForApplying: yup
    .string()
    .required('Please explain your reason for applying')
    .min(
      FORM_LIMITS.TEXTAREA_MIN,
      `Description must be at least ${FORM_LIMITS.TEXTAREA_MIN} characters`
    )
    .max(
      FORM_LIMITS.TEXTAREA_MAX,
      `Description cannot exceed ${FORM_LIMITS.TEXTAREA_MAX} characters`
    ),
});

// Type exports inferred from schemas
export type PersonalInfoFormData = yup.InferType<typeof personalInfoSchema>;
export type FamilyFinancialFormData = yup.InferType<typeof familyFinancialSchema>;
export type SituationDescriptionsFormData = yup.InferType<typeof situationDescriptionsSchema>;

export default {
  personalInfoSchema,
  familyFinancialSchema,
  situationDescriptionsSchema,
};
