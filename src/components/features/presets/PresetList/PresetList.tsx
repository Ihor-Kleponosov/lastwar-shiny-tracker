import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@/components/shared/ui/IconButton'
import type { Preset } from '@/types'

type PresetListProps = {
  presets: readonly Preset[]
}

export function PresetList({ presets }: PresetListProps) {
  const { t } = useTranslation('common')

  return (
    <section className="flex flex-col gap-3" aria-labelledby="preset-list-title">
      <div className="flex items-center justify-between gap-4">
        <h2 id="preset-list-title" className="text-base font-semibold">
          {t('presets.listTitle')}
        </h2>
        <IconButton
          className="border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)] shadow-[0_2px_3px_rgb(0_0_0_/_20%)] hover:bg-[var(--color-accent-hover)]"
          aria-label={t('presets.add')}
        >
          <Plus aria-hidden="true" className="size-5" />
        </IconButton>
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
              <button
                type="button"
                className="min-w-0 flex-1 rounded-lg px-2.5 py-2.5 text-left text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
              >
                <span className="block truncate">{preset.name}</span>
              </button>
              <IconButton
                className="bg-transparent shadow-none hover:bg-[var(--color-surface)]"
                aria-label={t('presets.edit', { name: preset.name })}
              >
                <Pencil aria-hidden="true" className="size-5" />
              </IconButton>
              <IconButton
                className="bg-transparent text-[var(--color-text-secondary)] shadow-none hover:bg-[var(--color-danger)] hover:text-white focus-visible:ring-[var(--color-danger)]"
                aria-label={t('presets.delete', { name: preset.name })}
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
