import React, { useState, useRef, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { withRouter } from "next/router";
import { useMutation } from "@apollo/react-hooks";
import { changePasswordMutation } from "../../queries/authQueries";

const NewPassword = ({ router }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState("");
  const alertTimeout = useRef();
  const [changePassword] = useMutation(changePasswordMutation);

  const handleChange = ({ target: { name, value } }) => {
    switch (name) {
      case "password":
        return setPassword(value);
      case "confirmPassword":
        return setConfirmPassword(value);
      default:
        break;
    }
  };

  // Clear timeout alert
  useEffect(() => {
    return () => clearTimeout(alertTimeout.current);
  }, []);

  const showAlert = alertObj => {
    // Set alert
    setAlert(alertObj);
    alertTimeout.current = setTimeout(clearAlert, 4000);
  };

  const clearAlert = () => {
    setAlert("");
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!router.query.token)
      return showAlert({
        msg: "Brak tokenu uwierzytelniającego - nieporawny link",
        type: "danger"
      });

    if (!password || !confirmPassword)
      return showAlert({
        msg: "Proszę wypełnić wszystkie pola",
        type: "danger"
      });

    if (password.length < 8)
      return showAlert({
        msg: "Hasło musi zawierać minimum 8 znaków",
        type: "danger"
      });

    if (password !== confirmPassword)
      return showAlert({
        msg: "Hasła nie są identyczne",
        type: "danger"
      });

    // Attempt to change password
    try {
      await changePassword({
        variables: { token: router.query.token, newPassword: password }
      });
      setAlert({
        msg: "Hasło zostało zmienione - możesz się zalogować",
        type: "success"
      });
      router.push("/logowanie");
    } catch (err) {
      if (err.graphQLErrors) {
        showAlert({ type: "danger", msg: err.graphQLErrors[0].message });
      } else {
        console.log(err);
      }
    }
  };

  return (
    <Layout>
      <div className="confirmed-change-password container">
        <h1 className="global-section-title">Zmień hasło</h1>
        {alert ? (
          <div
            className={`alert alert--${alert.type} confirmed-change-password__alert mb-1`}>
            <p className="alert__text">{alert.msg}</p>
            <i
              className="fas fa-times alert-close"
              onClick={clearAlert}
              aria-hidden="true"></i>
          </div>
        ) : null}
        <form
          action="submit"
          onSubmit={handleSubmit}
          className="change-password">
          <label htmlFor="password" className="label label--default">
            Nowe hasło:
          </label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            className="input input--default mb-1"
          />
          <label htmlFor="confirmPassword" className="label label--default">
            Powtórz hasło:
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            onChange={handleChange}
            className="input input--default"
          />
          <button typ="submit" className="btn btn--theme mt-1">
            Zmień hasło
          </button>
        </form>
      </div>
    </Layout>
  );
};
export default withRouter(NewPassword);
