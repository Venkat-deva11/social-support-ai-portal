/**
 * Wizard Component Types
 * All types related to wizard/stepper navigation
 */

export interface ApplicationStepperProps {
  activeStep: number;
}

export interface WizardNavigationProps {
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

export interface StepConfig {
  id: number;
  label: string;
  componentId: string;
}