"use client";

import React from "react";

export default function PrintButton() {
  return (
    <button
      onClick={() => typeof window !== "undefined" && window.print()}
      className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
    >
      🖨️ Print Report Card
    </button>
  );
}