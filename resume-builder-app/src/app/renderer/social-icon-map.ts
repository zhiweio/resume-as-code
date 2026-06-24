/**
 * Maps social network names (case-insensitive) to @iconify/icons-fa-brands icons.
 * Each value is a lazy import () => Promise so Vite can code-split them.
 */

/** Shape of an Iconify icon data object. */
export interface IconifyIconData {
  body: string
  width?: number
  height?: number
}

// Pre-loaded icon cache — filled on first use
const cache: Record<string, IconifyIconData> = {}

// Canonical network → icon module path mapping.
// Keys are lowercase; the lookup function normalises the network name.
const ICON_MAP: Record<string, () => Promise<{ default: IconifyIconData }>> = {
  // fa-solid: personal website
  website: () => import('@iconify/icons-fa-solid/globe'),
  // fa-brands: social networks
  github: () => import('@iconify/icons-fa-brands/github'),
  'github alt': () => import('@iconify/icons-fa-brands/github-alt'),
  linkedin: () => import('@iconify/icons-fa-brands/linkedin'),
  'linkedin in': () => import('@iconify/icons-fa-brands/linkedin-in'),
  twitter: () => import('@iconify/icons-fa-brands/twitter'),
  gitlab: () => import('@iconify/icons-fa-brands/gitlab'),
  bitbucket: () => import('@iconify/icons-fa-brands/bitbucket'),
  stackoverflow: () => import('@iconify/icons-fa-brands/stack-overflow'),
  'stack overflow': () => import('@iconify/icons-fa-brands/stack-overflow'),
  medium: () => import('@iconify/icons-fa-brands/medium'),
  dev: () => import('@iconify/icons-fa-brands/dev'),
  codepen: () => import('@iconify/icons-fa-brands/codepen'),
  dribbble: () => import('@iconify/icons-fa-brands/dribbble'),
  behance: () => import('@iconify/icons-fa-brands/behance'),
  figma: () => import('@iconify/icons-fa-brands/figma'),
  npm: () => import('@iconify/icons-fa-brands/npm'),
  youtube: () => import('@iconify/icons-fa-brands/youtube'),
  facebook: () => import('@iconify/icons-fa-brands/facebook'),
  instagram: () => import('@iconify/icons-fa-brands/instagram'),
  telegram: () => import('@iconify/icons-fa-brands/telegram'),
  discord: () => import('@iconify/icons-fa-brands/discord'),
  slack: () => import('@iconify/icons-fa-brands/slack'),
  'hacker news': () => import('@iconify/icons-fa-brands/hacker-news'),
}

/**
 * Resolve a social network name to an Iconify icon object.
 * Returns `null` if no matching icon is found.
 *
 * The function eagerly loads the icon module the first time it is requested,
 * then caches it for subsequent calls.
 */
export async function resolveSocialIcon(
  network: string,
): Promise<IconifyIconData | null> {
  const key = network.trim().toLowerCase()
  if (cache[key]) return cache[key]

  // Exact match first
  const loader = ICON_MAP[key]
  if (loader) {
    const mod = await loader()
    cache[key] = mod.default
    return cache[key]
  }

  // Partial match: "GitHub" matches "github", "LinkedIn" matches "linkedin"
  for (const [mapKey, mapLoader] of Object.entries(ICON_MAP)) {
    if (key.includes(mapKey) || mapKey.includes(key)) {
      const mod = await mapLoader()
      cache[key] = mod.default
      return cache[key]
    }
  }

  return null
}
