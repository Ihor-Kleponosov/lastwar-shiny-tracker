import { useEffect, type RefObject } from 'react'

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

type UseModalAccessibilityOptions = {
  dialogRef: RefObject<HTMLElement | null>
  focusKey?: unknown
  isOpen: boolean
  onClose: () => void
  returnFocusRef?: RefObject<HTMLElement | null>
}

export function useModalAccessibility({
  dialogRef,
  focusKey,
  isOpen,
  onClose,
  returnFocusRef,
}: UseModalAccessibilityOptions) {
  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    const returnFocusElement = returnFocusRef?.current
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusableElements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements.at(-1)

      if (!firstElement || !lastElement) return

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      returnFocusElement?.focus()
    }
  }, [dialogRef, isOpen, onClose, returnFocusRef])

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus()
    }
  }, [dialogRef, focusKey, isOpen])
}
