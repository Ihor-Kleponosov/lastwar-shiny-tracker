import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { MultiSelect } from '@/components/ui/MultiSelect'
import type { ServerId } from '@/types'

type PresetSelectorProps = {
  serverGroups: readonly (readonly ServerId[])[]
}

export function PresetSelector({ serverGroups }: PresetSelectorProps) {
  const { t } = useTranslation('common')

  return (
    <section
      className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[0_8px_24px_rgb(0_0_0_/_14%)] sm:p-4"
      aria-label={t('presets.title')}
    >
      <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
        {t('presets.title')}
      </h2>
      <div className="flex min-w-0 items-center gap-3">
        <MultiSelect
          ariaLabel={t('presets.title')}
          placeholder={t('presets.placeholder')}
          describedBy="preset-selector-help"
          options={serverGroups.map((_, index) => ({
            value: String(index),
            label: t('presets.group', { label: String.fromCharCode(65 + index) }),
          }))}
        />
        <Button variant="secondary">{t('presets.button')}</Button>
      </div>
      <p id="preset-selector-help" className="text-xs text-[var(--color-text-secondary)]">
        {t('presets.help')}
      </p>
    </section>
  )
}
