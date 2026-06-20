// lib/auth.ts
// ──────────────────────────────────────────────
// Student Password Generation & Authentication
// ──────────────────────────────────────────────
import bcrypt from "bcrypt";

/**
 * Generates a derived, hashed initial password for a student.
 * Format: UPPERCASE_LAST_NAME + LAST_4_DIGITS_OF_ID
 *
 * Examples:
 *   lastName="Smith", studentId="BA-2026-5421" → SMITH5421
 *   lastName="Obi-Wan", studentId="STU-0012"   → OBIWAN0012
 *   lastName="De Silva", studentId="9876"      → DESILVA9876
 *
 * @param lastName  - The student's last name
 * @param studentId - The student's unique login/card ID
 * @returns The bcrypt-hashed password string ready for database storage
 */
export async function generateInitialStudentPassword(
  lastName: string,
  studentId: string
): Promise<string> {
  // 1. Clean and uppercase the last name (remove spaces, hyphens, apostrophes, etc.)
  const cleanLastName = lastName
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, ""); // Keeps only letters A-Z

  // 2. Extract the last 4 characters of the student ID
  const cleanId = studentId.trim();
  const lastFourDigits = cleanId.slice(-4);

  // 3. Combine them to make the plaintext temporary password
  const temporaryPlaintextPassword = `${cleanLastName}${lastFourDigits}`;

  // 4. Hash it securely before it ever touches the database
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(temporaryPlaintextPassword, saltRounds);

  return hashedPassword;
}

/**
 * Returns the plaintext version of the derived password.
 * Use this ONLY for displaying to the student/parent on a printed slip.
 * NEVER store this in the database.
 *
 * @param lastName  - The student's last name
 * @param studentId - The student's unique login/card ID
 * @returns The plaintext temporary password (e.g., "SMITH5421")
 */
export function getPlaintextStudentPassword(
  lastName: string,
  studentId: string
): string {
  const cleanLastName = lastName
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, "");

  const lastFourDigits = studentId.trim().slice(-4);

  return `${cleanLastName}${lastFourDigits}`;
}

/**
 * Verifies a student's password during login
 */
export async function verifyStudentPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Hashes a new password (for password change/reset)
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(plainPassword, saltRounds);
}