import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getStoredPdfPath, isValidPdf } from "@/lib/storage";
import fs from "fs";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please log in to download notes." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note || note.isDeleted) {
      return NextResponse.json(
        { error: "The requested note could not be found." },
        { status: 404 }
      );
    }

    // Role check: Only admin can download unpublished/draft notes
    if (note.status !== "PUBLISHED" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "This note is currently unavailable for download." },
        { status: 403 }
      );
    }

    const filePath = getStoredPdfPath(note.storedFileName);
    if (!filePath) {
      return NextResponse.json(
        { error: "Document file not found in storage." },
        { status: 404 }
      );
    }

    const fileBuffer = await fs.promises.readFile(filePath);

    if (!isValidPdf(fileBuffer)) {
      return NextResponse.json(
        { error: "Corrupted document format." },
        { status: 500 }
      );
    }

    // Record download event and increment count
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || undefined;

    await prisma.$transaction([
      prisma.note.update({
        where: { id: note.id },
        data: { downloadCount: { increment: 1 } },
      }),
      prisma.downloadLog.create({
        data: {
          userId: user.id,
          noteId: note.id,
          ipAddress: ip,
          userAgent: userAgent,
        },
      }),
      prisma.activityLog.create({
        data: {
          userId: user.id,
          action: "NOTE_DOWNLOAD",
          targetType: "NOTE",
          targetId: note.id,
          details: `Downloaded note: ${note.title}`,
          ipAddress: ip,
        },
      }),
    ]);

    const downloadName = (note.originalFileName || `${note.title}.pdf`).endsWith(".pdf")
      ? note.originalFileName || `${note.title}.pdf`
      : `${note.title}.pdf`;

    const response = new NextResponse(fileBuffer);
    response.headers.set("Content-Type", "application/pdf");
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(downloadName)}"`
    );
    response.headers.set("Content-Length", fileBuffer.length.toString());
    response.headers.set("X-Content-Type-Options", "nosniff");

    return response;
  } catch (error) {
    console.error("Error downloading note:", error);
    return NextResponse.json(
      { error: "Failed to download document." },
      { status: 500 }
    );
  }
}

