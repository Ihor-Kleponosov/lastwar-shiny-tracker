import { de, enUS, fr, uk } from 'date-fns/locale'
import type { LanguageCode } from '@/i18n/languages'

const dateLocales = { en: enUS, fr, de, uk } as const

export function getDateLocale(language: string) {
  const languageCode = language.split('-')[0] as LanguageCode

  return dateLocales[languageCode] ?? dateLocales.en
}
