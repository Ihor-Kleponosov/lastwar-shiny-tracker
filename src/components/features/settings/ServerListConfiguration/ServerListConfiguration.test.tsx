import { useRef, useState } from 'react'
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { shinyTasksConfiguration } from '@/config'
import i18n from '@/i18n'
import { getConfiguredServerIds } from '@/utils/serverPreferences'
import { ServerListConfiguration } from '.'

const configuredServerIds = getConfiguredServerIds()
let gridWidth = 400
let scrollViewportHeight = 300

function calculateGridHeight(serverCount: number, columnCount: number): number {
  const rowCount = Math.ceil(serverCount / columnCount)
  return rowCount * 44 + Math.max(rowCount - 1, 0) * 8
}

function createRect(width: number, height: number): DOMRect {
  return {
    bottom: height,
    height,
    left: 0,
    right: width,
    top: 0,
    width,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect
}

class ResizeObserverMock {
  static instances = new Set<ResizeObserverMock>()
  private readonly targets = new Set<Element>()

  constructor(private readonly callback: ResizeObserverCallback) {
    ResizeObserverMock.instances.add(this)
  }

  observe(target: Element) {
    this.targets.add(target)
    this.notify()
  }

  disconnect() {
    ResizeObserverMock.instances.delete(this)
    this.targets.clear()
  }

  unobserve(target: Element) {
    this.targets.delete(target)
  }

  notify() {
    const entries = [...this.targets].map(
      (target) =>
        ({
          contentRect:
            target.tagName === 'UL' && target.getAttribute('aria-label')
              ? createRect(gridWidth, 0)
              : createRect(400, scrollViewportHeight),
          target,
        }) as ResizeObserverEntry,
    )

    this.callback(entries, this as unknown as ResizeObserver)
  }

  static notifyAll() {
    for (const instance of ResizeObserverMock.instances) {
      instance.notify()
    }
  }
}

function ServerListConfigurationHarness() {
  const [enabledServerIds, setEnabledServerIds] = useState<Set<number>>(() => new Set())
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const serverIds = getConfiguredServerIds()

  function toggleServer(serverId: number) {
    setEnabledServerIds((currentEnabledServerIds) => {
      const nextEnabledServerIds = new Set(currentEnabledServerIds)
      if (nextEnabledServerIds.has(serverId)) {
        nextEnabledServerIds.delete(serverId)
      } else {
        nextEnabledServerIds.add(serverId)
      }
      return nextEnabledServerIds
    })
  }

  function toggleServers(targetServerIds: readonly number[]) {
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
  }

  function clearServers(targetServerIds: readonly number[]) {
    setEnabledServerIds((currentEnabledServerIds) => {
      const nextEnabledServerIds = new Set(currentEnabledServerIds)
      for (const serverId of targetServerIds) {
        nextEnabledServerIds.delete(serverId)
      }
      return nextEnabledServerIds
    })
  }

  return (
    <div ref={scrollContainerRef} className="h-96 overflow-y-auto">
      <ServerListConfiguration
        enabledServerIds={enabledServerIds}
        scrollContainerRef={scrollContainerRef}
        serverIds={serverIds}
        onClearServers={clearServers}
        onToggleServer={toggleServer}
        onToggleServers={toggleServers}
      />
    </div>
  )
}

function renderConfiguration() {
  return render(<ServerListConfigurationHarness />)
}

function getServerCheckboxes() {
  return screen
    .getAllByRole('checkbox')
    .filter((checkbox) => checkbox.id.startsWith('server-')) as HTMLInputElement[]
}

async function selectSearchFilter(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('tab', { name: 'Search' }))
}

