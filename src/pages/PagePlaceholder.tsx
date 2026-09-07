import type { ReactNode } from 'react'
import { Card } from '../components/common/Card'

export interface PagePlaceholderProps {
  title: string
  description: string
  children?: ReactNode
}

export function PagePlaceholder({ title, description, children }: PagePlaceholderProps) {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-xxl-9">
        <Card title={title} subtitle="Route placeholder">
          <p className="text-muted-strong mb-0">{description}</p>
          {children}
        </Card>
      </div>
    </div>
  )
}
