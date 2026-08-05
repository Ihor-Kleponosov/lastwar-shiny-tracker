import { CircleAlert, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { IconButton } from '@/components/shared/ui/IconButton'

type NotificationProps = {
  children: ReactNode
  closeLabel: string
  label: string
  onClose: () => void
  open: boolean
}

export function Notification({ children, closeLabel, label, onClose, open }: NotificationProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[var(--color-overlay)] p-4">
      <section
        className="box-border w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3 shadow-[0_8px_24px_rgb(0_0_0_/_24%)]"
        aria-label={label}
        role="status"
      >
        <div className="flex items-start justify-between gap-3">
          <CircleAlert
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-[var(--color-accent)]"
            data-testid="notification-attention-icon"
            size={20}
          />
          <div className="min-w-0 flex-1">{children}</div>
          <IconButton aria-label={closeLabel} onClick={onClose}>
            <X aria-hidden="true" size={20} />
          </IconButton>
        </div>
      </section>
    </div>
  )
}
