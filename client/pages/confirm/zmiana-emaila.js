import React, { useState, useRef, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import validator from "validator";
import { withRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import { sendChangeEmailToNewAddressQuery } from "../../queries/authQueries";

const NewEmail = ({ router }) => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState("");
  const alertTimeout = useRef();
  const {
    refetch: sendChangeEmailToNewAddress
  } = useQuery(sendChangeEmailToNewAddressQuery, { skip: true });

  const handleChange = ({ target: { name, value } }) => {
    switch (name) {
      case "email":
        return setEmail(value);
      case "confirmEmail":
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

    if (!email || !confirmEmail)
      return showAlert({
        msg: "Proszę wypełnić wszystkie pola",
        type: "danger"
      });

    if (email !== confirmEmail)
      return showAlert({
        msg: "Adresy nie są identyczne",
        type: "danger"
      });

    if (!validator.isEmail(email))
      return showAlert({
        msg: "Niepoprawny adres email",
        type: "danger"
      });

    // Attempt send confirm email to new one
    try {
      await sendChangeEmailToNewAddress({
        firstStepToken: router.query.token,
        newEmail: email
      });
      setAlert({
        msg:
          "Wysłaliśmy link potwierdzający na twój nowy adres email - prosimy o potwierdzenie",
        type: "success"
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
      <div className="confirm-new-email container">
        <h1 className="global-section-title">Zmień email</h1>
        {alert ? (
          <div
            className={`alert alert--${alert.type} confirmed-new-email__alert mb-1`}>
            <p className="alert__text">{alert.msg}</p>
            <i
              className="fas fa-times alert-close"
              onClick={clearAlert}
              aria-hidden="true"></i>
          </div>
        ) : null}
        <form action="submit" onSubmit={handleSubmit} className="change-email">
          <label htmlFor="email" className="label label--default">
            Nowy email:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={handleChange}
            className="input input--default mb-1"
          />
          <label htmlFor="confirmEmail" className="label label--default">
            Powtórz email:
          </label>
          <input
            type="email"
            name="confirmEmail"
            id="confirmEmail"
            onChange={handleChange}
            className="input input--default"
          />
          <button typ="submit" className="btn btn--theme mt-1">
            Zmień email
          </button>
        </form>
      </div>
    </Layout>
  );
};
export default withRouter(NewEmail);
