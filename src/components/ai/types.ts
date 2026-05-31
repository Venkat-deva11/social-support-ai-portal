/**
 * AI Component Types
 * All types related to AI assistance components
 */

import type { AIAuthoringField } from '../../services/openai/types';

export interface AIAssistanceModalProps {
  open: boolean;
  onClose: () => void;
  field: AIAuthoringField;
  fieldLabel: string;
  existingContent?: string;
  onAccept: (content: string) => void;
  placeholder?: string;
  helperText?: string;
}

export interface UserData {
  personalInfo: {
    fullName: string;
    country: string;
    [key: string]: string | number;
  };
  familyFinancialInfo: {
    employmentStatus: string;
    monthlyIncome: number;
    [key: string]: string | number;
  };
}