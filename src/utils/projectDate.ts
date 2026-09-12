export function formatProjectDate(date: string): string {
  const parsedDate = new Date(`${date}T00:00:00Z`)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsedDate)
}

export function formatProjectDateTime(timestamp: string): string {
  const parsedDate = new Date(timestamp)

  if (Number.isNaN(parsedDate.getTime())) {
    return timestamp
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedDate)
}
