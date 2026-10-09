import { cookies } from "next/headers";
import type { Role, User } from "@/types";
import { AUTH_COOKIE, decodeJwt, getRoleFromToken, normalizeRole } from "@/lib/auth";

export async function getSessionRole(): Promise<Role | null> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  return token ? getRoleFromToken(token) : null;
}

export async function getSessionUser(): Promise<User | null> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) return null;
  const payload = decodeJwt(token);
  const role = normalizeRole(payload?.Role);
  if (!payload || !role) return null;

  const given = payload.GivenName?.trim() ?? "";
  const surname = payload.Surname?.trim() ?? "";
  const name = `${given} ${surname}`.trim() || payload.username || "Usuario";
  const initials = `${given[0] ?? ""}${surname[0] ?? ""}`.toUpperCase() || name.slice(0, 2).toUpperCase();

  return {
    name,
    firstName: given || name.split(" ")[0] || name,
    initials,
    role,
    avatar: "/images/avatar.png",
  };
}
