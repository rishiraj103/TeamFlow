import { Badge } from '../common/Badge'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { Link } from 'react-router-dom'
import type { Project } from '../../types'
import { formatProjectDate } from '../../utils/projectDate'

export interface ProjectCardProps {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <Card
      title={
        <Link to={`/projects/${project.id}`} className="project-card__title-link">
          {project.name}
        </Link>
      }
      subtitle={project.description}
      className="project-card tf-card--interactive h-100"
    >
      <div className="project-card__body">
        <div className="project-card__progress-summary d-flex align-items-center justify-content-between gap-3">
          <Badge variant={project.status} />
          <span className="project-card__progress-label">{project.progress}% complete</span>
        </div>

        <div className="project-card__progress mt-3">
          <div
            className="progress"
            role="progressbar"
            aria-label={`${project.name} progress: ${project.progress}%`}
            aria-valuenow={project.progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="progress-bar" style={{ width: `${project.progress}%` }} />
          </div>
        </div>

        <dl className="project-card__details row g-3 mt-1 mb-0">
          <div className="col-6">
            <dt>Due date</dt>
            <dd>{formatProjectDate(project.dueDate)}</dd>
          </div>
          <div className="col-6">
            <dt>Members</dt>
            <dd>{project.memberIds.length}</dd>
          </div>
        </dl>

        <div className="project-card__actions d-flex flex-wrap gap-2 mt-auto pt-4">
          <Button
            variant="ghost"
            className="btn-sm"
            aria-label={`Edit ${project.name}`}
            onClick={() => onEdit(project)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            className="btn-sm"
            aria-label={`Delete ${project.name}`}
            onClick={() => onDelete(project)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  )
}
