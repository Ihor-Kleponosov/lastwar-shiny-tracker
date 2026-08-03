import { CircleHelp, X } from 'lucide-react'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { IconButton } from '@/components/ui/IconButton'

type HelpPopoverProps = {
  children: ReactNode
  className?: string
  closeLabel: string
  label: string
}

export function HelpPopover({ children, className, closeLabel, label }: HelpPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverId = useId()

  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return

      event.preventDefault()
      event.stopImmediatePropagation()
      setIsOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('mousedown', handlePointerDown, true)
    document.addEventListener('keydown', handleKeyDown, true)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown, true)
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [isOpen])

  function handleClose() {
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`}>
      <IconButton
        ref={triggerRef}
        aria-label={label}
        aria-expanded={isOpen}
        aria-controls={popoverId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <CircleHelp aria-hidden="true" size={20} />
      </IconButton>
      {isOpen ? (
        <div
          id={popoverId}
          role="dialog"
          aria-label={label}
          className="absolute top-full right-0 z-10 mt-2 w-[min(100vw-2rem,28rem)] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3 shadow-[0_8px_24px_rgb(0_0_0_/_24%)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">{children}</div>
            <IconButton aria-label={closeLabel} onClick={handleClose}>
              <X aria-hidden="true" size={20} />
            </IconButton>
          </div>
        </div>
      ) : null}
    </div>
  )
}
