import axios, { AxiosError } from 'axios';
import { AI_ASSISTANCE_TIMEOUT } from '../../constants';
import type { ApiResponse, FamilyFinancialInfo } from '../../types';
import { logTokenUsage } from '../../utils/openAIPromptHelper';

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
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: {
    message: string;
    type: string;
    code?: string;
  };
}

export type AIAuthoringField = 'financialSituation' | 'employmentCircumstances' | 'reasonForApplying';

/**
 * Get simple system prompt - AI writes in first person as the user
 */
const getSystemPrompt = (field: AIAuthoringField): string => {
  const prompts = {
    financialSituation:
      'Write in first person starting with "I am [employment status]" and include your monthly income. Keep it 1 paragraph only. Professional and factual. After stating employment status and income, describe only your financial challenges: expenses, debts, difficulties. Do NOT mention company name, job title, or specific salary amounts.',
    employmentCircumstances:
      'Write in first person starting with "I am [employment status]" and include your monthly income. Keep it 1 paragraph only. Professional and factual. Do NOT mention company name or job title. Use only the provided employment status and income.',
    reasonForApplying:
      'Write in first person as the applicant. Keep it 1 paragraph only. Professional and factual.',
  };

  return prompts[field];
};

/**
 * Build user prompt using employment status and monthly income from Redux
 */
const buildUserPrompt = (
  field: AIAuthoringField,
  familyFinancialInfo: FamilyFinancialInfo
): string => {
  const employmentStatus = familyFinancialInfo?.employmentStatus || '';
  const monthlyIncome = familyFinancialInfo?.monthlyIncome;

  const incomeText = monthlyIncome !== undefined && monthlyIncome > 0
    ? ` with a monthly income of ${monthlyIncome}`
    : '';

  const prompts = {
    // Financial situation - start with employment status and income, then describe financial challenges
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

  return prompts[field];
};

/**
 * OpenAI Service for AI-assisted text generation
 */
export const OpenAIService = {
  /**
   * Generate text using OpenAI API
   * Uses only employment status from Redux to build simple prompts
   */
  generateText: async (
    field: AIAuthoringField,
    familyFinancialInfo: FamilyFinancialInfo
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ): Promise<ApiResponse<string>> => {
    // Check if API key is configured
    if (!API_KEY || API_KEY === '') {
      return {
        success: false,
        error: 'OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your environment.',
      };
    }

    // Build simple user prompt using only employment status
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
        temperature: 0.3,
        max_tokens: 200,
      };

      const response = await axios.post<OpenAIResponse>(ENDPOINT, request, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        timeout: AI_ASSISTANCE_TIMEOUT,
      });

      // Log token usage for cost monitoring
      logTokenUsage(response.data.usage);

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
        } else if ([500, 502, 503, 504].includes(status)) {
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

  isConfigured: (): boolean => {
    return Boolean(API_KEY && API_KEY !== 'your_openai_api_key_here');
  },

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