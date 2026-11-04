import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { savePdfFile, deleteStoredPdf, isValidPdf, MAX_FILE_SIZE } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const note = await prisma.note.findUnique({
      where: { id },
      include: { category: true, uploadedBy: { select: { name: true, email: true } } },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Get note error:", error);
    return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const existing = await prisma.note.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const title = (formData.get("title") as string)?.trim();
      const description = (formData.get("description") as string)?.trim() ?? existing.description;
      const categoryId = (formData.get("categoryId") as string) || existing.categoryId;
      const course = (formData.get("course") as string)?.trim() ?? existing.course;
      const topic = (formData.get("topic") as string)?.trim() ?? existing.topic;
      const academicSession = (formData.get("academicSession") as string)?.trim() ?? existing.academicSession;
      const language = (formData.get("language") as string)?.trim() ?? existing.language;
      const status = (formData.get("status") as string) || existing.status;
      const file = formData.get("file") as File | null;

      let storedFileName = existing.storedFileName;
      let originalFileName = existing.originalFileName;
      let fileSize = existing.fileSize;

      // If replacement file uploaded
      if (file && file.size > 0) {
        if (file.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: "The selected file exceeds the 25 MB limit." },
            { status: 400 }
          );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        if (!isValidPdf(buffer)) {
          return NextResponse.json(
            { error: "Replacement file must be a valid PDF." },
            { status: 400 }
          );
        }

        // Delete old file
        await deleteStoredPdf(existing.storedFileName);
        // Save new file
        storedFileName = await savePdfFile(buffer, file.name);
        originalFileName = file.name;
        fileSize = buffer.length;
      }

      const updated = await prisma.note.update({
        where: { id },
        data: {
          title: title || existing.title,
          description,
          categoryId,
          course,
          topic,
          academicSession,
          language,
          status,
          storedFileName,
          originalFileName,
          fileSize,
        },
      });

      const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: "NOTE_UPDATE",
          targetType: "NOTE",
          targetId: id,
          details: `Updated note "${updated.title}" (Status: ${status})`,
          ipAddress: ip,
        },
      });

      return NextResponse.json({ success: true, note: updated });
    } else {
      // JSON payload update (e.g. status toggle)
      const data = await request.json();
      const updated = await prisma.note.update({
        where: { id },
        data: {
          ...(data.title && { title: data.title.trim() }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.categoryId && { categoryId: data.categoryId }),
          ...(data.course !== undefined && { course: data.course }),
          ...(data.topic !== undefined && { topic: data.topic }),
          ...(data.academicSession !== undefined && { academicSession: data.academicSession }),
          ...(data.language && { language: data.language }),
          ...(data.status && { status: data.status }),
        },
      });

      const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: "NOTE_UPDATE",
          targetType: "NOTE",
          targetId: id,
          details: `Updated note "${updated.title}" via quick action`,
          ipAddress: ip,
        },
      });

      return NextResponse.json({ success: true, note: updated });
    }
  } catch (error) {
    console.error("Update note error:", error);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const note = await prisma.note.findUnique({ where: { id } });
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Soft delete or hard delete: PRD 5.5 mentions restore recently deleted if recycle bin, so let's mark isDeleted: true and status: ARCHIVED
    await prisma.note.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: "ARCHIVED",
      },
    });

    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "NOTE_DELETE",
        targetType: "NOTE",
        targetId: id,
        details: `Deleted note: "${note.title}"`,
        ipAddress: ip,
      },
    });

    return NextResponse.json({ success: true, message: "Note moved to archive / recycle bin" });
  } catch (error) {
    console.error("Delete note error:", error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}

