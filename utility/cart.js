const gql = String.raw;
export const createCart = async () => {
  try {
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const query = gql`
      mutation createCart($input: CartInput) {
        cartCreate(input: $input) {
          cart {
            id
          }
        }
      }
    `;
    const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE;
    const response = await fetch(`https://${shop}/api/2023-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    return data.data.cartCreate.cart.id;
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
};
export const createCheckout = async () => {
  try {
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const query = gql`
      mutation checkoutCreate {
        checkoutCreate(input: {}) {
          checkout {
            id
          }
        }
      }
    `;
    const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE;
    const response = await fetch(`https://${shop}/api/2023-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    return data.data.checkoutCreate.checkout.id;
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
};
export const addToCheckout = async (checkoutId, checkoutItems) => {
  try {
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE;
    const gql = String.raw;
    console.log(checkoutItems);
    const query = gql`
      mutation AddToCheckout(
        $checkoutId: ID!
        $lineItems: [CheckoutLineItemInput!]!
      ) {
        checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
          checkout {
            id
            completedAt
            currencyCode
            orderStatusUrl
            lineItems(first: 10) {
              nodes {
                title
                quantity
                id
              }
            }
            webUrl
            totalPrice {
              amount
              currencyCode
            }
          }
          checkoutUserErrors {
            code
            field
            message
          }
        }
      }
    `;
    const lineItems = checkoutItems.map((item) => ({
      variantId: item.variantId,
      quantity: item.quantity,
    }));
    const variables = {
      checkoutId,
      lineItems,
    };
    const response = await fetch(`https://${shop}/api/2023-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query: query, variables }),
    });

    const data = await response.json();

    return data.data.checkoutLineItemsAdd.checkout.webUrl;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};
export const addToCart = async (cartId, variantId, quantity) => {
  try {
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE;

    const query = gql`mutation AddToCart {
      cartLinesAdd(
        cartId: "${cartId}"
        lines: [{merchandiseId: "${variantId}", quantity: ${quantity}}]
      ) {
        cart {
          id
          lines(first: 10) {
            edges {
              node {
                id
                cost {
                  totalAmount {
                    amount
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    product {
                      title
                      featuredImage {
                        src
                      }
                    }
                  }
                }
                quantity
              }
            }
          }
        }
        userErrors {
          code
          field
          message
        }
      }
    }    
  `;

    const variables = {
      cartId,
      lineItems: [{ variantId, quantity }],
    };
    console.log(variables);
    const response = await fetch(`https://${shop}/api/2023-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query: query, variables }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};
export const fetchCartItems = async (cartId) => {
  try {
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE;
    console.log(cartId);
    const query = gql`query MyQuery {
      cart(id: "${cartId}") {
        lines(first:10){
          edges {
            node {
              cost {
                totalAmount {
                  amount
                }
              }
              merchandise {
                ... on ProductVariant {
                  id
                  product {
                    featuredImage {
                      src
                    }
                    title
                  }
                  title
                }
              }
              quantity
              ... on CartLine {
                id
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
          }
        }
      }
    }
    `;
    const response = await fetch(`https://${shop}/api/2023-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query: query }),
    });

    const data = await response.json();
    return data.data.cart;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};
export const updateCartItems = async (cartId, id, merchandiseId, quantity) => {
  try {
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE;
    console.log(cartId);
    console.log(`"${id}"`);
    console.log(`"${merchandiseId}"`);
    console.log(quantity);
    const query = gql`mutation cartLinesUpdate {
      cartLinesUpdate(cartId: "${cartId}"
      lines: [{id: "${id}",merchandiseId: "${merchandiseId}",quantity: ${quantity}}] ) {
        cart {
          id
          lines(first: 10) {
            edges {
              node {
                id
                cost {
                  totalAmount {
                    amount
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    product {
                      title
                      featuredImage {
                        src
                      }
                    }
                  }
                }
                quantity
                ... on CartLine {
                  id
                }
              }
            }
          }
        }
        userErrors {
          code
          field
          message
        }
      }
    }
    `;

    // const variables = {
    //   cartId,
    //   lines: lines,
    // };
    // console.log(lines);
    const response = await fetch(`https://${shop}/api/2023-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query: query }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};
export const removeCartItems = async (cartId, id) => {
  try {
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE;
    console.log(cartId);
    console.log(`"${id}"`);

    const query = gql`mutation cartLinesRemove{
      cartLinesRemove(
        cartId: "${cartId}",
        lineIds: "${id}"
      ) {
        cart {
          id
        }
        userErrors {
          field
          message
        }
        
      }
    }
    `;

    // const variables = {
    //   cartId,
    //   lines: lines,
    // };
    // console.log(lines);
    const response = await fetch(`https://${shop}/api/2023-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query: query }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};
