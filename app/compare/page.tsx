import { Suspense } from "react"
import TripComparison from "@/components/trip-comparison"
import AuthCheck from "@/components/auth-check"
import { Toaster } from "@/components/ui/toaster"

export default function ComparePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">Compare Trips</h1>
      <AuthCheck>
        <Suspense fallback={<div className="text-center">Loading comparison tool...</div>}>
          <TripComparison />
        </Suspense>
      </AuthCheck>
    </main>
  )
}

