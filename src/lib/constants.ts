export const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Sorts variants into a fixed, human-friendly size order (rather than DB insertion order).
export function sortBySize<T extends { size: string }>(variants: T[]): T[] {
  return [...variants].sort((a, b) => DEFAULT_SIZES.indexOf(a.size) - DEFAULT_SIZES.indexOf(b.size));
}

// Shipping price. Displayed in CZK, sent to Stripe in haléře (CZK × 100).
export const SHIPPING_KC = 129;
export const SHIPPING_HALERE = SHIPPING_KC * 100;
