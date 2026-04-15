export type OnboardingFormState = {
  personal: {
    firstName: string
    lastName: string
    email: string
  }
  preferences: {
    newsletter: boolean
    theme: string
  }
}
