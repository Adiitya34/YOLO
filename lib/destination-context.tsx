"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

type DestinationContextType = {
  destination: string
  setDestination: (destination: string) => void
}

const DestinationContext = createContext<DestinationContextType>({
  destination: "",
  setDestination: () => {},
})

export function DestinationProvider({ children }: { children: React.ReactNode }) {
  const [destination, setDestination] = useState("")

  return <DestinationContext.Provider value={{ destination, setDestination }}>{children}</DestinationContext.Provider>
}

export const useDestination = () => useContext(DestinationContext)

