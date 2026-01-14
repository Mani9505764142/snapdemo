

import { NextResponse } from "next/server";
import { readAnalytics } from "@/lib/analytics";

export async function GET() {
  return NextResponse.json(readAnalytics());
}
