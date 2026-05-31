/**
 * OpenAI Service Types
 * All types related to OpenAI integration
 */

import type { ApiResponse } from '../api/types';
import type { FamilyFinancialInfo } from '../../features/application/types';

export type AIAuthoringField = 'financialSituation' | 'employmentCircumstances' | 'reasonForApplying';

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface OpenAIChoice {
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

export interface OpenAIResponse {
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

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface OpenAIConfigStatus {
  hasApiKey: boolean;
  model: string;
  endpoint: string;
}

export type GenerateTextResponse = ApiResponse<string>;