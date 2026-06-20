"use client";

import { useRouter } from "next/navigation";

type Session = {
  id: string;
  year: string;
  term: string;
  isActive: boolean;
};

export default function SessionSelector({
  sessions,
  currentSessionId,
}: {
  sessions: Session[];
  currentSessionId: string;
}) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sessionId = e.target.value;
    router.push(`/student-portal/results?session=${sessionId}`);
  };

  return (
    <select
      value={currentSessionId}
      onChange={handleChange}
      className="p-2 border border-slate-200 rounded-lg text-sm bg-white"
      aria-label="Select Academic Session"
    >
      {sessions.map((s) => (
        <option key={s.id} value={s.id}>
          {s.year} — {s.term} Term {s.isActive ? "(Active)" : ""}
        </option>
      ))}
    </select>
  );
}