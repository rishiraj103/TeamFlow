import { ActivityList } from '../components/dashboard/ActivityList'
import { ProjectProgress } from '../components/dashboard/ProjectProgress'
import { StatCard } from '../components/dashboard/StatCard'
import { TaskDistribution } from '../components/dashboard/TaskDistribution'
import { UpcomingDeadlines } from '../components/dashboard/UpcomingDeadlines'
import { useProjects } from '../context/useProjects'
import { useTasks } from '../context/useTasks'
import { activities } from '../data/activities'
import { users } from '../data/users'

export function Dashboard() {
  const { projects } = useProjects()
  const { tasks } = useTasks()

  const activeProjects = projects.filter((project) => project.status === 'active').length
  const completedTasks = tasks.filter((task) => task.status === 'completed').length

  return (
    <div className="dashboard-page">
      <header className="dashboard-page__header mb-4">
        <p className="section-kicker">Workspace overview</p>
        <h2 className="dashboard-page__title">Dashboard</h2>
        <p className="dashboard-page__description">
          A live view of projects, tasks, and the latest activity across TeamFlow.
        </p>
      </header>

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
          <ActivityList activities={activities} users={users} />
        </div>
        <div className="col-12 col-xl-5">
          <UpcomingDeadlines tasks={tasks} projects={projects} users={users} />
        </div>
      </section>
    </div>
  )
}
