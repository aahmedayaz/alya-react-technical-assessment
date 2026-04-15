import type { ReactNode } from 'react'
import styles from './Modal.module.css'

export type ModalProps = {
  open: boolean
  onClose: () => void
  header?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  className?: string
}

export function Modal({
  open,
  onClose,
  header,
  children,
  footer,
  className,
}: ModalProps) {
  if (!open) return null
  const merged = [styles.dialog, className].filter(Boolean).join(' ')
  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className={merged}
        onClick={(e) => e.stopPropagation()}
      >
        {header ? <div className={styles.header}>{header}</div> : null}
        <div className={styles.body}>{children}</div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>
  )
}
