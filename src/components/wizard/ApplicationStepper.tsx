import React from 'react';
import { Box, Stepper, Step, StepLabel, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { STEPS } from '../../constants';
import { useSitecoreContent } from '../../hooks/useSitecoreContent';

interface ApplicationStepperProps {
  activeStep: number;
}

const ApplicationStepper: React.FC<ApplicationStepperProps> = ({ activeStep }) => {
  const { t } = useTranslation();
  const content = useSitecoreContent('application-stepper');

  const steps = [
    { label: t('pages.personalInformation.title'), componentId: 'personal-info-step' },
    { label: t('pages.familyFinancialInformation.title'), componentId: 'family-financial-step' },
    { label: t('pages.situationDescriptions.title'), componentId: 'situation-description-step' },
  ];

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
        {steps.map((step, index) => (
          <Step
            key={step.componentId}
            completed={activeStep > index + 1}
            aria-label={step.label}
          >
            <StepLabel>
              <Typography
                variant="body2"
                sx={{ fontWeight: activeStep === index + 1 ? 600 : 400 }}
              >
                {step.label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default ApplicationStepper;