import classNames from 'class-names'
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

type ButtonVariant = 'default' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, className, type = 'button', variant = 'default', ...props },
  ref,
) {
  const buttonClassName = classNames(
    'inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium shadow-[0_2px_3px_rgb(0_0_0_/_20%)] transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50',
    variant === 'danger'
      ? 'border-[var(--color-danger)] bg-[var(--color-danger)] font-semibold text-white hover:bg-[var(--color-danger-hover)] focus-visible:ring-offset-[var(--color-surface-elevated)]'
      : 'border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] focus-visible:ring-offset-[var(--color-background)]',
    className,
  )

  return (
    <button ref={ref} className={buttonClassName} type={type} {...props}>
      {children}
    </button>
  )
})
