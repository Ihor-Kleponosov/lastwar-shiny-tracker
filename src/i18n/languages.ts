export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'uk', name: 'Українська' },
] as const

export type LanguageCode = (typeof supportedLanguages)[number]['code']
export const fallbackLanguage: LanguageCode = 'en'
export const supportedLanguageCodes = supportedLanguages.map(({ code }) => code)
