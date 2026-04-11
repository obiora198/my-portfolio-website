import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ZoomOut } from 'lucide-react'
import { useTheme } from '@/app/components/ThemeContext'

interface BlogGalleryProps {
  images: string[]
}

export function BlogGallery({ images }: BlogGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const { currentTheme } = useTheme()

  // Body Scroll Locking
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '8px' // Prevent layout shift
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0px'
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0px'
    }
  }, [selectedImage])

  if (!images || images.length === 0) return null

  const handleClose = () => {
    setSelectedImage(null)
    setIsZoomed(false)
  }

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsZoomed(!isZoomed)
  }

  return (
    <div className="mt-16 mb-8 text-left">
      <h3 className={`text-2xl font-bold mb-8 text-gray-900 dark:text-white border-l-4 ${currentTheme.primary.replace('text-', 'border-')} pl-4`}>
        Project Gallery
      </h3>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((src, index) => (
          <motion.div
            key={index}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 group shadow-md hover:shadow-xl transition-shadow duration-300"
            onClick={() => setSelectedImage(src)}
            whileHover={{ y: -5 }}
          >
            <Image
              src={src}
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="text-white bg-black/50 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                View Full Image
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for Full Image */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-start bg-black/80 p-4 md:p-8 backdrop-blur-xl overflow-hidden"
            onClick={handleClose}
          >
            {/* Toolbar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[10001] pointer-events-none">
              <div className="flex items-center gap-4 pointer-events-auto">
                <button
                  onClick={toggleZoom}
                  className="text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors backdrop-blur-md border border-white/20 flex items-center gap-2 px-4 shadow-xl"
                >
                  {isZoomed ? (
                    <ZoomOut className="w-5 h-5" />
                  ) : (
                    <ZoomIn className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">
                    {isZoomed ? 'Actual Size' : 'Fit to Screen'}
                  </span>
                </button>
              </div>

              <button
                className="text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors z-[10000] backdrop-blur-md border border-white/20 pointer-events-auto shadow-xl"
                onClick={handleClose}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Image Wrapper - Aligned to top */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`relative w-full h-full custom-scrollbar transition-all duration-300 flex justify-center overflow-auto pt-24 pb-12 items-start`}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`relative transition-all duration-300 w-auto h-auto flex items-start justify-center`}
                onClick={toggleZoom}
              >
                <img
                  src={selectedImage}
                  alt="Expanded view"
                  className={`block select-none transition-all duration-300 rounded-lg shadow-2xl ${
                    isZoomed
                      ? 'w-[1240px] max-w-none cursor-zoom-out'
                      : 'w-auto max-w-[95vw] max-h-[85vh] object-contain object-top cursor-zoom-in'
                  }`}
                  style={{
                    imageRendering: 'auto',
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  )
}
