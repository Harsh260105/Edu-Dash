import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

const ParentPage = async () => {
  const { userId } = auth();
  const currentUserId = userId;

  const students = await prisma.student.findMany({
    where: {
      parentId: currentUserId!,
    },
  });

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT - Children's Schedules */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold mb-4">Children&apos;s Schedules</h1>

          {students.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No children found. Please contact the school administration.
            </div>
          ) : students.length === 1 ? (
            // Single child - show full calendar
            <div>
              <h2 className="text-lg font-medium mb-2">
                {students[0].name} {students[0].surname}&apos;s Schedule
              </h2>
              <BigCalendarContainer type="classId" id={students[0].classId} />
            </div>
          ) : (
            // Multiple children - show in tabs or grid
            <div className="space-y-6">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <h2 className="text-lg font-medium mb-2">
                    {student.name} {student.surname}&apos;s Schedule
                  </h2>
                  <div className="h-96 overflow-hidden rounded-md border">
                    <BigCalendarContainer type="classId" id={student.classId} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
