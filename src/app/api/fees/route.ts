import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (!userId || role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const feeRecord = await prisma.feeRecord.create({
      data: {
        studentId: body.studentId,
        feeStructureId: parseInt(body.feeStructureId),
        amountDue: parseFloat(body.amountDue),
        amountPaid: parseFloat(body.amountPaid || 0),
        status: body.status || "PENDING",
        dueDate: new Date(body.dueDate),
      },
    });

    return NextResponse.json(feeRecord);
  } catch (error) {
    console.error("Error creating fee record:", error);
    return NextResponse.json(
      { error: "Failed to create fee record" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (!userId || role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const feeRecord = await prisma.feeRecord.update({
      where: { id: parseInt(body.id) },
      data: {
        studentId: body.studentId,
        feeStructureId: parseInt(body.feeStructureId),
        amountDue: parseFloat(body.amountDue),
        amountPaid: parseFloat(body.amountPaid),
        status: body.status,
        dueDate: new Date(body.dueDate),
      },
    });

    return NextResponse.json(feeRecord);
  } catch (error) {
    console.error("Error updating fee record:", error);
    return NextResponse.json(
      { error: "Failed to update fee record" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId, sessionClaims } = auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (!userId || role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.feeRecord.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting fee record:", error);
    return NextResponse.json(
      { error: "Failed to delete fee record" },
      { status: 500 }
    );
  }
}
