import React from "react";
import Feed from "./components/Feed";
import Collection from "./components/Collection";
import { useSession, signIn, signOut } from "next-auth/react";

const index = () => {
  const { data: session } = useSession();
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
      {categories.map((category) => (
        <Collection category={category} />
      ))}
      {/* <div>
        {session ? (
          <>
            <p>Welcome, {session.user.name}!</p>
            <button onClick={() => signOut()}>Sign out</button>
          </>
        ) : (
          <button onClick={() => signIn("shopify")}>
            Sign in with Shopify
          </button>
        )}
      </div> */}
    </section>
  );
};

export default index;
