"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { searchPlaces } from "@/lib/places-api"
import Image from "next/image"
import { useDestination } from "@/lib/destination-context"
import { motion, AnimatePresence } from "framer-motion"

type Place = {
  id: string
  name: string
  imageUrl: string
}

export default function SearchDestination() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialDestination = searchParams.get("destination") || ""

  const [query, setQuery] = useState(initialDestination)
  const [places, setPlaces] = useState<Place[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { setDestination } = useDestination()

  // Handle click outside to close results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Set initial destination from URL if present
  useEffect(() => {
    if (initialDestination) {
      setDestination(initialDestination)
    }
  }, [initialDestination, setDestination])

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setShowResults(true)

    try {
      const results = await searchPlaces(query)
      setPlaces(results)
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Could not load destination suggestions. Please try again.",
        variant: "destructive",
      })
      setPlaces([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectPlace = (place: Place) => {
    setQuery(place.name)
    setShowResults(false)
    setDestination(place.name)

    // Update URL with selected destination
    router.push(`/?destination=${encodeURIComponent(place.name)}`)

    toast({
      title: "Destination selected",
      description: `You've selected ${place.name}. Now customize your trip details below.`,
    })
  }

  return (
    <motion.div
      className="my-12 py-8 px-4 sm:p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-border/50"
      id="search-destination"
      ref={searchRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.h2
        className="text-2xl sm:text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Where in India do you want to go?
      </motion.h2>
      <div className="relative max-w-3xl mx-auto">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for a destination in India..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 py-6 text-lg"
              onFocus={() => query && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={isLoading} size="lg" className="px-6">
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search
              </>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="absolute z-10 w-full mt-1 max-h-80 overflow-auto">
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-sm text-muted-foreground">Searching destinations...</p>
                    </div>
                  ) : places.length > 0 ? (
                    <ul className="divide-y">
                      {places.map((place) => (
                        <motion.li
                          key={place.id}
                          className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer transition-colors"
                          onClick={() => handleSelectPlace(place)}
                          whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                        >
                          <div className="relative h-12 w-12 rounded-md overflow-hidden">
                            <Image
                              src={place.imageUrl || "/placeholder.svg"}
                              alt={place.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span>{place.name}</span>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="p-4 text-center text-muted-foreground">
                      No destinations found. Try another search term.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

