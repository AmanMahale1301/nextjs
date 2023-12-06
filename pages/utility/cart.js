// Replace with the correct path to your Storefront API client

// Create a checkout
export const createCheckout = async () => {
  try {
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const query = `   mutation createCart($input: CartInput){
      cartCreate(input: $input) {
          cart {
            id
          }
        }
      }`;
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
    return data;
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
};

// Add product to the cart
export const addToCart = async (cartId, variantId, quantity) => {
  try {
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE;

    // const lineItems = [{ variantId, quantity }];
    // console.log(lineItems);
    const query = `mutation AddToCart {
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
    // const addedToCartData = data.data.checkoutLineItemsAdd;
    return data;
    // if (addedToCartData.checkoutUserErrors.length > 0) {
    //   console.error(
    //     "Error adding to cart:",
    //     addedToCartData.checkoutUserErrors
    //   );
    // } else {
    //   console.log("Added to cart:", addedToCartData.checkout);
    //   return addedToCartData.checkout;
    // }
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

// Remove product from the cart

export const fetchCartItems = async (cartId) => {
  try {
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE;
    console.log(cartId);
    const query = `query MyQuery {
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
                }
              }
              quantity
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
    // const addedToCartData = data.data.checkoutLineItemsAdd;
    return data.data.cart;
    // if (addedToCartData.checkoutUserErrors.length > 0) {
    //   console.error(
    //     "Error adding to cart:",
    //     addedToCartData.checkoutUserErrors
    //   );
    // } else {
    //   console.log("Added to cart:", addedToCartData.checkout);
    //   return addedToCartData.checkout;
    // }
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};
