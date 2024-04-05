"use client";

import React from "react";
import { TextField, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { CldUploadWidget } from "next-cloudinary";
import Head from "next/head";

const ProjectForm = () => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [imagePublicId, setImagePublicId] = React.useState("");

  // const openWidget = () => {
  //   // create the widget
  //   const widget = window.cloudinary
  //     .createUploadWidget(
  //       {
  //         cloudName: "dgd3z5vbo",
  //         uploadPreset: "ml_default",
  //       },
  //       (error, result) => {
  //         if (
  //           result.event === "success" &&
  //           result.info.resource_type === "image"
  //         ) {
  //           console.log(result.info);
  //           setImagePublicId(result.info.public_id);
  //         }
  //       }
  //     )
  //     .then()
  //     .catch((error) => console.error(error));
  //   widget.open(); // open up the widget after creation
  // };
      const handleSubmit = (e) => {
        e.preventDefault()
        console.log(title,description,image);
      }
  return (
    <>
      <Head>
        <script
          src="https://widget.Cloudinary.com/v2.0/global/all.js"
          type="text/javascript"
        ></script>
      </Head>
      <div
        id="contact-section"
        className="w-full sm:h-screen flex flex-col items-center justify-center py-8"
      >
        <h1 className="text-5xl font-bold mb-4 sm:my-16">Upload A Project</h1>
        <div className="min-w-[50%] bg-amber-50 text-gray-900 flex flex-col gap-4 rounded-lg p-8">
          <form className="w-full flex flex-col items-center gap-4">
            <TextField
              id="outlined-basic"
              type="text"
              variant="outlined"
              placeholder="Project Title"
              className="w-full"
              onChange={(e)=>setTitle(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              type="email"
              variant="outlined"
              placeholder="Project Description"
              multiline={true}
              className="w-full"
              onChange={(e)=>setDescription(e.target.value)}
            />
            {
              image && (
                <h3>Image: {image.original_filename}</h3>
              )
            }

            <CldUploadWidget
              uploadPreset="ml_default"
              onSuccess={(result, { widget }) => {
                setImage(result?.info);
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
              onClick={handleSubmit}
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
