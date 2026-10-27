"use client";

import { useEffect } from "react";

export default function ConsumeUnlock() {
  useEffect(() => {
    // Fire-and-forget: delete the results-unlock cookie
    fetch("/api/auth/consume-unlock", { method: "POST" }).catch(() => {});
  }, []);

  return null;
}