import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import styles from './DsModal.module.css'

export type DsModalProps = {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  className?: string
}

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function DsModal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
}: DsModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const prevFocus = useRef<HTMLElement | null>(null)

  const onOverlayMouseDown = useCallback(
    (e: MouseEvent) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return
    prevFocus.current = document.activeElement as HTMLElement | null
    const root = dialogRef.current
    if (!root) return
    const focusables = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
    )
    const first = focusables[0]
    first?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !root) return
      const list = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
      )
      if (!list.length) return
      const last = list[list.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (!e.shiftKey && active === last) {
        e.preventDefault()
        list[0]?.focus()
      } else if (e.shiftKey && active === list[0]) {
        e.preventDefault()
        last?.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      prevFocus.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  const merged = [styles.dialog, className].filter(Boolean).join(' ')

  return createPortal(
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={onOverlayMouseDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={merged}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {title ? (
          <div className={styles.header} id={titleId}>
            {title}
          </div>
        ) : null}
        <div className={styles.body}>{children}</div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}
