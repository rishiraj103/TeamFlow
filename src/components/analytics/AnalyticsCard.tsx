import type { ReactNode } from 'react'
import { Card } from '../common/Card'

export interface AnalyticsCardProps {
  title: string
  subtitle: string
  children: ReactNode
  className?: string
}

export function AnalyticsCard({ title, subtitle, children, className }: AnalyticsCardProps) {
  const classNames = ['analytics-card', 'h-100', className].filter(Boolean).join(' ')

  return (
    <Card title={title} subtitle={subtitle} className={classNames}>
      {children}
    </Card>
  )
}
