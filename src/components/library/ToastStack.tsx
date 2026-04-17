import { useEffect } from 'react'
import type { ToastItem, ToastType } from '../../types/toast'
import styles from './ToastStack.module.css'

type ToastStackProps = {
  items: ToastItem[]
  onDismiss: (id: string) => void
}

function accentClass(type: ToastType) {
  if (type === 'success') return styles.success
  if (type === 'error') return styles.error
  if (type === 'warning') return styles.warning
  return styles.info
}

function barClass(type: ToastType) {
  if (type === 'success') return styles.successBar
  if (type === 'error') return styles.errorBar
  if (type === 'warning') return styles.warningBar
  return styles.infoBar
}

function ToastRow({
  item,
  onDismiss,
}: {
  item: ToastItem
  onDismiss: (id: string) => void
}) {
  const durationMs = item.durationMs ?? 5200

  useEffect(() => {
    if (durationMs <= 0) return
    const t = window.setTimeout(() => onDismiss(item.id), durationMs)
    return () => window.clearTimeout(t)
  }, [durationMs, item.id, onDismiss])

  return (
    <div className={styles.card} role="status">
      <div className={styles.row}>
        <div className={`${styles.accent} ${accentClass(item.type)}`} aria-hidden />
        <div className={styles.content}>
          {item.title ? (
            <div className={styles.title}>{item.title}</div>
          ) : null}
          <div className={styles.message}>{item.message}</div>
        </div>
        <button
          type="button"
          className={styles.close}
          onClick={() => onDismiss(item.id)}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
      {durationMs > 0 ? (
        <div className={styles.progressTrack} aria-hidden>
          <div
            className={`${styles.progressBar} ${barClass(item.type)}`}
            style={{ animationDuration: `${durationMs}ms` }}
          />
        </div>
      ) : null}
    </div>
  )
}

export function ToastStack({ items, onDismiss }: ToastStackProps) {
  if (!items.length) return null
  return (
    <div className={styles.region} aria-label="Notifications">
      {items.map((item) => (
        <ToastRow key={item.id} item={item} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
