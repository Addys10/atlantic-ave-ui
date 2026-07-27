export const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Shipping price. Displayed in CZK, sent to Stripe in haléře (CZK × 100).
// TODO: dočasně 1 Kč pro test reálné platby přes Stripe — vrátit na 129 po testu.
export const SHIPPING_KC = 1;
export const SHIPPING_HALERE = SHIPPING_KC * 100;
