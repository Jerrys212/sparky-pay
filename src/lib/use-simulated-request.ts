"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useSimulatedRequest(latency: number) {
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const run = useCallback(
    (onDone: () => void) => {
      setLoading(true);
      timer.current = setTimeout(() => {
        setLoading(false);
        onDone();
      }, latency);
    },
    [latency],
  );

  return { loading, run };
}
