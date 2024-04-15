"use client";

import React from "react";
import { TextField, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { CldUploadWidget } from "next-cloudinary";
import Head from "next/head";
import { useUser } from "../userContext";
import Loading from "../components/Loading";

const ProjectForm = () => {
  const { user } = useUser();

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://my-portfolio-api-1v51.onrender.com/api/v1/projects",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            title: title,
            description: description,
            images: [image.public_id],
            link: url,
          }),
        }
      );

      // Handle response if necessary
      if (response.status === 201) {
        const data = await response.json();
        console.log(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Head>
        <script
          src="https://widget.Cloudinary.com/v2.0/global/all.js"
          type="text/javascript"
        ></script>
      </Head>
      {loading && <Loading />}
      <div
        id="contact-section"
        className="w-full sm:h-screen flex flex-col items-center justify-center py-8"
      >
        <h1 className="text-5xl font-bold mb-4 sm:my-16">Upload A Project</h1>
        <div className="min-w-[50%] bg-amber-50 text-gray-900 flex flex-col gap-4 rounded-lg p-8">
          <form
            className="w-full flex flex-col items-center gap-4"
            onSubmit={handleSubmit}
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
