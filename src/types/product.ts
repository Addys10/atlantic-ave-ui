export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[]; // Všechny obrázky produktu
  sizes: Array<{
    name: string;
    available: boolean;
  }>;
  category: string;
  handle?: string; // Shopify product handle
  variantId?: string; // Shopify variant ID
}
