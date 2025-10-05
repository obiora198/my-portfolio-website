'use client'

import { ProjectType } from '../../configs/tsTypes'
import fetchProjects from '../../lib/fetchProjects'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Projects() {
  const [loading, setLoading] = React.useState<boolean>(true)
  const [projects, setProjects] = React.useState<ProjectType[]>([])
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const start = async () => {
    let projectsArray = await fetchProjects()
    setProjects(projectsArray)
    setLoading(false)
  }

  React.useEffect(() => {
    start()
  }, [])

  // Wave animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let time = 0;
    let animationFrameId: number;

    const waveData = Array.from({ length: 5 }).map(() => ({
      value: Math.random() * 0.5 + 0.1,
      targetValue: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.02 + 0.01,
    }));

    function resizeCanvas() {
      if (!canvas) return;
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    }

    function updateWaveData() {
      waveData.forEach((data) => {
        if (Math.random() < 0.01) data.targetValue = Math.random() * 0.7 + 0.1;
        const diff = data.targetValue - data.value;
        data.value += diff * data.speed;
      });
    }

    function draw() {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      waveData.forEach((data, i) => {
        const freq = data.value * 7;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
          const nx = (x / canvas.width) * 2 - 1;
          const px = nx + i * 0.04 + freq * 0.03;
          const py =
            Math.sin(px * 10 + time) *
            Math.cos(px * 2) *
            freq *
            0.1 *
            ((i + 1) / 8);
          const y = ((py + 1) * canvas.height) / 2;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        const intensity = Math.min(1, freq * 0.3);
        const r = 99 + intensity * 50;  // indigo-500 base
        const g = 102 + intensity * 30;
        const b = 241 + intensity * 20;
        ctx.lineWidth = 0.5 + i * 0.3;
        ctx.strokeStyle = `rgba(${r},${g},${b},0.4)`;
        ctx.shadowColor = `rgba(${r},${g},${b},0.3)`;
        ctx.shadowBlur = 3;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });
    }

    function animate() {
      time += 0.02;
      updateWaveData();
      draw();
      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {(loading || (projects.length == 0)) ? (
        <ProjectsSkeleton />
      ) : (
        <section id="projects-section" className="py-16 relative overflow-hidden min-h-screen">
          {/* Wave Background - Fixed positioning */}
          <div className="absolute top-0 left-0 w-full h-full  z-0">
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
              style={{ background: "transparent" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/80 to-gray-50/80 backdrop-blur-sm" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Fixed title positioning */}
            <motion.h1 
              className="text-5xl font-bold text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Projects
              </span>
            </motion.h1>

            <div className="grid gap-8 sm:grid-cols-2">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  viewport={{ once: true }}
                  className="relative border border-indigo-300 overflow-hidden rounded-2xl flex flex-col bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-4 flex justify-center relative">
                    <div className="w-full h-48 rounded-xl border border-indigo-200 overflow-hidden relative bg-gradient-to-br from-indigo-50 to-purple-50">
                      <Image
                        src={project.data.image as string}
                        alt={project.data.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 opacity-20">
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundImage:
                              "linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px)",
                            backgroundSize: "15px 15px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
                  <div className="p-4 flex flex-col flex-grow">
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-gray-600 rounded-full text-xs font-medium mb-3 border border-indigo-200">
                      {project.data.stack}
                    </span>
                    <h3 className="text-lg font-medium text-indigo-600 mb-2">{project.data.title}</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed text-sm flex-grow">
                      {project.data.description}
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      <a
                        href={project.data.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 transition flex items-center text-xs font-medium bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-200"
                      >
                        Live Demo
                        <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 12H19M19 12L12 5M19 12L12 19"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                      <a
                        href={project.data.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 transition flex items-center text-xs font-medium bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-200"
                      >
                        Code
                        <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 12H19M19 12L12 5M19 12L12 19"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

function ProjectsSkeleton() {
  return (
    <section
      id="projects-section"
      className="min-h-screen w-full flex flex-col items-center gap-8 sm:px-40 py-16 p-4 relative overflow-hidden"
    >
      {/* Skeleton Wave Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden bg-gradient-to-b from-indigo-50/80 to-gray-50/80 z-0" />
      
      {/* Updated skeleton title style */}
      <motion.h1 
        className="text-5xl font-bold text-center mb-12 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Projects
        </span>
      </motion.h1>

      {/* Skeleton Project Grid */}
      <div className="w-full grid gap-8 sm:grid-cols-2 relative z-10">
        {[...Array(2)].map((_, index) => (
          <div
            key={index}
            className="relative border border-indigo-300 overflow-hidden rounded-2xl flex flex-col bg-white/90 backdrop-blur-sm shadow-lg animate-pulse"
          >
            <div className="p-4 flex justify-center relative">
              <div className="w-full h-48 rounded-xl border border-indigo-200 overflow-hidden relative bg-gradient-to-br from-indigo-50 to-purple-50 bg-gray-300" />
            </div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
            <div className="p-4 flex flex-col flex-grow">
              <div className="h-6 bg-indigo-100/50 rounded-full w-1/3 mb-3" />
              <div className="h-5 bg-indigo-100/50 rounded w-2/3 mb-2" />
              <div className="space-y-2 flex-grow mb-4">
                <div className="h-3 bg-indigo-100/50 rounded w-full" />
                <div className="h-3 bg-indigo-100/50 rounded w-5/6" />
                <div className="h-3 bg-indigo-100/50 rounded w-2/3" />
              </div>
              <div className="flex justify-between items-center mt-auto">
                <div className="h-8 bg-indigo-100/50 rounded-lg w-2/5" />
                <div className="h-8 bg-indigo-100/50 rounded-lg w-2/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}