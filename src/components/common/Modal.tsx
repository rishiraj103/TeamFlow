import { useEffect, useId, useRef, type ReactNode } from 'react'
import { getFocusableElements } from '../../utils/focus'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

export interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  size?: ModalSize
  closeLabel?: string
}

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  size = 'md',
  closeLabel = 'Close dialog',
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousBodyOverflow = document.body.style.overflow
    const dialog = dialogRef.current

    document.body.classList.add('modal-open')
    document.body.style.overflow = 'hidden'

    const focusableElements = dialog ? getFocusableElements(dialog) : []
    ;(focusableElements[0] ?? dialog)?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialog) {
        return
      }

      const elements = getFocusableElements(dialog)

      if (elements.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }

      const firstElement = elements[0]
      const lastElement = elements[elements.length - 1]

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
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('modal-open')
      document.body.style.overflow = previousBodyOverflow
      previouslyFocusedElement?.focus()
    }
  }, [onClose, open])

  if (!open) {
    return null
  }

  const dialogSizeClass = size === 'md' ? '' : `modal-${size}`

  return (
    <>
      <div className="modal-backdrop fade show" aria-hidden="true" />
      <div className="modal fade show d-block" role="presentation" tabIndex={-1}>
        <div
          className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${dialogSizeClass}`.trim()}
        >
          <div
            ref={dialogRef}
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
          >
            <div className="modal-header">
              <h2 id={titleId} className="modal-title fs-5">
                {title}
              </h2>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label={closeLabel}
              />
            </div>
            <div className="modal-body">{children}</div>
            {footer ? <div className="modal-footer">{footer}</div> : null}
          </div>
        </div>
      </div>
    </>
  )
}
