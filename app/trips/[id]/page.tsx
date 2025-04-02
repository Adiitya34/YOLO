import { Suspense } from "react"
import TripDetails from "@/components/trip-details"
import AuthCheck from "@/components/auth-check"
import { Toaster } from "@/components/ui/toaster"

export default function TripDetailsPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-8">
      <Toaster />
      <AuthCheck>
        <Suspense fallback={<div className="text-center">Loading trip details...</div>}>
          <TripDetails id={params.id} />
        </Suspense>
      </AuthCheck>
    </main>
  )
}

