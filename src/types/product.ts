export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  sizes: Array<{
    id: string;
    name: string;
    available: boolean;
    stock: number;
  }>;
  category: string;
}
