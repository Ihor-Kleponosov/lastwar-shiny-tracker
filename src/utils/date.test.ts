import { de, enUS, fr, uk } from 'date-fns/locale'
import { describe, expect, it } from 'vitest'
import { getDateLocale } from './date'

describe('getDateLocale', () => {
  it.each([
    ['en', enUS],
    ['fr-FR', fr],
    ['de-DE', de],
    ['uk-UA', uk],
  ])('returns the locale for %s', (language, expectedLocale) => {
    expect(getDateLocale(language)).toBe(expectedLocale)
  })

  it('falls back to English for unsupported languages', () => {
    expect(getDateLocale('es')).toBe(enUS)
  })
})
