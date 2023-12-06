import React from "react";
import Feed from "./components/Feed";
import Collection from "./components/Collection";

const index = () => {
  const categories = ["Earrings", "Bracelet", "Necklace"];
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Discover The
        <br className="max-md:hidden" />
        <span className="orange_gradient text-center"> NextGen Products</span>
      </h1>
      <p className="desc text-center">
        Elevating Your Shopping Experience to the Future of Retail
      </p>
      {/* <Feed /> */}
      {categories.map((category) => (
        <Collection category={category} />
      ))}
    </section>
  );
};

export default index;
