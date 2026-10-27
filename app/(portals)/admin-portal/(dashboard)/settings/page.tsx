// ──────────────────────────────────────────────
// Admin Settings Page — Server Component
// Groups account management in one place.
// ──────────────────────────────────────────────

import SettingsClient from "./SettingsClient";
export const dynamic = "force-dynamic";
export default function AdminSettingsPage() {
  return <SettingsClient />;
}