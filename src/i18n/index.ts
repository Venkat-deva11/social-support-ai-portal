import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import sitecoreContent from '../content/sitecore.json';

// Translation resources built from sitecore content
const resources = {
  en: {
    translation: {
      common: sitecoreContent.en.common,
      pages: sitecoreContent.en.pages,
    },
  },
  ar: {
    translation: {
      common: sitecoreContent.ar.common,
      pages: sitecoreContent.ar.pages,
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'social_support_language',
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;