"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContextData } from "@/context/auth.context";
import { emailVerification } from "@/firebase/firebaseauth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseauth"; // Ensure you import your Firebase auth instance

export default function EmailVerification() {
    const { user } = AuthContextData()!;
    const router = useRouter();

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                // Check if the user's email is verified immediately after authentication
                if (currentUser.emailVerified) {
                    router.push("/"); // Redirect to home if email is verified
                }
            }
        });

       
        return () => unsubscribe();
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h3 className="text-2xl font-semibold text-center text-blue-600 mb-4">Email Verification Sent!</h3>
                <p className="text-gray-700 text-center mb-6">
                    Kindly verify your email to complete the registration process.
                </p>
                <p className="text-gray-600 text-sm text-center">
                    If you did not receive the email, check your spam folder or click{" "}
                    <button onClick={() => { emailVerification() }} className="text-blue-500 hover:underline">
                        here
                    </button> to resend.
                </p>
            </div>
        </div>
    );
}
