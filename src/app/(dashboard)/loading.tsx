export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="relative">
          {/* Spinner */}
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>

          {/* Inner circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-8 w-8 bg-white rounded-full"></div>
          </div>
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-700">Loading...</h2>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while we fetch your data
        </p>
      </div>
    </div>
  );
}
