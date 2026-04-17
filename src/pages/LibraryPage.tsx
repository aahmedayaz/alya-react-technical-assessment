import { useState } from 'react'
import { Button, DsModal, Input, Tooltip } from '../components/library'
import { useToast } from '../hooks'

export function LibraryPage() {
  const { push } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Component library</h1>
        <p className="mt-2 text-sm text-muted">
          Task 4 primitives use CSS Modules (not Tailwind) under{' '}
          <code className="rounded bg-page px-1 py-0.5 text-xs">src/components/library</code>.
        </p>
      </header>

      <section className="space-y-3 rounded-2xl border border-foreground/10 bg-card p-5">
        <h2 className="text-lg font-bold text-foreground">Buttons</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" size="sm">
            Primary sm
          </Button>
          <Button variant="secondary" size="md">
            Secondary md
          </Button>
          <Button variant="ghost" size="md">
            Ghost
          </Button>
          <Button variant="danger" size="md">
            Danger
          </Button>
          <Button
            variant="primary"
            size="lg"
            loading={loading}
            onClick={() => {
              setLoading(true)
              window.setTimeout(() => setLoading(false), 900)
            }}
          >
            Loading demo
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-foreground/10 bg-card p-5">
        <h2 className="text-lg font-bold text-foreground">Input</h2>
        <Input
          id="demo-field"
          label="Demo field"
          placeholder="Type something"
          helperText="Helper copy goes here."
        />
        <Input
          id="demo-error"
          label="Error field"
          defaultValue="invalid"
          error="This value is not allowed in the demo."
        />
      </section>

      <section className="space-y-3 rounded-2xl border border-foreground/10 bg-card p-5">
        <h2 className="text-lg font-bold text-foreground">Modal + tooltip + toast</h2>
        <div className="flex flex-wrap gap-2">
          <Tooltip label="Opens a focus-trapped modal dialog.">
            <span>
              <Button variant="primary" onClick={() => setOpen(true)}>
                Open modal
              </Button>
            </span>
          </Tooltip>
          <Button
            variant="secondary"
            onClick={() =>
              push({
                type: 'success',
                title: 'Saved',
                message: 'This uses the global toast stack.',
              })
            }
          >
            Push toast
          </Button>
        </div>
      </section>

      <DsModal
        open={open}
        onClose={() => setOpen(false)}
        title="Modal preview"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Confirm
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          Overlay click and Escape close this modal. Focus is trapped while open.
        </p>
      </DsModal>
    </div>
  )
}
