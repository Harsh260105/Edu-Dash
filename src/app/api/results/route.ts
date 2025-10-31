import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const examId = searchParams.get("examId");
    const assignmentId = searchParams.get("assignmentId");

    if (!examId && !assignmentId) {
      return NextResponse.json(
        { error: "Either examId or assignmentId is required" },
        { status: 400 }
      );
    }

    // Build the where clause
    const where: any = {};
    if (examId) {
      where.examId = parseInt(examId);
    }
    if (assignmentId) {
      where.assignmentId = parseInt(assignmentId);
    }

    // If teacher, only show results for their exams/assignments
    if (role === "teacher") {
      if (examId) {
        // Verify teacher owns this exam
        const exam = await prisma.exam.findFirst({
          where: {
            id: parseInt(examId),
            lesson: {
              teacherId: userId,
            },
          },
        });
        if (!exam) {
          return NextResponse.json(
            { error: "You don't have access to this exam" },
            { status: 403 }
          );
        }
      }
      if (assignmentId) {
        // Verify teacher owns this assignment
        const assignment = await prisma.assignment.findFirst({
          where: {
            id: parseInt(assignmentId),
            lesson: {
              teacherId: userId,
            },
          },
        });
        if (!assignment) {
          return NextResponse.json(
            { error: "You don't have access to this assignment" },
            { status: 403 }
          );
        }
      }
    }

    // Fetch existing results
    const results = await prisma.result.findMany({
      where,
      select: {
        studentId: true,
        score: true,
      },
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}
