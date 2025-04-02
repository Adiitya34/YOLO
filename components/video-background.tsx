"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ImageBackgroundProps {
  imageSrc: string
  overlayOpacity?: number
  children?: React.ReactNode
}

export default function ImageBackground({ 
  imageSrc = "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0", 
  
  // ✅ Replace with a direct image URL
  // https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0
  overlayOpacity = 0.5, 
  children 
}: ImageBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      <motion.div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${imageSrc})`, 
          scale, 
          opacity 
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />
      </motion.div>

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
