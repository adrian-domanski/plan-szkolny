import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/main.scss";
import { useRouter } from "next/router";
import { isApp as isAppFunc } from "../../helpers/helpers";
import AppFooter from "../app/AppFooter";

const Layout = ({ children }) => {
  const router = useRouter();
  const isApp = isAppFunc(router.pathname);

  useEffect(() => {
    const next = document.getElementById("__next");
    if (isApp) next.classList = "app";
    else next.classList = "";
  }, [isApp]);

  return (
    <>
      <Header />
      <main className={`content ${isApp ? "app" : ""}`}>{children}</main>
      {isApp ? (
        <>
          <Footer className="app" />
          <AppFooter />
        </>
      ) : (
        <Footer />
      )}
    </>
  );
};

export default Layout;
