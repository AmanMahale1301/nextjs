import React, { useState, useEffect } from "react";
import { fetchShopifyData } from "../../utility";
import Image from "next/image";
import { useRouter } from "next/router";

const Collection = (category) => {
  const [products, setProducts] = useState([]);
  const limit = 4;
  const router = useRouter();
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE;
  const collection = JSON.stringify(category.category);
  useEffect(() => {
    const query = `{
        products(query:${collection}, first: ${limit}) {
          edges {
            node {
              id
              title
              description
              featuredImage {
                src
              }
              variants(first: 1) {
                edges {
                  node {
                    price {
                      amount
                      currencyCode
                    }
                    title
                  }
                }
              }
            }
          }
        }
      }
      
    `;

    const fetchData = async () => {
      try {
        const data = await fetchShopifyData(query);
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [token, shop]);

  const handleCategoryClick = () => {
    const categoryRoute = `/collections/${encodeURIComponent(
      category.category
    )}`;

    router.push(categoryRoute);
  };
  const handleProductClick = (id) => {
    console.log(id);
    const productRoute = `/product/${encodeURIComponent(id)}`;

    router.push(productRoute);
  };
  console.log(products, "products");
  return (
    <>
      <div className="flex justify-start w-full mt-5">
        <h1
          className="font-bold ms-5 text-xl mb-2 "
          onClick={handleCategoryClick}
          style={{ cursor: "pointer" }}
        >
          {category.category}{" "}
        </h1>
      </div>
      <div className="container my-5 flex w-full overflow-x-auto">
        {products.map((product) => (
          <div
            className="max-w-sm rounded my-4 mx-5 w-64"
            key={product.node.id}
            style={{ border: " 1px solid black" }}
            onClick={() => handleProductClick(product.node.id)}
          >
            <Image
              src={product.node.featuredImage.src}
              alt=""
              className="w-full h-48"
              width={100}
              height={60}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{product.node.title}</div>
              <p className="text-gray-700 text-base truncate">
                {product.node.description}
              </p>
              <p className="text-gray-800 font-medium text-base ">
                {product.node.variants.edges[0].node.price.currencyCode}{" "}
                {product.node.variants.edges[0].node.price.amount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Collection;
