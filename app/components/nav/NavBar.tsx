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
      <header className="w-full px-4 pt-2 sm:px-16 md:px-32 lg:px-64">
        {/* mobile display start */}
        <div className="sm:hidden bg-gray-800 sticky top-0 w-full text-amber-100 text-xl px-4 flex items-center justify-between z-10 rounded-full">
          <div
            className={`${
              (logoFont.className, Style.logo)
            } font-bold text-5xl text-amber-200`}
          >
            SO
          </div>

          <nav className={`${
              isOPen
                ? "bg-gradient-to-b from-transparent to-gray-800 py-4"
                : "top-0 opacity-0"
            } w-full absolute top-10 left-0 duration-500 ease-in-out rounded-b-md flex flex-col justify-between items-center`}>
            <ul className={`flex flex-col justify-between items-center text-center px-16 ${isOPen ? '' : 'hidden'}`}
            >
              {
                links?.map((link,index) => (
                  <Link key={index} href={link.url} className="w-full hover:border-b border-amber-200 pr-2">{link.text}</Link>
                ))
              }
              <Link href='./auth' className="w-full hover:border-b border-amber-200">Login</Link>
            </ul>
          </nav>
          <div
            onClick={handleClick}
            className="bg-amber-200 w-8 h-8 flex flex-col items-center justify-around p-1 rounded-md z-40"
          >
            <div
              className={`bg-gray-900 w-full h-0.5 rounded-full ${
                isOPen ? "rotate-45 translate-y-2" : ""
              } duration-500 ease-in-out`}
            ></div>
            <div
              className={`bg-gray-900 w-full h-0.5 rounded-full ${
                isOPen ? "opacity-0 " : ""
              } duration-500 ease-in-out`}
            ></div>
            <div
              className={`bg-gray-900 w-full h-0.5 rounded-full ${
                isOPen ? "-rotate-45 -translate-y-2" : ""
              } duration-500 ease-in-out`}
            ></div>
          </div>
        </div>
        {/* mobile display ends */}

          {/* larger screens start */}
        <div className="hidden sm:flex bg-gray-800 sticky top-0 w-full text-amber-100 text-xl px-8 items-center justify-between z-10 rounded-full">
          <div
            className={`${
              (logoFont.className, Style.logo)
            } font-bold text-5xl sm:text-6xl text-amber-200`}
          >
            SO
          </div>

          <nav className="">
            <ul className="w-full flex justify-center items-center gap-8"
            >
              {
                links?.map((link,index) => (
                  <li key={index}>
                    <Link href={link.url} className="hover:border-b border-amber-200">{link.text}</Link>
                  </li>
                ))
              }
            </ul>
          </nav>
          <Link href="./auth">
              <Avatar src="" className="bg-amber-200 text-gray-900"/>
          </Link>
        </div>
        {/* larger screens end  */}
      </header>
    </>
  );
}
