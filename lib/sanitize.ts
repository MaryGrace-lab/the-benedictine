// lib/sanitize.ts

/**
 * Escapes HTML special characters to prevent XSS attacks
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Escapes an object's string values for safe HTML rendering
 */
export function escapeObject<T extends Record<string, any>>(obj: T): T {
  const escaped: any = {};
  for (const [key, value] of Object.entries(obj)) {
    escaped[key] = typeof value === 'string' ? escapeHtml(value) : value;
  }
  return escaped;
}