"use client";

/** Requests outside any locale (rare: the middleware redirects almost everything). */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#F3EEE4", color: "#1E2522", fontFamily: "system-ui, sans-serif" }}>
        <p>
          X-404 · Sheet not found — <a href="/en">decc.ae</a>
        </p>
      </body>
    </html>
  );
}
