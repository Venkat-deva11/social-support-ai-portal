/**
 * Sitecore Content Hooks
 * Custom hooks for accessing localized CMS content
 */

import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getPageContent, getCommonContent, getLanguageDirection } from '../utils/sitecoreContentHelper';
import type { SitecorePageContent, Language } from '../types';
import type { RootState } from '../app/store';

/**
 * Custom hook for accessing Sitecore content
 * Provides a clean interface for components to access localized content
 */
export function useSitecoreContent(componentId: string): SitecorePageContent | null {
  const language = useSelector((state: RootState) => state?.application?.language);

  return getPageContent(componentId, language ?? 'en');
}


export function useCommonContent(key: string): string | null {
  const language = useSelector((state: RootState) => state?.application?.language);

  return getCommonContent(key, language ?? 'en');
}


export function useLanguageDirection(): 'ltr' | 'rtl' {
  const language = useSelector((state: RootState) => state?.application?.language);

  return getLanguageDirection(language ?? 'en');
}


export function useSitecoreContentWithLanguage(
  componentId: string,
  language: Language
): SitecorePageContent | null {
  return getPageContent(componentId, language);
}


export function useFormFieldContent(
  componentId: string,
  fieldName: string
): Record<string, unknown> | null {
  const content = useSitecoreContent(componentId);

  if (!content) {
    return null;
  }

  const fields = content?.fields as Record<string, Record<string, unknown>> | undefined;
  if (!fields) return null;

  return fields[fieldName] ?? null;
}


export function useTranslationWithParams() {
  const t = useCallback((text: string, params?: Record<string, string | number>): string => {
    if (!params || !text) {
      return text ?? '';
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