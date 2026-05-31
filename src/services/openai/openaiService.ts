/**
 * OpenAI Service
 * Handles AI-assisted text generation for form fields
 */

import axios, { AxiosError } from 'axios';
import { AI_ASSISTANCE_TIMEOUT } from '../../constants';
import { OPENAI_API } from '../apiEndpoints';
import type {
  ApiResponse,
  AIAuthoringField,
  OpenAIRequest,
  OpenAIResponse,
  FamilyFinancialInfo,
} from '../../types';
import { logTokenUsage } from '../../utils/openAIPromptHelper';
import { OPENAI_MESSAGES } from '../../messages';

// OpenAI API Configuration from environment variables
const API_KEY = (import.meta.env.VITE_OPENAI_API_KEY as string) ?? '';
const MODEL = (import.meta.env.VITE_OPENAI_MODEL as string) || OPENAI_API.defaultModel;
const ENDPOINT =
  (import.meta.env.VITE_OPENAI_ENDPOINT as string) ||
  `${OPENAI_API.baseURL}${OPENAI_API.endpoints.chatCompletions}`;

/**
 * Get simple system prompt - AI writes in first person as the user
 */
const getSystemPrompt = (field: AIAuthoringField): string => {
  const prompts: Record<AIAuthoringField, string> = {
    financialSituation:
      'Write in first person starting with "I am [employment status]" and include your monthly income. Keep it 1 paragraph only. Professional and factual. After stating employment status and income, describe only your financial challenges: expenses, debts, difficulties. Do NOT mention company name, job title, or specific salary amounts.',
    employmentCircumstances:
      'Write in first person starting with "I am [employment status]" and include your monthly income. Keep it 1 paragraph only. Professional and factual. Do NOT mention company name or job title. Use only the provided employment status and income.',
    reasonForApplying:
      'Write in first person as the applicant. Keep it 1 paragraph only. Professional and factual.',
  };

  return prompts[field] ?? prompts.reasonForApplying;
};

/**
 * Build user prompt using employment status and monthly income from Redux
 */
const buildUserPrompt = (
  field: AIAuthoringField,
  familyFinancialInfo: FamilyFinancialInfo | undefined
): string => {
  const employmentStatus = familyFinancialInfo?.employmentStatus ?? '';
  const monthlyIncome = familyFinancialInfo?.monthlyIncome;

  const incomeText =
    monthlyIncome !== undefined && monthlyIncome > 0
      ? ` with a monthly income of ${monthlyIncome}`
      : '';

  const prompts: Record<AIAuthoringField, string> = {
    financialSituation: employmentStatus
      ? `I am ${employmentStatus.toLowerCase()}${incomeText}. Help me write a paragraph about my financial situation for a government social support application. Start with "I am ${employmentStatus.toLowerCase()}${incomeText}" and then describe only your financial challenges: expenses, debts, difficulties. Do NOT mention company name or job title.`
      : 'Help me write a paragraph about my financial situation for a government social support application. Describe only your financial challenges: expenses, debts, difficulties. Do NOT mention company or job details.',

    employmentCircumstances: employmentStatus
      ? `I am ${employmentStatus.toLowerCase()}${incomeText}. Help me write a paragraph describing my employment circumstances for a government social support application. Do NOT mention company name or job title.`
      : 'Help me write a paragraph describing my employment circumstances for a government social support application.',

    reasonForApplying: employmentStatus
      ? `I am ${employmentStatus.toLowerCase()}${incomeText}. Help me write a paragraph explaining why I need social support.`
      : 'Help me write a paragraph explaining why I need social support.',
  };

  return prompts[field] ?? prompts.reasonForApplying;
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
    familyFinancialInfo: FamilyFinancialInfo | undefined
  ): Promise<ApiResponse<string>> => {
    // Check if API key is configured
    if (!API_KEY || API_KEY === '' || API_KEY === 'your_openai_api_key_here') {
      return {
        success: false,
        error: OPENAI_MESSAGES.API_KEY_NOT_CONFIGURED,
      };
    }

    // Build user prompt using family financial info
    const userPrompt = buildUserPrompt(field, familyFinancialInfo);

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
            content: userPrompt,
          },
        ],
        temperature: OPENAI_API.config.temperature,
        max_tokens: OPENAI_API.config.maxTokens,
      };

      const response = await axios.post<OpenAIResponse>(ENDPOINT, request, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        timeout: AI_ASSISTANCE_TIMEOUT,
      });

      // Log token usage for cost monitoring
      logTokenUsage(response?.data?.usage);

      // Validate response structure
      const choices = response?.data?.choices;
      if (
        response?.data &&
        choices &&
        Array.isArray(choices) &&
        choices.length > 0 &&
        choices[0]?.message
      ) {
        const generatedText = choices[0].message.content?.trim() ?? '';

        if (!generatedText) {
          return {
            success: false,
            error: OPENAI_MESSAGES.EMPTY_RESPONSE,
          };
        }

        return {
          success: true,
          data: generatedText,
        };
      }

      return {
        success: false,
        error: OPENAI_MESSAGES.INVALID_RESPONSE,
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError?.response) {
        const status = axiosError.response.status;

        if (status === 401) {
          return {
            success: false,
            error: OPENAI_MESSAGES.INVALID_API_KEY,
          };
        } else if (status === 429) {
          return {
            success: false,
            error: OPENAI_MESSAGES.TOO_MANY_REQUESTS,
          };
        } else if ([500, 502, 503, 504].includes(status)) {
          return {
            success: false,
            error: OPENAI_MESSAGES.SERVICE_UNAVAILABLE,
          };
        }

        return {
          success: false,
          error: OPENAI_MESSAGES.SERVICE_ERROR(status),
        };
      } else if (axiosError?.code === 'ECONNABORTED') {
        return {
          success: false,
          error: OPENAI_MESSAGES.REQUEST_TIMEOUT,
        };
      } else if (axiosError?.message?.includes('Network Error')) {
        return {
          success: false,
          error: OPENAI_MESSAGES.NETWORK_ERROR,
        };
      }

      return {
        success: false,
        error: OPENAI_MESSAGES.UNEXPECTED_ERROR,
      };
    }
  },

  /**
   * Check if OpenAI service is configured
   */
  isConfigured: (): boolean => {
    return Boolean(API_KEY && API_KEY !== '' && API_KEY !== 'your_openai_api_key_here');
  },

  /**
   * Get configuration status
   */
  getConfigStatus: (): {
    hasApiKey: boolean;
    model: string;
    endpoint: string;
  } => {
    return {
      hasApiKey: Boolean(API_KEY && API_KEY !== '' && API_KEY !== 'your_openai_api_key_here'),
      model: MODEL,
      endpoint: ENDPOINT,
    };
  },
};

export default OpenAIService;
