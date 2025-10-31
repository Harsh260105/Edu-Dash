import { auth } from "@clerk/nextjs/server";

const MessagesPage = async () => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!userId) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-red-600">
          Authentication Error
        </h1>
        <p>Please log in to access this page.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold">Messages</h1>
      </div>

      <div className="text-center py-16">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Messages Feature Coming Soon
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          The messaging system is currently under development. You&apos;ll be
          able to communicate with teachers, students, and parents soon.
        </p>
      </div>
    </div>
  );
};

export default MessagesPage;
