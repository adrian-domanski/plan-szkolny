import { useContext, useEffect } from "react";
import { AuthContext } from "./authContext";
import LoginPage from "../pages/logowanie";
import Home from "../pages/app/home";
import RegisterSuccess from "../pages/app/pomyslna-rejestracja";
import { withRouter } from "next/router";
import { isBrowser } from "../helpers/helpers";

const InitialContextUse = ({
  children,
  authError,
  router: { pathname, push },
}) => {
  const {
    dispatch: authDispatch,
    authContext: { isAuth, user },
  } = useContext(AuthContext);

  useEffect(() => {
    if (!!authError) {
      authDispatch({ type: "AUTH_ERROR" });
    }
  }, [authError]);

  // Unauthenticated user
  if (!isAuth && pathname.includes("/app/")) {
    if (isBrowser()) {
      push("/logowanie");
    }
    return <LoginPage />;
  }

  // Authenticated user, but not confirmed
  if (isAuth && user && !user.confirmed && pathname.includes("/app/")) {
    if (isBrowser() && pathname !== "/app/pomyslna-rejestracja") {
      push("/app/pomyslna-rejestracja");
    }
    return <RegisterSuccess />;
  }

  // Auth user
  if (
    isAuth &&
    user &&
    user.confirmed &&
    (pathname === "/logowanie" || pathname === "/rejestracja")
  ) {
    if (isBrowser()) {
      push("/app/home");
    }
    return <Home />;
  }

  // Authenticated and confirmed user on successfull register page => Home
  if (
    isAuth &&
    user &&
    user.confirmed &&
    pathname === "/app/pomyslna-rejestracja"
  ) {
    if (isBrowser()) {
      push("/app/home");
    }
    return <Home />;
  }

  // Authenticated user without class
  if (isAuth && user && !user.class) {
    if (
      pathname.includes("/app/cms") ||
      pathname.includes("/app/powiadomienia")
    ) {
      if (isBrowser()) {
        push("/app/home");
      }
      return <Home />;
    }
  }

  // Admin routes
  if (isAuth && user.class && user.class.rank === "member") {
    if (pathname.includes("/app/cms")) {
      if (isBrowser()) {
        push("/app/home");
      }
      return <Home />;
    }
  }

  return children;
};

export default withRouter(InitialContextUse);
