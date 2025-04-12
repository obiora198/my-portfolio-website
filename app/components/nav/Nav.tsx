'use client'

import React, { useState } from 'react'
import { Pacifico } from 'next/font/google'
import Style from './navbar.module.css'
import Link from 'next/link'
import AdminButton from '../buttons/AdminButton'
import { useAuthContext } from '../../context/authContext'

const logoFont = Pacifico({
  subsets: ['latin'],
  weight: ['400'],
})

interface Links {
  text: string
  url: string
}

export default function Nav({ links }: { links: Links[] }) {
  const { user } = useAuthContext()
  const [isOPen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen(!isOPen)
  }

  return (
    <>
      <header className="w-full sticky top-0 bg-white opacity-90 px-32 border-b shadow-sm shadow-indigo-100">
        {/* larger screens start */}
        <div className="flex sticky top-0 w-full text-2xl pt-6 pb-2  text-black items-center justify-between z-10">
          <Link className="text-4xl" href={'/'}>
            Emmanuel
          </Link>

          <nav className="">
            <ul className="w-full flex justify-center items-center gap-8">
              {links?.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.url}
                    className="border-b-0 transition duration-500 hover:border-b-2 hover:border-indigo-500 hover:text-indigo-500"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {/* larger screens end  */}

        {/* mobile display start */}
        <div className="sm:hidden w-full text-xl px-4 flex items-center justify-between z-50">
          <div className="font-bold text-5xl text-indigo-500">SO</div>

          <nav
            className={`${
              isOPen
                ? 'bg-gradient-to-b from-transparent to-gray-800 py-4'
                : 'top-0 opacity-0'
            } w-full absolute top-10 left-0 duration-500 ease-in-out rounded-b-md flex flex-col justify-between items-center z-50`}
          >
            <ul
              className={`flex flex-col justify-between items-center text-center text-gray-900 gap-1 px-16 ${isOPen ? '' : 'hidden'}`}
            >
              {links?.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className="bg-indigo-500 active:bg-indigo-50 px-4 rounded-full"
                  onClick={handleClick}
                >
                  {link.text}
                </Link>
              ))}
              <AdminButton />
            </ul>
          </nav>
          <div
            onClick={handleClick}
            className="bg-indigo-500 w-8 h-8 flex flex-col items-center justify-around p-1 rounded-md z-40"
          >
            <div
              className={`bg-gray-900 w-full h-0.5 rounded-full ${
                isOPen ? 'rotate-45 translate-y-2' : ''
              } duration-500 ease-in-out`}
            ></div>
            <div
              className={`bg-gray-900 w-full h-0.5 rounded-full ${
                isOPen ? 'opacity-0 ' : ''
              } duration-500 ease-in-out`}
            ></div>
            <div
              className={`bg-gray-900 w-full h-0.5 rounded-full ${
                isOPen ? '-rotate-45 -translate-y-2' : ''
              } duration-500 ease-in-out`}
            ></div>
          </div>
        </div>
        {/* mobile display ends */}
      </header>
    </>
  )
}
