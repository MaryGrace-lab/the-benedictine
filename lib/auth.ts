// lib/auth.ts
// Student Password Generation & Authentication
import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * Generates a derived, hashed initial password for a student.
 * Format: UPPERCASE_LAST_NAME + LAST_4_DIGITS_OF_ID + RANDOM_4_CHARS
 *
 * @param lastName  - The student's last name
 * @param studentId - The student's unique login/card ID
 * @returns Object containing hashed password and plaintext version
 */
export async function generateInitialStudentPassword(
  lastName: string,
  studentId: string
): Promise<{ hashed: string; plaintext: string }> {
  // 1. Clean and uppercase the last name
  const cleanLastName = lastName
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, "");

  // 2. Extract the last 4 characters of the student ID
  const cleanId = studentId.trim();
  const lastFourDigits = cleanId.slice(-4);

  // 3. Add random component for security
  const randomBytes = crypto.randomBytes(4);
  const randomPart = randomBytes.toString("hex").slice(0, 4).toUpperCase();

  // 4. Combine them
  const plaintext = `${cleanLastName}${lastFourDigits}${randomPart}`;

  // 5. Hash with bcryptjs
  const saltRounds = 10;
  const hashed = await bcrypt.hash(plaintext, saltRounds);

  return { hashed, plaintext };
}

/**
 * Returns the plaintext version of the derived password.
 * Use ONLY for initial display to student/parent.
 * NEVER store plaintext in database.
 * 
 * @param lastName  - The student's last name
 * @param studentId - The student's unique login/card ID
 * @param randomPart - The random portion generated during creation
 * @returns The plaintext temporary password
 */
export function getPlaintextStudentPassword(
  lastName: string,
  studentId: string,
  randomPart: string
): string {
  const cleanLastName = lastName
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, "");

  const lastFourDigits = studentId.trim().slice(-4);

  return `${cleanLastName}${lastFourDigits}${randomPart}`;
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

/**
 * Validates password strength
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  message: string;
} {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain an uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain a lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain a number" };
  }
  return { valid: true, message: "Password is strong" };
}