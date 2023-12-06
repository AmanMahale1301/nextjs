import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { fetchShopifyData } from "../utility";
import Image from "next/image";

const Collections = () => {
  const router = useRouter();
  const { collectionSlug } = router.query;
  console.log(collectionSlug);

  const [products, setProducts] = useState([]);

  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const limit = 25;
  const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE;

  const collection = JSON.stringify(collectionSlug);
  useEffect(() => {
    const query = `{
      products(query:${collection},first: ${limit}) {
        edges {
          node {
            id
            title
            description
            featuredImage {
              src
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
  return (
    <>
      <div className="flex justify-start w-full mt-5">
        <h1 className="font-bold text-xl mb-2 ">{collectionSlug} </h1>
      </div>
      <div className="container my-5 flex">
        {products.map((product) => (
          <>
            <div
              className="max-w-sm rounded my-4 mx-5 w-64"
              key={product.node.id}
              style={{ border: " 1px solid black" }}
            >
              <Image
                src={product.node.featuredImage.src}
                alt=""
                className="w-full h-48"
                width={100}
                height={60}
              />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">
                  {product.node.title}
                </div>
                <p className="text-gray-700 text-base truncate">
                  {product.node.description}
                </p>
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
};

export default Collections;
