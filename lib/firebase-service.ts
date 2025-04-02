import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { getFirestoreInstance } from "./firebase-config";
import type { Trip } from "./types";

// Save a new trip
export async function saveTrip(tripData: Omit<Trip, "id" | "createdAt">): Promise<string> {
  const db = getFirestoreInstance();
  const tripsCollection = collection(db, "trips");

  // Sanitize tripData to remove undefined values and ensure JSON compatibility
  const sanitizedData = JSON.parse(JSON.stringify(tripData));
  const payload = {
    ...sanitizedData,
    createdAt: serverTimestamp(), // Firestore timestamp
  };

  console.log("Saving trip with payload:", payload); // Debug log

  try {
    const docRef = await addDoc(tripsCollection, payload);
    console.log("Trip saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving trip to Firestore:", error);
    throw new Error("Failed to save trip. Please try again.");
  }
}

// Get all trips for a user
export async function getUserTrips(userId: string): Promise<Trip[]> {
  const db = getFirestoreInstance();
  const tripsCollection = collection(db, "trips");

  const q = query(
    tripsCollection,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Trip
  );
}

// Get a specific trip by ID
export async function getTripById(
  userId: string,
  tripId: string
): Promise<Trip | null> {
  const db = getFirestoreInstance();
  const tripDoc = doc(db, "trips", tripId);

  const docSnap = await getDoc(tripDoc);

  if (docSnap.exists() && docSnap.data().userId === userId) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Trip;
  }

  return null;
}

// Delete a trip
export async function deleteTrip(userId: string, tripId: string): Promise<void> {
  const db = getFirestoreInstance();
  const tripDoc = doc(db, "trips", tripId);

  const docSnap = await getDoc(tripDoc);

  if (docSnap.exists() && docSnap.data().userId === userId) {
    await deleteDoc(tripDoc);
  } else {
    throw new Error("Trip not found or you do not have permission to delete it");
  }
}