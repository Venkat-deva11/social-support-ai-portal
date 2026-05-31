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
import PersonalInfoForm from '../components/forms/PersonalInfoForm';
import FamilyFinancialForm from '../components/forms/FamilyFinancialForm';
import SituationDescriptionsForm from '../components/forms/SituationDescriptionsForm';
import type { PersonalInfoFormRef, FamilyFinancialFormRef, SituationDescriptionsFormRef } from '../components/forms/types';

import {
  personalInfoSchema,
  familyFinancialSchema,
  situationDescriptionsSchema,
} from '../utils/validation';
import { isNotEmptyString } from '../utils/common';

/**
 * Application Wizard Component
 * Main form wizard that orchestrates multi-step form flow
 */
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
  } = useSelector((state: RootState) => state?.application ?? {});

  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const prevStepRef = useRef(currentStep);
  const wasResetRef = useRef(false);

  const personalInfoRef = useRef<PersonalInfoFormRef | null>(null);
  const familyFinancialRef = useRef<FamilyFinancialFormRef | null>(null);
  const situationDescriptionsRef = useRef<SituationDescriptionsFormRef | null>(null);

  const TOTAL_STEPS = 3;

  const getFormRef = useCallback(() => {
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
  }, [currentStep]);

  useEffect(() => {
    const savedApp = StorageService.loadApplication();
    if (savedApp) {
      // Small delay to ensure store is ready
      const timeoutId = setTimeout(() => {
        dispatch(
          restoreApplication({
            currentStep: savedApp?.currentStep,
            formData: savedApp?.formData,
            language: savedApp?.language,
          })
        );
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [dispatch]);

  useEffect(() => {
    if (wasResetRef.current) {
      wasResetRef.current = false;
      return;
    }
    // Debounce to avoid rapid saves
    const timeoutId = setTimeout(() => {
      StorageService.saveApplication(
        currentStep ?? STEPS.PERSONAL_INFO,
        formData ?? {},
        language ?? 'en'
      );
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [currentStep, formData, language]);

  useEffect(() => {
    const personalInfoEmpty = !isNotEmptyString(formData?.personalInfo?.fullName);
    const familyInfoEmpty = !isNotEmptyString(formData?.familyFinancialInfo?.maritalStatus);
    const situationEmpty = !isNotEmptyString(formData?.situationDescriptions?.financialSituation);
    const isAtFirstStep = currentStep === 1;
    const hasNoSavedData = !StorageService.loadApplication();

    if (personalInfoEmpty && familyInfoEmpty && situationEmpty && isAtFirstStep && hasNoSavedData) {
      setResetKey((prev) => prev + 1);
      wasResetRef.current = true;
    }
  }, [formData, currentStep]);

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
        const dataForValidation =
          step === STEPS.PERSONAL_INFO
            ? formData?.personalInfo
            : step === STEPS.FAMILY_FINANCIAL
            ? formData?.familyFinancialInfo
            : formData?.situationDescriptions;

        await schema.validate(dataForValidation, { abortEarly: false });
        return true;
      } catch (error: any) {
        const errors = error?.inner;
        if (Array.isArray(errors) && errors.length > 0) {
          toast.error(errors[0]?.message ?? 'Validation error', {
            position: 'bottom-right',
          });
        }
        return false;
      }
    },
    [formData]
  );

  const handleNext = useCallback(async () => {
    const formRef = getFormRef();
    let isFormValid = true;

    if (formRef?.current?.triggerValidation) {
      isFormValid = await formRef.current.triggerValidation();
    }

    if (!isFormValid) {
      return; 
    }

    const isValid = await validateStep(currentStep ?? STEPS.PERSONAL_INFO);

    if (isValid) {
      if ((currentStep ?? 1) < TOTAL_STEPS) {
        dispatch(setCurrentStep((currentStep ?? 1) + 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [currentStep, validateStep, dispatch, getFormRef]);

  const handlePrevious = useCallback(() => {
    if ((currentStep ?? 1) > 1) {
      dispatch(setCurrentStep((currentStep ?? 1) - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, dispatch]);

  const handleSubmitForm = useCallback(async () => {
    const formRef = getFormRef();
    let isFormValid = true;

    if (formRef?.current?.triggerValidation) {
      isFormValid = await formRef.current.triggerValidation();
    }

    if (!isFormValid) {
      return; 
    }

    const isValid = await validateStep(currentStep ?? STEPS.PERSONAL_INFO);

    if (!isValid) {
      return;
    }

    dispatch(setSubmitting(true));
    dispatch(setSubmitError(null));

    try {
      const result = await ApiService.submitApplication({
        personalInfo: formData?.personalInfo as unknown as Record<string, string | number>,
        familyFinancialInfo: formData?.familyFinancialInfo as unknown as Record<string, string | number>,
        situationDescriptions: formData?.situationDescriptions as unknown as Record<string, string>,
      });

      if (result?.success) {
        dispatch(setSubmitted(true));
        StorageService.clearApplication();
        navigate('/success');
      } else {
        dispatch(setSubmitError(result?.error ?? 'Submission failed. Please try again.'));
      }
    } catch {
      dispatch(setSubmitError('An unexpected error occurred. Please try again.'));
    } finally {
      dispatch(setSubmitting(false));
    }
  }, [currentStep, validateStep, formData, dispatch, navigate, getFormRef]);

  const renderCurrentStep = useCallback(() => {
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
  }, [currentStep, resetKey]);

  const progress = ((currentStep ?? 1) / TOTAL_STEPS) * 100;
  const currentStepKey = currentStep as keyof typeof STEP_NAMES;

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
          {t('common.appName') ?? 'Social Support Application'}
        </Typography>

        <ApplicationStepper activeStep={currentStep ?? 1} />

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
            {STEP_NAMES[currentStepKey] ?? 'Step'}
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
          currentStep={currentStep ?? 1}
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
          {t('common.applicationSubmitted') ?? 'Application submitted successfully'}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ApplicationWizard;