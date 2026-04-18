import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '../../../components/library'
import { useToast } from '../../../hooks'
import type { OnboardingPersonal, OnboardingPreferences } from '../../../types'
import {
  validatePersonal,
  validatePreferences,
} from '../validation/onboardingValidators'

const interestPool = [
  'Productivity',
  'Creative Writing',
  'Machine Learning',
  'Design Systems',
  'Data Viz',
  'Automation',
] as const

const notifyLabels = ['Quiet', 'Standard', 'Balanced', 'Frequent', 'Live'] as const

function StepDots({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-2" aria-hidden>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-full ${
            i <= step ? 'bg-primary' : 'bg-foreground/10'
          }`}
        />
      ))}
    </div>
  )
}

export function OnboardingFlow() {
  const { push } = useToast()
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [personal, setPersonal] = useState<OnboardingPersonal>({
    fullName: '',
    email: '',
    phone: '',
  })
  const [preferences, setPreferences] = useState<OnboardingPreferences>({
    interests: [],
    notifyLevel: 2,
    darkMode: false,
  })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [touchedPrefs, setTouchedPrefs] = useState(false)
  const [step2Attempted, setStep2Attempted] = useState(false)
  const [done, setDone] = useState(false)

  const personalErrors = useMemo(() => validatePersonal(personal), [personal])
  const preferencesErrors = useMemo(
    () => validatePreferences(preferences),
    [preferences],
  )

  const personalStepOk = Object.values(personalErrors).every((msg) => !msg)
  const preferencesStepOk = Object.values(preferencesErrors).every(
    (msg) => !msg,
  )

  const blurPersonal = useCallback((key: keyof OnboardingPersonal) => {
    setTouched((prev) => ({ ...prev, [key]: true }))
  }, [])

  const onNext = () => {
    if (step === 1) {
      setTouched((prev) => ({
        ...prev,
        fullName: true,
        email: true,
        phone: true,
      }))
      if (!personalStepOk) return
      setStep(2)
      return
    }
    if (step === 2) {
      setStep2Attempted(true)
      if (!preferencesStepOk) return
      setStep(3)
    }
  }

  const onBack = () => {
    if (step === 1) return
    setStep((s) => (s === 3 ? 2 : 1))
  }

  const onSubmit = () => {
    setDone(true)
    push({
      type: 'success',
      title: 'Welcome aboard',
      message: 'Your workspace is ready.',
    })
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-foreground/10 bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Success
        </p>
        <h2 className="mt-2 text-2xl font-bold text-foreground">You are all set</h2>
        <p className="mt-2 text-sm text-muted">
          Your onboarding details were saved locally in this demo.
        </p>
        <div className="mt-6">
          <Button variant="primary" onClick={() => navigate('/')}>
            Go to dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col gap-3 laptop:flex-row laptop:items-center laptop:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted">
            {step === 1 ? 'Start' : step === 2 ? 'Personalization' : 'Review'}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-foreground laptop:text-3xl">
            {step === 1
              ? 'Tell us about yourself.'
              : step === 2
                ? 'Set your preferences'
                : 'Review your profile'}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {step === 1
              ? 'We need a few details to personalize your workspace.'
              : step === 2
                ? 'Tune notifications and interests.'
                : 'Confirm everything before you submit.'}
          </p>
        </div>
        <div className="w-full max-w-xs space-y-2">
          <StepDots step={step} />
          <p className="text-right text-xs font-semibold text-muted">
            Step {step} of 3
          </p>
        </div>
      </div>

      <form
        className="rounded-2xl border border-foreground/10 bg-card p-5 shadow-sm laptop:p-8"
        onSubmit={(e) => {
          e.preventDefault()
          if (step < 3) onNext()
        }}
        noValidate
      >
        {step === 1 ? (
          <div className="grid grid-cols-1 gap-5">
            <Input
              id="fullName"
              label="Full name"
              value={personal.fullName}
              onChange={(e) =>
                setPersonal((prev) => ({ ...prev, fullName: e.target.value }))
              }
              onBlur={() => blurPersonal('fullName')}
              error={touched.fullName ? personalErrors.fullName : ''}
              autoComplete="name"
            />
            <Input
              id="email"
              label="Email address"
              type="email"
              value={personal.email}
              onChange={(e) =>
                setPersonal((prev) => ({ ...prev, email: e.target.value }))
              }
              onBlur={() => blurPersonal('email')}
              error={touched.email ? personalErrors.email : ''}
              autoComplete="email"
            />
            <Input
              id="phone"
              label="Phone number"
              value={personal.phone}
              onChange={(e) =>
                setPersonal((prev) => ({ ...prev, phone: e.target.value }))
              }
              onBlur={() => blurPersonal('phone')}
              error={touched.phone ? personalErrors.phone : ''}
              autoComplete="tel"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid grid-cols-1 gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">
                Interests
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {interestPool.map((tag) => {
                  const on = preferences.interests.includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setTouchedPrefs(true)
                        setPreferences((prev) => ({
                          ...prev,
                          interests: on
                            ? prev.interests.filter((item) => item !== tag)
                            : [...prev.interests, tag],
                        }))
                      }}
                      className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                        on
                          ? 'border-primary bg-primary-light text-primary'
                          : 'border-foreground/15 bg-page text-foreground hover:border-primary/40'
                      }`}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
              {(step2Attempted || touchedPrefs) && preferencesErrors.interests ? (
                <p className="mt-2 text-sm text-danger-fg" role="alert">
                  {preferencesErrors.interests}
                </p>
              ) : null}
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">
                  Notification frequency
                </p>
                <span className="rounded-full bg-success-bg px-2 py-1 text-xs font-semibold text-success-fg">
                  {notifyLabels[preferences.notifyLevel]}
                </span>
              </div>
              <input
                className="mt-3 w-full cursor-pointer accent-primary"
                type="range"
                min={0}
                max={4}
                step={1}
                value={preferences.notifyLevel}
                onChange={(e) => {
                  setTouchedPrefs(true)
                  setPreferences((prev) => ({
                    ...prev,
                    notifyLevel: Number(e.target.value),
                  }))
                }}
              />
              <div className="mt-2 flex justify-between text-[11px] font-semibold uppercase tracking-wide text-muted">
                {notifyLabels.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl bg-foreground px-4 py-4 text-card laptop:px-6">
              <div>
                <p className="text-sm font-bold">Visual theme</p>
                <p className="text-xs text-card/80">Switch to dark interface</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.darkMode}
                onClick={() => {
                  setTouchedPrefs(true)
                  setPreferences((prev) => ({
                    ...prev,
                    darkMode: !prev.darkMode,
                  }))
                }}
                className={`relative h-8 w-14 rounded-full transition-colors ${
                  preferences.darkMode ? 'bg-primary' : 'bg-card/20'
                }`}
              >
                <span
                  className={`absolute top-1 size-6 rounded-full bg-card transition-transform ${
                    preferences.darkMode ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="grid grid-cols-1 gap-4 text-sm laptop:grid-cols-2">
            <div className="rounded-xl border border-foreground/10 bg-page p-4">
              <p className="text-xs font-bold uppercase text-muted">Identity</p>
              <p className="mt-2 font-semibold text-foreground">{personal.fullName}</p>
              <p className="text-muted">{personal.email}</p>
              <p className="mt-2 text-muted">{personal.phone}</p>
            </div>
            <div className="rounded-xl border border-foreground/10 bg-page p-4">
              <p className="text-xs font-bold uppercase text-muted">Preferences</p>
              <p className="mt-2 font-semibold text-foreground">
                {preferences.interests.join(', ')}
              </p>
              <p className="mt-2 text-muted">
                Notifications: {notifyLabels[preferences.notifyLevel]}
              </p>
              <p className="text-muted">Dark mode: {preferences.darkMode ? 'On' : 'Off'}</p>
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-foreground/10 pt-6 laptop:flex-row laptop:items-center laptop:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {step > 1 ? (
              <Button variant="ghost" onClick={onBack}>
                Back
              </Button>
            ) : (
              <Button variant="ghost" disabled>
                Back
              </Button>
            )}
            <Button variant="ghost" onClick={() => navigate('/')}>
              Skip for now
            </Button>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {step < 3 ? (
              <Button
                type="submit"
                variant="primary"
                disabled={step === 1 ? !personalStepOk : !preferencesStepOk}
              >
                {step === 1 ? 'Next step' : 'Continue to review'}
              </Button>
            ) : (
              <Button type="button" variant="primary" onClick={onSubmit}>
                Complete onboarding
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
