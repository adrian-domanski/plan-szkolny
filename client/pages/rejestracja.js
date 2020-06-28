import React, { useState, useEffect, useContext, useRef } from "react";
import Layout from "../components/layout/Layout";
import { registerMutation } from "../queries/authQueries";
import { useMutation } from "@apollo/react-hooks";
import { withRouter } from "next/router";
import { AuthContext } from "../context/authContext";
import validator from "validator";
import { capitalize } from "../helpers/helpers";
import Head from "../components/layout/Head";

const Register = ({ router }) => {
  // const [name, setName] = useState("John");
  // const [surname, setSurname] = useState("Doe");
  // const [email, setEmail] = useState("plan-szkolny@o2.pl");
  // const [password, setPassword] = useState("test1234");
  // const [confirmPassword, setConfirmPassword] = useState("test1234");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [classCode, setClassCode] = useState("");
  const [hasClass, setHasClass] = useState(false);
  const [alert, setAlert] = useState("");
  const alertTimeout = useRef();
  const [registerNewUser] = useMutation(registerMutation);
  const {
    dispatch: authDispatch,
    authContext: { isAuth },
  } = useContext(AuthContext);

  // Redirect if logged in
  useEffect(() => {
    if (isAuth) {
      router.push("/app/home");
    }
  }, [isAuth]);

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

  const handleChange = ({ target: { name, value } }) => {
    switch (name) {
      case "name":
        if (value.length > 12) return;
        return setName(capitalize(value));
      case "surname":
        if (value.length > 12) return;
        return setSurname(capitalize(value));
      case "email":
        return setEmail(value);
      case "password":
        return setPassword(value);
      case "passwordConfirm":
        return setConfirmPassword(value);
      case "hasClass":
        return setHasClass(!hasClass);
      case "classCode":
        return setClassCode(value);
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // All fields filled
    if (!name || !surname || !email || !password || !confirmPassword)
      return showAlert({
        type: "danger",
        msg: "Proszę wypełnić wszystkie dane",
      });
    // Valid name
    if (!validator.isAlpha(name, "pl-PL"))
      return showAlert({
        type: "danger",
        msg: "Imie może zawierać tylko litery",
      });
    // Valid surname
    if (!validator.isAlpha(surname, "pl-PL"))
      return showAlert("Nazwisk może zawierać tylko litery");
    // Correct email
    if (!validator.isEmail(email))
      return showAlert({ type: "danger", msg: "Niepoprawny adres email" });
    // Password length > 8
    if (password.length < 8)
      return showAlert({
        type: "danger",
        msg: "Hasło musi zawierać minimum 8 znaków",
      });
    // Confirm password && password ale same
    if (password !== confirmPassword)
      return showAlert({ type: "danger", msg: "Hasła nie są identyczne" });

    if (hasClass && !classCode)
      return showAlert({
        type: "danger",
        msg: "Proszę podać kod klasy lub odznaczyć tą opcję",
      });
    const credentials = {
      name,
      surname,
      email,
      password,
      classCode,
    };

    // Attempt to register
    try {
      const { data } = await registerNewUser({ variables: credentials });
      authDispatch({ type: "REGISTER_SUCCESS", payload: data.createUser });
      router.push("/logowanie");
    } catch (err) {
      console.log(err);
      if (err.graphQLErrors) {
        showAlert({ type: "danger", msg: err.graphQLErrors[0].message });
      } else {
        console.log(err);
      }
      authDispatch({ type: "REGISTER_ERROR" });
    }
  };
  return (
    <Layout>
      <Head title="Rejestracja" />
      <div className="register-page container">
        <div className="register-container">
          <h1 className="register-title">Rejestracja</h1>
          {alert ? (
            <div className={`alert alert--${alert.type} register-page__alert`}>
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
            className="register-form">
            <input
              type="text"
              value={name}
              onChange={handleChange}
              name="name"
              placeholder="Imie..."
              className="register-form__input input input--default"
            />
            <input
              type="text"
              value={surname}
              onChange={handleChange}
              name="surname"
              placeholder="Nazwisko..."
              className="register-form__input input input--default"
            />
            <input
              type="email"
              value={email}
              onChange={handleChange}
              name="email"
              placeholder="Email..."
              className="register-form__input input input--default"
            />
            <input
              type="password"
              value={password}
              onChange={handleChange}
              name="password"
              placeholder="Hasło..."
              className="register-form__input input input--default"
            />
            <input
              type="password"
              name="passwordConfirm"
              placeholder="Powtórz hasło..."
              value={confirmPassword}
              onChange={handleChange}
              className="register-form__input input input--default"
            />

            <div className="form-control">
              <label htmlFor="hasClass" className="text-lead">
                Mam kod klasy i chcę go użyć
              </label>
              <input
                type="checkbox"
                className="checkbox-default"
                name="hasClass"
                onChange={handleChange}
                checked={hasClass}
              />
            </div>

            {/* If has class then ask for code */}
            {hasClass ? (
              <input
                type="text"
                name="classCode"
                placeholder="Kod klasy..."
                value={classCode}
                onChange={handleChange}
                className="register-form__input input input--default"
              />
            ) : null}

            <button type="submit" className="btn btn--theme register-form__btn">
              Zarejestruj
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(Register);
