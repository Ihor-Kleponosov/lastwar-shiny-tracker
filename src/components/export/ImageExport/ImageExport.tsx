import html2canvas from 'html2canvas'
import { Image } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExportView } from '@/components/export/ExportView'
import { IconButton } from '@/components/ui/IconButton'
import { Loader } from '@/components/ui/Loader'
import type { ServerId } from '@/types'
import { getExportFilename } from '@/utils/exportFilename'

type ImageExportProps = {
  enabledServerIds: ReadonlySet<ServerId>
  selectedDate: Date
}

export function ImageExport({ enabledServerIds, selectedDate }: ImageExportProps) {
  const { t } = useTranslation('common')
  const [isExporting, setIsExporting] = useState(false)
  const exportViewRef = useRef<HTMLDivElement>(null)

  const handleExport = async () => {
    setIsExporting(true)

    try {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

      const exportView = exportViewRef.current
      if (!exportView) {
        throw new Error('Export view was not mounted.')
      }

      await document.fonts.ready

      const canvas = await html2canvas(exportView, { scale: 2 })
      const imageBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
            return
          }

          reject(new Error('Unable to create the export image.'))
        }, 'image/png')
      })
      const objectUrl = URL.createObjectURL(imageBlob)

      try {
        const downloadLink = document.createElement('a')
        downloadLink.href = objectUrl
        downloadLink.download = getExportFilename(selectedDate)
        downloadLink.click()
      } finally {
        URL.revokeObjectURL(objectUrl)
      }
    } catch (error) {
      console.error('Image export failed.', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <IconButton aria-label={t('export.download')} onClick={handleExport}>
        <Image aria-hidden="true" size={20} />
      </IconButton>
      {isExporting ? (
        <>
          <div className="fixed left-[-10000px] top-0 pointer-events-none">
            <ExportView
              ref={exportViewRef}
              enabledServerIds={enabledServerIds}
              selectedDate={selectedDate}
            />
          </div>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-overlay)]"
            role="status"
            aria-live="polite"
            aria-label={t('export.loading')}
          >
            <Loader />
          </div>
        </>
      ) : null}
    </>
  )
}
