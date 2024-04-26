"use client";

import { CldImage } from 'next-cloudinary';
import Link from "next/link";
import React, { useState } from "react";

interface Params {
  image: string;
  title: string;
  url: String;
}

export default function ProjectCard({ image, title,url }: Params) {
  const [hover, setHover] = useState<Boolean>(false);

  return (
    <>
      <Link
        href={`/projects/${url}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="relative">
          <CldImage
            src={image}
            width={1000}
            height={1000}
            alt={title}
            className="w-full rounded-lg"
          />
          <div className="absolute top-0 bottom-0 w-full hover:bg-[rgba(0,0,0,0.5)] grid place-items-center text-4xl text-amber-100 text-center duration-1000 px-8">
            <span
              className={`${
                hover ? "absolute top-[50%] -translate-y-[50%]" : "absolute top-[50%] translate-y-[50%] text-[rgba(0,0,0,0)]"
              }  transition-all ease-in-out duration-1000`}
            >
              {title}
            </span>
          </div>
        </div>
      </Link>
    </>
  );
}
