// lib/jwt.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

if (!process.env.JWT_SECRET) {
  throw new Error("CRITICAL FAILURE: JWT_SECRET environment variable is missing.");
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// ── Student Token Helpers ──

export async function createStudentToken(studentId: string): Promise<string> {
  return new SignJWT({ studentId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(secret);
}

export async function verifyStudentToken(token: string): Promise<{ studentId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { studentId: string };
  } catch {
    return null;
  }
}

export async function setStudentSession(studentId: string) {
  const token = await createStudentToken(studentId);
  const cookieStore = await cookies();
  cookieStore.set("student-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}

export async function getStudentFromSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("student-token")?.value;
  if (!token) return null;
  const payload = await verifyStudentToken(token);
  return payload?.studentId || null;
}

export async function clearStudentSession() {
  const cookieStore = await cookies();
  cookieStore.delete("student-token");
}

// ── Admin Token Helpers ──

async function createAdminToken(userId: string, role: string, assignedClass?: string | null): Promise<string> {
  return new SignJWT({ userId, role, assignedClass })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(secret);
}

async function verifyAdminToken(token: string): Promise<{ userId: string; role: string; assignedClass: string | null } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; role: string; assignedClass: string | null };
  } catch {
    return null;
  }
}

export async function getAdminFromSession(): Promise<{ userId: string; role: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete("admin-token");
}

// ── Teacher Token Helpers ──

export async function getTeacherFromSession(): Promise<{ userId: string; role: string; assignedClass: string | null } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("teacher-token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; role: string; assignedClass: string | null };
  } catch {
    return null;
  }
}

export async function clearTeacherSession() {
  const cookieStore = await cookies();
  cookieStore.delete("teacher-token");
}

export async function getPayloadFromToken(token: string): Promise<{ userId: string; role: string; assignedClass?: string | null } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; role: string; assignedClass?: string | null };
  } catch {
    return null;
  }
}