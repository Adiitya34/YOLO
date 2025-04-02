"use client"
import { motion } from "framer-motion"
import DestinationCard from "./destination-card"

export default function PopularDestinations() {
  // Add descriptions to destinations
  const destinationsWithDescriptions = [
    {
      id: "1",
      name: "Agra",
      imageUrl: "/placeholder.svg?height=300&width=400",
      description: "Home to the iconic Taj Mahal, a testament to eternal love",
    },
    {
      id: "2",
      name: "Jaipur",
      imageUrl: "/placeholder.svg?height=300&width=400",
      description: "The Pink City with majestic palaces and vibrant bazaars",
    },
    {
      id: "3",
      name: "Goa",
      imageUrl: "/placeholder.svg?height=300&width=400",
      description: "Sun-kissed beaches and vibrant nightlife on the Arabian Sea",
    },
    {
      id: "6",
      name: "Varanasi",
      imageUrl: "/placeholder.svg?height=300&width=400",
      description: "Ancient spiritual city on the banks of the sacred Ganges",
    },
    {
      id: "7",
      name: "Kerala",
      imageUrl: "/placeholder.svg?height=300&width=400",
      description: "Serene backwaters and lush landscapes in God's Own Country",
    },
    {
      id: "8",
      name: "Udaipur",
      imageUrl: "/placeholder.svg?height=300&width=400",
      description: "The City of Lakes with romantic palaces and rich heritage",
    },
  ]

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Destinations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore India's most beloved destinations, each offering unique experiences and unforgettable memories
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinationsWithDescriptions.map((destination, index) => (
            <DestinationCard
              key={destination.id}
              id={destination.id}
              name={destination.name}
              imageUrl={destination.imageUrl}
              description={destination.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

