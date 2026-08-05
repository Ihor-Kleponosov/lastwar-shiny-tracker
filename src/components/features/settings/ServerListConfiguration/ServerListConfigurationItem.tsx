import { Check } from 'lucide-react'
import type { ServerId } from '@/types'

type ServerListConfigurationItemProps = {
  isSelected: boolean
  onToggle: (serverId: ServerId) => void
  serverId: ServerId
}

export function ServerListConfigurationItem({
  isSelected,
  onToggle,
  serverId,
}: ServerListConfigurationItemProps) {
  const inputId = `server-${serverId}`

  return (
    <li>
      <input
        id={inputId}
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggle(serverId)}
        className="peer sr-only"
      />
      <label
        htmlFor={inputId}
        className="flex min-h-11 cursor-pointer items-center justify-around gap-1 rounded-lg border border-[var(--color-border)] bg-transparent px-1 py-1 text-center text-sm font-light tabular-nums text-[var(--color-text-secondary)] transition-colors duration-150 peer-checked:border-[var(--color-accent)] peer-checked:text-[var(--color-text-primary)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-focus)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--color-background)] motion-reduce:transition-none"
      >
        <span>{serverId}</span>
        <Check
          aria-hidden="true"
          size={16}
          className={`text-[var(--color-accent)] ${isSelected ? 'opacity-100' : 'opacity-0'}`}
        />
      </label>
    </li>
  )
}
