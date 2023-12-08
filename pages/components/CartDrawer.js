import React, { useEffect, useState } from "react";
import {
  removeCartItems,
  fetchCartItems,
  updateCartItems,
  createCheckout,
  addToCheckout,
  createCart,
} from "../utility/cart";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
const CartDrawer = ({ isDrawerOpen, setIsDrawerOpen }) => {
  const [product, setProduct] = useState([]);
  const [total, setTotal] = useState();

  const router = useRouter();

  useEffect(() => {
    const cartId = localStorage?.getItem("cartId");
    console.log("test");
    const fetchCartData = async () => {
      try {
        if (isDrawerOpen) {
          console.log(cartId);
          const response = await fetchCartItems(cartId);
          console.log(response);
          setTotal(response.cost.totalAmount.amount);
          setProduct(response.lines.edges);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCartData();
  }, [isDrawerOpen]);

  const increaseQuantity = async (cart) => {
    const cartId = localStorage?.getItem("cartId");
    const merchandiseId = cart.merchandise.id;
    const quantity = cart.quantity + 1;
    const id = cart.id;
    console.log(cart.id);

    const response = await updateCartItems(cartId, id, merchandiseId, quantity);
    console.log(response);
    const newData = await fetchCartItems(cartId);
    setProduct(newData.lines.edges);
    setTotal(newData.cost.totalAmount.amount);
  };

  const decreaseQuantity = async (cart) => {
    const cartId = localStorage?.getItem("cartId");
    if (cart.quantity > 1) {
      const merchandiseId = cart.merchandise.id;
      const quantity = cart.quantity - 1;
      const id = cart.id;
      console.log(cart.id);

      const response = await updateCartItems(
        cartId,
        id,
        merchandiseId,
        quantity
      );
      console.log(response);
      const newData = await fetchCartItems(cartId);
      setProduct(newData.lines.edges);
      setTotal(newData.cost.totalAmount.amount);
    }
  };

  const handleRemove = async (cart) => {
    try {
      console.log(cart);
      const id = cart.id;
      const cartId = localStorage.getItem("cartId");
      const response = await removeCartItems(cartId, id);

      console.log(response);
      const newData = await fetchCartItems(cartId);
      setProduct(newData.lines.edges);
      setTotal(newData.cost.totalAmount.amount);
    } catch (error) {
      console.error(error);
    }
  };
  const handleCheckout = async () => {
    const checkoutItems = product.map((cartItem) => ({
      variantId: cartItem.node.merchandise.id,
      quantity: cartItem.node.quantity,
    }));
    console.log(checkoutItems);
    const checkoutId = await createCheckout();
    const checkout = await addToCheckout(checkoutId, checkoutItems);
    const cart = await createCart();
    const cartId = localStorage.setItem("cartId", cart);
    console.log(cartId);
    router.push(checkout);
  };
  return (
    <div>
      {isDrawerOpen && (
        <div className="fixed top-0 right-0 h-full w-2/4 shadow-2xl bg-zinc-100 fl">
          <div className="">
            <div className="w-full flex justify-between px-5 pt-4">
              <span className=" w-full text-2xl font-semibold">Cart</span>
              <span className="text-2xl font-semibold text-gray-400 bg- opacity-60">
                <button onClick={() => setIsDrawerOpen(false)}>X</button>
              </span>
            </div>
            <ul className="w-full  px-10 mt-11">
              {product.map((cart) => (
                <li key={cart.node.merchandise.id}>
                  <div className=" border-2  rounded-sm border-grey-800 my-4 flex">
                    <div className="w-1/3 flex">
                      <Image
                        src={cart.node.merchandise.product.featuredImage.src}
                        width={150}
                        height={150}
                        alt="test"
                        className="w-full h-32"
                      />
                    </div>
                    <div className="flex w-full">
                      <div className="w-2/3 justify-start ps-3 ">
                        <div className="font-semibold mt-1">
                          <span>{cart.node.merchandise.product.title}</span>
                        </div>
                        <div className="font-semibold mt-3">
                          <div className="mt-5 ms-9 flex justify-start">
                            <button
                              className="px-2 py-1 bg-gray-300 text-gray-700 rounded-l"
                              onClick={() => decreaseQuantity(cart.node)}
                            >
                              -
                            </button>
                            <input
                              type="text"
                              className="w-16 text-center border-t border-b border-gray-300 focus:outline-none"
                              value={cart.node.quantity}
                              readOnly
                            />
                            <button
                              className="px-2 py-1 bg-gray-300 text-gray-700 rounded-r"
                              onClick={() => increaseQuantity(cart.node)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center items-center">
                        <span className="font-medium">
                          ₹ {cart.node.cost.totalAmount.amount}
                        </span>
                      </div>
                      <div className="flex px-6 justify-center items-center">
                        <button onClick={() => handleRemove(cart.node)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20"
                            width="20"
                            viewBox="0 0 448 512"
                          >
                            <path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {total <= 1 ? (
              <>
                <h1 className="font-semibold text-2xl text-center">
                  Wow so empty
                </h1>{" "}
                <br />
                <p className="font-light text-xl text-center">
                  Shop for some products{" "}
                  <Link href="/products" className="underline">
                    Products
                  </Link>
                </p>
              </>
            ) : (
              <>
                <div className="fixed bottom-10 right-0 w-2/4">
                  <div className="flex justify-between px-20">
                    <span className="font-semibold text-center text-2xl ">
                      Total :
                    </span>
                    <span className="font-normal text-2xl underline-offset-4">
                      ₹ {total}
                    </span>
                  </div>
                  <div className="mt-3 px-20">
                    <button
                      onClick={() => handleCheckout(total)}
                      className="flex items-center h-12 text-2xl text-white justify-center w-full rounded bg-slate-500 "
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;
