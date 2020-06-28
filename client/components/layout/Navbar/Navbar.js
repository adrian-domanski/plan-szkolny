import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { AuthContext } from "../../../context/authContext";
import AuthLinks from "./authLinks";
import UnAuthLinks from "./unAuthLinks";
import { withRouter } from "next/router";
import Head from "../../layout/Head";

const Navbar = ({ router }) => {
  const [mobile, setMobile] = useState(false);
  const {
    authContext: { isAuth },
  } = useContext(AuthContext);

  useEffect(() => {
    if (!mobile) return;
    const handleCloseMobile = (e) => {
      if (mobile && !e.target.parentNode.classList.contains("is-active")) {
        setMobile(false);
      }
    };
    document.body.addEventListener("click", handleCloseMobile);
    // Clear
    return () => document.body.removeEventListener("click", handleCloseMobile);
  }, [mobile]);

  const mobileToggle = () => {
    setMobile(!mobile);
  };

  return (
    <nav className="main-navbar">
      <Head />
      <Link href="/">
        <div className="navbar__logo">
          <img
            src="/img/logo.svg"
            className="navbar__logo-img"
            alt="Plan szkolny logo"
          />
        </div>
      </Link>

      <Link href="/">
        <h1 className="site-title">Plan Szkolny</h1>
      </Link>

      <div
        className={`nav-toggler ${mobile ? "is-active" : ""}`}
        onClick={mobileToggle}>
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </div>
      <ul className={`main-navbar-list ${mobile ? "is-active" : ""}`}>
        <li className="main-navbar-list__item">
          <Link href="/">
            <a
              className={`main-navbar-list__item-link ${
                router.pathname === "/" ? "active" : ""
              }`}>
              Strona Główna
            </a>
          </Link>
        </li>
        {isAuth ? <AuthLinks /> : <UnAuthLinks />}
      </ul>
    </nav>
  );
};

export default withRouter(Navbar);
