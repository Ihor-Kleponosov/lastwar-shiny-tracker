import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { Header } from '.'

describe('Header', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('renders the application identity and language action', () => {
    render(<Header onNavigateHome={vi.fn()} />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Last War Shiny Tracker logo' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Last War Shiny Tracker' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Choose language' })).toHaveTextContent('EN')
    expect(screen.queryByRole('button', { name: 'Open settings' })).not.toBeInTheDocument()
  })

  it('navigates home when the logo is clicked', async () => {
    const user = userEvent.setup()
    const onNavigateHome = vi.fn()

    render(<Header onNavigateHome={onNavigateHome} />)

    await user.click(screen.getByRole('button', { name: 'Go to main page' }))

    expect(onNavigateHome).toHaveBeenCalledOnce()
  })
})
