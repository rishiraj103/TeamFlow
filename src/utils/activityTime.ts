import { formatProjectDateTime } from './projectDate'

const minuteInMilliseconds = 60 * 1000
const hourInMilliseconds = 60 * minuteInMilliseconds
const dayInMilliseconds = 24 * hourInMilliseconds

export function formatActivityTimestamp(timestamp: string, now = new Date()): string {
  const activityDate = new Date(timestamp)
  const activityTime = activityDate.getTime()

  if (Number.isNaN(activityTime)) {
    return timestamp
  }

  const elapsed = now.getTime() - activityTime

  if (elapsed < 0) {
    return formatProjectDateTime(timestamp)
  }

  if (elapsed < minuteInMilliseconds) {
    return 'Just now'
  }

  if (elapsed < hourInMilliseconds) {
    const minutes = Math.floor(elapsed / minuteInMilliseconds)
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  }

  if (elapsed < dayInMilliseconds) {
    const hours = Math.floor(elapsed / hourInMilliseconds)
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  }

  if (elapsed < 2 * dayInMilliseconds) {
    return 'Yesterday'
  }

  return formatProjectDateTime(timestamp)
}
