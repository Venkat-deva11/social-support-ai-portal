/**
 * API Service Types
 * All types related to API service layer
 */

export interface ValidationError {
  message: string;
  field?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SubmissionData {
  personalInfo: Record<string, string | number>;
  familyFinancialInfo: Record<string, string | number>;
  situationDescriptions: Record<string, string>;
}

export interface MockSubmissionResponse {
  id: string;
  referenceNumber: string;
  status: string;
  submittedAt: string;
}
