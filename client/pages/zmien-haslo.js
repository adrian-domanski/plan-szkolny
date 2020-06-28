import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/layout/Layout";
import validator from "validator";
import { remindPasswordQuery } from "../queries/authQueries";
import { useQuery } from "@apollo/react-hooks";

const ChangePassword = () => {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState("");
  const alertTimeout = useRef();
  const { refetch: remindPassword } = useQuery(remindPasswordQuery, {
    skip: true
  });

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

  const handleEmailChange = ({ target: { value } }) => {
    setEmail(value);
  };

  const handleSubmit = async () => {
    if (!email)
      // Not empty
      return showAlert({
        type: "danger",
        msg: "Proszę podać adres email"
      });
    // Correct email
    if (!validator.isEmail(email))
      return showAlert({ type: "danger", msg: "Niepoprawny adres email" });

    // Attempt to send email
    try {
      await remindPassword({ email });
      setEmail("");
      return showAlert({
        type: "success",
        msg: "Wiadomość została wysłana"
      });
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
      <div className="change-password-page container">
        <h1 className="global-section-title">Zmiana hasła</h1>
        <p className="text-lead change-password-page__lead">
          W celu zmiany hasła, prosimy o podanie adresu email przypisanego do
          konta. Dalsze wskazówki przekażemy bezpośrednio na poniższy adres
        </p>
        {alert ? (
          <div
            className={`alert alert--${alert.type} register-page__alert mt-1`}>
            <p className="alert__text">{alert.msg}</p>
            <i
              className="fas fa-times alert-close"
              onClick={clearAlert}
              aria-hidden="true"></i>
          </div>
        ) : null}
        <input
          type="email"
          name="email"
          className="input input--default mt-1"
          placeholder="Twój email..."
          id="email"
          onChange={handleEmailChange}
          value={email}
        />
        <button className="btn btn--theme mt-1" onClick={handleSubmit}>
          Wyślij
        </button>
      </div>
    </Layout>
  );
};

export default ChangePassword;
