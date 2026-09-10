import { useMemo, useState } from 'react'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { Input } from '../components/common/Input'
import { LoadingState } from '../components/common/LoadingState'
import { TeamMemberCard } from '../components/team/TeamMemberCard'
import { useProjects } from '../context/useProjects'
import { useTasks } from '../context/useTasks'
import { users } from '../data/users'

export function Team() {
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
  const [search, setSearch] = useState('')
  const isLoading = projectsLoading || tasksLoading
  const dataError = [projectsError, tasksError].find(
    (message): message is string => message !== null,
  )

  const visibleMembers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return users
      .map((user) => ({
        user,
        assignedTaskCount: tasks.filter((task) => task.assigneeId === user.id).length,
        projectsInvolvedCount: projects.filter((project) => project.memberIds.includes(user.id))
          .length,
      }))
      .filter(({ user }) => {
        if (!normalizedSearch) {
          return true
        }

        return [user.name, user.email, user.role].some((field) =>
          field.toLowerCase().includes(normalizedSearch),
        )
      })
  }, [projects, search, tasks])

  function retryTeamPersistence() {
    retryProjects()
    retryTasks()
  }

  if (isLoading) {
    return <LoadingState label="Loading team members..." />
  }

  return (
    <div className="team-page">
      <header className="team-page__header mb-4">
        <p className="section-kicker">Workspace</p>
        <h2 className="team-page__title">Team</h2>
        <p className="team-page__description">
          See who is working across TeamFlow and how responsibilities are distributed.
        </p>
      </header>

      {dataError ? (
        <ErrorState
          title="Team data needs attention"
          description={dataError}
          action={
            <Button variant="outline" onClick={retryTeamPersistence}>
              Try saving again
            </Button>
          }
          className="mb-4"
        />
      ) : null}

      <section className="team-page__filters mb-4" aria-label="Team member search">
        <Input
          label="Search team members"
          name="team-member-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, email, or role"
        />
      </section>

      <div className="team-page__result-summary mb-3" aria-live="polite">
        Showing {visibleMembers.length} of {users.length} team members
      </div>

      {visibleMembers.length === 0 ? (
        <EmptyState
          title="No team members found."
          description="Try a different name, email address, or role."
        />
      ) : (
        <section className="team-page__grid" aria-label="Team member list">
          {visibleMembers.map(({ user, assignedTaskCount, projectsInvolvedCount }) => (
            <TeamMemberCard
              key={user.id}
              user={user}
              assignedTaskCount={assignedTaskCount}
              projectsInvolvedCount={projectsInvolvedCount}
            />
          ))}
        </section>
      )}
    </div>
  )
}
