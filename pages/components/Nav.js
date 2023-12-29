import React, { useEffect, useState } from "react";
import logo from "../../public/images/logo.svg";
import Link from "next/link";
import cartLogo from "../../utils/cart.gif";
import Image from "next/image";
import { useRouter } from "next/router";
import CartDrawer from "./CartDrawer";
import toast from "react-hot-toast";
import countryCode from "../../utility/countryCode.json";
import {
  createCustomer,
  fetchCustomer,
  loginCustomer,
  recoverCustomer,
} from "@/utility/customer";
import { createCart } from "@/utility/cart";

const Nav = () => {
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "India",
    flag: "🇮🇳",
    code: "IN",
    dial_code: "+91",
  });
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSignIn, setIsSignIn] = useState("signIn");
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    acceptsMarketing: true,
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    phone: "",
  });
  const [loginUser, setLoginUser] = useState({
    email: "",
    password: "",
  });
  const [recoverUser, setRecoverUser] = useState({
    email: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const storedAccessToken = localStorage.getItem("accessToken");
      const cartId = localStorage.getItem("cartId");
      console.log(cartId);
      if (!cartId) {
        const cart = await createCart();
        const newCartId = cart;
        localStorage.setItem("cartId", newCartId);
      }
      if (storedAccessToken) {
        try {
          const response = await fetchCustomer(storedAccessToken);
          console.log(response);
          setData(response);
          localStorage.setItem("userEmail", response?.email);
          setLoggedIn(true);
        } catch (error) {
          toast.error(error.message);
        }
      }
    };
    fetchUser();
  }, []);

  const handleSignIn = async () => {
    try {
      if (!loginUser.email || !loginUser.password) {
        return toast.error("Fill all required fields");
      }
      const loggedUser = { ...loginUser };
      const response = await loginCustomer(loggedUser);
      localStorage.setItem("userEmail", loginUser.email);
      localStorage.setItem("accessToken", response);
      const userData = await fetchCustomer(response);
      setData(userData);
      setLoggedIn(true);
      setModalOpen(false);
      toast.success("User Signed In Successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSignOut = async () => {
    setToggleDropdown(false);
    setLoggedIn(false);
    setUser({
      acceptsMarketing: true,
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      phone: "",
    });
    setLoginUser({
      email: "",
      password: "",
    });
    setRecoverUser({
      email: "",
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("cartId");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };
  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginUser((user) => ({ ...user, [name]: value }));
  };
  const handleRecoverInputChange = (e) => {
    const { name, value } = e.target;
    setRecoverUser((user) => ({ ...user, [name]: value }));
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async () => {
    if (
      !user.email ||
      !user.password ||
      !user.phone ||
      !user.firstName ||
      !user.lastName
    ) {
      return toast.error("Fill all required fields");
    }
    try {
      const newUser = { ...user };
      if (selectedCountry) {
        const dialCode = selectedCountry.dial_code;
        newUser.phone = `${dialCode}${newUser.phone}`;
      }
      const response = await createCustomer(newUser);
      localStorage.setItem("userEmail", response.email);
      const loginData = { email: response.email, password: newUser.password };
      const login = await loginCustomer(loginData);
      const customer = await fetchCustomer(login);
      setData(customer);
      setLoggedIn(true);
      setModalOpen(false);
      toast.success("User Signed In Sucessfully");
    } catch (error) {
      toast.error(error);
      console.log(selectedCountry);
    }
  };
  const handleCountryChange = (e) => {
    const selectedCountryCode = e.target.value;
    const country = countryCode.find(
      (c) => c.dial_code === selectedCountryCode
    );
    setSelectedCountry(country);
  };

  useEffect(() => {
    if (selectedCountry) {
      const dialCode = selectedCountry.dial_code;
      console.log(dialCode);
    }
  }, [selectedCountry]);
  const handleRecover = async () => {
    if (!recoverUser.email) {
      return toast.error("Fill all required fields");
    }
    try {
      const userEmail = recoverUser.email;
      const response = await recoverCustomer(userEmail);
      console.log(response);
      toast.success("Please check your registered email for Reset Url ");
      setIsSignIn("signIn");
    } catch (error) {
      toast.error(error);
    }
    setIsSignIn("signIn");
  };
  function titleFormatted(inputTitle) {
    return inputTitle.replace(/([A-Z])/g, " $1").trim();
  }
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
          {loggedIn ? (
            <div className="flex gap-3 md:gap-5">
              <Link href="/products" className="black_btn">
                All Products
              </Link>
              <button
                type="button"
                onClick={() => handleSignOut()}
                className="outline_btn"
              >
                Sign Out
              </button>
              <div>
                <button onClick={() => setOpen(true)}>
                  <Image src={cartLogo} width={35} height={35} alt="Cart" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="black_btn"
              >
                Sign In
              </button>
            </>
          )}
        </div>

        <div className="sm:hidden flex relative">
          {loggedIn ? (
            <div className="flex">
              <button onClick={() => setToggleDropdown((prev) => !prev)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16"
                  width="14"
                  viewBox="0 0 448 512"
                >
                  <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
                </svg>
              </button>

              {toggleDropdown && (
                <div className="dropdown">
                  <Link
                    href="/products"
                    className="dropdown_link"
                    onClick={() => setToggleDropdown(false)}
                  >
                    All Products
                  </Link>
                  <button
                    onClick={() => setOpen(true)}
                    className="dropdown_link"
                  >
                    Cart
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-2 w-full black_btn"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="black_btn"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </nav>
      {modalOpen ? (
        <div className="fixed top-0 left-0 w-full h-full flex flex-wrap items-center justify-center">
          <div className="bg-black bg-opacity-50 w-full h-full fixed top-0 left-0"></div>
          <div className="bg-white shadow-lg p-4 rounded relative z-10 m-4">
            <div className="flex justify-between items-center pt-3 px-5">
              <p className="font-semibold text-2xl capitalize">
                {titleFormatted(isSignIn)}
              </p>
              <p
                className="font-medium text-gray-400 text-2xl cursor-pointer"
                onClick={() => setModalOpen(false)}
              >
                X
              </p>
            </div>

            {isSignIn === "signIn" ? (
              <form className=" rounded px-8 pt-6 pb-8 w-[40vw]">
                <div className="mb-4 w-full">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-email"
                  >
                    Email
                  </label>
                  <input
                    className="appearance-none block w-full  text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-email"
                    type="email"
                    name="email"
                    value={loginUser.email}
                    onChange={handleLoginInputChange}
                    placeholder="Email"
                  />
                </div>
                <div className="mb-6">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={loginUser.password}
                      onChange={handleLoginInputChange}
                      placeholder="Password"
                    />
                    <span
                      className="absolute right-0 top-0 m-3.5 cursor-pointer"
                      onClick={handleTogglePassword}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="16"
                          width="18"
                          viewBox="0 0 576 512"
                        >
                          <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="16"
                          width="20"
                          viewBox="0 0 640 512"
                        >
                          <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" />
                        </svg>
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="bg-zinc-900  hover:bg-zinc-800 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={handleSignIn}
                  >
                    Sign In
                  </button>
                  <button
                    className=" flex items-center text-center font-medium text-sm text-black hover:text-gray-600"
                    onClick={() => setIsSignIn("recover")}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="my-2 w-full text-center text-lg">
                  If user is not signed in{" "}
                  <a
                    href="#"
                    className="underline font-semibold"
                    onClick={() => setIsSignIn("signUp")}
                  >
                    Sign Up{" "}
                  </a>
                </div>
              </form>
            ) : isSignIn === "signUp" ? (
              <form className="w-[60vw] mt-4 p-4">
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      First Name
                    </label>
                    <input
                      className="appearance-none block w-full  text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      id="grid-first-name"
                      type="text"
                      name="firstName"
                      value={user.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-last-name"
                    >
                      Last Name
                    </label>
                    <input
                      className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-last-name"
                      type="text"
                      name="lastName"
                      value={user.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-email"
                    >
                      Email
                    </label>
                    <input
                      className="appearance-none block w-full  text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      id="grid-email"
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        className="appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={user.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                      />
                      <span
                        className="absolute right-0 top-0 m-3.5 cursor-pointer"
                        onClick={handleTogglePassword}
                      >
                        {showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            width="18"
                            viewBox="0 0 576 512"
                          >
                            <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            width="20"
                            viewBox="0 0 640 512"
                          >
                            <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z" />
                          </svg>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-2">
                  <div className="w-full md:w-2/4 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-phone"
                    >
                      Phone
                    </label>
                    <div className="flex">
                      <select
                        id="grid-phone"
                        className="appearance-none block max-w-full text-gray-700 border border-gray-200 rounded-tl py-3 px-4 leading-tight focus:outline-none bottom-10 focus:bg-white focus:border-gray-500"
                        onChange={handleCountryChange}
                        value={selectedCountry ? selectedCountry.dial_code : ""}
                      >
                        <option value="">Select Country</option>
                        {countryCode.map((country) => (
                          <option
                            key={country.code}
                            value={country.dial_code}
                            className="px-4"
                          >
                            {country.code} ({country.dial_code})
                          </option>
                        ))}
                      </select>
                      <input
                        className="appearance-none block w-full  text-gray-700 border border-gray-200 rounded-tr rounded-bl py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-phone"
                        type="text"
                        name="phone"
                        value={user.phone}
                        onChange={handleInputChange}
                        placeholder="Phone No."
                        maxLength="10"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-5">
                  <button
                    className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={handleSignUp}
                  >
                    Sign Up
                  </button>
                  <button
                    className="flex items-center text-center font-bold text-sm text-black hover:text-gray-600"
                    onClick={() => setIsSignIn("signIn")}
                  >
                    Already have an account? Sign In
                  </button>
                </div>
              </form>
            ) : isSignIn === "recover" ? (
              <form className=" rounded px-8 pt-6 pb-8 w-[40vw]">
                <div className="mb-4 w-full">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-email"
                  >
                    Email
                  </label>
                  <input
                    className="appearance-none block w-full  text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-email"
                    type="email"
                    name="email"
                    value={recoverUser.email}
                    onChange={handleRecoverInputChange}
                    placeholder="Email"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="bg-zinc-900  hover:bg-zinc-800 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={handleRecover}
                  >
                    Submit
                  </button>
                  <button
                    className=" flex items-center text-center font-medium text-sm text-black hover:text-gray-600"
                    onClick={() => setIsSignIn("recover")}
                  >
                    Sign Up if you do not have an account
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        </div>
      ) : null}
      <CartDrawer isDrawerOpen={open} setIsDrawerOpen={setOpen} />
    </>
  );
};

export default Nav;
