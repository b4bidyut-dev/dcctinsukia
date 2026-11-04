import fs from "fs";
import path from "path";
import crypto from "crypto";

export const STORAGE_DIR = path.join(process.cwd(), "storage", "notes");
export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export function ensureStorageDirectory(): void {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

/**
 * Validates that the buffer is genuinely a PDF file by checking
 * the "%PDF-" magic bytes header (0x25, 0x50, 0x44, 0x46, 0x2D).
 */
export function isValidPdf(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 5) return false;
  const header = buffer.subarray(0, 5).toString("latin1");
  return header === "%PDF-";
}

/**
 * Saves a validated PDF file to secure storage.
 * Returns the unique stored filename.
 */
export async function savePdfFile(buffer: Buffer, originalFilename: string): Promise<string> {
  ensureStorageDirectory();

  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error("File exceeds maximum allowed size of 25 MB");
  }

  if (!isValidPdf(buffer)) {
    throw new Error("Invalid file content: Not a valid PDF document");
  }

  const sanitizedBase = path.basename(originalFilename).replace(/[^a-zA-Z0-9.-]/g, "_");
  const uniqueId = crypto.randomBytes(8).toString("hex");
  const storedFileName = `dcc_${Date.now()}_${uniqueId}_${sanitizedBase}`;
  const filePath = path.join(STORAGE_DIR, storedFileName);

  await fs.promises.writeFile(filePath, buffer);
  return storedFileName;
}

/**
 * Retrieves the full path to a stored PDF if it exists.
 */
export function getStoredPdfPath(storedFileName: string): string | null {
  // Prevent path traversal attacks
  const safeName = path.basename(storedFileName);
  const filePath = path.join(STORAGE_DIR, safeName);
  if (fs.existsSync(filePath)) {
    return filePath;
  }
  return null;
}

/**
 * Deletes a stored PDF file from disk.
 */
export async function deleteStoredPdf(storedFileName: string): Promise<boolean> {
  const filePath = getStoredPdfPath(storedFileName);
  if (filePath) {
    try {
      await fs.promises.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

