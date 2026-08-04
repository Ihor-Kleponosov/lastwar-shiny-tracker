import { describe, expect, it } from 'vitest'
import { generateUniqueId } from './index'

describe('generateUniqueId', () => {
  it('generates different IDs for separate presets', () => {
    expect(generateUniqueId()).not.toBe(generateUniqueId())
  })
})
