import { useCallback, useState } from 'react'
import type { ServerId } from '@/types'
import {
  getConfiguredServerIds,
  getEnabledServerIds,
  saveEnabledServerIds,
} from '@/utils/serverPreferences'

export function useServerPreferences() {
  const [enabledServerIds, setEnabledServerIds] = useState<Set<ServerId>>(getEnabledServerIds)
  const [serverIds] = useState(getConfiguredServerIds)

  const saveEnabledServers = useCallback((nextEnabledServerIds: ReadonlySet<ServerId>) => {
    const nextEnabledServerIdsCopy = new Set(nextEnabledServerIds)
    setEnabledServerIds(nextEnabledServerIdsCopy)
    saveEnabledServerIds(nextEnabledServerIdsCopy)
  }, [])

  return { enabledServerIds, serverIds, saveEnabledServers }
}
