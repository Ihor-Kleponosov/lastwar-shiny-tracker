import { useTranslation } from 'react-i18next'
import { ServerList } from '@/components/features/servers/ServerList'
import type { Preset } from '@/types'

type PresetsListProps = {
  presets: readonly Preset[]
  selectedDate: Date
}

export function PresetsList({ presets, selectedDate }: PresetsListProps) {
  const { t } = useTranslation('common')

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {presets.length === 0 ? (
        <p id="preset-selector-help" className="text-xs text-[var(--color-text-secondary)]">
          {t('presets.help')}
        </p>
      ) : null}
      {presets.map((preset) => (
        <ServerList key={preset.id} preset={preset} selectedDate={selectedDate} />
      ))}
    </div>
  )
}
