import { X } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useId, useRef, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { useModalAccessibility } from '@/hooks/useModalAccessibility'
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

  useModalAccessibility({ dialogRef, isOpen: true, onClose, returnFocusRef })

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
