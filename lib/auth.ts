// lib/auth.ts
// Student Password & PIN Generation & Authentication
import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * Generates a derived, hashed initial password for a student.
 * Format: UPPERCASE_LAST_NAME + LAST_4_DIGITS_OF_ID + RANDOM_4_CHARS
 */
export async function generateInitialStudentPassword(
  lastName: string,
  studentId: string
): Promise<{ hashed: string; plaintext: string }> {
  const cleanLastName = lastName.trim().toUpperCase().replace(/[^A-Z]/g, "");
  const lastFourDigits = studentId.trim().slice(-4);
  const randomBytes = crypto.randomBytes(4);
  const randomPart = randomBytes.toString("hex").slice(0, 4).toUpperCase();
  const plaintext = `${cleanLastName}${lastFourDigits}${randomPart}`;
  const hashed = await bcrypt.hash(plaintext, 10);
  return { hashed, plaintext };
}

/**
 * Returns the plaintext version of the derived password.
 */
export function getPlaintextStudentPassword(
  lastName: string,
  studentId: string,
  randomPart: string
): string {
  const cleanLastName = lastName.trim().toUpperCase().replace(/[^A-Z]/g, "");
  const lastFourDigits = studentId.trim().slice(-4);
  return `${cleanLastName}${lastFourDigits}${randomPart}`;
}

/**
 * Generates a random 4–6 digit PIN for a student.
 */
export function generateStudentPin(): string {
  // 6-digit PIN with leading zeros preserved
  const pin = Math.floor(100000 + Math.random() * 900000).toString();
  return pin;
}

/**
 * Hashes a PIN.
 */
export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, 10);
}

/**
 * Verifies a PIN against its hash.
 */
export async function verifyStudentPin(
  plainPin: string,
  hashedPin: string
): Promise<boolean> {
  return bcrypt.compare(plainPin, hashedPin);
}

/**
 * Verifies a student's password during login.
 */
export async function verifyStudentPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Hashes a password.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, 10);
}

/**
 * Validates password strength.
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