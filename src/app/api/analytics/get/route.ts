import { NextResponse } from "next/server";
import { getAnalytics } from "@/lib/analytics";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const videoKey = searchParams.get("videoKey");

    if (!videoKey) {
      return NextResponse.json(
        { error: "Missing videoKey" },
        { status: 400 }
      );
    }

    const data = await getAnalytics(videoKey);

    return NextResponse.json({
      views: data.views ?? 0,
      completedViews: data.completedViews ?? 0,
    });
  } catch (err) {
    console.error("GET ANALYTICS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
