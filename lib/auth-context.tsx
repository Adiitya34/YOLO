"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { initializeFirebase, auth } from "./firebase-config"; // Import auth instance
import { useToast } from "@/components/ui/use-toast";

// Initialize Firebase
initializeFirebase();

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  emailSignIn: (email: string, password: string) => Promise<void>;
  emailSignUp: (email: string, password: string) => Promise<void>;
  authError: string | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  emailSignIn: async () => {},
  emailSignUp: async () => {},
  authError: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      setAuthError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Error signing in:", error);
      if (error.code === "auth/unauthorized-domain") {
        const errorMessage =
          "This domain is not authorized for authentication. Please add it to your Firebase console or use email sign-in instead.";
        setAuthError(errorMessage);
        toast({
          title: "Authentication Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        setAuthError(error.message || "Failed to sign in");
        toast({
          title: "Authentication Error",
          description: error.message || "Failed to sign in",
          variant: "destructive",
        });
      }
    }
  };

  const emailSignIn = async (email: string, password: string) => {
    try {
      setAuthError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Error signing in with email:", error);
      setAuthError(error.message || "Failed to sign in");
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to sign in with email",
        variant: "destructive",
      });
    }
  };

  const emailSignUp = async (email: string, password: string) => {
    try {
      setAuthError(null);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Error signing up with email:", error);
      setAuthError(error.message || "Failed to sign up");
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        emailSignIn,
        emailSignUp,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);