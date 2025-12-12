import { Product } from '@/types/product';

// POZNÁMKA: Pro development/fallback použijeme mock data
// V produkci se produkty načítají z Shopify pomocí API routes a server components

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Star shirt',
    description: 'Prémiové tričko s unikátním designem. Ideální pro každodenní nošení.',
    price: 999,
    image: '/images/tee1.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'Trička',
    handle: 'star-shirt',
  },
  {
    id: '2',
    name: '41 Ave shirt',
    description: 'Stylové tričko s moderním designem. Perfektní pro každou příležitost.',
    price: 999,
    image: '/images/tee2.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'Trička',
    handle: '41-ave-shirt',
  },
];

/**
 * Pomocná funkce pro načtení produktů z Shopify
 * Použití: const products = await getShopifyProducts();
 */
export async function getShopifyProducts(): Promise<Product[]> {
  try {
    // Zavolá naši API route která fetchuje z Shopify
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`, {
      cache: 'no-store', // Vždy načti fresh data
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();

    // Import helper funkce dynamicky aby nefailovalo na client side
    const { mapShopifyProducts } = await import('@/lib/shopify-helpers');
    const shopifyProducts = data.products.edges.map((edge: any) => edge.node);

    return mapShopifyProducts(shopifyProducts);
  } catch (error) {
    console.error('Error loading Shopify products, using mock data:', error);
    return mockProducts;
  }
}

/**
 * Pomocná funkce pro načtení jednoho produktu podle handle
 */
export async function getShopifyProductByHandle(handle: string): Promise<Product | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/${handle}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    const data = await response.json();

    if (!data.productByHandle) {
      return null;
    }

    const { mapShopifyProductToProduct } = await import('@/lib/shopify-helpers');
    return mapShopifyProductToProduct(data.productByHandle);
  } catch (error) {
    console.error('Error loading Shopify product:', error);
    return mockProducts.find(p => p.handle === handle) || null;
  }
}

// Export mock products jako default pro backward compatibility
export const products = mockProducts;
