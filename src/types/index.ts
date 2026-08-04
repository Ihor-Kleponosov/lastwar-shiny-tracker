export type ServerId = number

export type ServerGroup = readonly ServerId[]

export interface Preset {
  readonly id: string
  readonly name: string
}

export interface ShinyTasksConfiguration {
  readonly anchorDate: string
  readonly serverGroups: readonly ServerGroup[]
}

export interface PersistedServerPreferences {
  readonly enabledServerIds: readonly ServerId[]
}
