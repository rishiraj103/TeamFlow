import type { Activity, User } from '../../types'
import { formatProjectDateTime } from '../../utils/projectDate'
import { Card } from '../common/Card'

export interface ActivityListProps {
  activities: Activity[]
  users: User[]
  limit?: number
}

function getActivityTimestamp(timestamp: string): number {
  const parsedTimestamp = new Date(timestamp).getTime()
  return Number.isNaN(parsedTimestamp) ? 0 : parsedTimestamp
}

export function ActivityList({ activities, users, limit = 5 }: ActivityListProps) {
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
            const actor = users.find((user) => user.id === activity.userId)

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
                    {formatProjectDateTime(activity.timestamp)}
                  </time>
                </div>
              </li>
            )
          })}
        </ol>
      ) : (
        <p className="text-muted-strong mb-0">No activity has been recorded yet.</p>
      )}
    </Card>
  )
}
