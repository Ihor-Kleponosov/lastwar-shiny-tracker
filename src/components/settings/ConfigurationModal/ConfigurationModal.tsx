import { X } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useId, useRef, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { ServerListConfiguration } from '@/components/settings/ServerListConfiguration'
import { IconButton } from '@/components/ui/IconButton'
import type { ServerId } from '@/types'

type ConfigurationModalProps = {
  enabledServerIds: ReadonlySet<ServerId>
  onClose: () => void
  onToggleServer: (serverId: ServerId) => void
  onToggleServers: (serverIds: readonly ServerId[]) => void
  returnFocusRef: RefObject<HTMLButtonElement | null>
  serverIds: readonly ServerId[]
}

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function ConfigurationModal({
  enabledServerIds,
  onClose,
  onToggleServer,
  onToggleServers,
  returnFocusRef,
  serverIds,
}: ConfigurationModalProps) {
  const { t } = useTranslation('common')
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const prefersReducedMotion = useReducedMotion() ?? false
  const transition = {
    duration: prefersReducedMotion ? 0 : 0.2,
    ease: [0.2, 0.8, 0.2, 1] as const,
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const returnFocusElement = returnFocusRef.current
    document.body.style.overflow = 'hidden'
    dialogRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusableElements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements.at(-1)

      if (!firstElement || !lastElement) return

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      returnFocusElement?.focus()
    }
  }, [onClose, returnFocusRef])

  return (
    <motion.div
      ref={dialogRef}
      className="fixed inset-0 z-20 bg-[var(--color-background)] text-[var(--color-text-primary)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
    >
      <motion.div
        className="mx-auto flex h-full w-full max-w-[1200px] flex-col px-4 sm:px-6"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
        transition={transition}
      >
        <header className="flex min-h-16 shrink-0 items-center justify-between border-b border-[var(--color-border)]">
          <h2 id={titleId} className="text-xl font-semibold">
            {t('settings.title')}
          </h2>
          <IconButton aria-label={t('settings.close')} onClick={onClose}>
            <X aria-hidden="true" size={20} />
          </IconButton>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto py-6">
          <ServerListConfiguration
            enabledServerIds={enabledServerIds}
            serverIds={serverIds}
            onToggleServer={onToggleServer}
            onToggleServers={onToggleServers}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
