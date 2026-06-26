import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Allowed: PDF, JPG, PNG, DOCX",
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: "File too large. Maximum size is 5MB",
    };
  }

  return { valid: true };
}

export async function saveFile(
  file: File,
  folder: string
): Promise<{ success: boolean; filePath?: string; error?: string }> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}-${safeName}`;

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });

    // Save file
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Return relative path for database
    const relativePath = `/uploads/${folder}/${fileName}`;

    return { success: true, filePath: relativePath };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Failed to save file" };
  }
}