import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { getFirestoreInstance } from "./firebase-config";
import type { Trip } from "./types";
import { getStaticImage } from "./utils";

// Save a new trip
export async function saveTrip(tripData: Omit<Trip, "id" | "createdAt">): Promise<string> {
  const db = getFirestoreInstance();
  const userId = tripData.userId;
  const tripsCollection = collection(db, `users/${userId}/trips`);

  // Use static image if imageUrl is missing
  const imageUrl = tripData.imageUrl || getStaticImage(tripData.destination);

  const sanitizedData = JSON.parse(
    JSON.stringify({
      ...tripData,
      imageUrl, // Include imageUrl
    })
  );
  const payload = {
    ...sanitizedData,
    createdAt: serverTimestamp(),
  };

  console.log("Saving trip with payload:", payload);

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
  const tripsCollection = collection(db, `users/${userId}/trips`);

  const q = query(tripsCollection, orderBy("createdAt", "desc"));

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Trip
    );
  } catch (error) {
    console.error("Error fetching user trips:", error);
    throw new Error("Failed to fetch trips.");
  }
}

// Get a specific trip by ID
export async function getTripById(userId: string, tripId: string): Promise<Trip | null> {
  const db = getFirestoreInstance();
  const tripDoc = doc(db, `users/${userId}/trips`, tripId);

  try {
    const docSnap = await getDoc(tripDoc);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Trip;
    }
    return null;
  } catch (error) {
    console.error("Error fetching trip by ID:", error);
    return null;
  }
}

// Delete a trip
export async function deleteTrip(userId: string, tripId: string): Promise<void> {
  const db = getFirestoreInstance();
  const tripDoc = doc(db, `users/${userId}/trips`, tripId);

  try {
    const docSnap = await getDoc(tripDoc);
    if (docSnap.exists()) {
      await deleteDoc(tripDoc);
    } else {
      throw new Error("Trip not found.");
    }
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw new Error("Failed to delete trip.");
  }
}