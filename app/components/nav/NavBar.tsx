"use client";

import React, { useState } from "react";
import { Pacifico } from "next/font/google";
import Style from "./navbar.module.css";
import Link from "next/link";
import Avatar from '@mui/material/Avatar';

const logoFont = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
});

interface Links {
  text: string
  url: string
}

export default function NavBar({ links }: { links: Links[] }) {
  const [isOPen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOPen);
  };

  return (
    <>
      <header className="bg-gray-800 sticky top-0 w-[calc(100%-256px)] text-amber-100 text-xl mx-64 px-4 mt-2 flex justify-between items-center z-10 rounded-b-md">
        <div
          className={`${
            (logoFont.className, Style.logo)
          } font-bold text-5xl sm:text-6xl text-amber-200`}
        >
          OS
        </div>
        <nav
          className={`${
            isOPen
              ? "bg-gray-800 sm:static w-full sm:w-auto opacity-80 sm:opacity-100 py-4"
              : "w-full sm:w-auto top-0 opacity-0 sm:opacity-100"
          } absolute sm:static top-[100px] left-0 sm:block duration-500 ease-in-out `}
        >
          <ul
            className={`flex flex-col sm:flex-row sm:gap-8 gap-4 justify-center items-center ${isOPen ? '' : 'hidden sm:flex'}`}
          >
            {
              links?.map((link,index) => (
                <Link key={index} href={link.url}>{link.text}</Link>
              ))
            }
          </ul>
        </nav>

        <div className="flex gap-4">
          <a
            href=""
            className="bg-amber-200 hover:bg-amber-50 text-gray-900 px-4 py-2 text-sm rounded-full hidden sm:block"
          >
            Contact me
          </a>
          <Link href="./auth">
              <Avatar src="" className="bg-amber-200"/>
          </Link>
        </div>
        <div
          onClick={handleClick}
          className="bg-amber-200 w-10 h-10 flex flex-col items-center justify-around p-2 rounded-lg sm:hidden z-40"
        >
          <div
            className={`bg-amber-50 w-full h-0.5 rounded-full ${
              isOPen ? "rotate-45 translate-y-2" : ""
            } duration-500 ease-in-out`}
          ></div>
          <div
            className={`bg-amber-50 w-full h-0.5 rounded-full ${
              isOPen ? "opacity-0 " : ""
            } duration-500 ease-in-out`}
          ></div>
          <div
            className={`bg-amber-50 w-full h-0.5 rounded-full ${
              isOPen ? "-rotate-45 -translate-y-2" : ""
            } duration-500 ease-in-out`}
          ></div>
        </div>
      </header>
    </>
  );
}
