"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const handleSignOut = async () => {
      await signOut();
      router.push("/sign-in");
    };

    handleSignOut();
  }, [signOut, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">
          Signing you out...
        </h2>
        <p className="text-gray-500 mt-2">Please wait</p>
      </div>
    </div>
  );
}
