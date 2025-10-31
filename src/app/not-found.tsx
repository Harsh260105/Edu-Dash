"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-500">404</h1>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. The
          page might have been moved or doesn&apos;t exist.
        </p>
        <div className="space-x-4">
          <Link
            href="/"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md transition duration-200"
          >
            Go to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-md transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
