import { TASK_PRIORITIES, TASK_STATUSES } from '../../constants/data'
import type { Project, User } from '../../types'
import type {
  SortDirection,
  TaskFilterState,
  TaskPriority,
  TaskStatus,
  TaskSortField,
} from '../../types'
import { getTaskSortOption, taskSortOptions, type TaskSortOption } from '../../utils/taskFilters'
import { taskPriorityLabels, taskStatusLabels } from '../../utils/taskLabels'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { Select, type SelectOption } from '../common/Select'

export interface TaskFiltersProps {
  filters: TaskFilterState
  projects: Project[]
  assignees: User[]
  onChange: (updates: Partial<TaskFilterState>) => void
  onReset: () => void
}

const statusOptions: SelectOption[] = [
  { label: 'All statuses', value: 'all' },
  ...TASK_STATUSES.map((status) => ({
    label: taskStatusLabels[status],
    value: status,
  })),
]

const priorityOptions: SelectOption[] = [
  { label: 'All priorities', value: 'all' },
  ...TASK_PRIORITIES.map((priority) => ({
    label: taskPriorityLabels[priority],
    value: priority,
  })),
]

const sortConfig: Record<TaskSortOption, { sortBy: TaskSortField; sortDirection: SortDirection }> =
  {
    'dueDate:asc': { sortBy: 'dueDate', sortDirection: 'asc' },
    'dueDate:desc': { sortBy: 'dueDate', sortDirection: 'desc' },
    'priority:desc': { sortBy: 'priority', sortDirection: 'desc' },
    'priority:asc': { sortBy: 'priority', sortDirection: 'asc' },
    'title:asc': { sortBy: 'title', sortDirection: 'asc' },
    'title:desc': { sortBy: 'title', sortDirection: 'desc' },
  }

export function TaskFilters({ filters, projects, assignees, onChange, onReset }: TaskFiltersProps) {
  const projectOptions: SelectOption[] = [
    { label: 'All projects', value: 'all' },
    ...projects.map((project) => ({ label: project.name, value: project.id })),
  ]
  const assigneeOptions: SelectOption[] = [
    { label: 'All assignees', value: 'all' },
    ...assignees.map((assignee) => ({ label: assignee.name, value: assignee.id })),
  ]

  function handleSortChange(value: string) {
    const nextSort = sortConfig[value as TaskSortOption]

    if (nextSort) {
      onChange(nextSort)
    }
  }

  return (
    <section className="task-filters" aria-label="Task filters">
      <div className="task-filters__primary row align-items-end g-3">
        <div className="col-12 col-lg-5">
          <Input
            label="Search tasks"
            name="task-search"
            type="search"
            value={filters.search}
            onChange={(event) => onChange({ search: event.target.value })}
            placeholder="Search title or description"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <Select
            label="Status"
            name="task-status-filter"
            value={filters.status}
            onChange={(event) =>
              onChange({ status: (event.target.value || 'all') as TaskStatus | 'all' })
            }
            options={statusOptions}
            placeholder="Choose status"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-2">
          <Select
            label="Priority"
            name="task-priority-filter"
            value={filters.priority}
            onChange={(event) =>
              onChange({ priority: (event.target.value || 'all') as TaskPriority | 'all' })
            }
            options={priorityOptions}
            placeholder="Choose priority"
          />
        </div>
        <div className="col-12 col-lg-2">
          <Button
            type="button"
            variant="outline"
            className="task-filters__reset w-100"
            onClick={onReset}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      <details className="task-filters__advanced">
        <summary>More filters and sorting</summary>
        <div className="row align-items-end g-3 pt-3">
          <div className="col-12 col-sm-6 col-lg-4">
            <Select
              label="Project"
              name="task-project-filter"
              value={filters.projectId}
              onChange={(event) => onChange({ projectId: event.target.value || 'all' })}
              options={projectOptions}
              placeholder="Choose project"
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-4">
            <Select
              label="Assignee"
              name="task-assignee-filter"
              value={filters.assigneeId}
              onChange={(event) => onChange({ assigneeId: event.target.value || 'all' })}
              options={assigneeOptions}
              placeholder="Choose assignee"
            />
          </div>
          <div className="col-12 col-lg-4">
            <Select
              label="Sort by"
              name="task-sort"
              value={getTaskSortOption(filters)}
              onChange={(event) => handleSortChange(event.target.value)}
              options={taskSortOptions}
              placeholder="Choose sorting"
            />
          </div>
        </div>
      </details>
    </section>
  )
}
