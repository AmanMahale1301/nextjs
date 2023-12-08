// /pages/utility/shopifyApi.js
const gql = String.raw;
export const fetchProductData = async (productString) => {
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE;
  console.log(productString);

  const query = gql`{
    product(id: "${productString}") {
      title
      description
      variants(first: 5) {
        edges {
          node {
            id
            title
            price {
              amount
            }
          }
        }
      }
      featuredImage {
        src
      }
      metafield(key: "extraInfo", namespace: "custom") {
        value
      }
    }
  }
  `;
  console.log(query);
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
    console.log(data);
    return data.data.product;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error to be handled by the component
  }
};
