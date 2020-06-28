import React, { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "../../../context/authContext";
import { useRouter } from "next/router";

const AuthLinks = () => {
  const router = useRouter();
  const { dispatch: authDispatch } = useContext(AuthContext);

  const handleLogout = (e) => {
    e.preventDefault();
    authDispatch({ type: "LOGOUT_SUCCESS" });
    router.push("/");
  };
  return (
    <>
      <li className="main-navbar-list__item">
        <Link href="/app/home">
          <a
            className={`main-navbar-list__item-link ${
              router.pathname === "/app/home" ? "active" : ""
            }`}>
            Strona Domowa
          </a>
        </Link>
      </li>
      <li className="main-navbar-list__item">
        <a
          href="/"
          onClick={handleLogout}
          className="main-navbar-list__item-link">
          Wyloguj
        </a>
      </li>
    </>
  );
};

export default AuthLinks;
