import { site } from "../config";
import { getAllSettings } from "../db/database";
import { useDbData } from "./useDbData";

/**
 * Live site settings, with any values saved in Admin → Settings overriding
 * the defaults in config.ts. Because both the site and the admin share the
 * same SQLite database, edits in the admin show up on the site immediately.
 */
export function useSiteSettings() {
  const saved = useDbData(getAllSettings);
  const pick = (key: string, fallback: string) => {
    const v = saved?.[key]?.trim();
    return v ? v : fallback;
  };

  const customSocials = [
    { label: "GitHub", href: pick("social_github", site.socials.find(s => s.label === "GitHub")?.href || "") },
    { label: "LinkedIn", href: pick("social_linkedin", site.socials.find(s => s.label === "LinkedIn")?.href || "") },
    { label: "X / Twitter", href: pick("social_twitter", site.socials.find(s => s.label.includes("X"))?.href || "") },
    { label: "Dribbble", href: pick("social_dribbble", site.socials.find(s => s.label === "Dribbble")?.href || "") },
    { label: "Instagram", href: pick("social_instagram", "") },
    { label: "YouTube", href: pick("social_youtube", "") },
  ].filter(s => Boolean(s.href));

  return {
    name: pick("profile_name", site.name),
    email: pick("profile_email", site.email),
    location: pick("profile_location", site.location),
    availability: pick("site_availability", site.availability),
    heroPhoto: pick("profile_hero_photo", ""),
    aboutPhoto: pick("profile_about_photo", ""),
    role: site.role,
    socials: customSocials.length ? customSocials : site.socials,
  };
}
