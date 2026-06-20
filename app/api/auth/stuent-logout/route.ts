import { NextResponse } from "next/server";
import { clearStudentSession } from "@/lib/jwt";

export async function POST() {
  await clearStudentSession();
  return NextResponse.json({ success: true });
}