import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, localeCookie } from "@/lib/i18n";

/**
 * Every page lives under /en or /fa. Locale-less URLs go to the visitor's
 * saved choice, and English is the default.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0 && isLocale(segments[0])) {
    const locale = segments[0];
    const requestHeaders = new Headers(request.headers);
    // The 404 page is rendered on the server, but it gets no params; pass the
    // locale through a request header so it can pick the right copy.
    requestHeaders.set("x-locale", locale);

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    // Remember the locale also when someone lands directly on /fa or /en.
    // Only document navigations may write the cookie: RSC/prefetch requests
    // ask for text/x-component and must not silently change the saved locale.
    const isDocument = (request.headers.get("accept") ?? "").includes(
      "text/html",
    );
    if (isDocument && request.cookies.get(localeCookie)?.value !== locale) {
      response.cookies.set(localeCookie, locale, {
        path: "/",
        maxAge: 31536000,
        sameSite: "lax",
      });
    }

    return response;
  }

  const saved = request.cookies.get(localeCookie)?.value;
  const locale = isLocale(saved) ? saved : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = segments.length === 0 ? `/${locale}` : `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  // Do not route known static files through the locale proxy. Everything else,
  // including unknown paths that contain a dot, gets the locale redirect so it
  // can reach the themed 404.
  matcher: [
    "/((?!api|_next|favicon.ico|images/|og.png|icon.svg|robots.txt|sitemap.xml).*)",
  ],
};
