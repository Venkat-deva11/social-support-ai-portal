import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getPageContent, getCommonContent, getLanguageDirection } from '../utils/sitecoreContentHelper';
import type { SitecorePageContent } from '../types';
import type { RootState } from '../app/store';

/**
 * Custom hook for accessing Sitecore content
 * Provides a clean interface for components to access localized content
 *
 * @param componentId - The unique identifier for the page/component content
 * @returns The page content object with all fields localized
 */
export function useSitecoreContent(componentId: string): SitecorePageContent | null {
  const language = useSelector((state: RootState) => state.application.language);

  return getPageContent(componentId, language);
}

/**
 * Hook to access common/shared content
 */
export function useCommonContent(key: string): string | null {
  const language = useSelector((state: RootState) => state.application.language);

  return getCommonContent(key, language);
}

/**
 * Hook to get current language direction
 */
export function useLanguageDirection(): 'ltr' | 'rtl' {
  const language = useSelector((state: RootState) => state.application.language);

  return getLanguageDirection(language);
}

/**
 * Hook to get page content with manual language override
 * Useful when you need to preview a different language
 */
export function useSitecoreContentWithLanguage(
  componentId: string,
  language: 'en' | 'ar'
): SitecorePageContent | null {
  return getPageContent(componentId, language);
}

/**
 * Helper hook to access form field content
 * Returns the field configuration for a specific field
 */
export function useFormFieldContent(
  componentId: string,
  fieldName: string
): Record<string, unknown> | null {
  const content = useSitecoreContent(componentId);

  if (!content) {
    return null;
  }

  const fields = content.fields as Record<string, Record<string, unknown>>;
  return fields[fieldName] || null;
}

/**
 * Helper hook for i18n interpolation
 * Replaces {{count}} placeholders with actual values
 */
export function useTranslationWithParams() {
  const t = useCallback((text: string, params?: Record<string, string | number>): string => {
    if (!params) {
      return text;
    }

    let result = text;
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    });

    return result;
  }, []);

  return t;
}

export default {
  useSitecoreContent,
  useCommonContent,
  useLanguageDirection,
  useSitecoreContentWithLanguage,
  useFormFieldContent,
  useTranslationWithParams,
};