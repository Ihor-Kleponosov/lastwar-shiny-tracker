import { useTranslation } from 'react-i18next'
import { Button } from '@/components/shared/ui/Button'
import { MultiSelect } from '@/components/shared/ui/MultiSelect'
import type { Preset } from '@/types'

type PresetSelectorProps = {
  checkedPresetIds: ReadonlySet<string>
  onEditPresets: () => void
  onSelectedPresetIdsChange: (presetIds: ReadonlySet<string>) => void
  presets: readonly Preset[]
}

export function PresetSelector({
  checkedPresetIds,
  onEditPresets,
  onSelectedPresetIdsChange,
  presets,
}: PresetSelectorProps) {
  const { t } = useTranslation('common')

  function handleOptionToggle(value: string) {
    const nextPresetIds = new Set(checkedPresetIds)

    if (nextPresetIds.has(value)) nextPresetIds.delete(value)
    else nextPresetIds.add(value)

    onSelectedPresetIdsChange(nextPresetIds)
  }

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
          options={presets.map((preset) => ({
            value: preset.id,
            label: preset.name,
          }))}
          checkedValues={checkedPresetIds}
          onOptionToggle={handleOptionToggle}
        />
        <Button variant="secondary" onClick={onEditPresets}>
          {t('presets.button')}
        </Button>
      </div>
      <p id="preset-selector-help" className="text-xs text-[var(--color-text-secondary)]">
        {t('presets.help')}
      </p>
    </section>
  )
}
