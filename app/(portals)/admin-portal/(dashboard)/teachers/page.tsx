// ──────────────────────────────────────────────
// Manage Teachers Page — Server Component
// Fetches teachers on the server via Prisma.
// ──────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import ManageTeachersClient from "./ManageTeachersClient";

export default async function ManageTeachersPage() {
  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      assignedClass: true,
      createdAt: true,
    },
  });

  return <ManageTeachersClient initialTeachers={teachers} />;
}