import { env } from "@/lib/env";

export interface BackendResult {
  status: number;
  body: unknown;
}

export async function backendFetch(path: string, init?: RequestInit): Promise<BackendResult> {
  const res = await fetch(`${env.BACKEND_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  const body = await res.json().catch(() => null);
  return { status: res.status, body };
}
