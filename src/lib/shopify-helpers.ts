import { Product } from '@/types/product';
import { ShopifyProduct } from '@/types/shopify';

/**
 * Konvertuje Shopify produkt na náš Product interface
 */
export function mapShopifyProductToProduct(shopifyProduct: ShopifyProduct): Product {
  const firstImage = shopifyProduct.images.edges[0]?.node.url || '/images/placeholder.jpg';
  const price = parseFloat(shopifyProduct.priceRange.minVariantPrice.amount);

  // Získáme všechny obrázky produktu
  const allImages = shopifyProduct.images.edges.map(edge => edge.node.url);

  // Získáme všechny dostupné velikosti z variant (předpokládáme, že title varianty = velikost)
  const sizes = shopifyProduct.variants.edges
    .filter(edge => edge.node.availableForSale)
    .map(edge => edge.node.title);

  return {
    id: shopifyProduct.id,
    name: shopifyProduct.title,
    description: shopifyProduct.description || '',
    price: price,
    image: firstImage,
    images: allImages.length > 0 ? allImages : [firstImage],
    sizes: sizes.length > 0 ? sizes : ['One Size'],
    category: 'Oblečení', // Můžeš rozšířit o product tags nebo collections
    handle: shopifyProduct.handle,
  };
}

/**
 * Konvertuje pole Shopify produktů
 */
export function mapShopifyProducts(shopifyProducts: ShopifyProduct[]): Product[] {
  return shopifyProducts.map(mapShopifyProductToProduct);
}

/**
 * Získá ID varianty podle velikosti
 */
export function getVariantIdBySize(shopifyProduct: ShopifyProduct, size: string): string | undefined {
  const variant = shopifyProduct.variants.edges.find(
    edge => edge.node.title === size && edge.node.availableForSale
  );
  return variant?.node.id;
}
