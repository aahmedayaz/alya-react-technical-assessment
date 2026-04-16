import type { ToastItem } from '../../../contexts/ToastContext'

type ToastViewportProps = {
  items: ToastItem[]
  onDismiss: (id: string) => void
}

export function ToastViewport({ items, onDismiss }: ToastViewportProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-[100] flex max-w-sm flex-col gap-2"
    >
      {items.map((item) => (
        <div
          key={item.id}
          role="status"
          className="flex items-start justify-between gap-3 rounded-lg border border-muted/20 bg-card px-4 py-3 text-sm text-foreground shadow-lg"
        >
          <span className="min-w-0 flex-1">{item.message}</span>
          <button
            type="button"
            onClick={() => onDismiss(item.id)}
            className="shrink-0 rounded p-1 text-muted hover:text-foreground"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
