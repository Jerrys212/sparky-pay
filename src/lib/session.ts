import { cookies } from "next/headers";
import type { Role } from "@/types";
import { AUTH_COOKIE, getRoleFromToken } from "@/lib/auth";

export async function getSessionRole(): Promise<Role | null> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  return token ? getRoleFromToken(token) : null;
}
