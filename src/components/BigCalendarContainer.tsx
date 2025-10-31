import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalender";
import { generateRecurringLessons } from "@/lib/utils";

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

  const lessons = dataRes.map((lesson) => ({
    title: lesson.name,
    start: lesson.startTime,
    end: lesson.endTime,
    subject: lesson.subject.name,
    class: lesson.class.name,
    teacher: `${lesson.teacher.name} ${lesson.teacher.surname}`,
    day: lesson.day,
  }));

  // Generate recurring lessons for the next 12 weeks (full semester)
  const recurringLessons = generateRecurringLessons(lessons, 12);

  // Merge the recurring times with the lesson details
  const data = recurringLessons.map((recurringLesson, index) => {
    const originalLesson = lessons[index % lessons.length];
    return {
      ...originalLesson,
      start: recurringLesson.start,
      end: recurringLesson.end,
    };
  });

  return (
    <div className="h-full overflow-hidden">
      <BigCalendar data={data} />
    </div>
  );
};

export default BigCalendarContainer;
