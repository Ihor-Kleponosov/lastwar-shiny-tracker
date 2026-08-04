import { ServerList } from '@/components/features/servers/ServerList'
import type { Preset } from '@/types'

type PresetsListProps = {
  presets: readonly Preset[]
  selectedDate: Date
}

export function PresetsList({ presets, selectedDate }: PresetsListProps) {
  return presets.map((preset) => (
    <ServerList key={preset.id} preset={preset} selectedDate={selectedDate} />
  ))
}
