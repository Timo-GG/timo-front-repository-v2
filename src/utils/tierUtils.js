export function getTierIcon(tierName) {
    const lower = tierName.toLowerCase(); // 플래티넘 -> platinum
    try {
      return new URL(`/src/assets/tiers/${lower}.webp`, import.meta.url).href;
    } catch {
      return new URL(`/src/assets/tiers/unrank.webp`, import.meta.url).href;
    }
  }