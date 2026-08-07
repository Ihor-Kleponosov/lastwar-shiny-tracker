import { Download, Pencil, Plus, Trash2, Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@/components/shared/ui/IconButton'
import type { Preset } from '@/types'

type PresetListProps = {
  presets: readonly Preset[]
  onAdd: (trigger: HTMLButtonElement) => void
  onDelete: (preset: Preset, trigger: HTMLButtonElement) => void
  onEdit: (preset: Preset, trigger: HTMLButtonElement) => void
  onExport: (trigger: HTMLButtonElement) => void
  onImport: (trigger: HTMLButtonElement) => void
}

export function PresetList({
  presets,
  onAdd,
  onDelete,
  onEdit,
  onExport,
  onImport,
}: PresetListProps) {
  const { t } = useTranslation('common')

  return (
    <section className="flex flex-col gap-3" aria-labelledby="preset-list-title">
      <div className="flex items-center justify-between gap-4">
        <h2 id="preset-list-title" className="text-base font-semibold">
          {t('presets.listTitle')}
        </h2>
        <div className="flex items-center gap-2">
          <IconButton
            onClick={(event) => onExport(event.currentTarget)}
            aria-label={t('presets.export.action')}
          >
            <Upload aria-hidden="true" className="size-5" />
          </IconButton>
          <IconButton
            onClick={(event) => onImport(event.currentTarget)}
            aria-label={t('presets.import')}
          >
            <Download aria-hidden="true" className="size-5" />
          </IconButton>
          <IconButton
            onClick={(event) => onAdd(event.currentTarget)}
            className="border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)] shadow-[0_2px_3px_rgb(0_0_0_/_20%)] hover:bg-[var(--color-accent-hover)]"
            aria-label={t('presets.add')}
          >
            <Plus aria-hidden="true" className="size-5" />
          </IconButton>
        </div>
      </div>

      {presets.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--color-border)] px-4 py-6 text-center text-sm text-[var(--color-text-secondary)]">
          {t('presets.empty')}
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5" aria-label={t('presets.listTitle')}>
          {presets.map((preset) => (
            <li
              key={preset.id}
              className="flex min-w-0 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/70 p-1.5"
            >
              <div className="min-w-0 flex-1 rounded-lg px-2.5 py-2.5 text-left text-sm font-medium text-[var(--color-text-primary)]">
                <span className="block truncate">{preset.name}</span>
              </div>
              <IconButton
                className="bg-transparent shadow-none hover:bg-[var(--color-surface)]"
                aria-label={t('presets.edit', { name: preset.name })}
                onClick={(event) => onEdit(preset, event.currentTarget)}
              >
                <Pencil aria-hidden="true" className="size-5" />
              </IconButton>
              <IconButton
                className="bg-transparent text-[var(--color-text-secondary)] shadow-none hover:bg-[var(--color-danger)] hover:text-white focus-visible:ring-[var(--color-danger)]"
                aria-label={t('presets.delete', { name: preset.name })}
                onClick={(event) => onDelete(preset, event.currentTarget)}
              >
                <Trash2 aria-hidden="true" className="size-5" />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
