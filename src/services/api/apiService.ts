import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_TIMEOUT } from '../../constants';
import type { ApiResponse } from '../../types';

interface SubmissionData {
  personalInfo: Record<string, string | number>;
  familyFinancialInfo: Record<string, string | number>;
  situationDescriptions: Record<string, string>;
}

interface MockSubmissionResponse {
  id: string;
  referenceNumber: string;
  status: string;
  submittedAt: string;
}

/**
 * API service for application submission
 * Uses jsonplaceholder for mock API calls
 */
export const ApiService = {
  /**
   * Axios instance with default configuration
   */
  api: axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  }) as AxiosInstance,

  /**
   * Submit application to mock API
   */
  submitApplication: async (
    data: SubmissionData
  ): Promise<ApiResponse<MockSubmissionResponse>> => {
    try {
      // Simulate API call to jsonplaceholder
      const response = await ApiService.api.post<MockSubmissionResponse>(
        '/posts',
        {
          title: `Application: ${data.personalInfo.fullName}`,
          body: JSON.stringify(data),
          userId: 1,
        }
      );

      // Generate a mock reference number
      const referenceNumber = `SSA-${Date.now().toString(36).toUpperCase()}`;

      return {
        success: true,
        data: {
          id: response.data.id?.toString() || '1',
          referenceNumber,
          status: 'submitted',
          submittedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        // Server responded with error status
        return {
          success: false,
          error: `Server error: ${axiosError.response.status}`,
        };
      } else if (axiosError.request) {
        // Request was made but no response received
        return {
          success: false,
          error: 'Network error. Please check your connection.',
        };
      } else {
        // Something else happened
        return {
          success: false,
          error: 'An unexpected error occurred. Please try again.',
        };
      }
    }
  },

  /**
   * Health check for API connectivity
   */
  healthCheck: async (): Promise<boolean> => {
    try {
      await ApiService.api.get('/posts/1');
      return true;
    } catch {
      return false;
    }
  },
};

export default ApiService;