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
        <div className="inline-flex size-10 items-center justify-center rounded-xl">
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

const TxAvatar = memo(function TxAvatar({
  name,
  avatarSrc,
}: {
  name: string
  avatarSrc?: string
}) {
  const [failed, setFailed] = useState(false)
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
  if (avatarSrc && !failed) {
    return (
      <img
        src={avatarSrc}
        alt=""
        className="size-9 shrink-0 rounded-full object-cover"
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    )
  }
  return (
    <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-light text-xs font-bold text-primary">
      {initials}
    </div>
  )
})

const TxRow = memo(function TxRow({ row }: { row: TransactionRow }) {
  const isActive = row.status === 'active'
  const badgeClass = isActive
    ? 'bg-success-bg text-success-fg'
    : 'bg-warning-bg text-warning-fg'
  const dotClass = isActive ? 'bg-success-fg' : 'bg-warning-fg'
  const statusLabel = isActive ? 'Active' : 'Pending'
  return (
    <tr className="border-t border-foreground/10">
      <td className="py-3 pr-3">
        <div className="flex items-center gap-3">
          <TxAvatar name={row.name} avatarSrc={row.avatarSrc} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{row.name}</p>
            <p className="truncate text-xs text-muted">{row.email}</p>
          </div>
        </div>
      </td>
      <td className="py-3 pr-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass}`}
        >
          <span
            className={`size-1.5 shrink-0 rounded-full ${dotClass}`}
            aria-hidden
          />
          {statusLabel}
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

  const weekBars = useMemo(
    () =>
      weekdayLabels.map((day, index) => ({
        day,
        currentPct: Math.round((current[index] / maxVal) * 100),
        previousPct: Math.round((previous[index] / maxVal) * 100),
        currentValue: current[index],
        previousValue: previous[index],
      })),
    [current, previous, maxVal],
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
          icon={<DashboardGlyph id="dollar" className="size-10" />}
        />
        <KpiCard
          title="Active Users"
          value="12,842"
          delta="+8.2%"
          positive
          icon={<DashboardGlyph id="usersMetric" className="size-10" />}
        />
        <KpiCard
          title="Conversion Rate"
          value="3.4%"
          delta="-1.4%"
          positive={false}
          icon={<DashboardGlyph id="percent" className="size-10" />}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 laptop:grid-cols-3 laptop:gap-5">
        <div className="rounded-3xl border border-foreground/10 bg-card p-5 shadow-sm laptop:col-span-2 laptop:p-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-foreground">Revenue Growth</h2>
            <div className="flex items-center gap-5 text-xs font-semibold text-muted">
              <span className="inline-flex items-center gap-2">
                <span
                  className="size-2 shrink-0 rounded-full bg-[#3F3D89]"
                  aria-hidden
                />
                Current
              </span>
              <span className="inline-flex items-center gap-2">
                <span
                  className="size-2 shrink-0 rounded-full border border-foreground/10 bg-[#F1F3F9]"
                  aria-hidden
                />
                Previous
              </span>
            </div>
          </div>
          <div className="mt-8 flex flex-col">
            <div className="flex h-44 gap-0 laptop:h-52">
              {weekBars.map(
                ({
                  day,
                  currentPct,
                  previousPct,
                  currentValue,
                  previousValue,
                }) => (
                  <div
                    key={day}
                    className="relative h-full min-w-0 flex-1"
                  >
                    <div
                      className="absolute inset-x-0 bottom-0 rounded-t-sm bg-[#F1F3F9]"
                      style={{ height: `${previousPct}%` }}
                      title={`Previous ${previousValue}`}
                    />
                    <div
                      className="absolute inset-x-0 bottom-0 z-1 rounded-t-sm bg-[#3F3D89]"
                      style={{ height: `${currentPct}%` }}
                      title={`Current ${currentValue}`}
                    />
                  </div>
                ),
              )}
            </div>
            <div className="mt-0 border-t border-foreground/10 pt-2">
              <div className="flex gap-0">
                {weekBars.map(({ day }) => (
                  <div
                    key={`${day}-label`}
                    className="min-w-0 flex-1 text-center text-[11px] font-semibold uppercase tracking-wide text-muted"
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-stretch rounded-[32px] bg-[#3F41A4] p-8 shadow-sm">
          <span className="w-fit rounded-md bg-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            New insights
          </span>
          <h3 className="mt-4 text-2xl font-bold leading-tight text-white laptop:text-3xl">
            Machine learning detected a 14% anomaly in User Retention.
          </h3>
          <p className="mt-4 text-base leading-relaxed text-white/90">
            Most active users are coming from Central Europe. Would you like to
            optimize servers for that region?
          </p>
          <button
            type="button"
            onClick={() => setInsightOpen(true)}
            className="mt-8 w-full cursor-pointer rounded-2xl bg-white py-4 text-center text-base font-bold text-[#3F41A4] transition-colors hover:bg-white/90"
          >
            Investigate Now
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-foreground/10 bg-card p-4 shadow-sm laptop:p-6">
        <div className="flex flex-col gap-3 laptop:flex-row laptop:items-center laptop:justify-between">
          <h2 className="text-lg font-bold text-foreground">Recent Transactions</h2>
          <div className="flex flex-wrap gap-2">
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
                className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold transition-colors laptop:text-sm ${
                  txFilter === key
                    ? 'bg-[#F1F5F9] text-foreground'
                    : 'border border-foreground/10 bg-card text-muted hover:text-foreground'
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
                <th className="pb-2 pr-3">Last active</th>
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
