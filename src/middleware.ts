import { NextRequest, NextResponse } from "next/server";
import { validateBasicAuth } from "@/lib/auth";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/calls")) {
    return NextResponse.next();
  }

  if (validateBasicAuth(request)) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Dashboard", charset="UTF-8"',
    },
  });
}

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
