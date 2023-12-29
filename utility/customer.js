const gql = String.raw;
export const createCustomer = async (input) => {
  try {
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    console.log(input);
    const query = gql`
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            firstName
            lastName
            email
            phone
            acceptsMarketing
          }
          customerUserErrors {
            field
            message
            code
          }
        }
      }
    `;
    const variables = {
      input: input,
    };
    const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE;
    const response = await fetch(`https://${shop}/api/2023-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    });
    const data = await response.json();
    return data.data.customerCreate.customer;
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
};
export const loginCustomer = async (input) => {
  try {
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    console.log(input);
    const query = gql`
      mutation customerAccessTokenCreate(
        $input: CustomerAccessTokenCreateInput!
      ) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
          }
          customerUserErrors {
            message
          }
        }
      }
    `;
    const variables = {
      input: input,
    };
    const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE;
    const response = await fetch(`https://${shop}/api/2023-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    });
    const data = await response.json();
    return data.data.customerAccessTokenCreate.customerAccessToken.accessToken;
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
};

export const fetchCustomer = async (accessToken) => {
  try {
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const query = gql`query {
              customer(customerAccessToken: "${accessToken}") {
                id
                firstName
                lastName
                acceptsMarketing
                email
                phone
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
    return data.data.customer;
  } catch (error) {
    console.error("Error creating checkout:", error);
    return error;
  }
};
export const recoverCustomer = async (email) => {
  try {
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const query = gql`
      mutation MyMutation {
        customerRecover(email: "${email}") {
          customerUserErrors {
            code
            field
            message
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
    return data;
  } catch (error) {
    console.error("Error creating checkout:", error);
    return error;
  }
};
