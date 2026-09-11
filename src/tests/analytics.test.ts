import { describe, expect, it } from 'vitest'
import { calculateAnalytics, formatAnalyticsPercentage } from '../utils/analytics'

describe('analytics calculations', () => {
  it('handles zero projects and zero tasks without invalid metrics', () => {
    const summary = calculateAnalytics([], [])

    expect(summary.totalTasks).toBe(0)
    expect(summary.completedTasks).toBe(0)
    expect(summary.completionRate).toBe(0)
    expect(summary.tasksByStatus.every((metric) => metric.count === 0)).toBe(true)
    expect(summary.projectsByStatus.every((metric) => metric.count === 0)).toBe(true)
    expect(formatAnalyticsPercentage(summary.completionRate)).toBe('0%')
    expect(formatAnalyticsPercentage(Number.NaN)).toBe('0%')
  })
})
