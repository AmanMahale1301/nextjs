import { Inter } from "next/font/google";
import Meta from "./meta";
import Provider from "./Provider";
import Nav from "./Nav";
import { Toaster } from "react-hot-toast";

const metaData = {
  title: "NextGen Store",
  description: "Discover & share next gen products",
};

export default function Layout({ children }) {
  return (
    <>
      <Provider>
        <Meta {...metaData} />
        <div className="main">
          <div className="gradient" />
        </div>
        <main className="app">
          <Toaster position="top-center" reverseOrder={false} />
          <Nav />
          {children}
        </main>
      </Provider>
    </>
  );
}
