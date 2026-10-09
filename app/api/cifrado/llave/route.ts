import { NextResponse } from "next/server";
import { transportPublicKey } from "@/lib/crypto";

export function GET() {
  return NextResponse.json({ llavePublica: transportPublicKey });
}
