// ──────────────────────────────────────────────
// Manage Sessions Page — Server Component
// Fetches sessions on the server via Prisma,
// then renders the client component with data.
// ──────────────────────────────────────────────

import { prisma } from "@/lib/prisma";
import ManageSessionsClient from "./ManageSessionsClient";

export const dynamic = "force-dynamic";
export default async function ManageSessionsPage() {
  const sessions = await prisma.academicSession.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { results: true },
      },
    },
  });

  return <ManageSessionsClient initialSessions={sessions} />;
}