import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import de from '@/locales/de/common.json'
import en from '@/locales/en/common.json'
import fr from '@/locales/fr/common.json'
import uk from '@/locales/uk/common.json'
import { fallbackLanguage, supportedLanguageCodes } from './languages'

export const resources = {
  en: { common: en },
  fr: { common: fr },
  de: { common: de },
  uk: { common: uk },
} as const

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: fallbackLanguage,
    supportedLngs: supportedLanguageCodes,
    nonExplicitSupportedLngs: true,
    defaultNS: 'common',
    ns: ['common'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  })

export default i18n
