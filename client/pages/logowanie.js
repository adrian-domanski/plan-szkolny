import React, { useState, useEffect, useContext, useRef } from "react";
import Layout from "../components/layout/Layout";
import { loginQuery } from "../queries/authQueries";
import { useQuery } from "@apollo/react-hooks";
import { AuthContext } from "../context/authContext";
import { withRouter } from "next/router";
import Link from "next/link";
import Head from "../components/layout/Head";

const LoginPage = ({ router }) => {
  // const [email, setEmail] = useState("plan-szkolny@o2.pl");
  // const [password, setPassword] = useState("test1234");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");
  const alertTimeout = useRef();

  const {
    dispatch: authDispatch,
    authContext: { isAuth },
  } = useContext(AuthContext);

  const { refetch: loginUser } = useQuery(loginQuery, { skip: true });

  // Check if auth - push to app
  useEffect(() => {
    if (isAuth) router.push("/app/home");
  }, [isAuth]);

  const handleChange = ({ target: { name, value } }) => {
    switch (name) {
      case "email":
        return setEmail(value);
      case "password":
        return setPassword(value);
      default:
        break;
    }
  };

  // Clear timeout alert
  useEffect(() => {
    return () => clearTimeout(alertTimeout.current);
  }, []);

  const showAlert = (alertObj) => {
    // Set alert
    setAlert(alertObj);
    alertTimeout.current = setTimeout(clearAlert, 4000);
  };

  const clearAlert = () => {
    setAlert("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password)
      return showAlert({
        msg: "Proszę wypełnić wszystkie pola",
        type: "danger",
      });

    const credentials = {
      email,
      password,
    };

    try {
      setAlert({ msg: "Proszę czekać...", type: "warning" });
      const { data } = await loginUser(credentials);
      authDispatch({ type: "LOGIN_SUCCESS", payload: data.login });
    } catch (err) {
      if (err.graphQLErrors) {
        showAlert({ type: "danger", msg: err.graphQLErrors[0].message });
      } else {
        showAlert({ type: "danger", msg: "Wystąpił błąd" });
        console.log(err);
      }
      authDispatch({ type: "LOGIN_ERROR" });
    }
  };

  return (
    <Layout>
      <Head title="Logowanie" />
      <div className="login-page container">
        <div className="login-container">
          <h1 className="login-title">Logowanie</h1>
          {alert ? (
            <div className={`alert alert--${alert.type} login-page__alert`}>
              <p className="alert__text">{alert.msg}</p>
              <i
                className="fas fa-times alert-close"
                onClick={clearAlert}
                aria-hidden="true"></i>
            </div>
          ) : null}
          <form action="submit" onSubmit={handleSubmit} className="login-form">
            <input
              type="email"
              value={email}
              onChange={handleChange}
              name="email"
              placeholder="Email..."
              className="login-form__input input input--default"
            />
            <input
              type="password"
              value={password}
              onChange={handleChange}
              name="password"
              placeholder="Hasło..."
              className="login-form__input input input--default"
            />
            <Link href="/zmien-haslo">
              <a className="login-form__forget-password-link">
                Nie pamiętam hasła
              </a>
            </Link>

            <button type="submit" className="btn btn--theme login-form__btn">
              Zaloguj
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(LoginPage);
