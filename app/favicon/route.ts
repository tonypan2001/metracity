import { NextResponse, type NextRequest } from "next/server";

// Redirect /favicon to the actual favicon file
export function GET(request: NextRequest) {
  const url = new URL("/favicon.ico", request.url);
  return NextResponse.redirect(url, 308);
}

export function HEAD(request: NextRequest) {
  const url = new URL("/favicon.ico", request.url);
  return NextResponse.redirect(url, 308);
}

