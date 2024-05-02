import Image from "next/image";
import React from "react";

export default function Hero() {
  return (
    <>
      <div id="hero-section" className="min-h-screen text-amber-100 grid md:grid-cols-2 p-4 sm:px-16 md:px-32 lg:px-64 relative">
        <div className="w-full h-full grid place-content-center">
          <p className="text-center text-3xl">
            Hello, I&apos;m Sopuluchukwu E. Obiora, a 
            <span className="text-amber-200 text-4xl"> fullstack web developer,</span> I build
            <span className="text-amber-200 text-4xl"> visually appealing </span>and
            <span className="text-amber-200 text-4xl"> functional</span> fullstack web apps
            , feel free to look around and see some of my work.
          </p>
        </div>
        <div className="w-full h-full absolute flex items-center justify-center md:static -top-16 -z-10">
          <div className="md:hidden h-full w-full bg-[rgba(0,0,0,0.7)] absolute"></div>
          <div className="hidden md:block h-4/5 w-4/5 bg-[url(/hero-img2.png)] bg-cover bg-center rounded-xl">
            <div className="h-full w-full bg-gradient-to-r from-gray-950 to-50% to-transparent"></div>
          </div>
          <Image src='/hero-img2.png' className=" h-full w-full md:hidden" alt="" width={1000} height={1000}/>
        </div>
      </div>
    </>
  );
}
