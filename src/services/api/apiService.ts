/**
 * API Service
 * Handles application submission to backend
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_TIMEOUT } from '../../constants';
import { JSONPLACEHOLDER_API } from '../apiEndpoints';
import type { ApiResponse, SubmissionData, MockSubmissionResponse } from '../../types';
import { API_MESSAGES } from '../../messages';

/**
 * Axios instance with default configuration
 */
const createApiInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: JSONPLACEHOLDER_API.baseURL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const api = createApiInstance();

/**
 * API service for application submission
 */
export const ApiService = {
  /**
   * Submit application to mock API
   */
  submitApplication: async (
    data: SubmissionData
  ): Promise<ApiResponse<MockSubmissionResponse>> => {
    try {
      // Validate input data
      if (!data?.personalInfo?.fullName) {
        return {
          success: false,
          error: API_MESSAGES.INVALID_SUBMISSION_DATA,
        };
      }

      // Simulate API call to jsonplaceholder
      const response = await api.post<MockSubmissionResponse>(
        JSONPLACEHOLDER_API.endpoints.posts,
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
          id: response?.data?.id?.toString() ?? '1',
          referenceNumber,
          status: 'submitted',
          submittedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError?.response) {
        // Server responded with error status
        return {
          success: false,
          error: API_MESSAGES.SERVER_ERROR(axiosError.response.status),
        };
      } else if (axiosError?.request) {
        // Request was made but no response received
        return {
          success: false,
          error: API_MESSAGES.NETWORK_ERROR,
        };
      } else {
        // Something else happened
        return {
          success: false,
          error: API_MESSAGES.UNEXPECTED_ERROR,
        };
      }
    }
  },

  /**
   * Health check for API connectivity
   */
  healthCheck: async (): Promise<boolean> => {
    try {
      await api.get(`${JSONPLACEHOLDER_API.endpoints.posts}/1`);
      return true;
    } catch {
      return false;
    }
  },
};

export default ApiService;
