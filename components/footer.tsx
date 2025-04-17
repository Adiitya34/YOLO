"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { MapPin, Instagram, Twitter, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { getFirestoreInstance } from "@/lib/firebase-config"; // Updated import
import { collection, addDoc } from "firebase/firestore"; // Keep these imports

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      const db = getFirestoreInstance(); // Get Firestore instance
      await addDoc(collection(db, "subscribers"), {
        email,
        subscribedAt: new Date().toISOString(),
      });

      toast({
        title: "Subscribed!",
        description: "Thanks for joining our newsletter!",
      });
      setEmail(""); // Clear input
    } catch (error) {
      console.error("Error subscribing:", error);
      toast({
        title: "Subscription Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <footer className="border-t py-12 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <MapPin className="h-6 w-6 text-primary" />
              <span>YOLOtrippin</span>
            </Link>
            <p className="text-muted-foreground mb-4">AI-powered trip planning for your perfect Indian adventure.</p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/trips" className="text-muted-foreground hover:text-primary transition-colors">
                  My Trips
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-muted-foreground hover:text-primary transition-colors">
                  Compare Trips
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4">Popular Destinations</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/?destination=Goa" className="text-muted-foreground hover:text-primary transition-colors">
                  Goa
                </Link>
              </li>
              <li>
                <Link href="/?destination=Jaipur" className="text-muted-foreground hover:text-primary transition-colors">
                  Jaipur
                </Link>
              </li>
              <li>
                <Link href="/?destination=Kerala" className="text-muted-foreground hover:text-primary transition-colors">
                  Kerala
                </Link>
              </li>
              <li>
                <Link href="/?destination=Varanasi" className="text-muted-foreground hover:text-primary transition-colors">
                  Varanasi
                </Link>
              </li>
              <li>
                <Link href="/?destination=Darjeeling" className="text-muted-foreground hover:text-primary transition-colors">
                  Darjeeling
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-muted-foreground mb-4">Subscribe to receive travel tips and exclusive offers.</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-r-none"
                  required
                />
                <Button type="submit" className="rounded-l-none">
                  Subscribe
                </Button>
              </div>
            </form>
          </motion.div>
        </div>

        <motion.div
          className="mt-12 pt-6 border-t text-center text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p>© {new Date().getFullYear()} YOLOtrippin. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}