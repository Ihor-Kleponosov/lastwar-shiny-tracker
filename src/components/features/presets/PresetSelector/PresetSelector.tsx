import { Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@/components/shared/ui/IconButton'
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

    if (nextPresetIds.has(value)) {
      nextPresetIds.delete(value)
    } else {
      nextPresetIds.add(value)
    }

    onSelectedPresetIdsChange(nextPresetIds)
  }

  return (
    <section className="flex flex-col gap-3 p-3 sm:p-4" aria-label={t('presets.title')}>
      <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
        {t('presets.title')}
      </h2>
      <div className="flex min-w-0 items-center gap-3">
        <MultiSelect
          ariaLabel={t('presets.title')}
          emptyMessage={t('presets.noOptions')}
          placeholder={t('presets.placeholder')}
          describedBy="preset-selector-help"
          options={presets.map((preset) => ({
            value: preset.id,
            label: preset.name,
          }))}
          checkedValues={checkedPresetIds}
          onOptionToggle={handleOptionToggle}
        />
        <IconButton aria-label={t('presets.button')} onClick={onEditPresets}>
          <Settings aria-hidden="true" size={20} />
        </IconButton>
      </div>
    </section>
  )
}
