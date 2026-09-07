import { activities } from './activities'
import { projects } from './projects'
import { tasks } from './tasks'
import { users } from './users'
import { assertValidSeedData } from './validation'
import type { TeamFlowSeedData } from '../types'

export const seedData: TeamFlowSeedData = {
  users,
  projects,
  tasks,
  activities,
}

assertValidSeedData(seedData)

export { activities, projects, tasks, users }
export { assertValidSeedData, validateSeedData } from './validation'
