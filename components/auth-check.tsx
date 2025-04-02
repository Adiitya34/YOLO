"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn } from "lucide-react"
import EmailAuthForm from "./email-auth-form"

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { user, signIn, loading, authError } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <Card className="max-w-md mx-auto my-8">
        <CardHeader>
          <CardTitle>Sign in to continue</CardTitle>
          <CardDescription>You need to be signed in to plan and save trips</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Sign In button */}
          <Button onClick={signIn} className="w-full">
            <LogIn className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Email Authentication Form */}
          <EmailAuthForm />
        </CardContent>
      </Card>
    )
  }

  return <>{children}</>
}

