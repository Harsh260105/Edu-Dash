import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (role !== "teacher" && role !== "admin") {
      return NextResponse.json(
        { error: "Only teachers and admins can take attendance" },
        { status: 403 }
      );
    }

    const { attendance } = await request.json();

    if (!Array.isArray(attendance) || attendance.length === 0) {
      return NextResponse.json(
        { error: "Attendance array is required" },
        { status: 400 }
      );
    }

    // Validate each attendance record
    for (const record of attendance) {
      if (
        !record.studentId ||
        !record.lessonId ||
        typeof record.present !== "boolean"
      ) {
        return NextResponse.json(
          { error: "Invalid attendance data" },
          { status: 400 }
        );
      }
    }

    // If teacher, verify they teach this lesson
    if (role === "teacher") {
      const lessonIds = Array.from(new Set(attendance.map((a) => a.lessonId)));
      for (const lessonId of lessonIds) {
        const lesson = await prisma.lesson.findFirst({
          where: {
            id: lessonId,
            teacherId: userId,
          },
        });

        if (!lesson) {
          return NextResponse.json(
            { error: "You can only take attendance for your lessons" },
            { status: 403 }
          );
        }
      }
    }

    // Use a transaction to save all attendance records
    const savedAttendance = await prisma.$transaction(async (tx) => {
      const results = [];

      for (const record of attendance) {
        // Check if attendance already exists for this student-lesson-date combination
        const existingAttendance = await tx.attendance.findFirst({
          where: {
            studentId: record.studentId,
            lessonId: record.lessonId,
            date: {
              gte: new Date(new Date().toDateString()), // Start of today
              lt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // End of today
            },
          },
        });

        if (existingAttendance) {
          // Update existing record
          const updated = await tx.attendance.update({
            where: { id: existingAttendance.id },
            data: { present: record.present },
          });
          results.push(updated);
        } else {
          // Create new record
          const created = await tx.attendance.create({
            data: {
              studentId: record.studentId,
              lessonId: record.lessonId,
              present: record.present,
              date: new Date(),
            },
          });
          results.push(created);
        }
      }

      return results;
    });

    return NextResponse.json({
      success: true,
      message: `Saved ${savedAttendance.length} attendance records successfully`,
      attendance: savedAttendance,
    });
  } catch (error) {
    console.error("Attendance creation error:", error);
    return NextResponse.json(
      { error: "Failed to save attendance" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");
    const studentId = searchParams.get("studentId");
    const date = searchParams.get("date");

    const where: any = {};

    if (lessonId) where.lessonId = parseInt(lessonId);
    if (studentId) where.studentId = studentId;
    if (date) {
      const searchDate = new Date(date);
      where.date = {
        gte: new Date(
          searchDate.getFullYear(),
          searchDate.getMonth(),
          searchDate.getDate()
        ),
        lt: new Date(
          searchDate.getFullYear(),
          searchDate.getMonth(),
          searchDate.getDate() + 1
        ),
      };
    }

    // Role-based filtering
    if (role === "teacher") {
      where.lesson = { teacherId: userId };
    } else if (role === "student") {
      where.studentId = userId;
    } else if (role === "parent") {
      where.student = { parentId: userId };
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        student: { select: { name: true, surname: true } },
        lesson: {
          include: {
            class: { select: { name: true } },
            teacher: { select: { name: true, surname: true } },
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}
