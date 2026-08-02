import { describe, expect, it } from 'vitest'
import { getExportFilename } from './exportFilename'

describe('getExportFilename', () => {
  it('uses an English month name regardless of the application locale', () => {
    expect(getExportFilename(new Date(2026, 7, 20))).toBe('last-war-shiny-tasks-august-2026.png')
  })
})
