import { NextResponse } from "next/server";
import { incrementView } from "@/lib/analytics";

export async function POST(req: Request) {
  const { key } = await req.json();
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  await incrementView(key);
  return NextResponse.json({ ok: true });
}
