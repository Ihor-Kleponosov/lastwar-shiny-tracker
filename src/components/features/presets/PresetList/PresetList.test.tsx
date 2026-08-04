import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import type { Preset } from '@/types'
import { PresetList } from '.'

describe('PresetList', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('renders an empty state and add button when there are no presets', () => {
    render(<PresetList presets={[]} />)

    expect(screen.getByRole('heading', { name: 'Created presets' })).toBeInTheDocument()
    expect(screen.getByText('No presets created yet.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add new preset' })).toBeEnabled()
  })

  it('renders preset names and icon actions', () => {
    const presets: readonly Preset[] = [
      { id: 'preset-1', name: 'Weekly servers', enabledServerIds: [] },
    ]

    render(<PresetList presets={presets} />)

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Weekly servers' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit preset Weekly servers' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Delete preset Weekly servers' })).toBeEnabled()
  })
})
