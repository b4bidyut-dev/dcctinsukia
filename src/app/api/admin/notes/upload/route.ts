import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { savePdfFile, isValidPdf, MAX_FILE_SIZE } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Only administrators can upload notes." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || "";
    const categoryId = formData.get("categoryId") as string;
    const course = (formData.get("course") as string)?.trim() || "";
    const topic = (formData.get("topic") as string)?.trim() || "";
    const academicSession = (formData.get("academicSession") as string)?.trim() || "";
    const language = (formData.get("language") as string)?.trim() || "English";
    const status = (formData.get("status") as string) || "PUBLISHED";

    if (!file) {
      return NextResponse.json(
        { error: "Please select a PDF file to upload." },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: "Note title is required." },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: "Please select a category or subject." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "The selected file exceeds the maximum permitted size of 25 MB." },
        { status: 400 }
      );
    }

    // Convert file to buffer and validate magic bytes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!isValidPdf(buffer)) {
      return NextResponse.json(
        { error: "Only valid PDF files are allowed. The uploaded file is not a valid PDF." },
        { status: 400 }
      );
    }

    // Save PDF securely
    const storedFileName = await savePdfFile(buffer, file.name);

    // Save note to database
    const newNote = await prisma.note.create({
      data: {
        title,
        description,
        categoryId,
        course,
        topic,
        academicSession,
        language,
        storedFileName,
        originalFileName: file.name,
        fileSize: buffer.length,
        mimeType: "application/pdf",
        uploadedById: user.id,
        status: ["PUBLISHED", "DRAFT", "ARCHIVED", "UNPUBLISHED"].includes(status)
          ? status
          : "PUBLISHED",
      },
      include: {
        category: true,
      },
    });

    // Log admin activity
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "NOTE_UPLOAD",
        targetType: "NOTE",
        targetId: newNote.id,
        details: `Uploaded note: "${title}" (${file.name}, ${(buffer.length / 1024 / 1024).toFixed(2)} MB)`,
        ipAddress: ip,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Note uploaded and registered successfully!",
      note: newNote,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "The file could not be uploaded. Please try again." },
      { status: 500 }
    );
  }
}