describe('ServerListConfiguration', () => {
  beforeEach(async () => {
    localStorage.clear()
    await i18n.changeLanguage('en')
    gridWidth = 400
    scrollViewportHeight = 300
    vi.stubGlobal('ResizeObserver', ResizeObserverMock)
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.tagName === 'UL' && this.getAttribute('aria-label')
        ? createRect(gridWidth, 0)
        : createRect(400, scrollViewportHeight)
    })
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.tagName === 'UL' && this.getAttribute('aria-label') ? gridWidth : 400
    })
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.tagName === 'UL' && this.getAttribute('aria-label') ? 0 : scrollViewportHeight
    })
  })

  afterEach(() => {
    ResizeObserverMock.instances.clear()
    vi.restoreAllMocks()
  })

  it('displays visible configured servers in numerical order with none selected by default', () => {
    renderConfiguration()

    const serverCheckboxes = getServerCheckboxes()

    const visibleServerIds = serverCheckboxes.map(({ id }) => Number(id.replace('server-', '')))
    expect(visibleServerIds).toEqual(configuredServerIds.slice(0, visibleServerIds.length))
    expect(visibleServerIds.length).toBeLessThan(configuredServerIds.length)
    expect(serverCheckboxes.every((checkbox) => !(checkbox as HTMLInputElement).checked)).toBe(true)
    const allDisplayedCheckbox = screen.getByRole('checkbox', { name: 'All displayed' })
    const selectedCount = screen.getByText('Selected: 0 / 100')

    expect(allDisplayedCheckbox).not.toBeChecked()
    expect(selectedCount).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear selection' })).toBeDisabled()
    expect(screen.getByRole('tab', { name: 'By range' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled()
  })

  it('reflows virtual rows after the available grid width changes', () => {
    scrollViewportHeight = 120
    renderConfiguration()

    const serverList = screen.getByRole('list', { name: 'Server list' })
    const initialRowCount = Math.ceil(configuredServerIds.length / 4)
    expect(within(serverList).getAllByRole('list').length).toBeLessThan(initialRowCount)
    expect(serverList).toHaveStyle({
      height: `${calculateGridHeight(configuredServerIds.length, 4)}px`,
    })

    gridWidth = 200
    act(() => ResizeObserverMock.notifyAll())

    const resizedRowCount = Math.ceil(configuredServerIds.length / 2)
    expect(within(serverList).getAllByRole('list').length).toBeLessThan(resizedRowCount)
    expect(serverList).toHaveStyle({
      height: `${calculateGridHeight(configuredServerIds.length, 2)}px`,
    })
    const visibleServerIds = getServerCheckboxes().map(({ id }) =>
      Number(id.replace('server-', '')),
    )
    expect(new Set(visibleServerIds)).toHaveLength(visibleServerIds.length)
  })

  it('switches between flat and grouped views with radio-button keyboard behavior', async () => {
    const user = userEvent.setup()

    renderConfiguration()

    const flatView = screen.getByRole('radio', { name: 'Show all servers in one list' })
    const groupedView = screen.getByRole('radio', { name: 'Show servers grouped' })

    expect(flatView).toHaveAttribute('aria-checked', 'true')
    expect(groupedView).toHaveAttribute('aria-checked', 'false')
    expect(screen.queryByRole('heading', { name: 'Group A' })).not.toBeInTheDocument()

    flatView.focus()
    await user.keyboard('{ArrowRight}')

    expect(groupedView).toHaveAttribute('aria-checked', 'true')
    expect(groupedView).toHaveFocus()
    expect(screen.getAllByRole('separator')).toHaveLength(3)

    for (const [groupIndex, groupLabel] of ['A', 'B', 'C'].entries()) {
      const groupList = screen.getByRole('list', { name: `Group ${groupLabel}` })
      expect(groupList.parentElement).toHaveClass('max-h-[300px]', 'overflow-y-auto')
      const groupServerIds = within(groupList)
        .getAllByRole('checkbox')
        .map((checkbox) => Number(checkbox.id.replace('server-', '')))

      expect(groupServerIds).toEqual(
        shinyTasksConfiguration.serverGroups[groupIndex]?.slice(0, groupServerIds.length),
      )
    }

    await user.click(flatView)

    expect(flatView).toHaveAttribute('aria-checked', 'true')
    expect(screen.queryByRole('heading', { name: 'Group A' })).not.toBeInTheDocument()
  })

  it('filters grouped servers, handles empty groups, and keeps server selection interactive', async () => {
    const user = userEvent.setup()

    renderConfiguration()
    await selectSearchFilter(user)
    await user.type(screen.getByRole('searchbox', { name: 'Search servers' }), '1639')
    await user.click(screen.getByRole('radio', { name: 'Show servers grouped' }))

    expect(screen.getAllByText('No servers in this group')).toHaveLength(2)
    const serverCheckbox = within(screen.getByRole('list', { name: 'Group B' })).getByRole(
      'checkbox',
      { name: '1639' },
    )

    expect(serverCheckbox).not.toBeChecked()
    await user.click(serverCheckbox)

    expect(serverCheckbox).toBeChecked()
  })

  it('filters servers inclusively by range and swaps reversed bounds', async () => {
    const user = userEvent.setup()

    renderConfiguration()

    const from = screen.getByRole('textbox', { name: 'From' })
    const to = screen.getByRole('textbox', { name: 'To' })

    await user.type(from, '1692')
    await user.type(to, '16a80')
    expect(to).toHaveValue('1680')

    await user.click(screen.getByRole('button', { name: 'Apply' }))

    expect(from).toHaveValue('1680')
    expect(to).toHaveValue('1692')
    expect(getServerCheckboxes().map(({ id }) => Number(id.replace('server-', '')))).toEqual(
      Array.from({ length: 13 }, (_, index) => 1680 + index),
    )
    expect(screen.getByRole('checkbox', { name: 'All displayed' })).toBeInTheDocument()
  })

  it('resets filters when switching tabs', async () => {
    const user = userEvent.setup()

    renderConfiguration()

    await user.type(screen.getByRole('textbox', { name: 'From' }), '1680')
    await user.type(screen.getByRole('textbox', { name: 'To' }), '1692')
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(getServerCheckboxes()).toHaveLength(13)

    await selectSearchFilter(user)
    await user.type(screen.getByRole('searchbox', { name: 'Search servers' }), '1638')
    expect(getServerCheckboxes()).toHaveLength(1)

    await user.click(screen.getByRole('tab', { name: 'By range' }))
    expect(screen.getByRole('textbox', { name: 'From' })).toHaveValue('')
    expect(screen.getByRole('textbox', { name: 'To' })).toHaveValue('')
    expect(getServerCheckboxes().length).toBeLessThan(configuredServerIds.length)
  })

  it('resets the applied range with the reset filter action', async () => {
    const user = userEvent.setup()

    renderConfiguration()

    await user.type(screen.getByRole('textbox', { name: 'From' }), '1680')
    await user.type(screen.getByRole('textbox', { name: 'To' }), '1692')
    await user.click(screen.getByRole('button', { name: 'Apply' }))

    const resetFilter = screen.getByRole('button', { name: 'Reset filter' })
    const viewSwitcher = screen.getByRole('radiogroup', { name: 'Server list view' })

    const toolbar = resetFilter.parentElement?.parentElement
    expect(toolbar?.firstElementChild).toBe(viewSwitcher)
    expect(toolbar).toContainElement(resetFilter)

    await user.click(resetFilter)

    expect(screen.getByRole('textbox', { name: 'From' })).toHaveValue('')
    expect(screen.getByRole('textbox', { name: 'To' })).toHaveValue('')
    expect(getServerCheckboxes().length).toBeLessThan(configuredServerIds.length)
    expect(screen.queryByRole('button', { name: 'Reset filter' })).not.toBeInTheDocument()
  })

  it('toggles a server with pointer and keyboard interaction', async () => {
    const user = userEvent.setup()

    renderConfiguration()

    await selectSearchFilter(user)
    await user.type(screen.getByRole('searchbox', { name: 'Search servers' }), '1638')

    const serverCheckbox = screen.getByRole('checkbox', { name: '1638' })
    await user.click(serverCheckbox)
    expect(serverCheckbox).toBeChecked()

    serverCheckbox.focus()
    await user.keyboard(' ')
    expect(serverCheckbox).not.toBeChecked()
  })

  it('filters servers by text and restores the list when cleared', async () => {
    const user = userEvent.setup()

    renderConfiguration()
    await selectSearchFilter(user)

    const filter = screen.getByRole('searchbox', { name: 'Search servers' })
    await user.type(filter, '1638')

    expect(screen.getByRole('checkbox', { name: '1638' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: '1639' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear server filter' }))

    expect(getServerCheckboxes().length).toBeLessThan(configuredServerIds.length)
  })

  it('keeps the displayed-selection control visible when a filter matches the full list', async () => {
    const user = userEvent.setup()

    renderConfiguration()
    await selectSearchFilter(user)

    await user.type(screen.getByRole('searchbox', { name: 'Search servers' }), '1')

    expect(screen.getByRole('checkbox', { name: 'All displayed' })).not.toBeChecked()
  })

  it('shows no-results feedback for a filter without matching servers', async () => {
    const user = userEvent.setup()

    renderConfiguration()
    await selectSearchFilter(user)

    await user.type(screen.getByRole('searchbox', { name: 'Search servers' }), '9999')

    expect(screen.getByText('No servers found')).toBeInTheDocument()
    expect(getServerCheckboxes()).toHaveLength(0)
    expect(screen.getByRole('checkbox', { name: 'All displayed' })).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: 'Show servers grouped' }))

    expect(screen.queryByText('No servers found')).not.toBeInTheDocument()
    expect(screen.getAllByText('No servers in this group')).toHaveLength(3)
  })

  it('toggles only displayed servers and updates its checked state', async () => {
    const user = userEvent.setup()

    renderConfiguration()
    await selectSearchFilter(user)

    const filter = screen.getByRole('searchbox', { name: 'Search servers' })
    await user.type(filter, '1638')

    const selectDisplayed = screen.getByRole('checkbox', { name: 'All displayed' })

    await user.click(selectDisplayed)
    expect(screen.getByRole('checkbox', { name: '1638' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'All displayed' })).toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Clear server filter' }))
    expect(screen.getByRole('checkbox', { name: 'All displayed' })).not.toBeChecked()

    await user.type(filter, '1638')
    const selectDisplayedAfterRefilter = screen.getByRole('checkbox', { name: 'All displayed' })

    await user.click(selectDisplayedAfterRefilter)
    expect(screen.getByRole('checkbox', { name: '1638' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'All displayed' })).not.toBeChecked()

    await user.click(screen.getByRole('checkbox', { name: '1638' }))
    expect(screen.getByRole('checkbox', { name: 'All displayed' })).toBeChecked()
  })

  it('clears only selected servers currently shown', async () => {
    const user = userEvent.setup()

    renderConfiguration()
    await selectSearchFilter(user)
    await user.type(screen.getByRole('searchbox', { name: 'Search servers' }), '1638')
    await user.click(screen.getByRole('checkbox', { name: 'All displayed' }))
    await user.click(screen.getByRole('button', { name: 'Clear server filter' }))
    await user.type(screen.getByRole('searchbox', { name: 'Search servers' }), '1639')
    await user.click(screen.getByRole('checkbox', { name: 'All displayed' }))
    await user.click(screen.getByRole('button', { name: 'Clear server filter' }))
    await user.type(screen.getByRole('searchbox', { name: 'Search servers' }), '1638')

    await user.click(screen.getByRole('button', { name: 'Clear selection' }))

    expect(screen.getByRole('checkbox', { name: '1638' })).not.toBeChecked()
    expect(screen.getByText('Selected: 1 / 100')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear selection' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Clear server filter' }))
    await user.type(screen.getByRole('searchbox', { name: 'Search servers' }), '1639')
    expect(screen.getByRole('checkbox', { name: '1639' })).toBeChecked()
  })
})
