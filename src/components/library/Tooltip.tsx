import type { ReactNode } from 'react'
import styles from './Tooltip.module.css'

export type TooltipProps = {
  label: string
  children: ReactNode
  className?: string
}

export function Tooltip({ label, children, className }: TooltipProps) {
  const merged = [styles.host, className].filter(Boolean).join(' ')
  return (
    <span className={merged} tabIndex={0}>
      {children}
      <span className={styles.tip} role="tooltip">
        {label}
      </span>
    </span>
  )
}
