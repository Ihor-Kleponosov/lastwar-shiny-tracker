import { Download, Moon, Sun, X } from 'lucide-react'
import type { RefObject } from 'react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { ExportView, type ExportTheme } from '@/components/features/export/ExportView'
import { IconButton } from '@/components/shared/ui/IconButton'
import type { ServerId } from '@/types'

type ExportPreviewDialogProps = {
  dialogRef: RefObject<HTMLDivElement | null>
  enabledServerIds: ReadonlySet<ServerId>
  exportDate: Date
  exportViewRef: RefObject<HTMLDivElement | null>
  isExporting: boolean
  theme: ExportTheme
  onClose: () => void
  onDownload: () => void
  onThemeChange: (theme: ExportTheme) => void
}

export function ExportPreviewDialog({
  dialogRef,
  enabledServerIds,
  exportDate,
  exportViewRef,
  isExporting,
  theme,
  onClose,
  onDownload,
  onThemeChange,
}: ExportPreviewDialogProps) {
  const { t } = useTranslation('common')
  const titleId = useId()

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-[var(--color-overlay)] p-4"
      onMouseDown={onClose}
    >
      <div
        ref={dialogRef}
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-[430px] flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] pt-14 shadow-[0_8px_24px_rgb(0_0_0_/_24%)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="sr-only">
          {t('export.previewTitle')}
        </h2>
        <IconButton
          aria-label={t('export.download')}
          onClick={onDownload}
          className="absolute top-1.5 left-1.5 z-10"
          disabled={isExporting}
        >
          <Download aria-hidden="true" size={20} />
        </IconButton>
        <IconButton
          aria-label={t(theme === 'dark' ? 'export.useLightTheme' : 'export.useDarkTheme')}
          aria-pressed={theme === 'dark'}
          onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
          className="absolute top-1.5 left-[3.75rem] z-10"
          disabled={isExporting}
        >
          {theme === 'dark' ? (
            <Sun aria-hidden="true" size={20} />
          ) : (
            <Moon aria-hidden="true" size={20} />
          )}
        </IconButton>
        <IconButton
          aria-label={t('export.closePreview')}
          onClick={onClose}
          className="absolute top-1.5 right-1.5 z-10"
          disabled={isExporting}
        >
          <X aria-hidden="true" size={20} />
        </IconButton>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="w-full overflow-x-auto">
            <div className="mx-auto w-full">
              <ExportView
                ref={exportViewRef}
                enabledServerIds={enabledServerIds}
                selectedDate={exportDate}
                theme={theme}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
