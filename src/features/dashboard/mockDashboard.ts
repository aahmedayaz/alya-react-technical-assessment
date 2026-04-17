export type DateRangeKey = '7' | '30' | '90'

export type TxStatus = 'active' | 'inactive' | 'suspended' | 'pending'

export type TransactionRow = {
  id: string
  name: string
  email: string
  status: TxStatus
  lastActive: string
  revenue: string
}

export const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export const baseCurrent = [42, 55, 48, 62, 58, 70, 66]
export const basePrevious = [36, 44, 40, 50, 48, 58, 54]

export function scaleSeries(
  series: readonly number[],
  factor: number,
): number[] {
  return series.map((v) => Math.round(v * factor))
}

export const allTransactions: TransactionRow[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    status: 'active',
    lastActive: '2 mins ago',
    revenue: '$1,240.00',
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'marcus.j@example.com',
    status: 'inactive',
    lastActive: '1 hour ago',
    revenue: '$890.50',
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    email: 'elena.r@example.com',
    status: 'suspended',
    lastActive: 'Yesterday',
    revenue: '$2,450.00',
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@example.com',
    status: 'pending',
    lastActive: '3 days ago',
    revenue: '$560.00',
  },
  {
    id: '5',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    status: 'active',
    lastActive: '5 mins ago',
    revenue: '$3,120.75',
  },
]
