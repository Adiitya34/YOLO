"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Wallet, Users, Save, BarChart3 } from "lucide-react"

const features = [
  {
    icon: <MapPin className="h-10 w-10 text-primary" />,
    title: "Smart Destination Search",
    description: "Find the perfect Indian destination with our intelligent search and suggestions system.",
  },
  {
    icon: <Calendar className="h-10 w-10 text-primary" />,
    title: "Personalized Itineraries",
    description: "Get day-by-day plans tailored to your preferences, duration, and travel style.",
  },
  {
    icon: <Wallet className="h-10 w-10 text-primary" />,
    title: "Budget Optimization",
    description: "Plan your trip according to your budget with accurate cost estimates and options.",
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: "Traveler Type Matching",
    description: "Whether solo, couple, family, or friends, get recommendations that match your group.",
  },
  {
    icon: <Save className="h-10 w-10 text-primary" />,
    title: "Save & Revisit",
    description: "Save your trip plans to your account and access them anytime, anywhere.",
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-primary" />,
    title: "Trip Comparison",
    description: "Compare different trip options side by side to make the best choice for your adventure.",
  },
]

export default function Features() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose YOLOtrippin</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform makes planning your Indian adventure simple, personalized, and stress-free
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full border-border/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-2">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

