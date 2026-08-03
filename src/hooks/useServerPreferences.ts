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

  const saveEnabledServers = useCallback((nextEnabledServerIds: ReadonlySet<ServerId>) => {
    setEnabledServerIds(new Set(nextEnabledServerIds))
  }, [])

  return { enabledServerIds, serverIds, saveEnabledServers }
}
