import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Timestamp } from "firebase/firestore";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(dateInput: string | Timestamp | Date | null | undefined): string {
  if (!dateInput) {
    return "N/A"; // Handle null or undefined
  }

  let date: Date;
  if (dateInput instanceof Timestamp) {
    date = dateInput.toDate(); // Convert Firestore Timestamp to Date
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    date = new Date(dateInput); // Assume string
  }

  if (isNaN(date.getTime())) {
    return "Invalid Date"; // Handle invalid dates
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}