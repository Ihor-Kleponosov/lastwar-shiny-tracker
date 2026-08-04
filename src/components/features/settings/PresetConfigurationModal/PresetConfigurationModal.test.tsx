import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import type { Preset } from '@/types'
import { getConfiguredServerIds } from '@/utils/serverPreferences'
import { PresetConfigurationModal } from '.'

describe('PresetConfigurationModal', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('starts new presets with an empty name and server selection', () => {
    render(
      <PresetConfigurationModal
        preset={null}
        onClose={vi.fn()}
        onSave={vi.fn()}
        returnFocusRef={createRef<HTMLButtonElement>()}
        serverIds={getConfiguredServerIds()}
      />,
    )

    expect(screen.getByRole('dialog', { name: 'Add preset' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Preset name' })).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  it('uses the preset state when editing and saves its updated data', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    const preset: Preset = { id: 'preset-1', name: 'Weekly', enabledServerIds: [1638] }

    render(
      <PresetConfigurationModal
        preset={preset}
        onClose={vi.fn()}
        onSave={onSave}
        returnFocusRef={createRef<HTMLButtonElement>()}
        serverIds={getConfiguredServerIds()}
      />,
    )

    const nameInput = screen.getByRole('textbox', { name: 'Preset name' })
    await user.clear(nameInput)
    await user.type(nameInput, 'Updated')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSave).toHaveBeenCalledWith({
      id: 'preset-1',
      name: 'Updated',
      enabledServerIds: [1638],
    })
  })
})
