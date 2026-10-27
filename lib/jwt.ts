// lib/jwt.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

if (!process.env.JWT_SECRET) {
  throw new Error("CRITICAL FAILURE: JWT_SECRET environment variable is missing.");
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24, // 24 hours
  path: "/",
};

// ── Student Token Helpers ──

export async function createStudentToken(studentId: string): Promise<string> {
  return new SignJWT({ userId: studentId, role: "STUDENT" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .setIssuedAt()
    .sign(secret);
}

export async function verifyStudentToken(token: string): Promise<{ userId: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function setStudentSession(studentId: string) {
  const token = await createStudentToken(studentId);
  const cookieStore = await cookies();
  cookieStore.set("student-token", token, COOKIE_OPTIONS);
}

export async function getStudentFromSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("student-token")?.value;
  if (!token) return null;
  const payload = await verifyStudentToken(token);
  return payload?.userId || null;
}

export async function clearStudentSession() {
  const cookieStore = await cookies();
  cookieStore.set("student-token", "", { ...COOKIE_OPTIONS, maxAge: 0 });
}

// ── Admin Token Helpers ──

async function createAdminToken(userId: string, role: string, assignedClass?: string | null): Promise<string> {
  return new SignJWT({ userId, role, assignedClass })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .setIssuedAt()
    .sign(secret);
}

export async function setAdminSession(userId: string, role: string, assignedClass?: string | null) {
  const token = await createAdminToken(userId, role, assignedClass);
  const cookieStore = await cookies();
  cookieStore.set("admin-token", token, COOKIE_OPTIONS);
}

export async function getAdminFromSession(): Promise<{ userId: string; role: string; assignedClass?: string | null } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token) return null;
  
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; role: string; assignedClass?: string | null };
  } catch {
    return null;
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set("admin-token", "", { ...COOKIE_OPTIONS, maxAge: 0 });
}

// ── Teacher Token Helpers ──

export async function createTeacherToken(userId: string, assignedClass?: string | null): Promise<string> {
  return new SignJWT({ userId, role: "TEACHER", assignedClass })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .setIssuedAt()
    .sign(secret);
}

export async function setTeacherSession(userId: string, assignedClass?: string | null) {
  const token = await createTeacherToken(userId, assignedClass);
  const cookieStore = await cookies();
  cookieStore.set("teacher-token", token, COOKIE_OPTIONS);
}

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
  cookieStore.set("teacher-token", "", { ...COOKIE_OPTIONS, maxAge: 0 });
}

// ── Utility ──

export async function getPayloadFromToken(token: string): Promise<{ userId: string; role: string; assignedClass?: string | null } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; role: string; assignedClass?: string | null };
  } catch {
    return null;
  }
}

// ──────────────────────────────────────────────
// Results Unlock Session (PIN gate for viewing results)
// ──────────────────────────────────────────────

export async function setResultsUnlockSession(studentId: string) {
  const token = await new SignJWT({ userId: studentId, purpose: "results-unlock" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30m")
    .setIssuedAt()
    .sign(secret);
  const cookieStore = await cookies();
  cookieStore.set("results-unlock", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 30,
    path: "/",
  });
}

export async function hasResultsUnlock(studentId: string): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("results-unlock")?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.userId === studentId && payload.purpose === "results-unlock";
  } catch {
    return false;
  }
}

export async function clearResultsUnlockSession() {
  const cookieStore = await cookies();
  cookieStore.set("results-unlock", "", { maxAge: 0, path: "/" });
}