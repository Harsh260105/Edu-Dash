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

    const lessonId = parseInt(params.id);
    if (isNaN(lessonId)) {
      return NextResponse.json({ error: "Invalid lesson ID" }, { status: 400 });
    }

    // Fetch the lesson
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        class: { select: { id: true, name: true } },
        subject: { select: { name: true } },
        teacher: { select: { name: true, surname: true } },
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Check if user has access to this lesson
    if (role === "teacher" && lesson.teacherId !== userId) {
      return NextResponse.json(
        { error: "You don't have access to this lesson" },
        { status: 403 }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson" },
      { status: 500 }
    );
  }
}
