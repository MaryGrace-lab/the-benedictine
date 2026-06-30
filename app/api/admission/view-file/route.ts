// app/api/admission/view-file/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdminFromSession } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  // Only authenticated admins can access
  const admin = await getAdminFromSession();
  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get("url");
  if (!fileUrl) {
    return NextResponse.json({ error: "Missing file URL" }, { status: 400 });
  }

  // Extract the relative path from the Supabase storage URL.
  // Example URL: https://<project>.supabase.co/storage/v1/object/public/admission-documents/admissions/123-file.pdf
  // Relative path: admissions/123-file.pdf
  let relativePath = fileUrl;
  try {
    const url = new URL(fileUrl);
    // The pathname starts with /storage/v1/object/public/<bucket>/
    // We need everything after the bucket name.
    const pathParts = url.pathname.split("/");
    const bucketIndex = pathParts.indexOf("admission-documents");
    if (bucketIndex !== -1 && bucketIndex + 1 < pathParts.length) {
      relativePath = pathParts.slice(bucketIndex + 1).join("/");
    }
  } catch {
    // If parsing fails, use the whole fileUrl as a fallback (unlikely to work)
  }

  // Initialize Supabase with the service role key (server‑side only)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  // Download the file from the bucket
  const { data, error } = await supabase.storage
    .from("admission-documents")
    .download(relativePath);

  if (error) {
    console.error("File download error:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  // Return the file directly
  return new NextResponse(data, {
    headers: {
      "Content-Type": data.type || "application/octet-stream",
      "Content-Disposition": `inline; filename="${relativePath.split('/').pop()}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}