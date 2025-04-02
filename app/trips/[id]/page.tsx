import TripDetails from "@/components/trip-details";

export default async function TripDetailsPage({ params }: { params: { id: string } }) {
  return <TripDetails id={params.id} />;
} 