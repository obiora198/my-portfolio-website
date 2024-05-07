export interface ProjectType {
  images: string[]
  title: string
  link: string
  description: string
  _id: string
}

export interface DialogPropsType {
  anchorEl: HTMLElement | null
  id: string
  setAnchor: (anchor: HTMLElement | null) => void
  setStamp: (stamp: number) => void
}

export type ImagePropsType = {
  public_id: string | null
  original_filename: string | null
  [propName: string]: any | null
}

export type DeleteDialogProps = {
  open: boolean
  loading: boolean
  onClose: () => void
  onClickYes: () => void
  onClickNo: () => void
}

export type UpdateDialogProps = {
  id: string
  open: boolean
  onClose: () => void
  setStamp: (stamp: number) => void
}