import type { SitecoreContent, SitecorePageContent } from '../types';
import sitecoreContentData from '../content/sitecore.json';

/**
 * Content helper for Sitecore-like CMS integration
 * Provides a unified interface for accessing localized content
 */

// Cast the imported JSON to our typed structure
const sitecoreContent = sitecoreContentData as unknown as SitecoreContent;

/**
 * Get page content by component ID
 * Automatically returns content in the currently selected language
 */
export function getPageContent(
  componentId: string,
  language: 'en' | 'ar' = 'en'
): SitecorePageContent | null {
  const langContent = sitecoreContent[language];

  if (!langContent) {
    console.warn(`Language '${language}' not found in sitecore content`);
    return null;
  }

  // Find the page content by componentId
  const pages = langContent.pages;
  const pageKey = Object.keys(pages).find(
    (key) => pages[key as keyof typeof pages]?.componentId === componentId
  );

  if (!pageKey) {
    console.warn(`Component ID '${componentId}' not found in sitecore content`);
    return null;
  }

  return pages[pageKey as keyof typeof pages];
}

/**
 * Get common/shared content by key
 */
export function getCommonContent(
  key: string,
  language: 'en' | 'ar' = 'en'
): string | null {
  const langContent = sitecoreContent[language];

  if (!langContent) {
    return null;
  }

  return langContent.common[key] || null;
}

/**
 * Get all available languages
 */
export function getAvailableLanguages(): Array<{ code: 'en' | 'ar'; name: string }> {
  return [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
  ];
}

/**
 * Get direction for a language
 */
export function getLanguageDirection(language: 'en' | 'ar'): 'ltr' | 'rtl' {
  return language === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Check if content exists for a component
 */
export function hasContent(
  componentId: string,
  language: 'en' | 'ar' = 'en'
): boolean {
  return getPageContent(componentId, language) !== null;
}

/**
 * Get all page component IDs
 */
export function getAllComponentIds(language: 'en' | 'ar' = 'en'): string[] {
  const langContent = sitecoreContent[language];

  if (!langContent) {
    return [];
  }

  return Object.values(langContent.pages).map((page) => page.componentId);
}

export default {
  getPageContent,
  getCommonContent,
  getAvailableLanguages,
  getLanguageDirection,
  hasContent,
  getAllComponentIds,
};