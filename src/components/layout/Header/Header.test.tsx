import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { Header } from '.'

describe('Header', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('renders the application identity and accessible actions', () => {
    render(<Header onOpenSettings={() => undefined} settingsButtonRef={{ current: null }} />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Last War Shiny Tracker logo' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Last War Shiny Tracker' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Choose language' })).toHaveTextContent('EN')
    expect(screen.getByRole('button', { name: 'Open settings' })).toBeInTheDocument()
  })

  it('opens settings when its action is selected', async () => {
    const user = userEvent.setup()
    const onOpenSettings = vi.fn()

    render(<Header onOpenSettings={onOpenSettings} settingsButtonRef={{ current: null }} />)

    await user.click(screen.getByRole('button', { name: 'Open settings' }))

    expect(onOpenSettings).toHaveBeenCalledOnce()
  })
})
