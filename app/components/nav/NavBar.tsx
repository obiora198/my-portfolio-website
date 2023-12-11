"use client";

import React, { useState } from "react";
import { Pacifico } from "next/font/google";
import Style from "./navbar.module.css";
import Link from "next/link";

const logoFont = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
});

interface ids {
  homeId: string
  portfolioId: string
  contactId: string
}

export default function NavBar({homeId, contactId, portfolioId}: ids) {
  const [isOPen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOPen);
  };

  return (
    <>
      <header className="w-full h-[100px] bg-gray-800 fixed text-amber-100 text-2xl px-4 sm:px-48 flex justify-between items-center z-20">
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
            <li>
              <Link href={homeId} scroll={false}>Home</Link>
            </li>
            <li>
              <Link href={portfolioId} scroll={false}>Portfolio</Link>
            </li>
            <li>
              <Link href={contactId} scroll={false}>Contact</Link>
            </li>
          </ul>
        </nav>

        <a
          href=""
          className="bg-amber-200 hover:bg-amber-50 text-gray-900 px-4 py-2 text-sm rounded-full hidden sm:block"
        >
          Contact me
        </a>
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
