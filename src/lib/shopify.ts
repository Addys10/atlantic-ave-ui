import { createStorefrontApiClient } from '@shopify/storefront-api-client';

// Shopify Storefront API Client
// Fallback pro build time pokud ENV proměnné nejsou nastavené
const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'placeholder.myshopify.com';
const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'placeholder-token';

export const shopifyClient = createStorefrontApiClient({
  storeDomain,
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2025-01',
  publicAccessToken: accessToken,
});

// GraphQL query pro všechny produkty
export const GET_PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
                availableForSale
                quantityAvailable
              }
            }
          }
        }
      }
    }
  }
`;

// GraphQL query pro detail produktu
export const GET_PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      descriptionHtml
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            priceV2 {
              amount
              currencyCode
            }
            availableForSale
            quantityAvailable
          }
        }
      }
    }
  }
`;

// GraphQL mutation pro vytvoření košíku
export const CREATE_CART_MUTATION = `
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  priceV2 {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// GraphQL query pro načtení shop policies
export const GET_SHOP_POLICIES_QUERY = `
  query GetShopPolicies {
    shop {
      privacyPolicy {
        title
        body
        handle
      }
      refundPolicy {
        title
        body
        handle
      }
      shippingPolicy {
        title
        body
        handle
      }
      termsOfService {
        title
        body
        handle
      }
    }
  }
`;

// Helper funkce pro fetch produktů
export async function getProducts(limit = 10) {
  const { data, errors } = await shopifyClient.request(GET_PRODUCTS_QUERY, {
    variables: { first: limit },
  });

  if (errors) {
    console.error('Shopify API errors:', errors);
    throw new Error('Nepodařilo se načíst produkty');
  }

  return data;
}

// Helper funkce pro fetch produktu podle handle
export async function getProductByHandle(handle: string) {
  const { data, errors } = await shopifyClient.request(GET_PRODUCT_BY_HANDLE_QUERY, {
    variables: { handle },
  });

  if (errors) {
    console.error('Shopify API errors:', errors);
    throw new Error('Nepodařilo se načíst produkt');
  }

  return data;
}

// Helper funkce pro vytvoření košíku
export async function createCart(lines: Array<{ merchandiseId: string; quantity: number }>) {
  const { data, errors } = await shopifyClient.request(CREATE_CART_MUTATION, {
    variables: {
      input: { lines },
    },
  });

  if (errors) {
    console.error('Shopify API errors:', errors);
    throw new Error('Nepodařilo se vytvořit košík');
  }

  return data;
}

// Helper funkce pro načtení shop policies
export async function getShopPolicies() {
  const { data, errors } = await shopifyClient.request(GET_SHOP_POLICIES_QUERY);

  if (errors) {
    console.error('Shopify API errors:', errors);
    throw new Error('Nepodařilo se načíst obchodní podmínky');
  }

  return data;
}
