import { Card } from '../common/Card'

export interface StatCardProps {
  label: string
  value: number
  description: string
}

export function StatCard({ label, value, description }: StatCardProps) {
  return (
    <Card title={label} subtitle={description} className="stat-card h-100">
      <strong className="stat-card__value">{value}</strong>
    </Card>
  )
}
