import { StepPersonal } from './steps/StepPersonal'
import { StepPreferences } from './steps/StepPreferences'
import { StepReview } from './steps/StepReview'

export function OnboardingFlow() {
  return (
    <>
      <StepPersonal />
      <StepPreferences />
      <StepReview />
    </>
  )
}
