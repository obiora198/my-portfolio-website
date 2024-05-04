import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {

    try {
        const response = await fetch(
          "https://my-portfolio-api-1v51.onrender.com/api/v1/auth/login",
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
            }),
          }
        );
  
        // Handle response if necessary
        if (response.status === 200) {
          const data = await response.json();
          // console.log(data);
        //   setUser({name:data.user.name, token:data.token});
          cookies().set('user',JSON.stringify({name:data.user.name, token:data.token}),{
            httpOnly: true,
            maxAge: 24 * 60 * 60,
            sameSite: "strict"
          });
        } else {
        }
      } catch (error) {
        console.error(error);
      }
}