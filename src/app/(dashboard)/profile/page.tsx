import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Image from "next/image";

const ProfilePage = async () => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const user = await currentUser();

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

  let userData: any = null;

  try {
    // Fetch user data based on role
    if (role === "student") {
      userData = await prisma.student.findUnique({
        where: { id: userId },
        include: {
          class: true,
          grade: true,
          parent: true,
        },
      });
    } else if (role === "teacher") {
      userData = await prisma.teacher.findUnique({
        where: { id: userId },
        include: {
          subjects: true,
          _count: {
            select: { lessons: true, classes: true },
          },
        },
      });
    } else if (role === "parent") {
      userData = await prisma.parent.findUnique({
        where: { id: userId },
        include: {
          students: {
            include: {
              class: true,
              grade: true,
            },
          },
        },
      });
    } else if (role === "admin") {
      userData = await prisma.admin.findUnique({
        where: { id: userId },
      });
      // Add full name for admin
      if (userData) {
        userData.name = "Admin";
        userData.surname = "User";
      }
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold">My Profile</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Picture and Basic Info */}
        <div className="w-full md:w-1/3">
          <div className="bg-lamaSkyLight p-6 rounded-lg flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200">
              {userData?.img || user?.imageUrl ? (
                <Image
                  src={userData?.img || user?.imageUrl || "/avatar.png"}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-4xl font-bold">
                  {userData?.name?.[0] || "U"}
                </div>
              )}
            </div>
            <h2 className="text-xl font-semibold">
              {userData?.name} {userData?.surname}
            </h2>
            <p className="text-sm text-gray-500 uppercase">{role}</p>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="w-full md:w-2/3">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium">{userData?.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{userData?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{userData?.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{userData?.address || "N/A"}</p>
              </div>

              {role === "student" && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Blood Type</p>
                    <p className="font-medium">{userData?.bloodType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{userData?.sex}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Birthday</p>
                    <p className="font-medium">
                      {userData?.birthday
                        ? new Date(userData.birthday).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Class</p>
                    <p className="font-medium">{userData?.class?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Grade</p>
                    <p className="font-medium">
                      Grade {userData?.grade?.level}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Parent</p>
                    <p className="font-medium">
                      {userData?.parent?.name} {userData?.parent?.surname}
                    </p>
                  </div>
                </>
              )}

              {role === "teacher" && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Blood Type</p>
                    <p className="font-medium">{userData?.bloodType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{userData?.sex}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Birthday</p>
                    <p className="font-medium">
                      {userData?.birthday
                        ? new Date(userData.birthday).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Lessons</p>
                    <p className="font-medium">{userData?._count?.lessons}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Subjects</p>
                    <p className="font-medium">
                      {userData?.subjects?.map((s: any) => s.name).join(", ") ||
                        "N/A"}
                    </p>
                  </div>
                </>
              )}

              {role === "parent" && userData?.students && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-2">Children</p>
                  <div className="space-y-2">
                    {userData.students.map((student: any) => (
                      <div
                        key={student.id}
                        className="p-3 bg-gray-50 rounded-md"
                      >
                        <p className="font-medium">
                          {student.name} {student.surname}
                        </p>
                        <p className="text-sm text-gray-600">
                          {student.class?.name} - Grade {student.grade?.level}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
