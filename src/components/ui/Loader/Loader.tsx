import { type ComponentPropsWithoutRef } from 'react'
import classNames from 'class-names'

type LoaderProps = ComponentPropsWithoutRef<'div'>

export function Loader({ className, ...props }: LoaderProps) {
  return (
    <div
      aria-hidden="true"
      className={classNames(
        'size-11 animate-spin rounded-full border-4 border-[var(--color-text-secondary)] border-t-[var(--color-accent)]',
        className,
      )}
      {...props}
    />
  )
}
