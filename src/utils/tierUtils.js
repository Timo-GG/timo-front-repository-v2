export function getTierIcon(tierName) {
    const lower = tierName.toLowerCase();
  
    // unrank일 경우 별도 처리
    if (lower === 'unrank') {
      return new URL(`/src/assets/tiers/unrank.webp`, import.meta.url).href;
    }
  
    try {
      return new URL(`/src/assets/tiers/${lower}.webp`, import.meta.url).href;
    } catch {
      return new URL(`/src/assets/tiers/unrank.webp`, import.meta.url).href;
    }
  }
  