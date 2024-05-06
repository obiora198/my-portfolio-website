"use client";

import React from "react";
import { TextField, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { CldUploadWidget } from "next-cloudinary";
import Head from "next/head";
import Loading from "./Loading";


type ProjectProps = {
  submitHandler: (event: React.FormEvent<HTMLFormElement>) => void
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void
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


const ProjectForm = ({handleSubmit,handleChange}: {handleSubmit: ProjectProps['submitHandler'];handleChange: ProjectProps["changeHandler"]}) => {

  const [loading, setLoading] = React.useState(false);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
     await handleSubmit
    setLoading(false)
  }

  const hadleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handle
  }
  
  
  return (
    <>
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
    </>
  );
};

export default ProjectForm;
