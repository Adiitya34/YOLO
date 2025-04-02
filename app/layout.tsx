// app/layout.tsx
import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AuthProvider } from "@/lib/auth-context";
import { DestinationProvider } from "@/lib/destination-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "YOLOtrippin         : )",
  description: "Plan your perfect trip to India with AI-generated itineraries",
  generator: "v0.dev",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning><body className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider>
          <DestinationProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </DestinationProvider>
        </AuthProvider>
      </ThemeProvider>
    </body></html>
  );
}