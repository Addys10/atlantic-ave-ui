// Shopify Product Types
export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyVariant;
    }>;
  };
}

export interface ShopifyVariant {
  id: string;
  title: string;
  priceV2: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  quantityAvailable?: number;
}
