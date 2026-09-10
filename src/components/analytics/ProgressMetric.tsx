import { Link } from 'react-router-dom'
import type { Project } from '../../types'
import { formatProjectDate } from '../../utils/projectDate'
import { Badge } from '../common/Badge'

export interface ProgressMetricProps {
  project: Project
}

export function ProgressMetric({ project }: ProgressMetricProps) {
  const progress = Number.isFinite(project.progress)
    ? Math.min(Math.max(project.progress, 0), 100)
    : 0

  return (
    <li className="progress-metric">
      <div className="progress-metric__heading">
        <Link to={`/projects/${project.id}`} className="progress-metric__name">
          {project.name}
        </Link>
        <strong>{progress}%</strong>
      </div>
      <div
        className="progress progress-metric__track"
        role="progressbar"
        aria-label={`${project.name} progress: ${progress}%`}
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="progress-bar progress-metric__fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-metric__meta">
        <Badge variant={project.status} />
        <span>Due {formatProjectDate(project.dueDate)}</span>
      </div>
    </li>
  )
}
