import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Day } from "@prisma/client";

export const dynamic = "force-dynamic";

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

    // Map JavaScript day to database day enum (only weekdays)
    const dayMap: { [key: number]: Day | null } = {
      0: null, // Sunday
      1: Day.MONDAY,
      2: Day.TUESDAY,
      3: Day.WEDNESDAY,
      4: Day.THURSDAY,
      5: Day.FRIDAY,
      6: null, // Saturday
    };

    const today = dayMap[currentDay];

    // If today is weekend, return empty array
    if (!today) {
      return NextResponse.json([]);
    }

    let lessons;

    if (role === "teacher") {
      // Get only today's lessons for the teacher
      lessons = await prisma.lesson.findMany({
        where: {
          teacherId: userId,
          day: today,
        },
        include: {
          class: { select: { name: true } },
          subject: { select: { name: true } },
        },
        orderBy: [{ startTime: "asc" }],
      });
    } else {
      // Admin can see all today's lessons
      lessons = await prisma.lesson.findMany({
        where: {
          day: today,
        },
        include: {
          class: { select: { name: true } },
          subject: { select: { name: true } },
          teacher: { select: { name: true, surname: true } },
        },
        orderBy: [{ startTime: "asc" }],
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
