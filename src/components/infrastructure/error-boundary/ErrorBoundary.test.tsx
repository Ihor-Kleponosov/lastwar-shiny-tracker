import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { ErrorBoundary } from './ErrorBoundary'

const { toastError } = vi.hoisted(() => ({ toastError: vi.fn() }))

vi.mock('sonner', () => ({ toast: { error: toastError } }))

function ThrowError(): never {
  throw new Error('Test error')
}

describe('ErrorBoundary', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    toastError.mockClear()
  })

  it('shows a localized fallback when a child throws', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong')
    expect(toastError).toHaveBeenCalledWith('Something went wrong')
    consoleError.mockRestore()
  })
})
