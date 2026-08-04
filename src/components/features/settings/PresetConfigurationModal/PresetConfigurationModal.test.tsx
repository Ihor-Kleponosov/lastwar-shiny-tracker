import { createRef } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import type { Preset } from '@/types'
import { getConfiguredServerIds } from '@/utils/serverPreferences'
import { PresetConfigurationModal } from '.'

const presets: readonly Preset[] = [{ id: 'preset-1', name: 'Weekly', enabledServerIds: [1638] }]

describe('PresetConfigurationModal', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts new presets with an empty name and server selection', () => {
    render(
      <PresetConfigurationModal
        preset={null}
        presets={presets}
        onClose={vi.fn()}
        onSave={vi.fn()}
        returnFocusRef={createRef<HTMLButtonElement>()}
        serverIds={getConfiguredServerIds()}
      />,
    )

    expect(screen.getByRole('dialog', { name: 'Add preset' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Preset name' })).toHaveValue('')
    expect(screen.getByText('Max 20 characters')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Preset name' })).toHaveAttribute('maxLength', '20')
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  it('uses the preset state when editing and saves its updated data', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn(() => true)
    const preset: Preset = { id: 'preset-1', name: 'Weekly', enabledServerIds: [1638] }

    render(
      <PresetConfigurationModal
        preset={preset}
        presets={[preset]}
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

  it('shows a duplicate-name error two seconds after typing stops', () => {
    vi.useFakeTimers()
    render(
      <PresetConfigurationModal
        preset={null}
        presets={presets}
        onClose={vi.fn()}
        onSave={vi.fn(() => true)}
        returnFocusRef={createRef<HTMLButtonElement>()}
        serverIds={getConfiguredServerIds()}
      />,
    )

    fireEvent.change(screen.getByRole('textbox', { name: 'Preset name' }), {
      target: { value: ' weekly ' },
    })
    expect(screen.queryByText('A preset with this name already exists.')).not.toBeInTheDocument()

    act(() => vi.advanceTimersByTime(2000))
    expect(screen.getByText('A preset with this name already exists.')).toBeInTheDocument()
  })

  it('validates duplicate names immediately on save and scrolls to the input', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn(() => true)
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView

    render(
      <PresetConfigurationModal
        preset={null}
        presets={presets}
        onClose={vi.fn()}
        onSave={onSave}
        returnFocusRef={createRef<HTMLButtonElement>()}
        serverIds={getConfiguredServerIds()}
      />,
    )

    const input = screen.getByRole('textbox', { name: 'Preset name' })
    await user.type(input, 'WEEKLY')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(screen.getByText('A preset with this name already exists.')).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'center', behavior: 'smooth' })
    expect(input).toHaveFocus()
  })

  it('allows an edited preset to retain its own name', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn(() => true)
    const preset = presets[0]

    render(
      <PresetConfigurationModal
        preset={preset}
        presets={presets}
        onClose={vi.fn()}
        onSave={onSave}
        returnFocusRef={createRef<HTMLButtonElement>()}
        serverIds={getConfiguredServerIds()}
      />,
    )

    const input = screen.getByRole('textbox', { name: 'Preset name' })
    await user.clear(input)
    await user.type(input, ' weekly ')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSave).toHaveBeenCalledWith({ ...preset, name: 'weekly' })
  })
})
