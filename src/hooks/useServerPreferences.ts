import { useCallback, useEffect, useState } from 'react'
import type { ServerId } from '@/types'
import {
  getConfiguredServerIds,
  getEnabledServerIds,
  saveEnabledServerIds,
} from '@/utils/serverPreferences'

export function useServerPreferences() {
  const [enabledServerIds, setEnabledServerIds] = useState<Set<ServerId>>(getEnabledServerIds)
  const [serverIds] = useState(getConfiguredServerIds)

  useEffect(() => {
    saveEnabledServerIds(enabledServerIds)
  }, [enabledServerIds])

  const toggleServer = useCallback((serverId: ServerId) => {
    setEnabledServerIds((currentEnabledServerIds) => {
      const nextEnabledServerIds = new Set(currentEnabledServerIds)

      if (nextEnabledServerIds.has(serverId)) {
        nextEnabledServerIds.delete(serverId)
      } else {
        nextEnabledServerIds.add(serverId)
      }

      return nextEnabledServerIds
    })
  }, [])

  const toggleServers = useCallback((targetServerIds: readonly ServerId[]) => {
    if (targetServerIds.length === 0) {
      return
    }

    setEnabledServerIds((currentEnabledServerIds) => {
      const nextEnabledServerIds = new Set(currentEnabledServerIds)
      const areAllTargetServersSelected = targetServerIds.every((serverId) =>
        currentEnabledServerIds.has(serverId),
      )

      for (const serverId of targetServerIds) {
        if (areAllTargetServersSelected) {
          nextEnabledServerIds.delete(serverId)
        } else {
          nextEnabledServerIds.add(serverId)
        }
      }

      return nextEnabledServerIds
    })
  }, [])

  return { enabledServerIds, serverIds, toggleServer, toggleServers }
}
