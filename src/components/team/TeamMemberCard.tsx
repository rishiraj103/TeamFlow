import type { User } from '../../types'
import { Card } from '../common/Card'

export interface TeamMemberCardProps {
  user: User
  assignedTaskCount: number
  projectsInvolvedCount: number
}

export function TeamMemberCard({
  user,
  assignedTaskCount,
  projectsInvolvedCount,
}: TeamMemberCardProps) {
  return (
    <Card
      title={user.name}
      subtitle={user.role}
      className="team-member-card h-100"
      headerAction={
        <img
          className="team-member-card__avatar"
          src={user.avatar}
          alt={`${user.name} avatar`}
          loading="lazy"
        />
      }
    >
      <div className="team-member-card__body">
        <a className="team-member-card__email" href={`mailto:${user.email}`}>
          {user.email}
        </a>

        <dl className="team-member-card__stats" aria-label={`${user.name}'s work summary`}>
          <div>
            <dt>Assigned tasks</dt>
            <dd>{assignedTaskCount}</dd>
          </div>
          <div>
            <dt>Projects involved</dt>
            <dd>{projectsInvolvedCount}</dd>
          </div>
        </dl>
      </div>
    </Card>
  )
}
