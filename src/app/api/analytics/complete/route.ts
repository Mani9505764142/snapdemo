import { NextResponse } from "next/server";
import { incrementComplete } from "@/lib/analytics";

export async function POST(req: Request) {
  const { key } = await req.json();
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  await incrementComplete(key);
  return NextResponse.json({ ok: true });
}
