import { Suspense } from "react"
import SavedTrips from "@/components/saved-trips"
import AuthCheck from "@/components/auth-check"
import { Toaster } from "@/components/ui/toaster"

export default function TripsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">Your Saved Trips</h1>
      <AuthCheck>
        <Suspense fallback={<div className="text-center">Loading your trips...</div>}>
          <SavedTrips />
        </Suspense>
      </AuthCheck>
    </main>
  )
}

