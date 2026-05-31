import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ApplicationFormData, Language } from '../../types';
import { STEPS } from '../../constants';

interface ApplicationState {
  currentStep: number;
  formData: ApplicationFormData;
  isSubmitted: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  language: Language;
}

const initialFormData: ApplicationFormData = {
  personalInfo: {
    fullName: '',
    nationalId: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    email: '',
  },
  familyFinancialInfo: {
    maritalStatus: '',
    dependents: 0,
    employmentStatus: '',
    monthlyIncome: 0,
    housingStatus: '',
  },
  situationDescriptions: {
    financialSituation: '',
    employmentCircumstances: '',
    reasonForApplying: '',
  },
};

const initialState: ApplicationState = {
  currentStep: STEPS.PERSONAL_INFO,
  formData: initialFormData,
  isSubmitted: false,
  isSubmitting: false,
  submitError: null,
  language: 'en',
};

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },

    updatePersonalInfo: (
      state,
      action: PayloadAction<Partial<ApplicationFormData['personalInfo']>>
    ) => {
      state.formData.personalInfo = {
        ...state.formData.personalInfo,
        ...action.payload,
      };
    },

    updateFamilyFinancialInfo: (
      state,
      action: PayloadAction<Partial<ApplicationFormData['familyFinancialInfo']>>
    ) => {
      state.formData.familyFinancialInfo = {
        ...state.formData.familyFinancialInfo,
        ...action.payload,
      };
    },

    updateSituationDescriptions: (
      state,
      action: PayloadAction<Partial<ApplicationFormData['situationDescriptions']>>
    ) => {
      state.formData.situationDescriptions = {
        ...state.formData.situationDescriptions,
        ...action.payload,
      };
    },

    updateFormData: (state, action: PayloadAction<ApplicationFormData>) => {
      state.formData = action.payload;
    },

    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },

    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },

    setSubmitError: (state, action: PayloadAction<string | null>) => {
      state.submitError = action.payload;
    },

    setSubmitted: (state, action: PayloadAction<boolean>) => {
      state.isSubmitted = action.payload;
    },

    resetForm: () => initialState,

    restoreApplication: (
      state,
      action: PayloadAction<{
        currentStep: number;
        formData: ApplicationFormData;
        language: Language;
      }>
    ) => {
      state.currentStep = action.payload.currentStep;
      state.formData = action.payload.formData;
      state.language = action.payload.language;
    },
  },
});

export const {
  setCurrentStep,
  updatePersonalInfo,
  updateFamilyFinancialInfo,
  updateSituationDescriptions,
  updateFormData,
  setLanguage,
  setSubmitting,
  setSubmitError,
  setSubmitted,
  resetForm,
  restoreApplication,
} = applicationSlice.actions;

export default applicationSlice.reducer;