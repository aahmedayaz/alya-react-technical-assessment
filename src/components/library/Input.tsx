import type { InputHTMLAttributes, ReactNode } from 'react'
import styles from './Input.module.css'

export type LibInputProps = {
  id: string
  label: string
  helperText?: string
  error?: string
  prefix?: ReactNode
  suffix?: ReactNode
  className?: string
  inputClassName?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>

export function Input({
  id,
  label,
  helperText,
  error,
  prefix,
  suffix,
  className,
  inputClassName,
  ...rest
}: LibInputProps) {
  const wrap = [styles.wrap, className].filter(Boolean).join(' ')
  const field = [
    styles.field,
    error ? styles.errorField : '',
  ]
    .filter(Boolean)
    .join(' ')
  const inputCls = [styles.input, inputClassName].filter(Boolean).join(' ')
  return (
    <div className={wrap}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={field}>
        {prefix ? <span className={styles.prefix}>{prefix}</span> : null}
        <input id={id} className={inputCls} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : helperText ? `${id}-help` : undefined} {...rest} />
        {suffix ? <span className={styles.suffix}>{suffix}</span> : null}
      </div>
      {error ? (
        <p id={`${id}-err`} className={styles.errorText} role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${id}-help`} className={styles.helper}>
          {helperText}
        </p>
      ) : null}
    </div>
  )
}
