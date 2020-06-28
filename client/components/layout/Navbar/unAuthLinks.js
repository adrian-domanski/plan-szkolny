import React from "react";
import Link from "next/link";
import { withRouter } from "next/router";

const UnAuthLinks = ({ router }) => {
  return (
    <>
      <li className="main-navbar-list__item">
        <Link href="/rejestracja">
          <a
            className={`main-navbar-list__item-link ${
              router.pathname === "/rejestracja" ? "active" : ""
            }`}>
            Rejestracja
          </a>
        </Link>
      </li>
      <li className="main-navbar-list__item">
        <Link href="/logowanie">
          <a
            className={`main-navbar-list__item-link ${
              router.pathname === "/logowanie" ? "active" : ""
            }`}>
            Logowanie
          </a>
        </Link>
      </li>
    </>
  );
};

export default withRouter(UnAuthLinks);
