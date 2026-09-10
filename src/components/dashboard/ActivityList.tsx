import type { Activity, User } from '../../types'
import { formatActivityTimestamp } from '../../utils/activityTime'
import { Card } from '../common/Card'
import { EmptyState } from '../common/EmptyState'

export interface ActivityListProps {
  activities: Activity[]
  users: User[]
  currentUser?: User | null
  limit?: number
}

function getActivityTimestamp(timestamp: string): number {
  const parsedTimestamp = new Date(timestamp).getTime()
  return Number.isNaN(parsedTimestamp) ? 0 : parsedTimestamp
}

export function ActivityList({ activities, users, currentUser, limit = 5 }: ActivityListProps) {
  const recentActivities = [...activities]
    .sort(
      (leftActivity, rightActivity) =>
        getActivityTimestamp(rightActivity.timestamp) -
        getActivityTimestamp(leftActivity.timestamp),
    )
    .slice(0, limit)

  return (
    <Card
      title="Recent activity"
      subtitle="The latest updates from your workspace."
      className="dashboard-widget h-100"
    >
      {recentActivities.length > 0 ? (
        <ol className="activity-list list-unstyled mb-0">
          {recentActivities.map((activity) => {
            const actor =
              users.find((user) => user.id === activity.userId) ??
              (currentUser?.id === activity.userId ? currentUser : undefined)

            return (
              <li key={activity.id} className="activity-list__item">
                {actor ? (
                  <img src={actor.avatar} alt={`${actor.name} avatar`} loading="lazy" />
                ) : (
                  <span className="activity-list__avatar-placeholder" aria-hidden="true">
                    ?
                  </span>
                )}
                <div className="activity-list__copy">
                  <p>
                    <strong>{actor?.name ?? 'Unknown user'}</strong> {activity.description}
                  </p>
                  <time dateTime={activity.timestamp}>
                    {formatActivityTimestamp(activity.timestamp)}
                  </time>
                </div>
              </li>
            )
          })}
        </ol>
      ) : (
        <EmptyState
          title="No activity yet."
          description="Workspace activity will appear here as projects and tasks change."
          className="dashboard-empty-state"
        />
      )}
    </Card>
  )
}
