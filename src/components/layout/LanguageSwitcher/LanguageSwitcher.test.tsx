import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import { LanguageSwitcher } from '.'

describe('LanguageSwitcher', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('shows all supported languages and identifies the selected language', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher />)

    await user.click(screen.getByRole('button', { name: 'Choose language' }))

    expect(screen.getAllByRole('menuitemradio')).toHaveLength(4)
    expect(screen.getByRole('menuitemradio', { name: 'English', checked: true })).toBeVisible()
  })

  it('changes the language and closes the menu', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher />)

    await user.click(screen.getByRole('button', { name: 'Choose language' }))
    await user.click(screen.getByRole('menuitemradio', { name: 'Deutsch' }))

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sprache auswählen' })).toHaveTextContent('DE')
  })

  it('closes on Escape and outside click', async () => {
    const user = userEvent.setup()
    render(<LanguageSwitcher />)

    const trigger = screen.getByRole('button', { name: 'Choose language' })
    await user.click(trigger)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    await user.click(trigger)
    await user.click(document.body)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
