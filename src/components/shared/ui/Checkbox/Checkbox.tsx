import classNames from 'class-names'
import { Check } from 'lucide-react'
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: ReactNode
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { checked, className, disabled, label, ...props },
  ref,
) {
  return (
    <label
      className={classNames(
        'flex min-h-11 items-center gap-3 rounded-lg px-2 text-sm font-medium text-[var(--color-text-primary)]',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className,
      )}
    >
      <input
        {...props}
        ref={ref}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="flex size-5 shrink-0 items-center justify-center rounded border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors peer-checked:bg-[var(--color-surface-elevated)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-focus)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--color-background)] motion-reduce:transition-none"
      >
        <Check
          size={16}
          strokeWidth={3}
          className={classNames(
            'text-[var(--color-accent)] transition-opacity motion-reduce:transition-none',
            checked ? 'opacity-100' : 'opacity-0',
          )}
        />
      </span>
      <span>{label}</span>
    </label>
  )
})
