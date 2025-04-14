'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import AdminButton from '../buttons/AdminButton'
import { useAuthContext } from '../../context/authContext'


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
      <header className="w-full sticky top-0 bg-white opacity-90 md:px-32 border-b shadow-sm shadow-indigo-100 z-50">
        {/* larger screens start */}
        <div className="hidden md:flex sticky top-0 w-full text-2xl pt-6 pb-2  text-black items-center justify-between">
          <Link className="text-4xl" href={'/'}>
            <span className='text-white bg-indigo-500 rounded-md p-0 px-1'>E</span>mmanuel
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
        <div className="md:hidden w-full h-14 text-xl p-4 flex items-center justify-between z-50">
        <span className='text-white text-4xl bg-indigo-500 rounded-md p-0 px-1'>E</span>

          <nav
            className={`${
              isOPen
                ? 'bg-white py-4'
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
                  className="text-indigo-500 active:text-indigo-50 px-4 rounded-full"
                  onClick={handleClick}
                >
                  {link.text}
                </Link>
              ))}
            </ul>
          </nav>
          <div
            onClick={handleClick}
            className=" w-8 h-8 flex flex-col items-center justify-around p-1 rounded-md z-40"
          >
            <div
              className={`bg-indigo-500 w-full h-0.5 rounded-full ${
                isOPen ? 'rotate-45 translate-y-2' : ''
              } duration-500 ease-in-out`}
            ></div>
            <div
              className={`bg-indigo-500 w-full h-0.5 rounded-full ${
                isOPen ? 'opacity-0 ' : ''
              } duration-500 ease-in-out`}
            ></div>
            <div
              className={`bg-indigo-500 w-full h-0.5 rounded-full ${
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
