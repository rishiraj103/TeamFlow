import type { BadgeVariant } from '../common/Badge'
import { Badge } from '../common/Badge'

export interface MetricBarProps {
  label: string
  count: number
  maxCount: number
  badgeVariant?: BadgeVariant
}

export function MetricBar({ label, count, maxCount, badgeVariant }: MetricBarProps) {
  const safeCount = Number.isFinite(count) ? Math.max(0, count) : 0
  const safeMaxCount = Number.isFinite(maxCount) ? Math.max(1, maxCount) : 1
  const percentage = Math.min((safeCount / safeMaxCount) * 100, 100)

  return (
    <li className="metric-bar">
      <div className="metric-bar__heading">
        {badgeVariant ? <Badge variant={badgeVariant}>{label}</Badge> : <span>{label}</span>}
        <strong>{safeCount}</strong>
      </div>
      <div
        className="progress metric-bar__track"
        role="progressbar"
        aria-label={`${label} count`}
        aria-valuenow={safeCount}
        aria-valuemin={0}
        aria-valuemax={safeMaxCount}
      >
        <div className="progress-bar metric-bar__fill" style={{ width: `${percentage}%` }} />
      </div>
      <span className="visually-hidden">
        {label}: {safeCount} {safeCount === 1 ? 'item' : 'items'}
      </span>
    </li>
  )
}
