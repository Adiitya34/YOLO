"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "./theme-toggle";
import { MapPin, Menu, X, LogIn, Mail, Instagram, Coffee } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, signIn, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <MapPin className="h-6 w-6 text-primary" />
          <span>YOLOtrippin</span>
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            {/* Instagram Button */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              aria-label="Follow us on Instagram"
            >
              <a
                href="https://www.instagram.com/adiitya.j/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Instagram className="h-6 w-6" />
                <span>Developer</span>
              </a>
            </Button>
            {/* Buy Me a Coffee Button */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              aria-label="Support us on Buy Me a Coffee"
            >
              <a
                href="https://www.buymeacoffee.com/adiitya"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <Coffee className="h-4 w-4" />
                <span>Support</span>
              </a>
            </Button>
          </div>
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/trips" className="hover:text-primary transition-colors">
            My Trips
          </Link>
          <Link href="/compare" className="hover:text-primary transition-colors">
            Compare
          </Link>
          <ThemeToggle />
          {user ? (
            <Button onClick={signOut} variant="outline">
              Sign Out
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>Sign In</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={signIn} className="cursor-pointer">
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Sign in with Google</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/?auth=email" className="cursor-pointer flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Sign in with Email</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden py-4 px-4 border-t bg-background/95 backdrop-blur-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col gap-4">
              {/* Instagram Button (Mobile) */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                aria-label="Follow us on Instagram"
                onClick={() => setIsMenuOpen(false)}
              >
                <a
                  href="https://www.instagram.com/adiitya.j/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Instagram className="h-5 w-5" />
                  Follow on Instagram
                </a>
              </Button>
              {/* Buy Me a Coffee Button (Mobile) */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                aria-label="Support us on Buy Me a Coffee"
                onClick={() => setIsMenuOpen(false)}
              >
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Coffee className="h-5 w-5" />
                  Buy Me a Coffee
                </a>
              </Button>
              <Link href="/" className="hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link href="/trips" className="hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                My Trips
              </Link>
              <Link
                href="/compare"
                className="hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Compare
              </Link>
              <div className="flex items-center justify-between">
                <ThemeToggle />
                {user ? (
                  <Button onClick={signOut} variant="outline">
                    Sign Out
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={signIn} variant="outline" size="sm">
                      <LogIn className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/?auth=email" onClick={() => setIsMenuOpen(false)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}