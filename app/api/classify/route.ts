import { classifyQuery } from "@/lib/keyword-classifier";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/classify
 * Classifies a news query into categories
 */
export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query parameter is required and must be a string" },
        { status: 400 },
      );
    }

    const result = classifyQuery(query);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Classification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
