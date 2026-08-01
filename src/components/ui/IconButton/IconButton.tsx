import type { ButtonHTMLAttributes, ReactNode } from 'react'
import classNames from 'class-names'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export function IconButton({ children, className, type = 'button', ...props }: IconButtonProps) {
  const buttonClassName = classNames(
    'flex size-11 cursor-pointer items-center justify-center rounded-xl px-3 py-2 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]',
    className,
  )

  return (
    <button className={buttonClassName} type={type} {...props}>
      {children}
    </button>
  )
}
