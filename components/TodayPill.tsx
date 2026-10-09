"use client";

import { useEffect, useState } from "react";
import { formatToday } from "@/lib/format";

export function TodayPill() {
  // Rendered after mount so the label uses the viewer's clock and time zone, not the build server's.
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => setLabel(formatToday(new Date())), []);

  return (
    <div className="flex min-h-[38px] items-center gap-2 rounded-full border border-border-light bg-card px-4 py-2 text-[.8rem] font-semibold text-text-main">
      <i className="bi bi-calendar4 text-forest-medium" aria-hidden="true" />
      <span className="min-w-[14ch]">{label}</span>
    </div>
  );
}

export default TodayPill;
