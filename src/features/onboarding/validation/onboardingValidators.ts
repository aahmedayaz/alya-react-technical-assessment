import type { OnboardingPersonal, OnboardingPreferences } from '../../../types'

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateFullName(value: string): string {
  const v = value.trim()
  if (!v) return 'Full name is required.'
  if (v.length < 2) return 'Please enter at least 2 characters.'
  return ''
}

export function validateEmail(value: string): string {
  const v = value.trim()
  if (!v) return 'Email is required.'
  if (!emailRe.test(v)) return 'Please enter a valid email address.'
  return ''
}

export function validatePhone(value: string): string {
  const v = value.trim()
  if (!v) return 'Phone number is required.'
  const digits = v.replace(/\D/g, '')
  if (digits.length < 10) return 'Enter at least 10 digits.'
  return ''
}

export function validatePersonal(p: OnboardingPersonal): Record<string, string> {
  return {
    fullName: validateFullName(p.fullName),
    email: validateEmail(p.email),
    phone: validatePhone(p.phone),
  }
}

export function validatePreferences(p: OnboardingPreferences): Record<string, string> {
  if (!p.interests.length) return { interests: 'Pick at least one interest.' }
  if (p.notifyLevel < 0 || p.notifyLevel > 4) return { notifyLevel: 'Pick a notification level.' }
  return {}
}
