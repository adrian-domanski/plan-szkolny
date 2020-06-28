import React, { useState, useContext, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { addUserToClassMutation } from "../../queries/classQueries";
import { authUserQuery } from "../../queries/authQueries";
import { useMutation } from "@apollo/react-hooks";
import { AuthContext } from "../../context/authContext";
import { withRouter } from "next/router";

const JoinClass = ({ router }) => {
  const [classCode, setClassCode] = useState("");
  const [className, setClassName] = useState("");
  const [alertTimeout, setAlertTimeout] = useState("");
  const [alert, setAlert] = useState("");
  const {
    authContext: { token }
  } = useContext(AuthContext);

  const [joinClass] = useMutation(addUserToClassMutation);

  // Clear timeout
  useEffect(() => () => clearTimeout(alertTimeout));

  const showAlert = alertObj => {
    // Clear current alert
    if (alert || alertTimeout) {
      clearAlert();
    }
    // Set alert
    setAlert(alertObj);
    const timeout = setTimeout(clearAlert, 4000);
    setAlertTimeout(timeout);
  };

  const clearAlert = () => {
    setAlert("");
    if (alertTimeout) {
      clearTimeout(alertTimeout);
    }
  };

  const handleChange = ({ target: { value, name } }) => {
    switch (name) {
      case "classCode":
        return setClassCode(value);
      case "className":
        return setClassName(value);
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    try {
      await joinClass({
        variables: { code: classCode, className },
        refetchQueries: [{ query: authUserQuery, variables: { token } }]
      });
      router.push("/app/moje-konto");
    } catch (err) {
      if (err.graphQLErrors) {
        showAlert({ type: "danger", msg: err.graphQLErrors[0].message });
      } else {
        console.log(err.message);
      }
    }
  };
  return (
    <Layout>
      <div className="join-class container">
        <h1 className="global-section-title create-class__title">
          Dołącz do klasy
        </h1>
        {/* Alert */}
        {alert ? (
          <div className={`alert alert--${alert.type} mb-1`}>
            <p className="alert__text">{alert.msg}</p>
            <i
              className="fas fa-times alert-close"
              onClick={clearAlert}
              aria-hidden="true"></i>
          </div>
        ) : null}
        <form
          action="submit"
          onSubmit={e => e.preventDefault()}
          className="join-class-form">
          <input
            type="text"
            placeholder="Nazwa klasy..."
            name="className"
            value={className}
            onChange={handleChange}
            className="input input--default create-class__input"
          />
          <input
            type="text"
            placeholder="Kod klasy..."
            name="classCode"
            value={classCode}
            onChange={handleChange}
            className="input input--default create-class__input"
          />
          <button
            onClick={handleSubmit}
            className="btn btn--theme create-class__btn">
            Dołącz
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default withRouter(JoinClass);
