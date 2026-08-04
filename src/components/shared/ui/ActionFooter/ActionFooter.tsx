import type { PropsWithChildren } from 'react'

type ActionFooterProps = PropsWithChildren<{
  className?: string
}>

export function ActionFooter({ children, className }: ActionFooterProps) {
  return (
    <footer
      className={`flex shrink-0 gap-3 border-t border-[var(--color-border)] py-4 pb-[max(1rem,env(safe-area-inset-bottom))]${className ? ` ${className}` : ''}`}
    >
      {children}
    </footer>
  )
}
