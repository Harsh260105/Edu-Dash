import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { results } = await request.json();

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json(
        { error: "Results array is required" },
        { status: 400 }
      );
    }

    // Validate each result
    for (const result of results) {
      if (!result.studentId || typeof result.score !== "number") {
        return NextResponse.json(
          { error: "Invalid result data" },
          { status: 400 }
        );
      }

      if (result.score < 0 || result.score > 100) {
        return NextResponse.json(
          { error: "Score must be between 0 and 100" },
          { status: 400 }
        );
      }

      // Ensure teacher can only grade their own students if they're a teacher
      if (role === "teacher") {
        // Check if the student is in a class taught by this teacher
        const studentLesson = await prisma.student.findFirst({
          where: { id: result.studentId },
          include: {
            class: {
              include: {
                lessons: {
                  where: { teacherId: userId },
                },
              },
            },
          },
        });

        if (!studentLesson) {
          return NextResponse.json(
            { error: "Student not found" },
            { status: 404 }
          );
        }

        if (!studentLesson.class || studentLesson.class.lessons.length === 0) {
          return NextResponse.json(
            { error: "You can only grade students in your classes" },
            { status: 403 }
          );
        }
      }
    }

    // Use a transaction to save all results
    const savedResults = await prisma.$transaction(async (tx) => {
      const resultsToReturn = [];

      for (const result of results) {
        let existingResult = null;

        // Find existing result
        if (result.examId) {
          existingResult = await tx.result.findFirst({
            where: {
              studentId: result.studentId,
              examId: result.examId,
            },
          });
        } else if (result.assignmentId) {
          existingResult = await tx.result.findFirst({
            where: {
              studentId: result.studentId,
              assignmentId: result.assignmentId,
            },
          });
        }

        if (existingResult) {
          // Update existing result
          const updatedResult = await tx.result.update({
            where: { id: existingResult.id },
            data: { score: result.score },
          });
          resultsToReturn.push(updatedResult);
        } else {
          // Create new result
          const newResult = await tx.result.create({
            data: {
              studentId: result.studentId,
              score: result.score,
              ...(result.examId && { examId: result.examId }),
              ...(result.assignmentId && { assignmentId: result.assignmentId }),
            },
          });
          resultsToReturn.push(newResult);
        }
      }

      return resultsToReturn;
    });

    return NextResponse.json({
      success: true,
      message: `Saved ${savedResults.length} grades successfully`,
      results: savedResults,
    });
  } catch (error) {
    console.error("Bulk grading error:", error);
    return NextResponse.json(
      { error: "Failed to save grades" },
      { status: 500 }
    );
  }
}
