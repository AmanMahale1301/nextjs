import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchProductData } from "../utility/product";
import { createCheckout, addToCart, fetchCartItems } from "../utility/cart";
import CartDrawer from "../components/CartDrawer";

const SingleProduct = () => {
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const router = useRouter();
  const { product: productId } = router.query;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await fetchProductData(productId);
        setProduct(productData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [token, shop, productId]);

  const handleQuantityChange = (event) => {
    // Ensure the quantity is a positive integer
    const newQuantity = Math.max(1, parseInt(event.target.value, 10) || 1);
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    try {
      let cartId = localStorage.getItem("cartId");
      console.log(cartId);
      if (!cartId) {
        cartId = await createCheckout();
        localStorage.setItem("cartId", cartId);
      }

      const variantId = product.variants.edges[0].node.id;
      console.log(variantId);
      const response = await addToCart(cartId, variantId, quantity);
      console.log("Product added to cart:", response);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };
  return (
    <div className="">
      {product && (
        <div>
          <div className="flex" style={{ width: "58rem" }}>
            <div className="w-2/4">
              <Image
                src={product?.featuredImage?.src}
                width={100}
                height={100}
                className="w-full"
              />
            </div>
            <div className="w-2/3">
              <h1 className="text-gray-800 ms-8 font-bold text-5xl">
                {product.title}
              </h1>
              <p className="font-light ms-8 mt-5 text-xl">
                {product.description}
              </p>
              <div className="mt-5 ms-9 flex justify-start">
                <button
                  className="px-2 py-1 bg-gray-300 text-gray-700 rounded-l"
                  onClick={decreaseQuantity}
                >
                  -
                </button>
                <input
                  type="text"
                  className="w-16 text-center border-t border-b border-gray-300 focus:outline-none"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
                <button
                  className="px-2 py-1 bg-gray-300 text-gray-700 rounded-r"
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>
              <button
                className="flex items-center h-12 mt-8 text-white justify-center w-full rounded-lg bg-slate-400 mx-8"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;
