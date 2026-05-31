/**
 * OpenAI Prompt Helper Utilities
 * Sanitizes context, builds user data context from Redux state, and optimizes prompts
 */

import type { FamilyFinancialInfo } from '../types';

// Maximum characters for context to prevent token overflow
const MAX_CONTEXT_CHARS = 1000;

// Minimum meaningful context length
const MIN_CONTEXT_LENGTH = 30;

/**
 * Sanitize user-provided context by removing common labels and normalizing whitespace
 */
export const sanitizeContext = (text?: string): string => {
  if (!text) return '';

  return text
    // Remove common form labels that get repeated
    .replace(/Please describe your employment circumstances/gi, '')
    .replace(/Please describe your financial situation/gi, '')
    .replace(/Please describe why you need assistance/gi, '')
    // Normalize multiple whitespace to single space
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Check if context is meaningful enough to send to AI
 */
export const hasMeaningfulContext = (context?: string): boolean => {
  return Boolean(context && context.trim().length > MIN_CONTEXT_LENGTH);
};

/**
 * Build a context string from Redux user data for employment field
 * Set includeExistingContext=false when regenerating to avoid stale AI-generated content
 */
export const buildEmploymentContextFromRedux = (
  familyFinancialInfo: FamilyFinancialInfo,
  existingContext?: string,
  includeExistingContext: boolean = true
): string => {
  const { employmentStatus, monthlyIncome, housingStatus } = familyFinancialInfo;

  const parts: string[] = [];

  // Add factual data from Redux state - do NOT hallucinate
  if (employmentStatus) {
    parts.push(`Employment Status: ${employmentStatus}`);
  }

  if (monthlyIncome !== undefined && monthlyIncome > 0) {
    parts.push(`Monthly Income: ${monthlyIncome}`);
  }

  if (housingStatus) {
    parts.push(`Housing Status: ${housingStatus}`);
  }

  // Only include existing context when user hasn't changed their data
  // This prevents stale AI-generated content (e.g., "retired") from being re-sent
  if (includeExistingContext) {
    const sanitizedExisting = sanitizeContext(existingContext);
    if (sanitizedExisting) {
      parts.push(`Additional context: ${sanitizedExisting}`);
    }
  }

  return parts.join('. ');
};

/**
 * Build a context string from Redux user data for financial field
 */
export const buildFinancialContextFromRedux = (
  familyFinancialInfo: FamilyFinancialInfo,
  existingContext?: string,
  includeExistingContext: boolean = true
): string => {
  const { maritalStatus, dependents, monthlyIncome, housingStatus } = familyFinancialInfo;

  const parts: string[] = [];

  if (maritalStatus) {
    parts.push(`Marital Status: ${maritalStatus}`);
  }

  if (dependents !== undefined) {
    parts.push(`Number of Dependents: ${dependents}`);
  }

  if (monthlyIncome !== undefined && monthlyIncome >= 0) {
    parts.push(`Monthly Income: ${monthlyIncome}`);
  }

  if (housingStatus) {
    parts.push(`Housing Status: ${housingStatus}`);
  }

  // Only include existing context when user hasn't changed their data
  if (includeExistingContext) {
    const sanitizedExisting = sanitizeContext(existingContext);
    if (sanitizedExisting) {
      parts.push(`Additional context: ${sanitizedExisting}`);
    }
  }

  return parts.join('. ');
};

/**
 * Build a context string from Redux user data for reason for applying field
 */
export const buildReasonContextFromRedux = (
  familyFinancialInfo: FamilyFinancialInfo,
  existingContext?: string,
  includeExistingContext: boolean = true
): string => {
  const { employmentStatus, monthlyIncome } = familyFinancialInfo;

  const parts: string[] = [];

  if (employmentStatus) {
    parts.push(`Current Employment: ${employmentStatus}`);
  }

  if (monthlyIncome !== undefined) {
    parts.push(`Monthly Income: ${monthlyIncome}`);
  }

  // Only include existing context when user hasn't changed their data
  if (includeExistingContext) {
    const sanitizedExisting = sanitizeContext(existingContext);
    if (sanitizedExisting) {
      parts.push(`Additional details: ${sanitizedExisting}`);
    }
  }

  return parts.join('. ');
};

/**
 * Truncate context to max characters
 */
export const truncateContext = (context: string, maxChars: number = MAX_CONTEXT_CHARS): string => {
  if (context.length <= maxChars) return context;
  return context.slice(0, maxChars);
};

/**
 * Build optimized user prompt with minimal tokens
 */
export const buildOptimizedPrompt = (
  field: 'financialSituation' | 'employmentCircumstances' | 'reasonForApplying',
  context: string
): string => {
  const fieldInstructions = {
    financialSituation: 'Describe your current financial situation professionally.',
    employmentCircumstances: 'Describe your employment circumstances professionally.',
    reasonForApplying: 'Explain why you need financial assistance professionally.',
  };

  if (!context) {
    return fieldInstructions[field];
  }

  return `Context: ${truncateContext(context)}\n\n${fieldInstructions[field]}`;
};

/**
 * Parse and log token usage from OpenAI response
 */
export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export const parseTokenUsage = (usage?: {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}): TokenUsage | null => {
  if (!usage) return null;

  return {
    promptTokens: usage.prompt_tokens,
    completionTokens: usage.completion_tokens,
    totalTokens: usage.total_tokens,
  };
};

export const logTokenUsage = (usage?: {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}): void => {
  const parsed = parseTokenUsage(usage);
  if (parsed) {
    console.log(
      `[OpenAI] Token Usage - Prompt: ${parsed.promptTokens}, Completion: ${parsed.completionTokens}, Total: ${parsed.totalTokens}`
    );
  }
};
