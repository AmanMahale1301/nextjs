import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchProductData } from "../../utility/product";
import { createCart, addToCart, fetchCartItems } from "../../utility/cart";
import CartDrawer from "../components/CartDrawer";

const SingleProduct = () => {
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState();
  const [selected, setSelected] = useState();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { product: productId } = router.query;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await fetchProductData(productId);
        // console.log(productData);
        setProduct(productData);
        setData(productData.variants.edges);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [token, shop, productId]);
  // console.log(data);
  const handleQuantityChange = (event) => {
    const newQuantity = Math.max(1, parseInt(event.target.value, 10) || 1);
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    try {
      let cartId = sessionStorage.getItem("cartId");
      console.log(cartId);
      if (!cartId) {
        cartId = await createCart();
        sessionStorage.setItem("cartId", cartId);
      }
      const variantId = variant;
      console.log(variantId);
      const response = await addToCart(cartId, variantId, quantity);
      console.log("Product added to cart:", response);
      setOpen(true);
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

  const [selectedOptions, setSelectedOptions] = useState({});
  const categories = Array.from(
    new Set(
      data.flatMap((variant) =>
        variant.node.selectedOptions.map((opt) => opt.name)
      )
    )
  );

  const handleOptionChange = (category, value, variantId) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [category]: { value },
    }));
    console.log(selectedOptions);

    const matchingVariant = data.find((variant) =>
      variant.node.selectedOptions.every(
        (opt) =>
          selectedOptions[opt.name]?.value === opt.value ||
          (opt.name === category && opt.value === value)
      )
    );
    console.log(matchingVariant);
    if (matchingVariant) {
      setVariant(matchingVariant.node.id);
      console.log(matchingVariant.node.id);
    }
  };
  console.log(variant);
  return (
    <div className="">
      {product && (
        <div>
          <div className="flex flex-wrap">
            <div className="max-[525px]:w-full">
              <Image
                src={product?.featuredImage?.src}
                width={300}
                height={300}
                className="w-full flex"
              />
            </div>
            <div className="min-[768px]:w-[35vw] max-[440px]:py-4">
              <h1 className="text-gray-800 ms-8 font-bold text-5xl">
                {product.title}
              </h1>
              <p className="font-light ms-8 mt-5 text-xl">
                {product.description}
              </p>
              <p className="italic ms-8 mt-2">{product?.metafield?.value}</p>
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
              <div className="variants ms-9 mt-4">
                {categories.map((category) => {
                  const valuesInCategory = data
                    .flatMap((variant) => variant.node.selectedOptions)
                    .filter((option) => option.name === category)
                    .map((option) => ({
                      value: option.value,
                      variantId: data.find((variant) =>
                        variant.node.selectedOptions.some(
                          (opt) =>
                            opt.name === category && opt.value === option.value
                        )
                      ).node.id,
                    }));

                  const uniqueValues = valuesInCategory.filter(
                    (value, index, self) =>
                      self.findIndex((v) => v.value === value.value) === index
                  );
                  return (
                    <div key={category} className="">
                      {category === "Color" ? (
                        <div className="mt-3">
                          <p className="font-semibold ">{category}</p>
                          {uniqueValues.map((option) => (
                            <button
                              key={option.value}
                              onClick={() =>
                                handleOptionChange(
                                  category,
                                  option.value,
                                  option.variantId
                                )
                              }
                              className={`color-${
                                option.value
                              } btn border-2 border-gray-400 rounded me-3 p-3 px-3 py-1 ${
                                selectedOptions[category]?.value ===
                                option.value
                                  ? "active"
                                  : ""
                              }`}
                              style={{ padding: "3%" }}
                            ></button>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-3">
                          <p className="font-semibold">{category}</p>
                          {uniqueValues.map((option) => (
                            <button
                              key={option.value}
                              onClick={() =>
                                handleOptionChange(
                                  category,
                                  option.value,
                                  option.variantId
                                )
                              }
                              className={`btn border-2 border-gray-400 rounded me-3 px-3 py-1 ${
                                selectedOptions[category]?.value ===
                                option.value
                                  ? "active"
                                  : ""
                              }`}
                            >
                              {option.value}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                className="flex-center h-12 mt-5 text-white justify-center w-full rounded-lg bg-slate-400 "
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
            <CartDrawer isDrawerOpen={open} setIsDrawerOpen={setOpen} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;
