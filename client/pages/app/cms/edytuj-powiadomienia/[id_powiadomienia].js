import React, { useEffect, useState } from "react";
import { withRouter } from "next/router";
import Layout from "../../../../components/layout/Layout";
import { useQuery, useMutation } from "@apollo/react-hooks";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import {
  getNotificationByClassQuery,
  editNotificationMutation,
  getAllNotificationsByClassQuery,
} from "../../../../queries/notificationQueries";
import pl from "date-fns/locale/pl";
import Head from "../../../../components/layout/Head";
registerLocale("pl", pl);

const TaskEdit = ({ router }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [importance, setImportance] = useState("");
  const [alert, setAlert] = useState("");
  const [alertTimeout, setAlertTimeout] = useState("");

  // Get task query
  const { data: notificationData, loading: notificationLoading } = useQuery(
    getNotificationByClassQuery,
    {
      variables: {
        notificationId: router.query.id_powiadomienia,
      },
    }
  );

  const [editNotification] = useMutation(editNotificationMutation);

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

  useEffect(() => {
    if (!notificationLoading) {
      const {
        title,
        description,
        date,
        importance,
      } = notificationData.getNotificationByClass;
      setTitle(title);
      setDescription(description);
      setImportance(importance);
      setDate(new Date(date));
    }
  }, [notificationLoading]);

  const handleChange = ({ target: { name, value } }) => {
    switch (name) {
      case "title":
        return setTitle(value);
      case "description":
        return setDescription(value);
      case "date":
        return setDate(value);
      case "importance":
        return setImportance(value);
      default:
        break;
    }
  };

  const handleDateChange = (date) => {
    setDate(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      title: dbTitle,
      description: dbDescription,
      date: dbDate,
      importance: dbImportance,
    } = notificationData.getNotificationByClass;
    if (
      title === dbTitle &&
      description === dbDescription &&
      date.toString() === new Date(dbDate).toString() &&
      importance === dbImportance
    ) {
      return showAlert({
        type: "danger",
        msg: "Wprowadź zmiany aby nadpisać zadanie",
      });
    }

    // Update item
    const editedItem = {
      notificationId: router.query.id_powiadomienia,
      title,
      description,
      date,
      importance,
    };

    try {
      await editNotification({
        variables: editedItem,
        refetchQueries: [
          {
            query: getAllNotificationsByClassQuery,
          },
        ],
      });
      showAlert({ type: "success", msg: "Zadanie zostało zmienione" });
    } catch (err) {
      showAlert({ type: "danger", msg: "Wystąpił błąd" });
      console.log(err);
    }
  };

  return (
    <Layout>
      <Head title="Edytuj powiadomienia" />
      <div className="cms-notification-edit container">
        <h1 className="global-section-title">Edycja zadania</h1>
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
          onSubmit={handleSubmit}
          className="cms-notification-edit-form">
          <input
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
            className="input input--default cms-notification-edit-form__input"
          />
          <input
            type="text"
            name="description"
            value={description}
            onChange={handleChange}
            className="input input--default cms-notification-edit-form__input"
          />
          <select
            name="importance"
            onChange={handleChange}
            className="input input--default cms-notification-edit-form__input"
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
            className="input input--default cms-notification-edit-form__input"
          />
          <button type="submit" className="btn btn--theme">
            Zapisz zmiany
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default withRouter(TaskEdit);
