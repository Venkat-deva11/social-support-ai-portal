/**
 * Validation Schemas
 * Yup schemas for form validation
 */

import * as yup from 'yup';
import { FORM_LIMITS } from '../constants';
import { VALIDATION_MESSAGES } from '../messages';

// Personal Information Schema
export const personalInfoSchema = yup.object({
  fullName: yup
    .string()
    .required(VALIDATION_MESSAGES.FULL_NAME_REQUIRED)
    .min(
      FORM_LIMITS.FULL_NAME_MIN,
      VALIDATION_MESSAGES.FULL_NAME_MIN(FORM_LIMITS.FULL_NAME_MIN)
    )
    .max(
      FORM_LIMITS.FULL_NAME_MAX,
      VALIDATION_MESSAGES.FULL_NAME_MAX(FORM_LIMITS.FULL_NAME_MAX)
    )
    .matches(/^[a-zA-Z0-9\s]+$/, VALIDATION_MESSAGES.FULL_NAME_ALPHANUMERIC),

  nationalId: yup
    .string()
    .required(VALIDATION_MESSAGES.NATIONAL_ID_REQUIRED)
    .min(
      FORM_LIMITS.NATIONAL_ID_MIN,
      VALIDATION_MESSAGES.NATIONAL_ID_MIN(FORM_LIMITS.NATIONAL_ID_MIN)
    )
    .max(
      FORM_LIMITS.NATIONAL_ID_MAX,
      VALIDATION_MESSAGES.NATIONAL_ID_MAX(FORM_LIMITS.NATIONAL_ID_MAX)
    )
    .matches(/^[a-zA-Z0-9]+$/, VALIDATION_MESSAGES.NATIONAL_ID_ALPHANUMERIC),

  dateOfBirth: yup
    .string()
    .required(VALIDATION_MESSAGES.DATE_OF_BIRTH_REQUIRED)
    .test('valid-date', VALIDATION_MESSAGES.DATE_OF_BIRTH_INVALID, (value) => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test('age-18', VALIDATION_MESSAGES.AGE_18_REQUIRED, (value) => {
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

  gender: yup.string().required(VALIDATION_MESSAGES.GENDER_REQUIRED),

  address: yup
    .string()
    .required(VALIDATION_MESSAGES.ADDRESS_REQUIRED)
    .min(
      FORM_LIMITS.ADDRESS_MIN,
      VALIDATION_MESSAGES.ADDRESS_MIN(FORM_LIMITS.ADDRESS_MIN)
    ),

  city: yup.string().required(VALIDATION_MESSAGES.CITY_REQUIRED),

  state: yup.string().required(VALIDATION_MESSAGES.STATE_REQUIRED),

  country: yup.string().required(VALIDATION_MESSAGES.COUNTRY_REQUIRED),

  phone: yup
    .string()
    .required(VALIDATION_MESSAGES.PHONE_REQUIRED)
    .matches(
      /^\+?[\d\s-()]{10,}$/,
      VALIDATION_MESSAGES.PHONE_INVALID
    ),

  email: yup
    .string()
    .required(VALIDATION_MESSAGES.EMAIL_REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL_INVALID),
});

// Family Financial Schema
export const familyFinancialSchema = yup.object({
  maritalStatus: yup.string().required(VALIDATION_MESSAGES.MARITAL_STATUS_REQUIRED),

  dependents: yup
    .number()
    .required(VALIDATION_MESSAGES.DEPENDENTS_REQUIRED)
    .min(0, VALIDATION_MESSAGES.DEPENDENTS_INVALID),

  employmentStatus: yup.string().required(VALIDATION_MESSAGES.EMPLOYMENT_STATUS_REQUIRED),

  monthlyIncome: yup
    .number()
    .required(VALIDATION_MESSAGES.MONTHLY_INCOME_REQUIRED)
    .min(0, VALIDATION_MESSAGES.MONTHLY_INCOME_INVALID),

  housingStatus: yup.string().required(VALIDATION_MESSAGES.HOUSING_STATUS_REQUIRED),
});

// Situation Descriptions Schema
export const situationDescriptionsSchema = yup.object({
  financialSituation: yup
    .string()
    .required(VALIDATION_MESSAGES.FINANCIAL_SITUATION_REQUIRED)
    .min(
      FORM_LIMITS.TEXTAREA_MIN,
      VALIDATION_MESSAGES.FINANCIAL_SITUATION_MIN(FORM_LIMITS.TEXTAREA_MIN)
    )
    .max(
      FORM_LIMITS.TEXTAREA_MAX,
      VALIDATION_MESSAGES.FINANCIAL_SITUATION_MAX(FORM_LIMITS.TEXTAREA_MAX)
    ),

  employmentCircumstances: yup
    .string()
    .required(VALIDATION_MESSAGES.EMPLOYMENT_CIRCUMSTANCES_REQUIRED)
    .min(
      FORM_LIMITS.TEXTAREA_MIN,
      VALIDATION_MESSAGES.EMPLOYMENT_CIRCUMSTANCES_MIN(FORM_LIMITS.TEXTAREA_MIN)
    )
    .max(
      FORM_LIMITS.TEXTAREA_MAX,
      VALIDATION_MESSAGES.EMPLOYMENT_CIRCUMSTANCES_MAX(FORM_LIMITS.TEXTAREA_MAX)
    ),

  reasonForApplying: yup
    .string()
    .required(VALIDATION_MESSAGES.REASON_FOR_APPLYING_REQUIRED)
    .min(
      FORM_LIMITS.TEXTAREA_MIN,
      VALIDATION_MESSAGES.REASON_FOR_APPLYING_MIN(FORM_LIMITS.TEXTAREA_MIN)
    )
    .max(
      FORM_LIMITS.TEXTAREA_MAX,
      VALIDATION_MESSAGES.REASON_FOR_APPLYING_MAX(FORM_LIMITS.TEXTAREA_MAX)
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
