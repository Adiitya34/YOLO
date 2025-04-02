// app/page.tsx
import { Suspense } from "react";
import Hero from "@/components/hero";
import SearchDestination from "@/components/search-destination";
import TripForm from "@/components/trip-form";
import AuthCheck from "@/components/auth-check";
import { Toaster } from "@/components/ui/toaster";
import PopularDestinations from "@/components/popular-destinations";
import Features from "@/components/features";
import Testimonials from "@/components/testimonials";


export default function Home() {
  return (
    <main className="min-h-screen">
      <Toaster />
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div className="text-center">Loading search...</div>}>
          <SearchDestination />
        </Suspense>
        <AuthCheck>
          <TripForm />
        </AuthCheck>
      </div>
      <PopularDestinations />
      <Features />
      <Testimonials />
    </main>
  );
}