// app/api/auth/consume-unlock/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("results-unlock")?.value;

  if (!token) {
    return NextResponse.json({ success: false });
  }

  try {
    await jwtVerify(token, secret);
    cookieStore.delete("results-unlock");
    return NextResponse.json({ success: true });
  } catch {
    cookieStore.delete("results-unlock");
    return NextResponse.json({ success: false });
  }
}