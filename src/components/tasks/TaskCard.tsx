import { TASK_STATUSES } from '../../constants/data'
import type { Project, Task, TaskStatus, User } from '../../types'
import { formatProjectDate } from '../../utils/projectDate'
import { taskStatusLabels } from '../../utils/taskLabels'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'
import { Card } from '../common/Card'

export interface TaskCardProps {
  task: Task
  project?: Project
  assignee?: User
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onStatusChange: (taskId: string, status: TaskStatus) => void
}

export function TaskCard({
  task,
  project,
  assignee,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  return (
    <Card
      title={task.title}
      subtitle={task.description}
      className="task-card tf-card--interactive h-100"
    >
      <div className="task-card__body">
        <div className="task-card__badges">
          <Badge variant={task.status} />
          <Badge variant={task.priority} />
        </div>

        <dl className="task-card__details">
          <div>
            <dt>Project</dt>
            <dd>{project?.name ?? 'Unknown project'}</dd>
          </div>
          <div>
            <dt>Due date</dt>
            <dd>{formatProjectDate(task.dueDate)}</dd>
          </div>
        </dl>

        <div className="task-card__assignee">
          {assignee ? (
            <img src={assignee.avatar} alt={`${assignee.name} avatar`} loading="lazy" />
          ) : (
            <span className="task-card__assignee-placeholder" aria-hidden="true">
              ?
            </span>
          )}
          <div>
            <span className="task-card__assignee-label">Assignee</span>
            <strong>{assignee?.name ?? 'Unknown user'}</strong>
          </div>
        </div>

        <div className="task-card__controls">
          <div className="task-card__status-control field-group">
            <label htmlFor={`task-status-${task.id}`} className="form-label">
              Status
            </label>
            <select
              id={`task-status-${task.id}`}
              className="form-select form-select-sm"
              value={task.status}
              onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)}
            >
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {taskStatusLabels[status]}
                </option>
              ))}
            </select>
          </div>

          <div className="task-card__actions d-flex flex-wrap gap-2">
            <Button
              variant="ghost"
              className="btn-sm"
              aria-label={`Edit ${task.title}`}
              onClick={() => onEdit(task)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              className="btn-sm"
              aria-label={`Delete ${task.title}`}
              onClick={() => onDelete(task)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
