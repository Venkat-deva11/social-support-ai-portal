/**
 * Sitecore Content Helper
 * Provides utilities for accessing localized CMS content
 */

import type { SitecoreContent, SitecorePageContent, Language } from '../types';
import { isNotEmptyString, isNotNull } from './common';
import sitecoreContentData from '../content/sitecore.json';

// Cast the imported JSON to our typed structure
const sitecoreContent = sitecoreContentData as unknown as SitecoreContent;

/**
 * Get page content by component ID
 */
export function getPageContent(
  componentId: string,
  language: Language = 'en'
): SitecorePageContent | null {
  const langContent = sitecoreContent?.[language];

  if (!langContent) {
    return null;
  }

  const pages = langContent?.pages;
  if (!pages) return null;

  // Find the page content by componentId
  const pageKeys = Object.keys(pages ?? {});
  const pageKey = pageKeys.find(
    (key) => pages?.[key]?.componentId === componentId
  );

  if (!pageKey) {
    return null;
  }

  return pages[pageKey] ?? null;
}

/**
 * Get common/shared content by key
 */
export function getCommonContent(
  key: string,
  language: Language = 'en'
): string | null {
  if (!isNotEmptyString(key)) return null;

  const langContent = sitecoreContent?.[language];
  if (!langContent) return null;

  const common = langContent?.common;
  if (!common) return null;

  return common[key] ?? null;
}

/**
 * Get all available languages
 */
export function getAvailableLanguages(): Array<{ code: Language; name: string }> {
  return [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
  ];
}

/**
 * Get direction for a language
 */
export function getLanguageDirection(language: Language): 'ltr' | 'rtl' {
  return language === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Check if content exists for a component
 */
export function hasContent(
  componentId: string,
  language: Language = 'en'
): boolean {
  return getPageContent(componentId, language) !== null;
}

/**
 * Get all page component IDs
 */
export function getAllComponentIds(language: Language = 'en'): string[] {
  const langContent = sitecoreContent?.[language];

  if (!langContent) return [];

  const pages = langContent?.pages;
  if (!pages) return [];

  const pageValues = Object.values(pages);
  if (!Array.isArray(pageValues) || pageValues.length === 0) return [];

  return pageValues
    .filter((page) => isNotNull(page))
    .map((page) => page.componentId)
    .filter(isNotEmptyString);
}

export default {
  getPageContent,
  getCommonContent,
  getAvailableLanguages,
  getLanguageDirection,
  hasContent,
  getAllComponentIds,
};