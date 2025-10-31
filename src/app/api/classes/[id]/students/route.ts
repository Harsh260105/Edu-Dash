import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const classId = parseInt(params.id);
    if (isNaN(classId)) {
      return NextResponse.json({ error: "Invalid class ID" }, { status: 400 });
    }

    // Check if user has access to this class
    if (role === "teacher") {
      // Verify teacher teaches this class
      const teacherClass = await prisma.lesson.findFirst({
        where: {
          teacherId: userId,
          classId: classId,
        },
      });

      if (!teacherClass) {
        return NextResponse.json(
          { error: "You don't have access to this class" },
          { status: 403 }
        );
      }
    }

    // Fetch students in the class
    const students = await prisma.student.findMany({
      where: {
        classId: classId,
      },
      select: {
        id: true,
        name: true,
        surname: true,
      },
      orderBy: [{ surname: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching class students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
