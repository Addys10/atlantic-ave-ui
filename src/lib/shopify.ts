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

// GraphQL mutation pro přidání položky do košíku
export const ADD_TO_CART_MUTATION = `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
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

// GraphQL mutation pro odstranění položky z košíku
export const REMOVE_FROM_CART_MUTATION = `
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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

// GraphQL query pro načtení košíku
export const GET_CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
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
                  handle
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

// Helper funkce pro přidání do košíku
export async function addToCart(cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>) {
  const { data, errors } = await shopifyClient.request(ADD_TO_CART_MUTATION, {
    variables: { cartId, lines },
  });

  if (errors) {
    console.error('Shopify API errors:', errors);
    throw new Error('Nepodařilo se přidat do košíku');
  }

  return data;
}

// Helper funkce pro odstranění z košíku
export async function removeFromCart(cartId: string, lineIds: string[]) {
  const { data, errors } = await shopifyClient.request(REMOVE_FROM_CART_MUTATION, {
    variables: { cartId, lineIds },
  });

  if (errors) {
    console.error('Shopify API errors:', errors);
    throw new Error('Nepodařilo se odstranit z košíku');
  }

  return data;
}

// Helper funkce pro načtení košíku
export async function getCart(cartId: string) {
  const { data, errors } = await shopifyClient.request(GET_CART_QUERY, {
    variables: { cartId },
  });

  if (errors) {
    console.error('Shopify API errors:', errors);
    throw new Error('Nepodařilo se načíst košík');
  }

  return data;
}
