import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 'project-marketplace-refresh',
    name: 'Marketplace Refresh',
    description: 'A faster, more discoverable storefront experience for independent sellers.',
    status: 'active',
    progress: 68,
    dueDate: '2026-10-18',
    memberIds: ['user-amelia-chen', 'user-priya-shah', 'user-jordan-brooks', 'user-noah-williams'],
  },
  {
    id: 'project-pulse-mobile',
    name: 'Pulse Mobile',
    description: 'A companion mobile app that gives customers real-time account insights.',
    status: 'active',
    progress: 42,
    dueDate: '2026-11-06',
    memberIds: ['user-mateo-ruiz', 'user-amelia-chen', 'user-sofia-petrov', 'user-jordan-brooks'],
  },
  {
    id: 'project-care-connect',
    name: 'CareConnect Portal',
    description: 'A secure patient portal that simplifies appointment and care-plan updates.',
    status: 'completed',
    progress: 100,
    dueDate: '2026-08-28',
    memberIds: ['user-priya-shah', 'user-mateo-ruiz', 'user-noah-williams'],
  },
  {
    id: 'project-skillforge',
    name: 'SkillForge Learning Hub',
    description: 'A guided learning platform for role-based development and certification paths.',
    status: 'active',
    progress: 24,
    dueDate: '2026-12-12',
    memberIds: ['user-amelia-chen', 'user-priya-shah', 'user-jordan-brooks', 'user-sofia-petrov'],
  },
  {
    id: 'project-insight-lake',
    name: 'Insight Lake',
    description: 'An internal analytics platform that brings operational metrics into one view.',
    status: 'archived',
    progress: 76,
    dueDate: '2026-07-31',
    memberIds: ['user-mateo-ruiz', 'user-noah-williams', 'user-sofia-petrov'],
  },
]
