export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[]; // Všechny obrázky produktu
  sizes: string[];
  category: string;
  handle?: string; // Shopify product handle
  variantId?: string; // Shopify variant ID
}

export interface SelectedProduct extends Product {
  selectedSize: string;
}
