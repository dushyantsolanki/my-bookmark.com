import { NextRequest, NextResponse } from "next/server";

export interface AuthenticatedRequest extends NextRequest {
  user: {
    userId: string;
    email: string;
  };
}

export function withAuth(handler: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    const userId = req.headers.get("x-user-id");
    const email = req.headers.get("x-user-email");

    if (!userId || !email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Attach user to the request object for easy access in handlers
    (req as any).user = { userId, email };

    return handler(req, ...args);
  };
}
