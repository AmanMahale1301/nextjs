import React, { useEffect, useState } from "react";
import { fetchShopifyData } from "../utility";
import Image from "next/image";
import { useRouter } from "next/router";

const Product = () => {
  const [products, setProducts] = useState([]);
  const limit = 25;
  const router = useRouter();
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE;

  useEffect(() => {
    const query = `{
      products(first: ${limit}) {
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
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [token, shop]);
  const handleProductClick = (id) => {
    console.log(id);
    const productRoute = `/product/${encodeURIComponent(id)}`;

    router.push(productRoute);
  };
  return (
    <div className="flex flex-wrap justify-center">
      {products.map((product) => (
        <>
          <div
            class="max-w-sm rounded my-4 mx-5 w-64"
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
            <div class="px-6 py-4">
              <div class="font-bold text-xl mb-2">{product.node.title}</div>
              <p class="text-gray-700 text-base truncate">
                {product.node.description}
              </p>
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default Product;
