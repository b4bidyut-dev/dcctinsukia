import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentUser();
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const { status, role } = await request.json();

    // Prevent admin from deactivating or demoting themselves
    if (admin.id === id && (status === "DEACTIVATED" || role === "USER")) {
      return NextResponse.json(
        { error: "You cannot deactivate or demote your own administrator account." },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(role && { role }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        action: "USER_STATUS_CHANGE",
        targetType: "USER",
        targetId: id,
        details: `Updated user ${updated.email}: status=${status || "unchanged"}, role=${role || "unchanged"}`,
        ipAddress: ip,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}

