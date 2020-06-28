import React, { useState, useEffect, useContext } from "react";
import Layout from "../../components/layout/Layout";
import { createClassMutation } from "../../queries/classQueries";
import { authUserQuery } from "../../queries/authQueries";
import { useMutation } from "@apollo/react-hooks";
import withApollo from "../../lib/withApollo";
import { AuthContext } from "../../context/authContext";
import { useRouter } from "next/router";

const CreateClass = () => {
  const [className, setClassName] = useState("");
  const [alert, setAlert] = useState("");
  const [alertTimeout, setAlertTimeout] = useState("");
  const {
    authContext: { token }
  } = useContext(AuthContext);

  const [createClass] = useMutation(createClassMutation);
  const router = useRouter();

  // Clear timeout
  useEffect(() => () => clearTimeout(alertTimeout));

  const handleChange = ({ target: { value, name } }) => {
    switch (name) {
      case "className":
        return setClassName(value);
      default:
        break;
    }
  };

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

  const handleSubmit = async e => {
    e.preventDefault();

    if (!className) {
      return showAlert({
        type: "danger",
        msg: "Proszę podać nazwę klasy"
      });
    }

    try {
      await createClass({
        variables: { name: className },
        refetchQueries: [{ query: authUserQuery, variables: { token } }]
      });
      router.push("/app/moje-konto");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="create-class container">
        <h1 className="global-section-title create-class__title">
          Utwórz klasę
        </h1>
        {/* Alert */}
        {alert ? (
          <div className={`alert alert--${alert.type} create-class__alert`}>
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
          className="create-class-form">
          <input
            type="text"
            placeholder="Nazwa klasy, np. 3C..."
            className="input input--default create-class__input"
            onChange={handleChange}
            value={className}
            name="className"
          />
          <button className="btn btn--theme create-class__btn">Utwórz</button>
        </form>
      </div>
    </Layout>
  );
};

export default withApollo(CreateClass);
