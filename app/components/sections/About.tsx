import React from 'react'
import Image from 'next/image'

export default function About () {
  return (
    <section id="about-section">
      <div className="w-full h-screen flex flex-col items-center px-40 pt-16">
        <h1 className="text-4xl font-bold text-indigo-500 inline-block text-center border-b-2 mt-8">
          About me
        </h1>

        <div className="w-full h-full flex items-center justify-between gap-24 px-4">
          <Image
            src="/profile-img.jpg"
            className="h-auto rounded-2xl shadow-lg"
            alt=""
            width={300}
            height={300}
          />
          <p className="text-black text-justify">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nisi, amet
            nobis voluptates iure facilis necessitatibus minus deleniti repellat
            alias velit commodi. Aut velit quo ducimus modi dolorum, id tempora
            cupiditate impedit ipsam quasi quisquam dolor doloribus ea hic iusto
            inventore, magnam numquam optio sequi tenetur sit quae. Minus,
            corporis amet.
          </p>
        </div>
      </div>
    </section>
  )
}
