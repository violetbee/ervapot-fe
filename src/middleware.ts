import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  if (
    request.cookies.get("accessToken")?.value &&
    request.nextUrl.pathname === "/login"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  headers.set("x-current-path", request.nextUrl.pathname);

  return NextResponse.next({ headers });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
