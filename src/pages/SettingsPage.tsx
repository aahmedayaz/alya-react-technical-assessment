import { useState } from 'react'
import { Button } from '../components/library'
import { useToast } from '../hooks'

export function SettingsPage() {
  const { push } = useToast()
  const [digest, setDigest] = useState(true)

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-2 text-sm text-muted">
          Lightweight demo controls for notifications.
        </p>
      </header>
      <div className="rounded-2xl border border-foreground/10 bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-foreground">Weekly digest</p>
            <p className="text-sm text-muted">Email summary every Monday.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={digest}
            onClick={() => setDigest((v) => !v)}
            className={`relative h-8 w-14 rounded-full transition-colors ${
              digest ? 'bg-primary' : 'bg-foreground/15'
            }`}
          >
            <span
              className={`absolute top-1 size-6 rounded-full bg-card transition-transform ${
                digest ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <div className="mt-6">
          <Button
            variant="primary"
            onClick={() =>
              push({
                type: 'success',
                title: 'Saved',
                message: 'Your preferences were updated.',
              })
            }
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  )
}
