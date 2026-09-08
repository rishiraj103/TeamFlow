import type { Task } from '../../types'
import { Button } from '../common/Button'
import { Modal } from '../common/Modal'

export interface TaskDeleteModalProps {
  task: Task | null
  onClose: () => void
  onConfirm: () => void
}

export function TaskDeleteModal({ task, onClose, onConfirm }: TaskDeleteModalProps) {
  return (
    <Modal
      open={task !== null}
      title="Delete task"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete task
          </Button>
        </>
      }
    >
      <p className="mb-0">
        Are you sure you want to delete <strong>{task?.title}</strong>? This action cannot be
        undone.
      </p>
    </Modal>
  )
}
