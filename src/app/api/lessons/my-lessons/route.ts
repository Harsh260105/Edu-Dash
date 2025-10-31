import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (role !== "teacher" && role !== "admin") {
      return NextResponse.json(
        { error: "Only teachers and admins can access lessons" },
        { status: 403 }
      );
    }

    // Get current date and time
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Map JavaScript day to database day enum
    const dayMap: { [key: number]: string } = {
      0: "SUNDAY",
      1: "MONDAY",
      2: "TUESDAY",
      3: "WEDNESDAY",
      4: "THURSDAY",
      5: "FRIDAY",
      6: "SATURDAY",
    };

    const today = dayMap[currentDay];

    let lessons;

    if (role === "teacher") {
      // Get all teacher's lessons (not just today, so they can take attendance anytime)
      lessons = await prisma.lesson.findMany({
        where: {
          teacherId: userId,
        },
        include: {
          class: { select: { name: true } },
          subject: { select: { name: true } },
        },
        orderBy: [{ day: "asc" }, { startTime: "asc" }],
      });
    } else {
      // Admin can see all lessons
      lessons = await prisma.lesson.findMany({
        include: {
          class: { select: { name: true } },
          subject: { select: { name: true } },
          teacher: { select: { name: true, surname: true } },
        },
        orderBy: [{ day: "asc" }, { startTime: "asc" }],
      });
    }

    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
