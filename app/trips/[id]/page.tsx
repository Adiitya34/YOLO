import TripDetails from "@/components/trip-details";

export default async function TripDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await params to fix the error
  return <TripDetails id={id} />;
}