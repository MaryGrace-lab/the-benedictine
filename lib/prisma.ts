// ──────────────────────────────────────────────
// Prisma Client — Works with both local & cloud
// ──────────────────────────────────────────────

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL!;

  // Use Neon adapter for Supabase/Neon URLs
  if (url.includes("neon.tech") || url.includes("pooler.supabase.com")) {
    const adapter = new PrismaNeon({ connectionString: url });
    return new PrismaClient({
      adapter,
      log: ["error", "warn"],
    });
  }

  // Use direct connection for local PostgreSQL
  return new PrismaClient({
    log: ["error", "warn"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}