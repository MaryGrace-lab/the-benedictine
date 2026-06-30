// prisma/seed.ts
// ──────────────────────────────────────────────
// Database Seed Script
// Creates default admin, subjects, session,
// and a sample student for testing
// Run once: npx prisma db seed
// ──────────────────────────────────────────────

// prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { generateInitialStudentPassword, getPlaintextStudentPassword } from "../lib/auth";

const JSS_SUBJECTS = [
  "English Language",
  "Mathematics",
  "Social Studies",
  "Christian Religions Studies",
  "Quantitative Reasoning",
  "Verbal Reasoning",
  "Creative/ Fine Art",
  "Hand- Writing",
  "Agric. Science",
  "Music",
  "Basic Science",
  "Health Education",
  "Catholic Doctrine",
  "Civic Education",
  "Home Economics",
  "Computer",
  "Pre-Vocational Studies",
  "Literature in English",
];

// SSS Subjects by stream
const SSS_SUBJECTS: { name: string; stream: string }[] = [
  // All streams
  { name: "English Language", stream: "ALL" },
  { name: "Mathematics", stream: "ALL" },
  { name: "Christian Religious Studies", stream: "ALL" },
  { name: "Computer", stream: "ALL" },
  { name: "Civic Education", stream: "ALL" },
  { name: "Economics", stream: "ALL" },
  { name: "Marketing", stream: "ALL" },
  // Science only
  { name: "Physics", stream: "SCIENCE" },
  { name: "Chemistry", stream: "SCIENCE" },
  { name: "Biology", stream: "SCIENCE" },
  { name: "Agricultural Science", stream: "SCIENCE" },
  // Art only
  { name: "Literature in English", stream: "ART" },
  { name: "Government", stream: "ART" },
  // Commercial only
  { name: "Commerce", stream: "COMMERCIAL" },
  { name: "Financial Accounting", stream: "COMMERCIAL" },
];

async function seedAdmin() {
  console.log("👤 Creating default admin user...");
  const hashedPassword = await bcrypt.hash("TBA@dm1n_2025!Secure", 10);
  await prisma.user.upsert({
    where: { email: "admin@thebenedictineacademyportal.com" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@thebenedictineacademyportal.com",
      password: hashedPassword,
      role: Role.ADMIN,
    } as any,
  });
  console.log("   ✅ Admin created\n");
}

async function seedSubjects() {
  // JSS Subjects
  console.log("📚 Seeding JSS subjects (18)...");
  for (const name of JSS_SUBJECTS) {
    await prisma.subject.create({
      data: { name, level: "JSS", stream: null } as any,
    });
  }
  console.log("   ✅ JSS subjects done\n");

  // SSS Subjects
  console.log("📚 Seeding SSS subjects (15)...");
  for (const { name, stream } of SSS_SUBJECTS) {
    await prisma.subject.create({
      data: { name, level: "SSS", stream } as any,
    });
  }
  console.log("   ✅ SSS subjects done\n");
}

async function seedSession() {
  console.log("📅 Creating academic session...");
  await prisma.academicSession.create({
    data: { year: "2024/2025", term: "FIRST", isActive: true } as any,
  });
  console.log("   ✅ Session: 2024/2025 - FIRST\n");
}

async function seedStudent() {
  console.log("🧑‍🎓 Creating sample student...");
  const studentId = "BA-2025-0001";
  const hashedPassword = await generateInitialStudentPassword("Okoro", studentId);

  await prisma.student.create({
    data: {
      studentId,
      firstName: "John",
      lastName: "Okoro",
      class: "JSS 1",
      password: hashedPassword,
      guardianName: "Mrs. Grace Okoro",
      guardianPhone: "+2348012345678",
    } as any,
  });

  console.log("   ✅ John Okoro - JSS 1");
  console.log(`   Card ID: BA-2025-0001`);
  console.log(`   Password: OKORO0001\n`);
}

async function main() {
  console.log("🌱 Seeding database...\n");
  await seedAdmin();
  await seedSubjects();
  await seedSession();
  await seedStudent();
  console.log("🎉 Done!\n");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });