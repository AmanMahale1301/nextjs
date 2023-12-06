import React, { useEffect, useState } from "react";
import { fetchCartItems } from "../utility/cart";
import Image from "next/image";
import logo from "../../utils/cart.gif";
const CartDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [product, setProduct] = useState([]);
  const [data, setData] = useState([]);
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    const cartId = localStorage.getItem("cartId");
    console.log("test");
    const fetchCartData = async () => {
      try {
        if (isDrawerOpen) {
          console.log(cartId);
          const response = await fetchCartItems(cartId);
          console.log(response);
          setProduct(response.lines.edges);
          console.log(response);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCartData();
  }, [isDrawerOpen]);
  console.log(data);
  return (
    <div>
      <button
        onClick={toggleDrawer}
        className="border-2 border-slate-900 text-black py-2 px-4 rounded-full hover:bg-slate-800 hover:text-white"
      >
        <Image src={logo} width={20} height={20} alt="Cart" />
      </button>

      {isDrawerOpen && (
        <div className="fixed top-0 right-0 h-full w-2/4 shadow-2xl bg-zinc-100 fl">
          <div className="">
            <div className="w-full flex justify-between px-5 pt-4">
              <span className=" w-full text-2xl font-semibold">Cart</span>
              <span className="text-2xl font-semibold text-gray-400 bg- opacity-60">
                <button onClick={toggleDrawer}>X</button>
              </span>
            </div>
            <ul className="w-full  px-10 mt-11">
              {console.log(product, "Cart")}
              {product.map((cart) => (
                <li key={cart.node.merchandise.id}>
                  <div className=" border-2  rounded-sm border-grey-800 my-4 flex">
                    <div className="w-1/3 flex">
                      <Image
                        src={cart.node.merchandise.product.featuredImage.src}
                        width={150}
                        height={150}
                        alt="test"
                        className="w-full"
                      />
                    </div>
                    <div className="flex w-full">
                      <div className="w-2/3 justify-start ps-3 ">
                        <div className="font-semibold mt-1">
                          <span>{cart.node.merchandise.product.title}</span>
                        </div>
                        <div className="font-semibold mt-3">
                          Quantity : {cart.node.quantity}
                        </div>
                      </div>
                      <div className="flex justify-center items-center">
                        <span className="font-medium">
                          ₹ {cart.node.cost.totalAmount.amount}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;
