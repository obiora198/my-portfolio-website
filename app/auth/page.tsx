"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FormEventHandler } from "react";
import { TextField, Button } from "@mui/material";
import { useUser } from "../userContext";
import Loading from "../components/Loading";

export default function Login() {
  const router = useRouter();
  const {setUser} = useUser()

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setLoading(true)

    try {
      const response = await fetch(
        "https://my-portfolio-api-1v51.onrender.com/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      // Handle response if necessary
      if (response.status === 200) {
        const data = await response.json();
        // console.log(data);
        setUser({name:data.user.name, token:data.token});
        setLoading(false)
        router.push("/");
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      id="contact-section"
      className="w-full h-[calc(100vh-150px)] flex flex-col items-center justify-center py-8"
    >
      <h1 className="text-5xl font-bold mb-8">Admin Login</h1>
      <div className="min-w-[50%] bg-amber-50 text-gray-900 flex flex-col gap-4 rounded-lg p-8 relative">
      
        {loading && <div className='w-full h-full absolute top-0 left-0'><Loading dark={true}/></div>}

        <form
          className="w-full flex flex-col items-center gap-4"
          method="POST"
          onSubmit={handleSubmit}
        >
          <TextField
            id="outlined-basic"
            type="email"
            variant="outlined"
            placeholder="email"
            className="w-full"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            type="password"
            variant="outlined"
            placeholder="password"
            className="w-full"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
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
  );
}
