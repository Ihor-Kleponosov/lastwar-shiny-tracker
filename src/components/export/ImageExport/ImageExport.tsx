import { Image } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useModalAccessibility } from '@/hooks/useModalAccessibility'
import { IconButton } from '@/components/ui/IconButton'
import { Loader } from '@/components/ui/Loader'
import type { ExportTheme } from '@/components/export/ExportView'
import type { ServerId } from '@/types'
import { downloadElementAsPng } from '@/utils/downloadElementAsPng'
import { getExportFilename } from '@/utils/exportFilename'
import { getCurrentMonthValue, getDateFromMonthValue } from '@/utils/month'
import { ExportMonthPickerDialog } from './ExportMonthPickerDialog'
import { ExportPreviewDialog } from './ExportPreviewDialog'

type ImageExportProps = {
  enabledServerIds: ReadonlySet<ServerId>
}

type ExportDialogStep = 'closed' | 'month-picker' | 'preview'

export function ImageExport({ enabledServerIds }: ImageExportProps) {
  const { t } = useTranslation('common')
  const [dialogStep, setDialogStep] = useState<ExportDialogStep>('closed')
  const [monthValue, setMonthValue] = useState(getCurrentMonthValue)
  const [exportDate, setExportDate] = useState(() => getDateFromMonthValue(getCurrentMonthValue()))
  const [isExporting, setIsExporting] = useState(false)
  const [exportTheme, setExportTheme] = useState<ExportTheme>('dark')
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const exportViewRef = useRef<HTMLDivElement>(null)
  const isDialogOpen = dialogStep !== 'closed'

  const handleClose = useCallback(() => {
    setDialogStep('closed')
    setIsExporting(false)
  }, [])

  useModalAccessibility({
    dialogRef,
    focusKey: dialogStep,
    isOpen: isDialogOpen,
    onClose: handleClose,
    returnFocusRef: triggerRef,
  })

  const handleOpen = () => {
    setMonthValue(getCurrentMonthValue())
    setDialogStep('month-picker')
  }

  const handleProceed = () => {
    setExportDate(getDateFromMonthValue(monthValue))
    setDialogStep('preview')
  }

  const handleDownload = async () => {
    const exportView = exportViewRef.current
    if (!exportView) {
      console.error('Image export failed.', new Error('Export view was not mounted.'))
      return
    }

    setIsExporting(true)

    try {
      await downloadElementAsPng(exportView, getExportFilename(exportDate))
    } catch (error) {
      console.error('Image export failed.', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <IconButton ref={triggerRef} aria-label={t('export.download')} onClick={handleOpen}>
        <Image aria-hidden="true" size={20} />
      </IconButton>
      {dialogStep === 'month-picker' ? (
        <ExportMonthPickerDialog
          dialogRef={dialogRef}
          monthValue={monthValue}
          onClose={handleClose}
          onMonthChange={setMonthValue}
          onProceed={handleProceed}
        />
      ) : null}
      {dialogStep === 'preview' ? (
        <ExportPreviewDialog
          dialogRef={dialogRef}
          enabledServerIds={enabledServerIds}
          exportDate={exportDate}
          exportViewRef={exportViewRef}
          theme={exportTheme}
          isExporting={isExporting}
          onClose={handleClose}
          onDownload={handleDownload}
          onThemeChange={setExportTheme}
        />
      ) : null}
      {isExporting ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-overlay)]"
          role="status"
          aria-live="polite"
          aria-label={t('export.loading')}
        >
          <Loader />
        </div>
      ) : null}
    </>
  )
}
