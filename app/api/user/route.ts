import { getCurrentUser } from "@/lib/auth";
import type { NextRequest } from "next/server";
/**
 * Protected API Route: GET /api/user
 * Returns the current user's information
 * Requires active authentication session
 */
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        {
          error: "Unauthorized",
          message: "You must be logged in to access this resource",
        },
        { status: 401 },
      );
    }

    // Return user information
    return Response.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/user failed:", error);
    return Response.json(
      {
        error: "Internal Server Error",
        message: "Failed to fetch user information",
      },
      { status: 500 },
    );
  }
}

/**
 * Protected API Route: PUT /api/user
 * Updates user preferences
 * Requires active authentication session
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        {
          error: "Unauthorized",
          message: "You must be logged in to access this resource",
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    // Validate request body
    if (!body || typeof body !== "object") {
      return Response.json(
        {
          error: "Bad Request",
          message: "Invalid request body",
        },
        { status: 400 },
      );
    }

    // In a real app, you'd update the database here
    // For now, we'll just return a success response
    return Response.json(
      {
        message: "User preferences updated successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        // Echo back the preferences that would be saved
        preferences: body,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PUT /api/user failed:", error);
    return Response.json(
      {
        error: "Internal Server Error",
        message: "Failed to update user preferences",
      },
      { status: 500 },
    );
  }
}
