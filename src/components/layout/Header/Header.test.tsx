import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import { Header } from '.'

describe('Header', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('renders the application identity and language action', () => {
    render(<Header />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Last War Shiny Tracker logo' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Last War Shiny Tracker' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Choose language' })).toHaveTextContent('EN')
    expect(screen.queryByRole('button', { name: 'Open settings' })).not.toBeInTheDocument()
  })
})
