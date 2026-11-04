import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getStoredPdfPath, isValidPdf } from "@/lib/storage";
import fs from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please log in to view notes." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const note = await prisma.note.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!note || note.isDeleted) {
      return NextResponse.json(
        { error: "The requested note could not be found." },
        { status: 404 }
      );
    }

    // Role check: Only admin can view unpublished/draft notes
    if (note.status !== "PUBLISHED" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "This note is currently unavailable." },
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

    // Strict magic-byte check
    if (!isValidPdf(fileBuffer)) {
      return NextResponse.json(
        { error: "Corrupted document format." },
        { status: 500 }
      );
    }

    // Increment view count asynchronously
    prisma.note.update({
      where: { id: note.id },
      data: { viewCount: { increment: 1 } },
    }).catch((err) => console.error("Failed to increment viewCount:", err));

    const response = new NextResponse(fileBuffer);
    response.headers.set("Content-Type", "application/pdf");
    response.headers.set(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(note.originalFileName || note.title + '.pdf')}"`
    );
    response.headers.set("Content-Length", fileBuffer.length.toString());
    response.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
    response.headers.set("X-Content-Type-Options", "nosniff");

    return response;
  } catch (error) {
    console.error("Error viewing note:", error);
    return NextResponse.json(
      { error: "Failed to render document." },
      { status: 500 }
    );
  }
}

