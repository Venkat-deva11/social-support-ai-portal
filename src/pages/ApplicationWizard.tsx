import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  LinearProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import type { RootState, AppDispatch } from '../app/store';
import {
  setCurrentStep,
  setSubmitting,
  setSubmitError,
  setSubmitted,
  restoreApplication,
} from '../features/application/applicationSlice';
import { StorageService } from '../utils/storage';
import { ApiService } from '../services/api/apiService';
import { STEPS, STEP_NAMES } from '../constants';

import ApplicationStepper from '../components/wizard/ApplicationStepper';
import WizardNavigation from '../components/wizard/WizardNavigation';
import PersonalInfoForm, { PersonalInfoFormRef } from '../components/forms/PersonalInfoForm';
import FamilyFinancialForm, { FamilyFinancialFormRef } from '../components/forms/FamilyFinancialForm';
import SituationDescriptionsForm, { SituationDescriptionsFormRef } from '../components/forms/SituationDescriptionsForm';

import {
  personalInfoSchema,
  familyFinancialSchema,
  situationDescriptionsSchema,
} from '../utils/validation';

const ApplicationWizard: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    currentStep,
    formData,
    isSubmitting,
    submitError,
    language,
  } = useSelector((state: RootState) => state.application);

  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const prevStepRef = useRef(currentStep);
  const wasResetRef = useRef(false);

  // Refs for each form to trigger validation
  const personalInfoRef = useRef<PersonalInfoFormRef>(null);
  const familyFinancialRef = useRef<FamilyFinancialFormRef>(null);
  const situationDescriptionsRef = useRef<SituationDescriptionsFormRef>(null);

  const TOTAL_STEPS = 3;

  const getFormRef = () => {
    switch (currentStep) {
      case STEPS.PERSONAL_INFO:
        return personalInfoRef;
      case STEPS.FAMILY_FINANCIAL:
        return familyFinancialRef;
      case STEPS.SITUATION_DESCRIPTIONS:
        return situationDescriptionsRef;
      default:
        return null;
    }
  };

  // Restore saved application on mount
  useEffect(() => {
    const savedApp = StorageService.loadApplication();
    if (savedApp) {
      // Small delay to ensure store is ready
      setTimeout(() => {
        dispatch(
          restoreApplication({
            currentStep: savedApp.currentStep,
            formData: savedApp.formData,
            language: savedApp.language,
          })
        );
      }, 0);
    }
  }, [dispatch]);

  // Auto-save on step change
  useEffect(() => {
    // Skip saving if we just reset
    if (wasResetRef.current) {
      wasResetRef.current = false;
      return;
    }
    // Debounce to avoid rapid saves
    const timeoutId = setTimeout(() => {
      StorageService.saveApplication(currentStep, formData, language);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [currentStep, formData, language]);

  // Force form re-render when formData is reset (from clear)
  useEffect(() => {
    if (formData.personalInfo.fullName === '' &&
        formData.familyFinancialInfo.maritalStatus === '' &&
        formData.situationDescriptions.financialSituation === '' &&
        currentStep === 1 &&
        StorageService.loadApplication() === null) {
      // Form was reset and no data in storage - remount forms
      setResetKey(prev => prev + 1);
      wasResetRef.current = true;
    }
  }, [formData, currentStep]);

  // Reset refs when step changes
  useEffect(() => {
    if (prevStepRef.current !== currentStep) {
      prevStepRef.current = currentStep;
    }
  }, [currentStep]);

  const validateStep = useCallback(
    async (step: number): Promise<boolean> => {
      let schema: any;

      switch (step) {
        case STEPS.PERSONAL_INFO:
          schema = personalInfoSchema;
          break;
        case STEPS.FAMILY_FINANCIAL:
          schema = familyFinancialSchema;
          break;
        case STEPS.SITUATION_DESCRIPTIONS:
          schema = situationDescriptionsSchema;
          break;
        default:
          return true;
      }

      try {
        // Get the appropriate form data based on step
        const dataForValidation = step === STEPS.PERSONAL_INFO
          ? formData.personalInfo
          : step === STEPS.FAMILY_FINANCIAL
          ? formData.familyFinancialInfo
          : formData.situationDescriptions;

        await schema.validate(dataForValidation, { abortEarly: false });
        return true;
      } catch (error: any) {
        // Extract errors from yup validation
        if (error.inner && Array.isArray(error.inner)) {
          // Show first error as toast (for user feedback)
          if (error.inner.length > 0) {
            toast.error(error.inner[0].message, {
              position: 'bottom-right',
            });
          }
        }
        return false;
      }
    },
    [formData]
  );

  const handleNext = useCallback(async () => {
    // Trigger form validation first to show field-level errors
    const formRef = getFormRef();
    let isFormValid = true;

    if (formRef?.current?.triggerValidation) {
      isFormValid = await formRef.current.triggerValidation();
    }

    if (!isFormValid) {
      return; // Don't proceed if form is invalid - field errors will show
    }

    const isValid = await validateStep(currentStep);

    if (isValid) {
      if (currentStep < TOTAL_STEPS) {
        dispatch(setCurrentStep(currentStep + 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [currentStep, validateStep, dispatch]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      dispatch(setCurrentStep(currentStep - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, dispatch]);

  const handleSubmitForm = useCallback(async () => {
    // Trigger form validation first
    const formRef = getFormRef();
    let isFormValid = true;

    if (formRef?.current?.triggerValidation) {
      isFormValid = await formRef.current.triggerValidation();
    }

    if (!isFormValid) {
      return; // Don't proceed if form is invalid
    }

    const isValid = await validateStep(currentStep);

    if (!isValid) {
      return;
    }

    dispatch(setSubmitting(true));
    dispatch(setSubmitError(null));

    try {
      const result = await ApiService.submitApplication({
        personalInfo: formData.personalInfo as unknown as Record<string, string | number>,
        familyFinancialInfo: formData.familyFinancialInfo as unknown as Record<string, string | number>,
        situationDescriptions: formData.situationDescriptions as unknown as Record<string, string>,
      });

      if (result.success) {
        dispatch(setSubmitted(true));
        StorageService.clearApplication();
        navigate('/success');
      } else {
        dispatch(setSubmitError(result.error || 'Submission failed. Please try again.'));
      }
    } catch {
      dispatch(setSubmitError('An unexpected error occurred. Please try again.'));
    } finally {
      dispatch(setSubmitting(false));
    }
  }, [currentStep, validateStep, formData, dispatch, navigate]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case STEPS.PERSONAL_INFO:
        return <PersonalInfoForm key={resetKey} ref={personalInfoRef} />;
      case STEPS.FAMILY_FINANCIAL:
        return <FamilyFinancialForm key={resetKey} ref={familyFinancialRef} />;
      case STEPS.SITUATION_DESCRIPTIONS:
        return <SituationDescriptionsForm key={resetKey} ref={situationDescriptionsRef} />;
      default:
        return null;
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          minHeight: '70vh',
        }}
        role="main"
        aria-labelledby="wizard-title"
      >
        <Typography
          id="wizard-title"
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ mb: 2, textAlign: 'center', color: 'primary.main', fontWeight: 'bold' }}
        >
          {t('common.appName')}
        </Typography>

        <ApplicationStepper activeStep={currentStep} />

        <LinearProgress
          variant="determinate"
          value={progress}
          aria-label={`Progress: ${Math.round(progress)}%`}
          sx={{
            height: 8,
            borderRadius: 4,
            mb: 4,
            backgroundColor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'primary.main',
            },
          }}
        />

        <Box
          sx={{
            backgroundColor: 'grey.50',
            p: 3,
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {STEP_NAMES[currentStep as keyof typeof STEP_NAMES]}
          </Typography>
        </Box>

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(setSubmitError(null))}>
            {submitError}
          </Alert>
        )}

        <Box
          sx={{
            opacity: isSubmitting ? 0.6 : 1,
            pointerEvents: isSubmitting ? 'none' : 'auto',
          }}
        >
          {renderCurrentStep()}
        </Box>

        <WizardNavigation
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isPreviousDisabled={currentStep === 1}
          showSubmit={currentStep === TOTAL_STEPS}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmitForm}
        />
      </Paper>

      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowSuccessSnackbar(false)}>
          {t('common.applicationSubmitted')}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ApplicationWizard;
