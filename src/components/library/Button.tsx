import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

export type LibButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type LibButtonSize = 'sm' | 'md' | 'lg'

export type LibButtonProps = {
  variant?: LibButtonVariant
  size?: LibButtonSize
  loading?: boolean
  className?: string
  children?: ReactNode
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: LibButtonProps) {
  const merged = [
    styles.btn,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <button
      type={type}
      className={merged}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className={styles.spinner} aria-hidden /> : null}
      {children}
    </button>
  )
}
