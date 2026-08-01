export type ServerId = number

export type ServerGroup = readonly ServerId[]

export interface ShinyTasksConfiguration {
  readonly anchorDate: string
  readonly serverGroups: readonly ServerGroup[]
}

export interface PersistedServerPreferences {
  readonly disabledServerIds: readonly ServerId[]
}
