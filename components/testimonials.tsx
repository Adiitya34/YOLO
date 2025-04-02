"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Solo Traveler",
    content:
      "YOLOtrippin made my solo trip to Varanasi so easy to plan. The AI-generated itinerary was spot-on with my interests in spirituality and local cuisine. I discovered hidden gems I would have never found on my own!",
  },
  {
    id: 2,
    name: "Raj and Meera Patel",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Couple",
    content:
      "We used YOLOtrippin to plan our honeymoon in Kerala. The personalized recommendations for romantic spots and activities made our trip truly special. The budget estimates were accurate and helped us plan our expenses.",
  },
  {
    id: 3,
    name: "The Singh Family",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Family Trip",
    content:
      "Planning a family trip with kids can be challenging, but YOLOtrippin made it simple. Our Rajasthan itinerary had the perfect mix of historical sites for adults and fun activities for children. Highly recommended!",
  },
  {
    id: 4,
    name: "Arjun Mehta",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Adventure Seeker",
    content:
      "As someone who loves adventure, I was impressed by how well YOLOtrippin understood my preferences. My Rishikesh trip was packed with thrilling activities like white water rafting and trekking. Can't wait to plan my next adventure!",
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-muted/30 dark:from-gray-900 dark:to-gray-800/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Travelers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real experiences from travelers who planned their Indian adventures with YOLOtrippin
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm"
              onClick={prevTestimonial}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous</span>
            </Button>
          </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm"
              onClick={nextTestimonial}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next</span>
            </Button>
          </div>

          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-border/50 shadow-lg">
              <CardContent className="p-8">
                <Quote className="h-10 w-10 text-primary/30 mb-4" />
                <p className="text-lg mb-6 italic">{testimonials[currentIndex].content}</p>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonials[currentIndex].avatar} alt={testimonials[currentIndex].name} />
                    <AvatarFallback>{testimonials[currentIndex].name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{testimonials[currentIndex].name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-primary w-6" : "bg-muted-foreground/30"
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

