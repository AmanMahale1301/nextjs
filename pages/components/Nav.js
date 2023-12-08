import React, { useEffect, useState } from "react";
import logo from "../../public/images/logo.svg";
import Link from "next/link";
import cartLogo from "../../utils/cart.gif";
import Image from "next/image";
import { signIn, signOut, getProviders, useSession } from "next-auth/react";
import { createCart } from "../utility/cart";
import { useRouter } from "next/router";
import CartDrawer from "./CartDrawer";
const Nav = () => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const setProvider = async () => {
      const response = await getProviders();
      // console.log(response, "test");
      const email = session?.user?.email;
      const storedCartId = localStorage.getItem("cartId");

      if (!storedCartId) {
        const cart = await createCart();
        const newCartId = cart.data.cartCreate.cart.id;
        localStorage.setItem("cartId", newCartId);
      }
      localStorage.setItem("userEmail", email);
      setProviders(response);
    };
    setProvider();
  }, [session]);

  const handleSignOut = async () => {
    setToggleDropdown(false);
    await signOut({ redirect: false });
    router.push("/");
  };
  return (
    <>
      <nav className="flex-between w-full mb-16 pt-3">
        <Link href="/" className="flex gap-2 flex-center">
          <Image
            src={logo}
            alt="Nextgen Logo"
            width={30}
            height={30}
            className="object-contain"
          />
          <p className="logo_text">NextGen Store</p>
        </Link>
        <div className="sm:flex hidden ">
          {session?.user ? (
            <div className="flex gap-3 md:gap-5">
              <Link href="/products" className="black_btn">
                All Products
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="outline_btn"
              >
                Sign Out
              </button>

              <Link href="/profile">
                <Image
                  src={session?.user?.image}
                  width={37}
                  height={37}
                  className="rounded-full"
                  alt="profile"
                />
              </Link>
              <div>
                <button onClick={() => setOpen(true)}>
                  <Image src={cartLogo} width={35} height={35} alt="Cart" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {providers &&
                Object.values(providers).map((provider) => (
                  <button
                    type="button"
                    key={provider.name}
                    onClick={() => signIn(provider.id)}
                    className="black_btn"
                  >
                    Sign In
                  </button>
                ))}
            </>
          )}
        </div>

        <div className="sm:hidden flex relative">
          {session?.user ? (
            <div className="flex">
              <Image
                src={session?.user?.image}
                width={37}
                height={37}
                className="rounded-full"
                alt="profile"
                onClick={() => setToggleDropdown((prev) => !prev)}
              />

              {toggleDropdown && (
                <div className="dropdown">
                  <Link
                    href="/profile"
                    className="dropdown_link"
                    onClick={() => setToggleDropdown(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/profile"
                    className="dropdown_link"
                    onClick={() => setToggleDropdown(false)}
                  >
                    Create Prompt
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-5 w-full black_btn"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {providers &&
                Object.values(providers).map((provider) => (
                  <button
                    type="button"
                    key={provider.name}
                    onClick={() => signIn(provider.id)}
                    className="black_btn"
                  >
                    Sign In
                  </button>
                ))}
            </>
          )}
        </div>
      </nav>
      <CartDrawer isDrawerOpen={open} setIsDrawerOpen={setOpen} />
    </>
  );
};

export default Nav;
