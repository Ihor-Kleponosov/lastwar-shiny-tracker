import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import App from '@/App'

describe('internationalization', () => {
  it('renders a translation in the selected language', async () => {
    await i18n.changeLanguage('fr')
    render(<App />)
    expect(
      screen.getByRole('heading', { name: 'Suivi des brillants Last War' }),
    ).toBeInTheDocument()
  })

  it('falls back to English for unsupported languages', async () => {
    await i18n.changeLanguage('es')
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Last War Shiny Tracker' })).toBeInTheDocument()
  })
})
