import {
  memo,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { Button, DsModal, Tooltip } from '../components/library'
import { DashboardGlyph } from '../features/dashboard/DashboardGlyph'
import {
  allTransactions,
  baseCurrent,
  basePrevious,
  scaleSeries,
  weekdayLabels,
  type DateRangeKey,
  type TransactionRow,
} from '../features/dashboard/mockDashboard'
import { useToast } from '../hooks'

const rangeFactor: Record<DateRangeKey, number> = {
  '7': 0.86,
  '30': 1,
  '90': 1.12,
}

const KpiCard = memo(function KpiCard({
  title,
  value,
  delta,
  positive,
  icon,
}: {
  title: string
  value: string
  delta: string
  positive: boolean
  icon: ReactNode
}) {
  return (
    <article className="rounded-2xl border border-foreground/10 bg-card p-4 shadow-sm laptop:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-foreground laptop:text-3xl">
            {value}
          </p>
        </div>
        <div className="inline-flex size-10 items-center justify-center rounded-xl bg-primary-light text-primary">
          {icon}
        </div>
      </div>
      <div className="mt-3 inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-semibold">
        <span
          className={
            positive
              ? 'rounded-full bg-success-bg px-2 py-0.5 text-success-fg'
              : 'rounded-full bg-danger-bg px-2 py-0.5 text-danger-fg'
          }
        >
          {delta}
        </span>
        <span className="text-muted">vs last period</span>
      </div>
    </article>
  )
})

const TxRow = memo(function TxRow({ row }: { row: TransactionRow }) {
  const badge =
    row.status === 'active'
      ? 'bg-success-bg text-success-fg'
      : row.status === 'inactive'
        ? 'bg-warning-bg text-warning-fg'
        : row.status === 'suspended'
          ? 'bg-danger-bg text-danger-fg'
          : 'bg-primary-light text-primary'
  return (
    <tr className="border-t border-foreground/10">
      <td className="py-3 pr-3">
        <div className="flex items-center gap-3">
          <div className="size-9 overflow-hidden rounded-lg bg-primary-light text-xs font-bold text-primary">
            <div className="flex h-full w-full items-center justify-center">
              {row.name
                .split(' ')
                .map((p) => p[0])
                .slice(0, 2)
                .join('')}
            </div>
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{row.name}</p>
            <p className="truncate text-xs text-muted">{row.email}</p>
          </div>
        </div>
      </td>
      <td className="py-3 pr-3">
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badge}`}>
          {row.status[0].toUpperCase() + row.status.slice(1)}
        </span>
      </td>
      <td className="py-3 pr-3 text-sm text-muted">{row.lastActive}</td>
      <td className="py-3 text-right text-sm font-semibold text-foreground">
        {row.revenue}
      </td>
    </tr>
  )
})

export function DashboardPage() {
  const { push } = useToast()
  const [range, setRange] = useState<DateRangeKey>('30')
  const [txFilter, setTxFilter] = useState<'all' | 'active' | 'pending'>('all')
  const [insightOpen, setInsightOpen] = useState(false)

  const factor = rangeFactor[range]
  const current = useMemo(() => scaleSeries(baseCurrent, factor), [factor])
  const previous = useMemo(() => scaleSeries(basePrevious, factor), [factor])
  const maxVal = useMemo(
    () => Math.max(...current, ...previous, 1),
    [current, previous],
  )

  const rows = useMemo(() => {
    if (txFilter === 'all') return allTransactions
    return allTransactions.filter((r) => r.status === txFilter)
  }, [txFilter])

  const onExport = useCallback(() => {
    push({
      type: 'success',
      title: 'Export started',
      message: 'Your export will download shortly.',
    })
  }, [push])

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 laptop:space-y-8">
      <header className="flex flex-col gap-4 laptop:flex-row laptop:items-end laptop:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground laptop:text-3xl">
            Executive Summary
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted laptop:text-base">
            High-level performance across revenue, engagement, and conversion.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 laptop:gap-3">
          <label className="sr-only" htmlFor="range">
            Date range
          </label>
          <div className="inline-flex items-center gap-2 rounded-lg border border-foreground/10 bg-card px-2 py-1.5 text-sm text-foreground shadow-sm">
            <span className="pl-1 text-muted">
              <DashboardGlyph id="calendar" className="size-5" />
            </span>
            <select
              id="range"
              value={range}
              onChange={(e) => setRange(e.target.value as DateRangeKey)}
              className="cursor-pointer bg-transparent pr-2 text-sm font-semibold outline-none"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <Tooltip label="Exports a CSV snapshot for the selected range.">
            <span>
              <Button
                variant="primary"
                size="md"
                className="inline-flex"
                onClick={onExport}
              >
                <span className="inline-flex items-center gap-2 text-white">
                  <DashboardGlyph id="download" className="size-4 text-white" />
                  Export
                </span>
              </Button>
            </span>
          </Tooltip>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 tablet:grid-cols-2 laptop:grid-cols-3 laptop:gap-5">
        <KpiCard
          title="Total Revenue"
          value="$45,231.00"
          delta="+12.5%"
          positive
          icon={<DashboardGlyph id="dollar" className="size-5" />}
        />
        <KpiCard
          title="Active Users"
          value="12,842"
          delta="+8.2%"
          positive
          icon={<DashboardGlyph id="usersMetric" className="size-5" />}
        />
        <KpiCard
          title="Conversion Rate"
          value="3.4%"
          delta="-1.4%"
          positive={false}
          icon={<DashboardGlyph id="percent" className="size-5" />}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 laptop:grid-cols-3 laptop:gap-5">
        <div className="rounded-2xl border border-foreground/10 bg-card p-4 shadow-sm laptop:col-span-2 laptop:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-foreground">Revenue Growth</h2>
            <div className="flex items-center gap-4 text-xs font-semibold text-muted">
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" /> Current
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-full bg-chart-previous" /> Previous
              </span>
            </div>
          </div>
          <div className="mt-6 flex h-56 items-end justify-between gap-2 laptop:h-64 laptop:gap-3">
            {weekdayLabels.map((d, i) => {
              const cH = Math.round((current[i] / maxVal) * 100)
              const pH = Math.round((previous[i] / maxVal) * 100)
              return (
                <div key={d} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <div className="flex h-44 w-full max-w-[48px] items-end justify-center gap-1 laptop:h-52 laptop:max-w-[56px]">
                    <div
                      className="w-[42%] rounded-md bg-chart-previous"
                      style={{ height: `${pH}%` }}
                      title={`Previous ${previous[i]}`}
                    />
                    <div
                      className="w-[42%] rounded-md bg-chart-current"
                      style={{ height: `${cH}%` }}
                      title={`Current ${current[i]}`}
                    />
                  </div>
                  <span className="text-xs font-semibold text-muted">{d}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-insight p-5 text-card shadow-sm laptop:p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-card/80">
            New Insights
          </p>
          <h3 className="mt-2 text-xl font-bold leading-snug laptop:text-2xl">
            Anomaly detected in checkout conversion
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-card/90">
            Machine learning models identified a sharp drop correlated with mobile Safari users.
          </p>
          <div className="mt-5">
            <Button
              variant="secondary"
              size="md"
              className="!bg-card !text-primary"
              onClick={() => setInsightOpen(true)}
            >
              Investigate Now
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-foreground/10 bg-card p-4 shadow-sm laptop:p-6">
        <div className="flex flex-col gap-3 laptop:flex-row laptop:items-center laptop:justify-between">
          <h2 className="text-lg font-bold text-foreground">Recent Transactions</h2>
          <div className="inline-flex rounded-full border border-foreground/10 bg-page p-1">
            {(
              [
                ['all', 'All'],
                ['active', 'Active'],
                ['pending', 'Pending'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTxFilter(key)}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition-colors laptop:text-sm ${
                  txFilter === key
                    ? 'bg-primary text-card'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wide text-muted">
                <th className="pb-2 pr-3">User</th>
                <th className="pb-2 pr-3">Status</th>
                <th className="pb-2 pr-3">Last Active</th>
                <th className="pb-2 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <TxRow key={r.id} row={r} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <DsModal
        open={insightOpen}
        onClose={() => setInsightOpen(false)}
        title="Investigate insight"
        footer={
          <Button variant="ghost" onClick={() => setInsightOpen(false)}>
            Close
          </Button>
        }
      >
        <p className="text-sm text-muted">
          This is a preview action. Hook your analytics pipeline here to open a drill-down view.
        </p>
      </DsModal>
    </div>
  )
}
