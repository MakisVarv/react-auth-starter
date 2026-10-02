/** @import {RefObject } from 'react'*/
import { useEffect } from 'react'
/**
 * @param {{
 *   dialogRef: RefObject<HTMLElement | null>,
 *   initialFocusRef:RefObject<HTMLElement | null>,
 *   onClose: () => void,
 *   canClose?: boolean
 * }} options
 */
export function useModalAccessibility({
  dialogRef,
  initialFocusRef,
  onClose,
  canClose = true,
}) {
  useEffect(() => {
    const previouslyFocusedElement = document.activeElement

    initialFocusRef.current?.focus()

    return () => {
      if (previouslyFocusedElement instanceof HTMLElement) {
        previouslyFocusedElement.focus()
      }
    }
  }, [initialFocusRef])
  useEffect(() => {
    /** @param {KeyboardEvent} event */
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        if (canClose) {
          onClose()
        }

        return
      }

      if (event.key !== 'Tab') {
        return
      }
      const focusableElements = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), select:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      )

      const firstElement = focusableElements?.[0]
      const lastElement = focusableElements?.[focusableElements.length - 1]

      if (
        !(firstElement instanceof HTMLElement) ||
        !(lastElement instanceof HTMLElement)
      ) {
        return
      }
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
        return
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [dialogRef, onClose, canClose])
}
