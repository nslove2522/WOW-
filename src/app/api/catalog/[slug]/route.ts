import { NextResponse } from "next/server";

import { getPublishedTour } from "@/lib/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const tour = await getPublishedTour(slug);
  if (!tour) {
    return NextResponse.json({ error: "Tour not found." }, { status: 404 });
  }
  return NextResponse.json({ tour });
}
