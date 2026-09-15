/**
 * Single source of truth for site details.
 * Update these values to rebrand or reconfigure the site.
 */
export const site = {
  name: "Osborne Fernandes",
  shortName: "OsborneFerds",
  role: "Web, Software & AI Developer",
  location: "Philippines",
  timezone: "GMT+8",
  email: "hello@osbornefernandes.design",
  url: "https://osbornefernandes.design",
  availability: "Q3 2026",
  responseTime: "< 24h",
  socials: [
    { label: "GitHub", href: "https://github.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "X / Twitter", href: "https://x.com" },
    { label: "Dribbble", href: "https://dribbble.com" },
  ],
} as const;

/**
 * Admin panel settings.
 *
 * NOTE: this is a client-only build, so authentication runs in the browser.
 * It is hardened (hashed password, lockout, session expiry) to be safe for a
 * demo/portfolio, but for real secrets you should put a server behind it.
 */
export const adminConfig = {
  // SHA-256 hash of the admin password (default: "osborne2026").
  // Generate a new one in Admin → Settings → Security, or with:
  //   node -e "crypto.subtle.digest('SHA-256', new TextEncoder().encode('yourpassword')).then(h=>console.log(Buffer.from(h).toString('hex')))"
  passwordHash: "9402b74a6528d97bbc4d34de0ae23c729d5763d905a381a16faf7669f3e82fb5", // "osborne2026"
  username: "admin",
  sessionMinutes: 30,
  maxAttempts: 5,
  lockoutMinutes: 5,
  /** When true, a fresh database is seeded with realistic demo data. */
  seedDemoData: true,
} as const;
