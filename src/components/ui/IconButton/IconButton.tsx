import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import classNames from 'class-names'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  isActive?: boolean
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { children, className, isActive = false, type = 'button', ...props },
  ref,
) {
  const buttonClassName = classNames(
    'flex size-11 cursor-pointer items-center justify-center rounded-xl border border-[var(--color-border)] px-3 py-2 text-[var(--color-text-primary)] transition-all duration-150 hover:bg-[var(--color-surface)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50',
    isActive
      ? 'translate-y-px bg-[var(--color-surface)] shadow-[inset_0_3px_7px_rgb(0_0_0_/_35%),inset_0_-1px_0_rgb(255_255_255_/_5%)]'
      : 'bg-[var(--color-surface-elevated)] shadow-[0_2px_3px_rgb(0_0_0_/_20%)]',
    className,
  )

  return (
    <button ref={ref} className={buttonClassName} type={type} {...props}>
      {children}
    </button>
  )
})
