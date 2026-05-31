import React from 'react';
import { Box, Stepper, Step, StepLabel, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { STEPS } from '../../constants';
import { useSitecoreContent } from '../../hooks/useSitecoreContent';
import { isNotEmptyArray } from '../../utils/common';
import type { ApplicationStepperProps } from './types';

const STEPS_CONFIG = [
  { labelKey: 'pages.personalInformation.title', componentId: 'personal-info-step' },
  { labelKey: 'pages.familyFinancialInformation.title', componentId: 'family-financial-step' },
  { labelKey: 'pages.situationDescriptions.title', componentId: 'situation-description-step' },
];

/**
 * Application Stepper Component
 * Displays progress through the application wizard steps
 */
const ApplicationStepper: React.FC<ApplicationStepperProps> = ({ activeStep }) => {
  const { t } = useTranslation();
  useSitecoreContent('application-stepper'); // Preload content

  return (
    <Box
      sx={{
        width: '100%',
        py: 3,
      }}
      role="navigation"
      aria-label="Application progress"
    >
      <Stepper
        activeStep={activeStep - 1}
        alternativeLabel
        aria-label={`${t('common.step')} ${activeStep} ${t('common.of')} 3`}
      >
        {isNotEmptyArray(STEPS_CONFIG)
          ? STEPS_CONFIG.map((step, index) => (
              <Step
                key={step.componentId}
                completed={activeStep > index + 1}
                aria-label={t(step.labelKey)}
              >
                <StepLabel>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: activeStep === index + 1 ? 600 : 400 }}
                  >
                    {t(step.labelKey)}
                  </Typography>
                </StepLabel>
              </Step>
            ))
          : null}
      </Stepper>
    </Box>
  );
};

export default ApplicationStepper;