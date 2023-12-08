// /pages/utility/shopifyApi.js

export const fetchShopifyData = async (query) => {
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE;
  try {
    const response = await fetch(`https://${shop}/api/2023-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    return data.data.products.edges;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error to be handled by the component
  }
};
