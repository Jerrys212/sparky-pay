import type { Role } from "@/types";

export const AUTH_COOKIE = "spark_token";

interface JwtPayload {
  Role?: string;
  GivenName?: string;
  Surname?: string;
  username?: string;
  [key: string]: unknown;
}

function base64UrlDecode(segment: string): string {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
}

export function decodeJwt(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3 || !parts[1]) return null;
  try {
    return JSON.parse(base64UrlDecode(parts[1])) as JwtPayload;
  } catch {
    return null;
  }
}

export function normalizeRole(role: string | undefined): Role | null {
  if (!role) return null;
  const value = role.toLowerCase();
  return value === "operador" || value === "supervisor" ? value : null;
}

export function getRoleFromToken(token: string): Role | null {
  return normalizeRole(decodeJwt(token)?.Role);
}
