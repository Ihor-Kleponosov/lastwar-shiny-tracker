import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import classNames from 'class-names'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { children, className, type = 'button', ...props },
  ref,
) {
  const buttonClassName = classNames(
    'flex size-11 cursor-pointer items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-[var(--color-text-primary)] shadow-[0_2px_3px_rgb(0_0_0_/_20%)] transition-all duration-150 hover:bg-[var(--color-surface)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50',
    className,
  )

  return (
    <button ref={ref} className={buttonClassName} type={type} {...props}>
      {children}
    </button>
  )
})
