import { useMemo } from 'react'
import { AnalyticsCard } from '../components/analytics/AnalyticsCard'
import { MetricBar } from '../components/analytics/MetricBar'
import { ProgressMetric } from '../components/analytics/ProgressMetric'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { LoadingState } from '../components/common/LoadingState'
import { useProjects } from '../context/useProjects'
import { useTasks } from '../context/useTasks'
import { calculateAnalytics, formatAnalyticsPercentage } from '../utils/analytics'

export function Analytics() {
  const {
    projects,
    isLoading: projectsLoading,
    error: projectsError,
    retryPersistence: retryProjects,
  } = useProjects()
  const {
    tasks,
    isLoading: tasksLoading,
    error: tasksError,
    retryPersistence: retryTasks,
  } = useTasks()
  const analytics = useMemo(() => calculateAnalytics(projects, tasks), [projects, tasks])
  const isLoading = projectsLoading || tasksLoading
  const dataError = [projectsError, tasksError].find(
    (message): message is string => message !== null,
  )

  function retryAnalyticsPersistence() {
    retryProjects()
    retryTasks()
  }

  const highestTaskStatusCount = Math.max(
    ...analytics.tasksByStatus.map((metric) => metric.count),
    1,
  )
  const highestTaskPriorityCount = Math.max(
    ...analytics.tasksByPriority.map((metric) => metric.count),
    1,
  )
  const highestProjectStatusCount = Math.max(
    ...analytics.projectsByStatus.map((metric) => metric.count),
    1,
  )

  if (isLoading) {
    return <LoadingState label="Loading analytics..." />
  }

  return (
    <div className="analytics-page">
      <header className="analytics-page__header mb-4">
        <p className="section-kicker">Workspace insights</p>
        <h1 className="analytics-page__title">Analytics</h1>
        <p className="analytics-page__description">
          Understand task distribution, delivery progress, and completion across TeamFlow.
        </p>
      </header>

      {dataError ? (
        <ErrorState
          title="Analytics data needs attention"
          description={dataError}
          action={
            <Button variant="outline" onClick={retryAnalyticsPersistence}>
              Try saving again
            </Button>
          }
          className="mb-4"
        />
      ) : null}

      <section className="analytics-page__distribution-grid mb-4" aria-label="Workspace metrics">
        <AnalyticsCard title="Tasks by status" subtitle="Current task volume by workflow stage.">
          {analytics.totalTasks > 0 ? (
            <ul className="metric-bars list-unstyled mb-0">
              {analytics.tasksByStatus.map((metric) => (
                <MetricBar
                  key={metric.key}
                  label={metric.label}
                  count={metric.count}
                  maxCount={highestTaskStatusCount}
                  badgeVariant={metric.key as 'todo' | 'in-progress' | 'completed'}
                />
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No tasks yet."
              description="Create a task to see status distribution analytics."
              className="analytics-empty-state"
            />
          )}
        </AnalyticsCard>

        <AnalyticsCard title="Tasks by priority" subtitle="Workload grouped by priority level.">
          {analytics.totalTasks > 0 ? (
            <ul className="metric-bars list-unstyled mb-0">
              {analytics.tasksByPriority.map((metric) => (
                <MetricBar
                  key={metric.key}
                  label={metric.label}
                  count={metric.count}
                  maxCount={highestTaskPriorityCount}
                  badgeVariant={metric.key as 'low' | 'medium' | 'high'}
                />
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No priorities to show."
              description="Task priority analytics will appear once tasks exist."
              className="analytics-empty-state"
            />
          )}
        </AnalyticsCard>

        <AnalyticsCard
          title="Projects by status"
          subtitle="Project portfolio grouped by lifecycle."
        >
          {projects.length > 0 ? (
            <ul className="metric-bars list-unstyled mb-0">
              {analytics.projectsByStatus.map((metric) => (
                <MetricBar
                  key={metric.key}
                  label={metric.label}
                  count={metric.count}
                  maxCount={highestProjectStatusCount}
                  badgeVariant={metric.key as 'active' | 'completed' | 'archived'}
                />
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No projects yet."
              description="Create a project to see portfolio status analytics."
              className="analytics-empty-state"
            />
          )}
        </AnalyticsCard>
      </section>

      <section className="analytics-page__overview-grid mb-4" aria-label="Completion and progress">
        <AnalyticsCard
          title="Completion rate"
          subtitle="Completed tasks compared with total tasks."
        >
          <div className="completion-metric">
            <strong className="completion-metric__value">
              {formatAnalyticsPercentage(analytics.completionRate)}
            </strong>
            <span className="completion-metric__summary">
              {analytics.completedTasks} of {analytics.totalTasks} tasks completed
            </span>
            <div
              className="progress completion-metric__track"
              role="progressbar"
              aria-label={`Task completion rate: ${formatAnalyticsPercentage(analytics.completionRate)}`}
              aria-valuenow={analytics.completionRate}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="progress-bar completion-metric__fill"
                style={{ width: `${formatAnalyticsPercentage(analytics.completionRate)}` }}
              />
            </div>
            {analytics.totalTasks === 0 ? (
              <p className="completion-metric__empty mb-0">
                No tasks are available to calculate a completion rate.
              </p>
            ) : null}
          </div>
        </AnalyticsCard>

        <AnalyticsCard title="Project progress" subtitle="Progress reported by each project.">
          {projects.length > 0 ? (
            <ul className="progress-metrics list-unstyled mb-0">
              {projects.map((project) => (
                <ProgressMetric key={project.id} project={project} />
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No project progress yet."
              description="Create a project to track its delivery progress here."
              className="analytics-empty-state"
            />
          )}
        </AnalyticsCard>
      </section>
    </div>
  )
}
