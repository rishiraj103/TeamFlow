import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useActivities } from '../../context/useActivities'
import { useNotificationPreferences } from '../../context/useNotificationPreferences'
import { users } from '../../data/users'
import { sortActivitiesByNewest } from '../../services/activity'
import { formatActivityTimestamp } from '../../utils/activityTime'
import type { Activity } from '../../types'

const visibleActivityLimit = 5

export function NotificationCenter() {
  const { activities } = useActivities()
  const { notificationPreferences } = useNotificationPreferences()
  const [open, setOpen] = useState(false)
  const [readActivityIds, setReadActivityIds] = useState<Set<string>>(() => new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  const activityNotificationsEnabled = notificationPreferences.activityUpdates
  const visibleActivities = activityNotificationsEnabled
    ? sortActivitiesByNewest(activities).slice(0, visibleActivityLimit)
    : []
  const unreadCount = visibleActivities.filter(
    (activity) => !readActivityIds.has(activity.id),
  ).length
  const notificationLabel = unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'

  useEffect(() => {
    if (!open) {
      return undefined
    }

    function handleDocumentClick(event: MouseEvent) {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleDocumentClick)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  function markActivityAsRead(activityId: string) {
    setReadActivityIds((currentIds) => {
      const nextIds = new Set(currentIds)
      nextIds.add(activityId)
      return nextIds
    })
  }

  function markAllAsRead() {
    setReadActivityIds((currentIds) => {
      const nextIds = new Set(currentIds)
      visibleActivities.forEach((activity) => nextIds.add(activity.id))
      return nextIds
    })
  }

  return (
    <div ref={containerRef} className="notification-center">
      <button
        type="button"
        className="btn btn-icon topbar__notification notification-center__trigger"
        aria-label={notificationLabel}
        aria-controls={panelId}
        aria-expanded={open}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
        {unreadCount > 0 ? (
          <span className="topbar__notification-count" aria-hidden="true">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <section
          id={panelId}
          className="notification-center__panel"
          role="dialog"
          aria-label="Notifications"
        >
          <header className="notification-center__header">
            <div>
              <h2>Notifications</h2>
              <p>Recent activity from your workspace.</p>
            </div>
            <button
              type="button"
              className="btn btn-link notification-center__mark-all"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </button>
          </header>

          {!activityNotificationsEnabled ? (
            <div className="notification-center__empty">
              <p>Activity notifications are turned off.</p>
              <Link to="/settings" onClick={() => setOpen(false)}>
                Update notification settings
              </Link>
            </div>
          ) : visibleActivities.length === 0 ? (
            <p className="notification-center__empty">You’re all caught up. No recent activity.</p>
          ) : (
            <ul className="notification-center__list">
              {visibleActivities.map((activity) => (
                <NotificationItem
                  key={activity.id}
                  activity={activity}
                  isRead={readActivityIds.has(activity.id)}
                  onRead={markActivityAsRead}
                />
              ))}
            </ul>
          )}

          <footer className="notification-center__footer">
            <Link to="/dashboard" onClick={() => setOpen(false)}>
              View workspace activity
            </Link>
          </footer>
        </section>
      ) : null}
    </div>
  )
}

interface NotificationItemProps {
  activity: Activity
  isRead: boolean
  onRead: (activityId: string) => void
}

function NotificationItem({ activity, isRead, onRead }: NotificationItemProps) {
  const user = users.find((candidate) => candidate.id === activity.userId)
  const userName = user?.name ?? 'Team member'

  return (
    <li>
      <button
        type="button"
        className={`notification-center__item${isRead ? '' : ' is-unread'}`}
        aria-label={`${isRead ? 'Read' : 'Unread'} notification from ${userName}: ${activity.description}`}
        onClick={() => onRead(activity.id)}
      >
        <span className="notification-center__avatar" aria-hidden="true">
          {user?.initials ?? '?'}
        </span>
        <span className="notification-center__copy">
          <span className="notification-center__message">
            <strong>{userName}</strong> {activity.description}
          </span>
          <time dateTime={activity.timestamp}>{formatActivityTimestamp(activity.timestamp)}</time>
        </span>
        {!isRead ? <span className="notification-center__unread-dot" aria-label="Unread" /> : null}
      </button>
    </li>
  )
}
