import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import BulkGradingInterface from "@/components/BulkGradingInterface";

export const dynamic = "force-dynamic";

const BulkGradingPage = async () => {
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

  if (role !== "teacher" && role !== "admin") {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p>You don&apos;t have permission to access this page.</p>
      </div>
    );
  }

  // Get teacher's classes and lessons
  let classes: any[] = [];
  let lessons: any[] = [];
  let exams: any[] = [];
  let assignments: any[] = [];

  try {
    if (role === "teacher") {
      // Get classes taught by this teacher (from lessons)
      const teacherLessons = await prisma.lesson.findMany({
        where: {
          teacherId: userId!,
        },
        include: {
          class: { select: { id: true, name: true } },
        },
      });

      // Extract unique classes from lessons
      const classMap = new Map();
      teacherLessons.forEach((lesson) => {
        if (!classMap.has(lesson.class.id)) {
          classMap.set(lesson.class.id, lesson.class);
        }
      });
      classes = Array.from(classMap.values());

      // Get lessons taught by this teacher
      lessons = await prisma.lesson.findMany({
        where: {
          teacherId: userId!,
        },
        include: {
          subject: { select: { name: true } },
          class: { select: { name: true } },
          teacher: { select: { name: true, surname: true } },
        },
      });

      // Get exams for teacher's lessons
      exams = await prisma.exam.findMany({
        where: {
          lesson: {
            teacherId: userId!,
          },
        },
        include: {
          lesson: {
            include: {
              subject: { select: { name: true } },
              class: { select: { name: true } },
              teacher: { select: { name: true, surname: true } },
            },
          },
        },
      });

      // Get assignments for teacher's lessons
      assignments = await prisma.assignment.findMany({
        where: {
          lesson: {
            teacherId: userId!,
          },
        },
        include: {
          lesson: {
            include: {
              subject: { select: { name: true } },
              class: { select: { name: true } },
              teacher: { select: { name: true, surname: true } },
            },
          },
        },
      });
    } else if (role === "admin") {
      // Admin can see all classes, lessons, exams, and assignments
      classes = await prisma.class.findMany({
        select: { id: true, name: true },
      });

      lessons = await prisma.lesson.findMany({
        include: {
          subject: { select: { name: true } },
          class: { select: { name: true } },
          teacher: { select: { name: true, surname: true } },
        },
      });

      exams = await prisma.exam.findMany({
        include: {
          lesson: {
            include: {
              subject: { select: { name: true } },
              class: { select: { name: true } },
              teacher: { select: { name: true, surname: true } },
            },
          },
        },
      });

      assignments = await prisma.assignment.findMany({
        include: {
          lesson: {
            include: {
              subject: { select: { name: true } },
              class: { select: { name: true } },
              teacher: { select: { name: true, surname: true } },
            },
          },
        },
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p>Failed to load data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bulk Grade Entry</h1>
        <p className="text-gray-600 mt-2">
          Efficiently grade multiple students at once for exams or assignments.
        </p>
      </div>

      <BulkGradingInterface
        classes={classes}
        lessons={lessons}
        exams={exams}
        assignments={assignments}
      />
    </div>
  );
};

export default BulkGradingPage;
