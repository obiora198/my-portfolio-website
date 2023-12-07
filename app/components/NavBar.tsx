import React from 'react'
import { Courgette } from 'next/font/google'

const logoFont = Courgette({
  subsets: ['latin'],
  weight: ['400']
})

export default function NavBar() {
  return (
    <>
    <header className='w-full h-[100px] bg-gray-800 fixed  text-amber-100 text-2xl px-48 flex justify-between items-center z-20'>
        <div className={`${logoFont.className} font-bold text-6xl`}>
            OS
        </div>
        <nav>
            <ul className='flex gap-8'>
                <li>
                  <a href="/">Home</a>  
                </li>
                <li>
                  <a href="">About</a>  
                </li>
                <li>
                  <a href="">Portfolio</a>  
                </li>
            </ul>
        </nav>

        <a href="" className='bg-amber-200 hover:bg-amber-50 text-gray-900 px-4 py-2 text-sm rounded-full'>Contact me</a>
    </header>
    </>
  )
}
