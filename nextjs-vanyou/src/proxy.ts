import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

const FORM_TOKEN_COOKIE = "vy_ft";
const FORM_TOKEN_MAX_AGE = 600; // 10 minutes
const FORM_TOKEN_HEADER = "x-form-token";

const intlHandler = createIntlMiddleware(routing);

export function proxy(request: NextRequest): NextResponse {
  const existing = request.cookies.get(FORM_TOKEN_COOKIE)?.value;
  const token = existing ?? crypto.randomBytes(16).toString("hex");

  // Inject token into request headers so the page can read it via headers()
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(FORM_TOKEN_HEADER, token);

  // Pass the modified request to next-intl so it forwards our header downstream
  const response = intlHandler(
    new NextRequest(request, { headers: requestHeaders })
  ) as NextResponse;

  // Set the cookie on the response if this is a new token
  if (!existing) {
    response.cookies.set(FORM_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: FORM_TOKEN_MAX_AGE,
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
