export interface ProjectType {
  id: string
  data: {
    title: string
    githubLink: string
    link: string
    description: string
    stack: string
    image?: string
    createdAt?: number
    updatedAt?: number
  }
}

// MongoDB Project Type (new schema)
export interface MongoProjectType {
  _id: string
  title: string
  description: string
  longDescription?: string
  image: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  category: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface DialogPropsType {
  anchorEl: HTMLElement | null
  id: string
  setAnchor: (anchor: HTMLElement | null) => void
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
}

export interface UserType {
  name: string | null
  token: string | null
}
