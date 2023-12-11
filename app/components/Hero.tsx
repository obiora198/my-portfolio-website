import Image from "next/image";
import React from "react";

export default function Hero() {
  return (
    <>
      <div className="min-h-screen text-amber-100 grid sm:grid-cols-2 gap-16 p-4 sm:px-48 pb-24 pt-[140px] relative">
        <div className="w-full h-full grid place-content-center text-xl sm:text-2xl text-start">
          <p className="text-justify">
            Hello, <br />
            <span className="font-bold text-5xl sm:text-6xl text-amber-400">
              I&apos;m Obiora Sopulu E.
            </span>{" "}
            <br />{" "}
            <span className="font-bold text-5xl sm:text-6xl text-amber-50">
              an exprienced web developer
            </span>{" "}
            <br /> I build visually appealing and functional components using
            Nextsj and Tailwind css
          </p>
        </div>
        <div className="w-full h-full grid place-items-end absolute sm:static -top-4 -z-10">
          <div className="sm:hidden h-full w-full bg-[rgba(0,0,0,0.5)] absolute"></div>
          <div className=" w-full sm:w-[80%] h-[80%] bg-[url(/hero-img2.png)] bg-center bg-cover border-8 border-amber-50 rounded-se-full rounded-ee-full">
          </div>
        </div>
      </div>
    </>
  );
}
