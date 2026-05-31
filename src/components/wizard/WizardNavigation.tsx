import React from 'react';
import { Box, Card, CardContent, Typography, Button, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setCurrentStep, updateFormData, resetForm } from '../../features/application/applicationSlice';
import { StorageService } from '../../utils/storage';
import i18n from '../../i18n';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onSubmit?: () => void;
  isNextDisabled?: boolean;
  isPreviousDisabled?: boolean;
  showSubmit?: boolean;
  isSubmitting?: boolean;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSubmit,
  isNextDisabled = false,
  isPreviousDisabled = false,
  showSubmit = false,
  isSubmitting = false,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNext = () => {
    if (onNext && !isNextDisabled) {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (onPrevious && !isPreviousDisabled) {
      onPrevious();
    }
  };

  const handleClearApplication = () => {
    dispatch(resetForm());
    StorageService.clearApplication();
    i18n.changeLanguage('en');
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
    toast.success(t('common.clearedSuccessfully'), {
      position: 'bottom-right',
      autoClose: 3000,
    });
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pt: 3,
        mt: 3,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
      role="navigation"
      aria-label="Form navigation"
    >
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={isPreviousDisabled || currentStep === 1}
          aria-label={`${t('common.previous')} ${currentStep > 1 ? `Step ${currentStep - 1}` : ''}`}
        >
          {t('common.previous')}
        </Button>

        {!showSubmit && (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={isNextDisabled}
            aria-label={`${t('common.next')} ${currentStep < totalSteps ? `Step ${currentStep + 1}` : ''}`}
          >
            {t('common.next')}
          </Button>
        )}

        {showSubmit && (
          <Button
            variant="contained"
            color="secondary"
            onClick={onSubmit}
            disabled={isSubmitting}
            aria-label={t('common.submit')}
          >
            {isSubmitting ? t('common.loading') : t('common.submit')}
          </Button>
        )}
      </Stack>

      <Button
        variant="text"
        color="error"
        onClick={handleClearApplication}
        aria-label={t('common.clearSavedApplication')}
      >
        {t('common.clearSavedApplication')}
      </Button>
    </Box>
  );
};

export default WizardNavigation;