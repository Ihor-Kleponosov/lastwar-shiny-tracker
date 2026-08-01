import type { ServerId } from '@/types'

type ServerChipProps = {
  serverId: ServerId
}

export function ServerChip({ serverId }: ServerChipProps) {
  return (
    <li className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-1 py-1 text-center text-sm font-light tabular-nums text-[var(--color-text-primary)]">
      {serverId}
    </li>
  )
}
