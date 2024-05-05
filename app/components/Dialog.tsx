import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import editProject from "@/app/lib/editProject";
import { TextField, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { CldUploadWidget } from "next-cloudinary";
import Head from "next/head";
import Loading from "./Loading";

interface DialogProps {
  // open: boolean;
  handleClickMenu: (event: React.MouseEvent<HTMLElement>) => void;
}

type ImageProps = {
  public_id: string
  original_filename: string
  [propName: string]: any;
}

const defaultImage: ImageProps = {
  public_id: '',
  original_filename:'',
}

export default function CustomDialog({currentTarget}:{currentTarget: HTMLElement | null}) {
  // edit form props 
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState<ImageProps>(defaultImage);
  const [url, setUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  // edit form props end

   //MENU CONTROL >>>> START
   const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null | null>(null);
   const menuOpen = anchorEl == null ? false : true;
   setAnchorEl(currentTarget);
   const handleCloseMenu = () => setAnchorEl(null);
   //MENU CONTROL >>>> END

   //DELETE DIALOG CONTROL >>>> START
   const [deleteDialogOpen, setdeleteDialogOpen] = React.useState(false);
   const handleDeleteDialogOpen = () => setdeleteDialogOpen(true);
   const handleCloseDeleteDialog = () => setdeleteDialogOpen(false);
   //DELETE DIALOG CONTROL >>>> END
   
   //UPDATE DIALOG CONTROL >>>> START
   const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
   const handleClickUpdateDialogOpen = () => setUpdateDialogOpen(true);
   const handleCloseupdateDialog = () => setUpdateDialogOpen(false);
   //UPDATE DIALOG CONTROL >>>> END

  const handleDeleteProject = () => {
    
  };
  // edit form controls
  const clearForm = () => {
    setTitle('')
    setDescription('')
    setImage(defaultImage)
    setUrl('')
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    await editProject({title:title,description:description,image:image.public_id,link:url,id:'id'})
    clearForm()
    setLoading(false)
  }
  // edit form controls end

  return (
    <>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleClickUpdateDialogOpen}>Update</MenuItem>
        <MenuItem onClick={handleDeleteDialogOpen}>Delete</MenuItem>
      </Menu>

      {/* edit dialog  */}
      <Dialog onClose={handleCloseupdateDialog} open={updateDialogOpen}>
      <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
        <Head>
        <script
          src="https://widget.Cloudinary.com/v2.0/global/all.js"
          type="text/javascript" async
        ></script>
        <script src="https://console.cloudinary.com/console/c-876bfd119aa2e944477da90e6bf2a7/media_library/jquery/dist/jquery.js" type="text/javascript" async></script>
      </Head>
      <div
        id="contact-section"
        className="w-full h-[80vh] sm:h-screen border-8 border-gray-950 bg-gray-800 flex flex-col items-center justify-center py-8 rounded-lg"
        >
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Upload A Project</h1>
        <div className="min-w-[50%] bg-amber-50 text-gray-900 flex flex-col gap-4 rounded-lg p-8 relative">
          {loading && <div className='w-full h-full absolute top-0 left-0'><Loading dark={true}/></div>}
          <form
            className="w-full flex flex-col items-center gap-4"
            onSubmit={handleFormSubmit}
          >
            <TextField
              id="outlined-basic"
              type="text"
              variant="outlined"
              placeholder="Project Title"
              className="w-full"
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              type="text"
              variant="outlined"
              placeholder="Project Description"
              multiline={true}
              className="w-full"
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              type="text"
              variant="outlined"
              placeholder="Project link"
              className="w-full"
              onChange={(e) => setUrl(e.target.value)}
            />
            {image && <h3>Image: {image.original_filename}</h3>}

            <CldUploadWidget
              uploadPreset="ml_default"
              onSuccess={(result, { widget }) => {
                // @ts-ignore
                setImage(result?.info);
                console.log(result);
                widget.close();
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
          </form>
        </div>
      </div>
        </DialogContent>
      </Dialog>
      {/* edit dialog end  */}

      {/* delete dialog  */}
      <Dialog onClose={handleCloseDeleteDialog} open={deleteDialogOpen}>
        <DialogTitle>Delete Project</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
            <p>Are you sure you want to delete this project?</p>
            </DialogContentText>
            <DialogActions>
              <Button variant="contained" color='error' onClick={handleCloseDeleteDialog}>
                No
              </Button>
              <Button variant="contained" onClick={handleDeleteProject}>
                yes
              </Button>
            </DialogActions>
          </DialogContent>
      </Dialog>
      {/* delete dialog end */}
    </>
  );
}

 
