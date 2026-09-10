import { TASK_STATUSES } from '../../constants/data'
import type { Task } from '../../types'
import { taskStatusLabels } from '../../utils/taskLabels'
import { Badge } from '../common/Badge'
import { Card } from '../common/Card'
import { EmptyState } from '../common/EmptyState'

export interface TaskDistributionProps {
  tasks: Task[]
}

export function TaskDistribution({ tasks }: TaskDistributionProps) {
  const distribution = TASK_STATUSES.map((status) => ({
    status,
    count: tasks.filter((task) => task.status === status).length,
  }))
  const highestCount = Math.max(...distribution.map((item) => item.count), 1)

  return (
    <Card
      title="Task distribution"
      subtitle="Current task volume by status."
      className="dashboard-widget h-100"
    >
      {tasks.length > 0 ? (
        <ul className="task-distribution list-unstyled mb-0">
          {distribution.map(({ status, count }) => (
            <li key={status} className="task-distribution__item">
              <div className="task-distribution__heading">
                <Badge variant={status} />
                <strong>{count}</strong>
              </div>
              <div
                className="progress task-distribution__bar"
                role="progressbar"
                aria-label={`${taskStatusLabels[status]} task count: ${count}`}
                aria-valuenow={count}
                aria-valuemin={0}
                aria-valuemax={highestCount}
              >
                <div
                  className="progress-bar"
                  style={{ width: `${(count / highestCount) * 100}%` }}
                />
              </div>
              <span className="visually-hidden">
                {taskStatusLabels[status]}: {count} tasks
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No tasks yet."
          description="Task distribution will appear here when your workspace has tasks."
          className="dashboard-empty-state"
        />
      )}
    </Card>
  )
}
