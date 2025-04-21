import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Timestamp } from "firebase/firestore";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(dateInput: string | Timestamp | Date | null | undefined): string {
  if (!dateInput) {
    return "N/A";
  }

  let date: Date;
  if (dateInput instanceof Timestamp) {
    date = dateInput.toDate();
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function getStaticImage(destination: string): string {
  const imageMap: { [key: string]: string } = {
    agra: "/images/agra.jpg",
    goa: "/images/goa.jpg",
    jaipur: "/images/jaipur.jpg",
    kerala: "/images/kerala.jpg",
    udaipur: "/images/udaipur.jpg",
    varanasi: "/images/varanasi.jpg",
  };
  return imageMap[destination.toLowerCase()] || "/placeholder.jpg";
}