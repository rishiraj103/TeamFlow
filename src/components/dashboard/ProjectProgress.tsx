import { Link } from 'react-router-dom'
import type { Project } from '../../types'
import { formatProjectDate } from '../../utils/projectDate'
import { Badge } from '../common/Badge'
import { Card } from '../common/Card'
import { EmptyState } from '../common/EmptyState'

export interface ProjectProgressProps {
  projects: Project[]
}

export function ProjectProgress({ projects }: ProjectProgressProps) {
  return (
    <Card
      title="Project progress"
      subtitle="Delivery progress across the workspace."
      className="dashboard-widget h-100"
    >
      {projects.length > 0 ? (
        <ul className="project-progress list-unstyled mb-0">
          {projects.map((project) => (
            <li key={project.id} className="project-progress__item">
              <div className="project-progress__heading">
                <Link to={`/projects/${project.id}`} className="project-progress__name">
                  {project.name}
                </Link>
                <span className="project-progress__percentage">{project.progress}%</span>
              </div>
              <div
                className="progress project-progress__bar"
                role="progressbar"
                aria-label={`${project.name} progress: ${project.progress}%`}
                aria-valuenow={project.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="progress-bar" style={{ width: `${project.progress}%` }} />
              </div>
              <div className="project-progress__meta">
                <Badge variant={project.status} />
                <span>Due {formatProjectDate(project.dueDate)}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No projects yet."
          description="Project progress will appear here when your workspace has projects."
          className="dashboard-empty-state"
        />
      )}
    </Card>
  )
}
