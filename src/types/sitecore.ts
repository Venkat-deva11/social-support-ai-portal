/**
 * Sitecore Content Types
 * All types related to Sitecore CMS integration
 */

export interface SitecoreField {
  label: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
}

export interface SitecorePageContent {
  componentId: string;
  title: string;
  description?: string;
  fields: Record<string, SitecoreField | Record<string, SitecoreField>>;
}

export interface SitecoreLanguage {
  pages: Record<string, SitecorePageContent>;
  common: Record<string, string>;
}

export interface SitecoreContent {
  en: SitecoreLanguage;
  ar: SitecoreLanguage;
}

export interface FieldConfig {
  label: string;
  placeholder: string;
  helperText: string;
  errorMessage: Record<string, string>;
}