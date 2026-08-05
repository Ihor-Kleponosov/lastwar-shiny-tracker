import { X } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useId, useRef, useState, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useModalAccessibility } from '@/hooks/useModalAccessibility'
import { ServerListConfiguration } from '@/components/features/settings/ServerListConfiguration'
import { UnsavedChangesDialog } from '@/components/features/settings/UnsavedChangesDialog'
import { ActionFooter } from '@/components/shared/ui/ActionFooter'
import { Button } from '@/components/shared/ui/Button'
import { HelpPopover } from '@/components/shared/ui/HelpPopover'
import { IconButton } from '@/components/shared/ui/IconButton'
import type { Preset, ServerId } from '@/types'
import { generateUniqueId } from '@/utils'
import { MAX_ENABLED_SERVERS } from '@/utils/serverPreferences'

type PresetConfigurationModalProps = {
  preset: Preset | null
  presets: readonly Preset[]
  onClose: () => void
  onSave: (preset: Preset) => boolean
  returnFocusRef: RefObject<HTMLButtonElement | null>
  serverIds: readonly ServerId[]
}

export function PresetConfigurationModal({
  preset,
  presets,
  onClose,
  onSave,
  returnFocusRef,
  serverIds,
}: PresetConfigurationModalProps) {
  const { t } = useTranslation('common')
  const dialogRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const discardConfirmationTriggerRef = useRef<HTMLElement>(null)
  const titleId = useId()
  const initialPreset = useRef<Preset>(
    preset ?? { id: generateUniqueId(), name: '', enabledServerIds: [] },
  )
  const [draftName, setDraftName] = useState(initialPreset.current.name)
  const [draftEnabledServerIds, setDraftEnabledServerIds] = useState(
    () => new Set(initialPreset.current.enabledServerIds),
  )
  const [isDiscardConfirmationOpen, setIsDiscardConfirmationOpen] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion() ?? false
  const transition = {
    duration: prefersReducedMotion ? 0 : 0.2,
    ease: [0.2, 0.8, 0.2, 1] as const,
  }

  const hasUnsavedChanges =
    draftName !== initialPreset.current.name ||
    draftEnabledServerIds.size !== initialPreset.current.enabledServerIds.length ||
    [...draftEnabledServerIds].some(
      (serverId) => !initialPreset.current.enabledServerIds.includes(serverId),
    )

  const getNameError = useCallback(
    (value: string): string | null => {
      const normalizedName = value.trim().toLowerCase()
      if (!normalizedName) return null

      const hasDuplicateName = presets.some(
        (currentPreset) =>
          currentPreset.id !== initialPreset.current.id &&
          currentPreset.name.trim().toLowerCase() === normalizedName,
      )

      return hasDuplicateName ? t('presets.nameDuplicate') : null
    },
    [presets, t],
  )

  useEffect(() => {
    if (!draftName.trim()) {
      setNameError(null)
      return
    }

    const timeoutId = window.setTimeout(() => setNameError(getNameError(draftName)), 2000)
    return () => window.clearTimeout(timeoutId)
  }, [draftName, getNameError])

  const handleCloseRequest = useCallback(() => {
    if (isDiscardConfirmationOpen) return

    if (hasUnsavedChanges) {
      discardConfirmationTriggerRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null
      setIsDiscardConfirmationOpen(true)
      return
    }

    onClose()
  }, [hasUnsavedChanges, isDiscardConfirmationOpen, onClose])

  const handleToggleServer = useCallback(
    (serverId: ServerId) => {
      setDraftEnabledServerIds((currentEnabledServerIds) => {
        const nextEnabledServerIds = new Set(currentEnabledServerIds)

        if (nextEnabledServerIds.has(serverId)) nextEnabledServerIds.delete(serverId)
        else if (nextEnabledServerIds.size >= MAX_ENABLED_SERVERS) {
          toast.error(
            t('settings.serverList.selectionLimitReached', { count: MAX_ENABLED_SERVERS }),
          )
        } else nextEnabledServerIds.add(serverId)

        return nextEnabledServerIds
      })
    },
    [t],
  )

  const handleToggleServers = useCallback(
    (targetServerIds: readonly ServerId[]) => {
      if (targetServerIds.length === 0) return

      setDraftEnabledServerIds((currentEnabledServerIds) => {
        const nextEnabledServerIds = new Set(currentEnabledServerIds)
        const areAllTargetServersSelected = targetServerIds.every((serverId) =>
          currentEnabledServerIds.has(serverId),
        )

        for (const serverId of targetServerIds) {
          if (areAllTargetServersSelected) nextEnabledServerIds.delete(serverId)
          else if (nextEnabledServerIds.has(serverId)) continue
          else if (nextEnabledServerIds.size >= MAX_ENABLED_SERVERS) {
            toast.error(
              t('settings.serverList.selectionLimitReached', { count: MAX_ENABLED_SERVERS }),
            )
            break
          } else nextEnabledServerIds.add(serverId)
        }

        return nextEnabledServerIds
      })
    },
    [t],
  )

  const handleSave = useCallback(() => {
    const name = draftName.trim()
    if (!name) return

    const nextNameError = getNameError(name)
    if (nextNameError) {
      setNameError(nextNameError)
      nameInputRef.current?.scrollIntoView({
        block: 'center',
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
      nameInputRef.current?.focus()
      return
    }

    if (!onSave({ ...initialPreset.current, name, enabledServerIds: [...draftEnabledServerIds] }))
      return
    toast.success(t('presets.saved'))
    onClose()
  }, [draftEnabledServerIds, draftName, getNameError, onClose, onSave, prefersReducedMotion, t])

  const handleReturnToSettings = useCallback(() => {
    setIsDiscardConfirmationOpen(false)
    discardConfirmationTriggerRef.current?.focus()
  }, [])

  useModalAccessibility({ dialogRef, isOpen: true, onClose: handleCloseRequest, returnFocusRef })

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
            {t(preset ? 'presets.editTitle' : 'presets.addTitle')}
          </h2>
          <div className="relative flex items-center gap-1">
            <IconButton aria-label={t('settings.close')} onClick={handleCloseRequest}>
              <X aria-hidden="true" size={20} />
            </IconButton>
            <HelpPopover
              className="order-first"
              label={t('settings.serverList.showDescription')}
              closeLabel={t('settings.serverList.closeDescription')}
            >
              <p className="text-sm text-[var(--color-text-secondary)]">
                {t('settings.serverList.description')}
              </p>
            </HelpPopover>
          </div>
        </header>
        <div ref={contentRef} className="min-h-0 flex-1 overflow-y-auto py-6">
          <div className="mb-6">
            <label htmlFor="preset-name" className="mb-2 block text-sm font-medium">
              {t('presets.nameLabel')}
            </label>
            <input
              id="preset-name"
              ref={nameInputRef}
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              maxLength={20}
              placeholder={t('presets.namePlaceholder')}
              aria-describedby={
                nameError ? 'preset-name-helper preset-name-error' : 'preset-name-helper'
              }
              aria-invalid={nameError !== null}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            />
            <p id="preset-name-helper" className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {t('presets.nameMaxLength')}
            </p>
            {nameError ? (
              <p id="preset-name-error" className="mt-1 text-xs text-[var(--color-danger-text)]">
                {nameError}
              </p>
            ) : null}
          </div>
          <ServerListConfiguration
            enabledServerIds={draftEnabledServerIds}
            scrollContainerRef={contentRef}
            serverIds={serverIds}
            onToggleServer={handleToggleServer}
            onToggleServers={handleToggleServers}
          />
        </div>
        <ActionFooter>
          <Button className="flex-1" variant="secondary" onClick={handleCloseRequest}>
            {t('settings.cancel')}
          </Button>
          <Button
            className="flex-1"
            disabled={!hasUnsavedChanges || !draftName.trim()}
            onClick={handleSave}
          >
            {t('settings.save')}
          </Button>
        </ActionFooter>
      </motion.div>
      {isDiscardConfirmationOpen ? (
        <UnsavedChangesDialog onDiscard={onClose} onReturn={handleReturnToSettings} />
      ) : null}
    </motion.div>
  )
}
