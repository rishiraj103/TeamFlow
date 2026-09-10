import { ActivityList } from '../components/dashboard/ActivityList'
import { ProjectProgress } from '../components/dashboard/ProjectProgress'
import { StatCard } from '../components/dashboard/StatCard'
import { TaskDistribution } from '../components/dashboard/TaskDistribution'
import { UpcomingDeadlines } from '../components/dashboard/UpcomingDeadlines'
import { Button } from '../components/common/Button'
import { ErrorState } from '../components/common/ErrorState'
import { LoadingState } from '../components/common/LoadingState'
import { useProjects } from '../context/useProjects'
import { useTasks } from '../context/useTasks'
import { useActivities } from '../context/useActivities'
import { useAuth } from '../context/useAuth'
import { users } from '../data/users'

export function Dashboard() {
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
  const {
    activities,
    isLoading: activitiesLoading,
    error: activitiesError,
    retryPersistence: retryActivities,
  } = useActivities()
  const { currentUser } = useAuth()

  const activeProjects = projects.filter((project) => project.status === 'active').length
  const completedTasks = tasks.filter((task) => task.status === 'completed').length
  const isLoading = projectsLoading || tasksLoading || activitiesLoading
  const persistenceErrors = [projectsError, tasksError, activitiesError].filter(
    (message): message is string => message !== null,
  )

  function retryAllPersistence() {
    retryProjects()
    retryTasks()
    retryActivities()
  }

  if (isLoading) {
    return <LoadingState label="Loading workspace overview..." />
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-page__header mb-4">
        <p className="section-kicker">Workspace overview</p>
        <h1 className="dashboard-page__title">Dashboard</h1>
        <p className="dashboard-page__description">
          A live view of projects, tasks, and the latest activity across TeamFlow.
        </p>
      </header>

      {persistenceErrors.length > 0 ? (
        <ErrorState
          title="Some workspace data needs attention"
          description={persistenceErrors.join(' ')}
          action={
            <Button variant="outline" onClick={retryAllPersistence}>
              Try saving again
            </Button>
          }
          className="mb-4"
        />
      ) : null}

      <section className="dashboard-page__stats" aria-label="Workspace statistics">
        <StatCard
          label="Total Projects"
          value={projects.length}
          description="Across the workspace"
        />
        <StatCard label="Active Projects" value={activeProjects} description="Currently active" />
        <StatCard label="Total Tasks" value={tasks.length} description="Across all projects" />
        <StatCard label="Completed Tasks" value={completedTasks} description="Marked complete" />
        <StatCard label="Team Members" value={users.length} description="Available in the team" />
      </section>

      <section className="row g-4 mb-4" aria-label="Progress and task distribution">
        <div className="col-12 col-xl-7">
          <ProjectProgress projects={projects} />
        </div>
        <div className="col-12 col-xl-5">
          <TaskDistribution tasks={tasks} />
        </div>
      </section>

      <section className="row g-4" aria-label="Activity and deadlines">
        <div className="col-12 col-xl-7">
          <ActivityList activities={activities} users={users} currentUser={currentUser} />
        </div>
        <div className="col-12 col-xl-5">
          <UpcomingDeadlines tasks={tasks} projects={projects} users={users} />
        </div>
      </section>
    </div>
  )
}
