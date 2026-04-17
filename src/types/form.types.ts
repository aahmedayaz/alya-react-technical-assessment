export type OnboardingPersonal = {
  fullName: string
  email: string
  phone: string
}

export type OnboardingPreferences = {
  interests: string[]
  notifyLevel: number
  darkMode: boolean
}

export type OnboardingFormState = {
  personal: OnboardingPersonal
  preferences: OnboardingPreferences
}
