import axios, { AxiosError } from 'axios';
import { AI_ASSISTANCE_TIMEOUT } from '../../constants';
import type { ApiResponse } from '../../types';

// OpenAI API Configuration from environment variables
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string;
const MODEL = (import.meta.env.VITE_OPENAI_MODEL as string) || 'gpt-3.5-turbo';
const ENDPOINT =
  (import.meta.env.VITE_OPENAI_ENDPOINT as string) ||
  'https://api.openai.com/v1/chat/completions';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface OpenAIChoice {
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

interface OpenAIResponse {
  choices: OpenAIChoice[];
  error?: {
    message: string;
    type: string;
    code?: string;
  };
}

export type AIAuthoringField = 'financialSituation' | 'employmentCircumstances' | 'reasonForApplying';

/**
 * Get appropriate system prompt based on field type
 */
const getSystemPrompt = (field: AIAuthoringField): string => {
  const prompts = {
    financialSituation:
      'You are a helpful assistant helping a government social support applicant describe their financial situation. Write a clear, respectful, and professional paragraph (50-200 words) that describes financial hardship. Focus on factual description of income, expenses, debts, and challenges without exaggeration or emotional manipulation.',
    employmentCircumstances:
      'You are a helpful assistant helping a government social support applicant describe their employment circumstances. Write a clear, respectful, and professional paragraph (50-200 words) that describes their employment status, work history, and any job-related challenges. Be factual and professional.',
    reasonForApplying:
      'You are a helpful assistant helping a government social support applicant explain why they need financial assistance. Write a clear, respectful, and professional paragraph (50-200 words) that explains their situation and why they are seeking help. Focus on genuine need without exaggeration.',
  };

  return prompts[field];
};

/**
 * Get user prompt context based on field type and any existing content
 */
const getUserPrompt = (
  field: AIAuthoringField,
  existingContext?: string
): string => {
  const basePrompts = {
    financialSituation:
      existingContext && existingContext.length > 10
        ? `Based on this context: "${existingContext}", help me write a detailed paragraph describing my current financial situation for a government social support application.`
        : 'Help me write a paragraph describing my current financial situation for a government social support application. Be factual and professional.',
    employmentCircumstances:
      existingContext && existingContext.length > 10
        ? `Based on this context: "${existingContext}", help me write a detailed paragraph describing my employment circumstances for a government social support application.`
        : 'Help me write a paragraph describing my employment circumstances for a government social support application. Be factual and professional.',
    reasonForApplying:
      existingContext && existingContext.length > 10
        ? `Based on this context: "${existingContext}", help me write a detailed paragraph explaining why I need to apply for social support.`
        : 'Help me write a paragraph explaining why I need to apply for social support. Be factual and professional.',
  };

  return basePrompts[field];
};

/**
 * OpenAI Service for AI-assisted text generation
 */
export const OpenAIService = {
  /**
   * Generate text using OpenAI API
   */
  generateText: async (
    field: AIAuthoringField,
    existingContext?: string
  ): Promise<ApiResponse<string>> => {
    // Check if API key is configured
    if (!API_KEY || API_KEY === 'your_openai_api_key_here') {
      return {
        success: false,
        error: 'OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your environment.',
      };
    }

    try {
      const request: OpenAIRequest = {
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(field),
          },
          {
            role: 'user',
            content: getUserPrompt(field, existingContext),
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      };

      const response = await axios.post<OpenAIResponse>(ENDPOINT, request, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        timeout: AI_ASSISTANCE_TIMEOUT,
      });

      // Validate response structure
      if (
        response.data &&
        response.data.choices &&
        response.data.choices.length > 0 &&
        response.data.choices[0].message
      ) {
        const generatedText = response.data.choices[0].message.content.trim();

        if (!generatedText) {
          return {
            success: false,
            error: 'Received an empty response from the AI. Please try again.',
          };
        }

        return {
          success: true,
          data: generatedText,
        };
      }

      return {
        success: false,
        error: 'Received an invalid response from the AI service.',
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      // Handle specific error cases
      if (axiosError.response) {
        const status = axiosError.response.status;

        if (status === 401) {
          return {
            success: false,
            error: 'Invalid OpenAI API key. Please check your configuration.',
          };
        } else if (status === 429) {
          return {
            success: false,
            error: 'Too many requests. Please wait a moment and try again.',
          };
        } else if (status === 500) {
          return {
            success: false,
            error: 'OpenAI service is experiencing issues. Please try again later.',
          };
        }

        return {
          success: false,
          error: `AI service error: ${status}`,
        };
      } else if (axiosError.code === 'ECONNABORTED') {
        return {
          success: false,
          error: 'Request timed out. The AI took too long to respond. Please try again.',
        };
      } else if (axiosError.message.includes('Network Error')) {
        return {
          success: false,
          error: 'Network error. Please check your internet connection.',
        };
      }

      return {
        success: false,
        error: 'An unexpected error occurred while generating content. Please try again.',
      };
    }
  },

  /**
   * Check if OpenAI is properly configured
   */
  isConfigured: (): boolean => {
    return Boolean(API_KEY && API_KEY !== 'your_openai_api_key_here');
  },

  /**
   * Get current configuration status
   */
  getConfigStatus: (): {
    hasApiKey: boolean;
    model: string;
    endpoint: string;
  } => {
    return {
      hasApiKey: Boolean(API_KEY && API_KEY !== 'your_openai_api_key_here'),
      model: MODEL,
      endpoint: ENDPOINT,
    };
  },
};

export default OpenAIService;