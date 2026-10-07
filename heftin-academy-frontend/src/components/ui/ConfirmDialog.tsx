import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

type ConfirmDialogProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'danger'
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
    >
      <p className="mb-6 text-sm text-muted">
        {message}
      </p>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onClose}
        >
          {cancelText}
        </Button>

        <Button
          variant={confirmVariant}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </Dialog>
  )
}


