import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContentText from '@mui/material/DialogContentText'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Button } from '@mui/material'
import Loading from '../Loading'
import { DeleteDialogProps } from '@/app/configs/tsTypes'


export default function DeleteDialog({
  open,
  loading,
  onClose,
  onClickYes,
  onClickNo,
}: DeleteDialogProps) {
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Delete Project</DialogTitle>
      <DialogContent>
        {loading && (
          <div className="w-full h-full absolute top-0 left-0">
            <Loading dark={true} />
          </div>
        )}
        <DialogContentText id="alert-dialog-description">
          <p>Are you sure you want to delete this project?</p>
        </DialogContentText>
        <DialogActions>
          <Button
            variant="contained"
            className="bg-red-800"
            color="error"
            onClick={onClickNo}
          >
            No
          </Button>
          <Button
            variant="contained"
            className="bg-blue-800"
            color="primary"
            onClick={onClickYes}
          >
            yes
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
