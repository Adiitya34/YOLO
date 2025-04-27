  "use client";

  import { Button } from "@/components/ui/button";
  import Link from "next/link";
  import { motion } from "framer-motion";
  import VideoBackground from "./video-background";

  export default function Hero() {
    const container = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2,
          delayChildren: 0.3,
        },
      },
    };

    const item = {
      hidden: { y: 20, opacity: 0 },
      show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
    };

    return (
      <VideoBackground videoSrc="https://ibb.co/3yNTh7bT" overlayOpacity={0.6}>
        <div className="min-h-[90vh] flex items-center justify-center">
          <div className="container mx-auto px-4 text-center py-24 md:py-32">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="max-w-4xl mx-auto"
            >
              <motion.div variants={item}>
                <h1 className="text-4xl md:text-7xl font-bold mb-6 text-white leading-tight">
                  Discover the Magic of <span className="text-primary">India</span>
                </h1>
              </motion.div>

              <motion.div variants={item}>
                <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
                  AI-powered personalized trip planning for your perfect Indian adventure
                </p>
              </motion.div>

              <motion.div
                variants={item}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button size="lg" className="text-lg px-8 py-6" asChild>
                  <Link href="#search-destination">Plan Your Trip</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/30"
                  asChild
                >
                  <Link href="/trips">View Saved Trips</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </VideoBackground>
    );
  }
