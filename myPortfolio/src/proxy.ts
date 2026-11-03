import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, localeCookie } from "@/lib/i18n";

/**
 * Every page lives under /fa or /en. Locale-less URLs are redirected to the
 * visitor's saved choice, falling back to Persian.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0 && isLocale(segments[0])) {
    return NextResponse.next();
  }

  const saved = request.cookies.get(localeCookie)?.value;
  const locale = isLocale(saved) ? saved : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = segments.length === 0 ? `/${locale}` : `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
