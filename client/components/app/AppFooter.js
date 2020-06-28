import React, { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthContext } from "../../context/authContext";

const AppFooter = () => {
  const {
    authContext: { user, isAuth },
  } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownEl = useRef();
  const dropdownTogglerEl = useRef();

  // Dropdown close
  useEffect(() => {
    const handleCloseDropdown = () => {
      if (showDropdown && dropdownEl.current.classList.contains("is-active")) {
        setShowDropdown(false);
      }
    };
    document.body.addEventListener("click", handleCloseDropdown);
    // Clear
    return () =>
      document.body.removeEventListener("click", handleCloseDropdown);
  });

  // Dropdown open
  useEffect(() => {
    const dropdownToggle = () => {
      if (
        !showDropdown &&
        !dropdownEl.current.classList.contains("is-active")
      ) {
        setShowDropdown(true);
      }
    };
    dropdownTogglerEl.current.addEventListener("click", dropdownToggle);
  });

  const isLinkActive = (linkName) => {
    return router.pathname === `/app/${linkName}` ? "active" : "";
  };

  const router = useRouter();
  return (
    <footer className="app-footer">
      <ul className="app-footer-list">
        <li className="app-footer-list__item">
          <Link href="/app/home">
            <a className={`app-footer-list__link ${isLinkActive("home")}`}>
              <i className="fas fa-home footer-icon" aria-hidden="true"></i>
              <span className="link-title">Home</span>
            </a>
          </Link>
        </li>
        <li className="app-footer-list__item">
          <Link
            href={user && user.class ? "/app/zadania" : "/app/moje-zadania"}>
            <a className={`app-footer-list__link ${isLinkActive("zadania")}`}>
              <i className="fas fa-tasks footer-icon" aria-hidden="true"></i>
              <span className="link-title">Zadania</span>
            </a>
          </Link>
        </li>
        {/* Notifications if has class */}
        {user && user.rank ? (
          <li className="app-footer-list__item">
            <Link href="/app/powiadomienia">
              <a
                className={`app-footer-list__link ${isLinkActive(
                  "powiadomienia"
                )}`}>
                <i className="fas fa-bell footer-icon" aria-hidden="true"></i>
                <span className="link-title">Powiadomienia</span>
              </a>
            </Link>
          </li>
        ) : null}
        <li
          className="app-footer-list__item app-footer-list__dropdown-toggler"
          ref={dropdownTogglerEl}>
          <i
            className="fas fa-angle-double-up footer-icon"
            aria-hidden="true"></i>
        </li>
        {/* Other items */}
        <ul
          className={`app-footer-dropdown ${showDropdown ? "is-active" : ""}`}
          ref={dropdownEl}>
          {/* User with class */}
          {user && user.class ? (
            <>
              <li className="app-footer-dropdown__item">
                <Link href="/app/moje-zadania">
                  <a
                    className={`app-footer-dropdown__link ${isLinkActive(
                      "moje-zadania"
                    )}`}>
                    <i
                      className="fas fa-user-tag footer-icon"
                      aria-hidden="true"></i>
                    <span className="link-title">Moje Zadania</span>
                  </a>
                </Link>
              </li>
              <li className="app-footer-dropdown__item">
                <Link href="/app/plan-lekcji">
                  <a
                    className={`app-footer-dropdown__link ${isLinkActive(
                      "plan-lekcji"
                    )}`}>
                    <i
                      className="fas fa-table footer-icon"
                      aria-hidden="true"></i>
                    <span className="link-title">Plan Lekcji</span>
                  </a>
                </Link>
              </li>
              <li className="app-footer-dropdown__item">
                <Link href="/app/chat">
                  <a
                    className={`app-footer-dropdown__link ${isLinkActive(
                      "chat"
                    )}`}>
                    <i
                      className="fas fa-comments footer-icon"
                      aria-hidden="true"></i>
                    <span className="link-title">Chat</span>
                  </a>
                </Link>
              </li>
            </>
          ) : null}

          {/* All users links */}
          <li className="app-footer-dropdown__item">
            <Link href="/app/moje-konto">
              <a
                className={`app-footer-dropdown__link ${isLinkActive(
                  "moje-konto"
                )}`}>
                <i className="fas fa-user footer-icon" aria-hidden="true"></i>
                <span className="link-title">Moje Konto</span>
              </a>
            </Link>
          </li>

          {/* Class admin links */}
          {user &&
          user.class &&
          (user.rank === "admin" || user.rank === "owner") ? (
            <li className="app-footer-dropdown__item">
              <Link href="/app/cms">
                <a
                  className={`app-footer-dropdown__link ${isLinkActive(
                    "cms"
                  )}`}>
                  <i className="fas fa-cog footer-icon" aria-hidden="true"></i>
                  <span className="link-title">Panel Zarządzania</span>
                </a>
              </Link>
            </li>
          ) : null}
        </ul>
      </ul>
    </footer>
  );
};

export default AppFooter;
