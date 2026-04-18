export type DateRangeKey = '7' | '30' | '90'

export type TxStatus = 'active' | 'pending'

export type TransactionRow = {
  id: string
  name: string
  email: string
  status: TxStatus
  lastActive: string
  revenue: string
  avatarSrc?: string
}

export const weekdayLabels = [
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
  'SUN',
] as const

export const baseCurrent = [25, 40, 65, 45, 80, 50, 30]
export const basePrevious = [35, 50, 75, 55, 85, 60, 45]

export function scaleSeries(
  series: readonly number[],
  factor: number,
): number[] {
  return series.map((v) => Math.round(v * factor))
}

const avatar = (filename: string) => `/avatars/transactions/${filename}`

export const allTransactions: TransactionRow[] = [
  {
    id: '1',
    name: 'Alexandre Paiva',
    email: 'alex@design.co',
    status: 'active',
    lastActive: '2 mins ago',
    revenue: '$1,450.00',
    avatarSrc: avatar('alexandre-paiva.png'),
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    email: 'sarah@fintech.io',
    status: 'pending',
    lastActive: '4 hours ago',
    revenue: '$2,890.00',
    avatarSrc: avatar('sarah-jenkins.png'),
  },
  {
    id: '3',
    name: 'David Miller',
    email: 'd.miller@techhub.com',
    status: 'active',
    lastActive: '12 mins ago',
    revenue: '$840.50',
    avatarSrc: avatar('david-miller.png'),
  },
  {
    id: '4',
    name: 'Elena Rodriguez',
    email: 'elena.r@agency.com',
    status: 'pending',
    lastActive: '1 day ago',
    revenue: '$5,200.00',
    avatarSrc: avatar('elena-rodriguez.png'),
  },
]
