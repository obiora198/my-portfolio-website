import React from "react";

export default function Hero() {
  return (
    <>
      <div className="h-screen text-amber-100 grid grid-cols-2 gap-16 px-48 pb-24 pt-[140px]">
        <div className="w-full h-full grid place-content-center text-2xl text-start">
          <p>
            Hello, <br />
            <span className="font-bold text-6xl text-amber-400">
              I'm Obiora Sopulu E.
            </span>{" "}
            <br />{" "}
            <span className="font-bold text-6xl text-amber-50">
              an exprienced web developer
            </span>{" "}
            <br /> I build visually appealing and functional components using
            Nextsj and Tailwind css
          </p>
        </div>
        <div className="w-full h-full grid place-items-end">
          <img
            src="/hero-img2.png"
            alt="hero image"
            width="100"
            height="100"
            className="w-[80%] border-8 border-amber-50 rounded-se-full rounded-ee-full"
          />
        </div>
      </div>
    </>
  );
}
