import React, { useState, useEffect } from "react";
import withApollo from "../../../lib/withApollo";
import { getDataFromTree } from "@apollo/react-ssr";
import { useMutation } from "@apollo/react-hooks";
import {
  createNotificationMutation,
  getAllNotificationsByClassQuery,
} from "../../../queries/notificationQueries";
import Layout from "../../../components/layout/Layout";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";
registerLocale("pl", pl);
import "react-datepicker/dist/react-datepicker.css";
import Head from "../../../components/layout/Head";

const AddNotification = () => {
  const [alert, setAlert] = useState("");
  const [alertTimeout, setAlertTimeout] = useState("");
  const [createNotification] = useMutation(createNotificationMutation);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [importance, setImportance] = useState("");

  // Clear timeout
  useEffect(() => () => clearTimeout(alertTimeout));

  const showAlert = (alertObj) => {
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

  const handleDateChange = (date) => {
    setDate(date);
  };

  const handleChange = ({ target: { name, value } }) => {
    switch (name) {
      case "title":
        return setTitle(value);
      case "description":
        return setDescription(value);
      case "importance":
        return setImportance(value);
      default:
        break;
    }
  };

  const clearInputs = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setImportance("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !importance || !date) {
      return showAlert({
        type: "danger",
        msg: "Proszę wypełnić wszystkie pola",
      });
    }

    const dataObj = {
      title,
      description,
      importance,
      date: date.toISOString(),
    };

    try {
      await createNotification({
        variables: dataObj,
        refetchQueries: [{ query: getAllNotificationsByClassQuery }],
      });
      clearInputs();
      showAlert({ type: "success", msg: "Dodano powiadomienie!" });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <Head title="Dodaj powiadomienie" />
      <div className="cms-add-notification container">
        <h1 className="global-section-title">Dodaj powiadomienie</h1>
        <form
          action="submit"
          className="cms-add-notification-form"
          onSubmit={handleSubmit}>
          {/* Alert */}
          {alert ? (
            <div
              className={`alert alert--${alert.type} cms-add-notification__alert`}>
              <p className="alert__text">{alert.msg}</p>
              <i
                className="fas fa-times alert-close"
                onClick={clearAlert}
                aria-hidden="true"></i>
            </div>
          ) : null}
          <input
            type="text"
            name="title"
            placeholder="Tytuł powiadomienia..."
            className="input input--default cms-add-notification__input"
            onChange={handleChange}
            value={title}
          />
          <input
            type="text"
            name="description"
            placeholder="Krótka informacja..."
            className="input input--default cms-add-notification__input"
            onChange={handleChange}
            value={description}
          />
          <select
            name="importance"
            onChange={handleChange}
            className="input input--default cms-add-notification__input"
            value={importance}>
            <option value="" disabled>
              Waga zadania...
            </option>
            <option value="low">Mało ważne</option>
            <option value="medium">Średnio ważne</option>
            <option value="height">Bardzo ważne</option>
          </select>
          <DatePicker
            selected={date}
            onChange={handleDateChange}
            locale="pl"
            placeholderText="Termin zadania..."
            className="input input--default cms-add-notification__input"
          />
          <button
            type="submit"
            className="btn btn--theme cms-add-notification__submit">
            Dodaj powiadomienie
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default withApollo(AddNotification, { getDataFromTree });
