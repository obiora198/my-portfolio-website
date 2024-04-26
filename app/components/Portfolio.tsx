'use client'

import React, { useState, useEffect } from 'react'
import ProjectCard from "./ProjectCard";

interface Project {
  images:string[]
  title: string
  link: string
}

export default function Portfolio() {
    const [projects, setProjects] = useState<Project[]>([]);

    const getProjects = async () => {
        try {
        const response = await fetch("https://my-portfolio-api-1v51.onrender.com/api/v1/projects");
        const responseObj = await response.json();
        setProjects(responseObj.data); 
        } catch (error) {
        console.error(error);
        }
    };

  useEffect(() => {
    getProjects();
  }, []);

  console.log(projects);
  return (
    <div id="portfolio-section" className="min-h-screen text-amber-50 flex flex-col items-center justify-center gap-4 sm:gap-16 p-4 sm:px-48 sm:py-24">
      <h1 className="font-bold text-6xl text-center">My Portfolio</h1>

      <div className="h-full w-[80%] grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 place-items-center rounded-lg">
        {projects.map((item) => (
          <ProjectCard image={item.images[0]} title={item.title} url={item.link} key={projects.indexOf(item)} />
        ))}
      </div>
    </div>
  );
}


