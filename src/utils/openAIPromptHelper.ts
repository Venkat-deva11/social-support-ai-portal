/**
 * OpenAI Prompt Helper Utilities
 * Sanitizes context, builds user data context from Redux state, and optimizes prompts
 */

import type { FamilyFinancialInfo, TokenUsage } from '../types';
import { isNotEmptyString } from './common';

// Maximum characters for context to prevent token overflow
const MAX_CONTEXT_CHARS = 1000;

// Minimum meaningful context length
const MIN_CONTEXT_LENGTH = 30;

/**
 * Sanitize user-provided context by removing common labels and normalizing whitespace
 */
export const sanitizeContext = (text?: string): string => {
  if (!isNotEmptyString(text)) return '';

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
  if (!isNotEmptyString(context)) return false;
  return (context?.trim().length ?? 0) > MIN_CONTEXT_LENGTH;
};

/**
 * Build a context string from Redux user data for employment field
 */
export const buildEmploymentContextFromRedux = (
  familyFinancialInfo: FamilyFinancialInfo | undefined,
  existingContext?: string,
  includeExistingContext: boolean = true
): string => {
  if (!familyFinancialInfo) return '';

  const parts: string[] = [];

  const { employmentStatus, monthlyIncome, housingStatus } = familyFinancialInfo;

  if (isNotEmptyString(employmentStatus)) {
    parts.push(`Employment Status: ${employmentStatus}`);
  }

  if (monthlyIncome !== undefined && monthlyIncome > 0) {
    parts.push(`Monthly Income: ${monthlyIncome}`);
  }

  if (isNotEmptyString(housingStatus)) {
    parts.push(`Housing Status: ${housingStatus}`);
  }

  // Only include existing context when user hasn't changed their data
  if (includeExistingContext && isNotEmptyString(existingContext)) {
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
  familyFinancialInfo: FamilyFinancialInfo | undefined,
  existingContext?: string,
  includeExistingContext: boolean = true
): string => {
  if (!familyFinancialInfo) return '';

  const parts: string[] = [];

  const { maritalStatus, dependents, monthlyIncome, housingStatus } = familyFinancialInfo;

  if (isNotEmptyString(maritalStatus)) {
    parts.push(`Marital Status: ${maritalStatus}`);
  }

  if (dependents !== undefined) {
    parts.push(`Number of Dependents: ${dependents}`);
  }

  if (monthlyIncome !== undefined && monthlyIncome >= 0) {
    parts.push(`Monthly Income: ${monthlyIncome}`);
  }

  if (isNotEmptyString(housingStatus)) {
    parts.push(`Housing Status: ${housingStatus}`);
  }

  // Only include existing context when user hasn't changed their data
  if (includeExistingContext && isNotEmptyString(existingContext)) {
    const sanitizedExisting = sanitizeContext(existingContext);
    if (isNotEmptyString(sanitizedExisting)) {
      parts.push(`Additional context: ${sanitizedExisting}`);
    }
  }

  return parts.join('. ');
};

/**
 * Build a context string from Redux user data for reason for applying field
 */
export const buildReasonContextFromRedux = (
  familyFinancialInfo: FamilyFinancialInfo | undefined,
  existingContext?: string,
  includeExistingContext: boolean = true
): string => {
  if (!familyFinancialInfo) return '';

  const parts: string[] = [];

  const { employmentStatus, monthlyIncome } = familyFinancialInfo;

  if (isNotEmptyString(employmentStatus)) {
    parts.push(`Current Employment: ${employmentStatus}`);
  }

  if (monthlyIncome !== undefined) {
    parts.push(`Monthly Income: ${monthlyIncome}`);
  }

  // Only include existing context when user hasn't changed their data
  if (includeExistingContext && isNotEmptyString(existingContext)) {
    const sanitizedExisting = sanitizeContext(existingContext);
    if (isNotEmptyString(sanitizedExisting)) {
      parts.push(`Additional details: ${sanitizedExisting}`);
    }
  }

  return parts.join('. ');
};

/**
 * Truncate context to max characters
 */
export const truncateContext = (context: string, maxChars: number = MAX_CONTEXT_CHARS): string => {
  if (!isNotEmptyString(context)) return '';
  if ((context?.length ?? 0) <= maxChars) return context;
  return context.slice(0, maxChars);
};

/**
 * Build optimized user prompt with minimal tokens
 */
export const buildOptimizedPrompt = (
  field: 'financialSituation' | 'employmentCircumstances' | 'reasonForApplying',
  context: string
): string => {
  const fieldInstructions: Record<string, string> = {
    financialSituation: 'Describe your current financial situation professionally.',
    employmentCircumstances: 'Describe your employment circumstances professionally.',
    reasonForApplying: 'Explain why you need financial assistance professionally.',
  };

  if (!isNotEmptyString(context)) {
    return fieldInstructions[field] ?? fieldInstructions.reasonForApplying;
  }

  return `Context: ${truncateContext(context)}\n\n${fieldInstructions[field] ?? fieldInstructions.reasonForApplying}`;
};

/**
 * Parse and log token usage from OpenAI response
 */
export const parseTokenUsage = (usage?: {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}): TokenUsage | null => {
  if (!usage) return null;

  return {
    promptTokens: usage?.prompt_tokens ?? 0,
    completionTokens: usage?.completion_tokens ?? 0,
    totalTokens: usage?.total_tokens ?? 0,
  };
};

/**
 * Log token usage from OpenAI response
 */
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
