export type ServerId = number

export type ServerGroup = readonly ServerId[]

export interface Preset {
  readonly id: string
  readonly name: string
  readonly enabledServerIds: readonly ServerId[]
}

export interface ShinyTasksConfiguration {
  readonly anchorDate: string
  readonly serverTimeZone: string
  readonly serverGroups: readonly ServerGroup[]
}
