"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { MapPin } from "lucide-react"

interface DestinationCardProps {
  id: string
  name: string
  imageUrl: string
  description?: string
  index: number
}

export default function DestinationCard({ id, name, imageUrl, description, index }: DestinationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
      className="group cursor-pointer"
    >
      <Link href={`/?destination=${encodeURIComponent(name)}`}>
        <div className="relative overflow-hidden rounded-xl">
          <div className="aspect-[4/3] relative">
            <Image
              src={imageUrl || "/placeholder.svg?height=300&width=400"}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-center gap-1 mb-1">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">India</span>
            </div>
            <h3 className="text-xl font-bold">{name}</h3>
            {description && <p className="text-sm text-white/80 mt-1 line-clamp-2">{description}</p>}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

