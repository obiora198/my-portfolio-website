import * as React from 'react'
import Head from 'next/head'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { TextField, Button } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { CldUploadWidget } from 'next-cloudinary'
import Loading from '../Loading'
import getProject from '@/app/lib/getProject'
import editProject from '@/app/lib/editProject'
import { ProjectType, ImagePropsType, UpdateDialogProps } from '@/app/configs/tsTypes'
import revalidate from '@/app/lib/revalidateFetch'

export default function UpdateDialog({
  id,
  open,
  onClose,
}: UpdateDialogProps) {
  const [project, setProject] = React.useState<ProjectType | null>(null)
  const [title, setTitle] = React.useState(project?.title as string)
  const [description, setDescription] = React.useState(
    project?.description as string
  )
  const [url, setUrl] = React.useState(project?.link as string)
  const [image, setImage] = React.useState<ImagePropsType | null>(null)
  const [loading, setLoading] = React.useState(false)

  const getProjectData = async () => {
    const data = await getProject({ id: id })
    setProject(data)
  }
  React.useEffect(() => {
    getProjectData()
  }, [id]) // Add id as a dependency to rerun effect when id changes

  React.useEffect(() => {
    // When project state changes, update form fields
    if (project) {
      setTitle(project.title)
      setDescription(project.description)
      setUrl(project.link)
    }
  }, [project]) // Add project as a dependency to rerun effect when project changes

  // edit form controls

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const res = await editProject({
      title: title,
      description: description,
      image: image?.public_id as string,
      link: url,
      id: id,
    })
    console.log(res)

    if (res?.success == true) {
      revalidate('project')
      getProjectData()
      onClose()
    }
    setLoading(false)
  }

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Edit Project</DialogTitle>
      <DialogContent>
        <Head>
          <script
            src="https://widget.Cloudinary.com/v2.0/global/all.js"
            type="text/javascript"
            async
          ></script>
          <script
            src="https://console.cloudinary.com/console/c-876bfd119aa2e944477da90e6bf2a7/media_library/jquery/dist/jquery.js"
            type="text/javascript"
            async
          ></script>
        </Head>
        <div
          id="contact-section"
          className="w-full h-full border-8 flex flex-col items-center justify-center rounded-lg"
        >
          <div className="min-w-[50%] bg-amber-50 text-gray-900 flex flex-col gap-4 rounded-lg p-8 relative">
            {loading && (
              <div className="w-full h-full absolute top-0 left-0">
                <Loading dark={true} />
              </div>
            )}
            <form
              className="w-full flex flex-col items-center gap-4"
              onSubmit={handleFormSubmit}
            >
              {project && (
                <>
                  <TextField
                    id="outlined-basic"
                    type="text"
                    variant="outlined"
                    placeholder="Project Title"
                    className="w-full"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <TextField
                    id="outlined-basic"
                    type="text"
                    variant="outlined"
                    placeholder="Project Description"
                    multiline={true}
                    className="w-full"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <TextField
                    id="outlined-basic"
                    type="text"
                    variant="outlined"
                    placeholder="Project link"
                    className="w-full"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  {image && <h3>Image: {image.original_filename}</h3>}

                  <CldUploadWidget
                    uploadPreset="ml_default"
                    onSuccess={(result, { widget }) => {
                      // @ts-ignore
                      setImage(result?.info)
                      console.log(result)
                      widget.close()
                    }}
                  >
                    {({ open }) => (
                      <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        onClick={() => open()}
                      >
                        Upload Image
                      </Button>
                    )}
                  </CldUploadWidget>

                  <Button
                    variant="contained"
                    className="bg-amber-200 hover:bg-amber-50 text-gray-900 px-4 py-2 text-sm rounded-full mt-4"
                    type="submit"
                  >
                    Submit
                  </Button>
                </>
              )}
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
