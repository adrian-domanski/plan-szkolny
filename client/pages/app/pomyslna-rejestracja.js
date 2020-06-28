import React, { useContext, useState, useEffect, useRef } from "react";
import Layout from "../../components/layout/Layout";
import { useMutation } from "@apollo/react-hooks";
import { resentEmailConfirmMutation } from "../../queries/authQueries";
import { AuthContext } from "../../context/authContext";
import { withRouter } from "next/router";

const RegisterSuccess = () => {
  const [newEmail, setNewEmail] = useState("");
  const [alert, setAlert] = useState("");
  const alertTimeout = useRef();
  const {
    authContext: { user },
  } = useContext(AuthContext);
  const [resentEmail] = useMutation(resentEmailConfirmMutation);

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

  useEffect(() => {
    setNewEmail(user.email);
  }, []);

  const handleEmailChange = ({ target: { value } }) => {
    setNewEmail(value);
  };

  const handleResentEmail = async () => {
    try {
      await resentEmail({
        variables: { email: newEmail },
      });
      showAlert({ type: "success", msg: "Wiadomość została wysłana" });
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
      <div className="register-success-page container">
        <h1 className="global-section-title">Potwierdź adres email</h1>
        <p className="text-lead">
          W celu potwierdzenia twojego adresu email, wysłaliśmy link aktywacyjny
          na adres: <b>{user && user.email}</b>
        </p>
        <p className="text-lead mt-1">
          Jeżeli nie widzisz naszej wiadomości <b>sprawdź folder ze spamem</b>,
          lub wyślij wiadomość ponownie
        </p>
        {alert ? (
          <div
            className={`alert alert--${alert.type} confirm-email-page__alert mt-1`}>
            <p className="alert__text">{alert.msg}</p>
            <i
              className="fas fa-times alert-close"
              onClick={clearAlert}
              aria-hidden="true"></i>
          </div>
        ) : null}
        <label htmlFor="newEmail" className="label label--default mt-1">
          Chcę zmienić adres email
        </label>
        <input
          type="email"
          className="input input--default"
          value={newEmail}
          onChange={handleEmailChange}
          name="newEmail"
          onChange={handleEmailChange}
          id="newEmail"
        />
        <button
          className="register-success-page__submit btn btn--theme mt-1"
          onClick={handleResentEmail}>
          {newEmail !== user.email
            ? "Wyślij ponownie na nowy adres"
            : "Wyślij email ponownie"}
        </button>
      </div>
    </Layout>
  );
};

export default withRouter(RegisterSuccess);
