import { useParams } from 'react-router-dom'
import { PagePlaceholder } from './PagePlaceholder'

export function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>()

  return (
    <PagePlaceholder
      title="Project details"
      description="Project lookup and detail features will be implemented in later phases."
    >
      <p className="mt-4 mb-0">
        Project ID: <code>{projectId ?? 'unknown'}</code>
      </p>
    </PagePlaceholder>
  )
}
