import { Button } from '../common/Button'
import { Modal } from '../common/Modal'
import type { Project } from '../../types'

export interface ProjectDeleteModalProps {
  project: Project | null
  onClose: () => void
  onConfirm: () => void
}

export function ProjectDeleteModal({ project, onClose, onConfirm }: ProjectDeleteModalProps) {
  return (
    <Modal open={project !== null} title="Delete project?" onClose={onClose} size="sm">
      {project ? (
        <>
          <p>
            Are you sure you want to delete <strong>{project.name}</strong>?
          </p>
          <p className="text-muted-strong mb-0">
            This removes the project from the current workspace list. This action cannot be undone.
          </p>
          <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm}>
              Delete project
            </Button>
          </div>
        </>
      ) : null}
    </Modal>
  )
}
