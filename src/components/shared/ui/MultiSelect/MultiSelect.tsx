import { ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Checkbox } from '@/components/shared/ui/Checkbox'

export type MultiSelectOption = {
  label: string
  value: string
}

type MultiSelectProps = {
  describedBy?: string
  ariaLabel: string
  emptyMessage?: string
  options: readonly MultiSelectOption[]
  placeholder: string
  checkedValues: ReadonlySet<string>
  onOptionToggle: (value: string) => void
}

export function MultiSelect({
  ariaLabel,
  describedBy,
  emptyMessage,
  options,
  placeholder,
  checkedValues,
  onOptionToggle,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectId = useId()
  const listboxId = `${selectId}-listbox`

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1">
      <button
        type="button"
        id={selectId}
        className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-left text-sm text-[var(--color-text-primary)] outline-none transition-colors hover:bg-[var(--color-surface-elevated)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] motion-reduce:transition-none"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="min-w-0 truncate">
          {options
            .filter((option) => checkedValues.has(option.value))
            .map((option) => option.label)
            .join(', ') || placeholder}
        </span>
        <ChevronDown
          aria-hidden="true"
          size={18}
          className={isOpen ? 'rotate-180 transition-transform' : 'transition-transform'}
        />
      </button>
      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          aria-multiselectable="true"
          className="absolute top-[calc(100%+0.25rem)] right-0 left-0 z-30 max-h-52 overflow-y-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-1 shadow-[0_8px_24px_rgb(0_0_0_/_35%)]"
        >
          {options.length > 0
            ? options.map((option) => (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={checkedValues.has(option.value)}
                  className="rounded-sm hover:bg-[var(--color-surface)]"
                >
                  <Checkbox
                    checked={checkedValues.has(option.value)}
                    label={option.label}
                    onChange={() => onOptionToggle(option.value)}
                  />
                </div>
              ))
            : emptyMessage && (
                <p className="px-3 py-2 text-sm text-[var(--color-text-secondary)]">
                  {emptyMessage}
                </p>
              )}
        </div>
      ) : null}
    </div>
  )
}
