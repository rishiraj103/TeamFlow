import type { Project, Task, User } from '../../types'
import { formatProjectDate, getProjectDateTimestamp } from '../../utils/projectDate'
import { Badge } from '../common/Badge'
import { Card } from '../common/Card'
import { EmptyState } from '../common/EmptyState'

export interface UpcomingDeadlinesProps {
  tasks: Task[]
  projects: Project[]
  users: User[]
  limit?: number
}

export function UpcomingDeadlines({ tasks, projects, users, limit = 5 }: UpcomingDeadlinesProps) {
  const upcomingTasks = [...tasks]
    .filter((task) => task.status !== 'completed')
    .sort(
      (leftTask, rightTask) =>
        getProjectDateTimestamp(leftTask.dueDate) - getProjectDateTimestamp(rightTask.dueDate),
    )
    .slice(0, limit)

  return (
    <Card
      title="Upcoming deadlines"
      subtitle="Incomplete work ordered by due date."
      className="dashboard-widget h-100"
    >
      {upcomingTasks.length > 0 ? (
        <ol className="deadline-list list-unstyled mb-0">
          {upcomingTasks.map((task) => {
            const project = projects.find((candidate) => candidate.id === task.projectId)
            const assignee = users.find((user) => user.id === task.assigneeId)

            return (
              <li key={task.id} className="deadline-list__item">
                <div className="deadline-list__copy">
                  <h3>{task.title}</h3>
                  <p>{project?.name ?? 'Unknown project'}</p>
                </div>
                <div className="deadline-list__meta">
                  <span>
                    <strong>Assignee:</strong> {assignee?.name ?? 'Unknown user'}
                  </span>
                  <time dateTime={task.dueDate}>Due {formatProjectDate(task.dueDate)}</time>
                  <Badge variant={task.priority} />
                </div>
              </li>
            )
          })}
        </ol>
      ) : (
        <EmptyState
          title="No upcoming deadlines."
          description="Incomplete tasks with due dates will appear here when they are available."
          className="dashboard-empty-state"
        />
      )}
    </Card>
  )
}
