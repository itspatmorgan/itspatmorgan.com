// The work featured in pm-studio, shown on /snapshots and the homepage. pm-studio owns the list (its Featured work
// module) and publishes it in its manifest. Each build reads the live list; when the Studio can't be reached, it uses
// the last saved copy in featured.json, which `pnpm sync-featured` refreshes.
import saved from "./featured.json";

export const studioUrl = "https://studio.itspatmorgan.com";

export type FeaturedEntry = {
  id: string;
  title: string;
  line: string;
  size: "large" | "wide" | "tall" | "small";
  href: string;
  snapshot: { clip: string; poster: string };
  native: string | null;
};

function isEntries(value: unknown): value is FeaturedEntry[] {
  return Array.isArray(value) && value.every((entry) =>
    entry && typeof entry.id === "string" && typeof entry.title === "string" && typeof entry.line === "string" &&
    typeof entry.href === "string" && typeof entry.snapshot?.clip === "string" && typeof entry.snapshot?.poster === "string");
}

export async function fetchFeatured(): Promise<FeaturedEntry[] | undefined> {
  try {
    const response = await fetch(`${studioUrl}/prototypes/manifest.json`, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return undefined;
    const entries = (await response.json())?.contributions?.featured?.entries;
    return isEntries(entries) ? entries : undefined;
  } catch {
    return undefined;
  }
}

const live = await fetchFeatured();
if (!live) console.warn("[featured] pm-studio's featured list wasn't reachable, so the build uses src/data/featured.json.");

/** The featured pieces in the Studio's order, with absolute links and snapshot URLs. */
export const featured = (live ?? (saved.entries as FeaturedEntry[])).map((entry) => ({
  ...entry,
  href: new URL(entry.href, studioUrl).toString(),
  snapshot: {
    clip: new URL(entry.snapshot.clip, studioUrl).toString(),
    poster: new URL(entry.snapshot.poster, studioUrl).toString(),
  },
}));

export const featuredWorkUrl = `${studioUrl}/featured`;

/** The Pattern Engine in pm-studio. It opens with the settings in its address, which article visuals link with. */
export const patternEngineUrl = `${studioUrl}/prototypes/vjwrvf5t8z1cbwy3/artifacts/tc3b4fm8y98jv6nx`;
