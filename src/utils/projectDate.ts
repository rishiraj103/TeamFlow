export function parseProjectDate(date: string): Date | null {
  const parsedDate = new Date(`${date}T00:00:00Z`)

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}

export function getProjectDateTimestamp(date: string): number {
  return parseProjectDate(date)?.getTime() ?? Number.POSITIVE_INFINITY
}

export function formatProjectDate(date: string): string {
  const parsedDate = parseProjectDate(date)

  if (!parsedDate) {
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
