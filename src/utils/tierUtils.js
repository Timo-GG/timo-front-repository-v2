export function getTierIcon(tierName) {
    const lower = tierName.toLowerCase();

    // unrank일 경우 별도 처리
    if (lower === 'unrank') {
        return `/assets/tiers/unrank.webp`;
    }

    try {
      return `/assets/tiers/${lower}.webp`;
    } catch {
        return `/assets/tiers/unrank.webp`;
    }
  }
