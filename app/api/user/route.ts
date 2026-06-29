import { getCurrentUser } from "@/lib/auth";
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
export async function PUT() {
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

    return Response.json(
      {
        error: "Not Implemented",
        message:
          "User preference updates are not available yet because no persistence model exists.",
      },
      { status: 501 },
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
