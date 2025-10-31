import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalender";

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  const dataRes = await prisma.lesson.findMany({
    where: {
      ...(type === "teacherId"
        ? { teacherId: id as string }
        : { classId: id as number }),
    },
    include: {
      subject: { select: { name: true } },
      class: { select: { name: true } },
      teacher: { select: { name: true, surname: true } },
    },
  });

  const data = dataRes.map((lesson) => ({
    title: lesson.name,
    start: lesson.startTime,
    end: lesson.endTime,
    subject: lesson.subject.name,
    class: lesson.class.name,
    teacher: `${lesson.teacher.name} ${lesson.teacher.surname}`,
    day: lesson.day,
  }));

  // Show lessons on their actual scheduled dates instead of adjusting to current week
  return (
    <div className="h-full">
      <BigCalendar data={data} />
    </div>
  );
};

export default BigCalendarContainer;
