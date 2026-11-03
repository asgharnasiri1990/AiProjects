/* eslint-disable @next/next/no-html-link-for-pages -- this document is served for URLs that match no route, outside the locale router, so its links must be full page loads rather than client navigations. */

/**
 * The outer safety net: URLs that match no route at all never reach the
 * locale layout, so this document renders its own html and body.
 */
const styles = {
  html: {
    height: "100%",
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif",
    backgroundColor: "#f2f1ec",
    color: "#16160f",
  },
  body: {
    display: "flex",
    minHeight: "100%",
    margin: 0,
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  main: { maxWidth: "34rem", width: "100%" },
  label: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: "11px",
    letterSpacing: "0.16em",
    color: "#6b695f",
    margin: 0,
  },
  title: {
    fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
    fontWeight: 500,
    lineHeight: 1.1,
    margin: "0.75rem 0 0",
    letterSpacing: "-0.02em",
  },
  text: { marginTop: "0.75rem", fontSize: "14px", color: "#6b695f" },
  links: {
    marginTop: "2rem",
    display: "flex",
    gap: "1.5rem",
    fontSize: "14px",
  },
  link: { color: "#16160f", textDecoration: "underline", textUnderlineOffset: "4px" },
} as const;

export default function GlobalNotFound() {
  return (
    <html lang="en" style={styles.html}>
      <body style={styles.body}>
        <main style={styles.main}>
          <p dir="ltr" style={styles.label}>
            404
          </p>
          <h1 style={styles.title}>This page could not be found</h1>
          <p style={styles.text}>این صفحه پیدا نشد.</p>
          <div style={styles.links}>
            <a href="/fa" style={styles.link}>
              خانه
            </a>
            <a href="/en" style={styles.link}>
              Home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
