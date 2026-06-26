import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_SIZE = 5 * 1024 * 1024;

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!file) return { valid: false, error: "No file provided" };
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "Invalid file type. Allowed: PDF, JPG, PNG, DOCX" };
  }
  if (file.size > MAX_SIZE) {
    return { valid: false, error: "File too large. Maximum size is 5MB" };
  }
  return { valid: true };
}

export async function uploadToStorage(
  file: File,
  folder: string
): Promise<{ success: boolean; filePath?: string; error?: string }> {
  try {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${folder}/${timestamp}-${safeName}`;

    const { data, error } = await supabase.storage
      .from("admission-documents")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("admission-documents")
      .getPublicUrl(fileName);

    return { success: true, filePath: urlData.publicUrl };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Failed to upload file" };
  }
}