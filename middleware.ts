import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, getRoleFromToken } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const role = token ? getRoleFromToken(token) : null;

  const isLogin = pathname === "/login";
  const isOperador = pathname.startsWith("/operador");
  const isSupervisor = pathname.startsWith("/supervisor");

  if (!role) {
    if (isOperador || isSupervisor) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (isLogin) {
    return NextResponse.redirect(new URL(`/${role}`, request.url));
  }
  if (isOperador && role !== "operador") {
    return NextResponse.redirect(new URL("/sin-acceso", request.url));
  }
  if (isSupervisor && role !== "supervisor") {
    return NextResponse.redirect(new URL("/sin-acceso", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/operador/:path*", "/supervisor/:path*"],
};
