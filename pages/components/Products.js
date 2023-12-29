import React, { useEffect, useState } from "react";
import { fetchShopifyData } from "../../utility";
import Image from "next/image";
import { useRouter } from "next/router";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(10);
  const [sortKey, setSortKey] = useState("RELEVANCE");
  const router = useRouter();
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE;

  useEffect(() => {
    const query = `{
      products(first: ${limit} , sortKey: ${sortKey}) {
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
  }, [token, shop, limit, sortKey]);
  const handleProductClick = (id) => {
    console.log(id);
    const productRoute = `/product/${encodeURIComponent(id)}`;

    router.push(productRoute);
  };
  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };
  const handleSortKeyChange = (event) => {
    setSortKey(event.target.value);
  };
  return (
    <>
      <div className="flex justify-end items-center w-full">
        <div className="mb-4 px-4">
          <label className="mr-2 text-lg">Limit:</label>
          <select value={limit} onChange={handleLimitChange} className="p-2">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="mb-4  w-1/4 flex-center ">
          <label className="mr-2">Sort :</label>
          <select
            value={sortKey}
            onChange={handleSortKeyChange}
            className="p-2 "
          >
            <option value="BEST_SELLING">Best Selling</option>
            <option value="PRICE">Price</option>
            <option value="RELEVANCE">Relevance</option>
          </select>
        </div>
      </div>
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
    </>
  );
};

export default Product;
