import { List, ListTree } from 'lucide-react'
import { useRef, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@/components/shared/ui/IconButton'

export type ServerListView = 'all' | 'groups'

type ServerListViewSwitcherProps = {
  onChange: (view: ServerListView) => void
  value: ServerListView
}

const views = [
  { icon: List, translationKey: 'settings.serverList.viewAll', value: 'all' },
  { icon: ListTree, translationKey: 'settings.serverList.viewGroups', value: 'groups' },
] as const

export function ServerListViewSwitcher({ onChange, value }: ServerListViewSwitcherProps) {
  const { t } = useTranslation('common')
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    const previousKeys = ['ArrowLeft', 'ArrowUp']
    const nextKeys = ['ArrowRight', 'ArrowDown']
    if (!previousKeys.includes(event.key) && !nextKeys.includes(event.key)) return

    event.preventDefault()
    const direction = previousKeys.includes(event.key) ? -1 : 1
    const nextIndex = (currentIndex + direction + views.length) % views.length
    onChange(views[nextIndex].value)
    buttonRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="flex gap-1" role="radiogroup" aria-label={t('settings.serverList.viewLabel')}>
      {views.map((view, index) => {
        const Icon = view.icon
        const isSelected = value === view.value

        return (
          <IconButton
            key={view.value}
            ref={(button) => {
              buttonRefs.current[index] = button
            }}
            role="radio"
            aria-checked={isSelected}
            aria-label={t(view.translationKey)}
            isActive={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(view.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <Icon aria-hidden="true" size={20} />
          </IconButton>
        )
      })}
    </div>
  )
}
