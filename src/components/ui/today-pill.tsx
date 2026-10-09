"use client";

import { useSyncExternalStore } from "react";
import { formatToday } from "@/lib/format";

const subscribe = () => () => {};

export function TodayPill() {
  const label = useSyncExternalStore(
    subscribe,
    () => formatToday(new Date()),
    () => null,
  );

  return (
    <div className="flex min-h-[38px] items-center gap-2 rounded-full border border-border-light bg-card px-4 py-2 text-[.8rem] font-semibold text-text-main">
      <i className="bi bi-calendar4 text-forest-medium" aria-hidden="true" />
      <span className="min-w-[14ch]">{label}</span>
    </div>
  );
}

export default TodayPill;
