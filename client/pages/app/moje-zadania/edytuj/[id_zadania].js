import React, { useContext, useEffect, useState } from "react";
import { withRouter } from "next/router";
import Layout from "../../../../components/layout/Layout";
import { useMutation } from "@apollo/react-hooks";
import { editUserTaskMutation } from "../../../../queries/taskQueries";
import { AuthContext } from "../../../../context/authContext";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";
import { authUserQuery } from "../../../../queries/authQueries";
registerLocale("pl", pl);

const UserTaskEdit = ({ router }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [alert, setAlert] = useState("");
  const [task, setTask] = useState("");
  const [alertTimeout, setAlertTimeout] = useState("");
  const {
    authContext: { user, token }
  } = useContext(AuthContext);

  // Get task
  useEffect(() => {
    if (user) {
      const fetchedTask = user.tasks.find(
        task => task.id === router.query.id_zadania
      );
      setTask(fetchedTask);
    }
  }, [user]);

  // Edit task mutation
  const [editTask] = useMutation(editUserTaskMutation);

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

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDate(new Date(task.date));
    }
  }, [task]);

  const handleChange = ({ target: { name, value } }) => {
    switch (name) {
      case "title":
        return setTitle(value);
      case "description":
        return setDescription(value);
      case "date":
        return setDate(value);
      default:
        break;
    }
  };

  const handleDateChange = date => {
    setDate(date);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { title: dbTitle, description: dbDescription, date: dbDate } = task;
    if (
      title === dbTitle &&
      description === dbDescription &&
      date.toString() === new Date(dbDate).toString()
    ) {
      return showAlert({
        type: "danger",
        msg: "Wprowadź zmiany aby nadpisać zadanie"
      });
    }

    // Update item
    const editedItem = {
      taskId: router.query.id_zadania,
      title,
      description,
      date
    };

    try {
      await editTask({
        variables: editedItem,
        refetchQueries: [
          {
            query: authUserQuery,
            variables: { token }
          }
        ]
      });
      showAlert({ type: "success", msg: "Zadanie zostało zmienione" });
    } catch (err) {
      showAlert({ type: "danger", msg: "Wystąpił błąd" });
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="cms-task-edit container">
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
          className="cms-task-edit-form">
          <label htmlFor="title" className="label label--default">
            Tytuł zadania:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleChange}
            className="input input--default cms-task-edit-form__input"
          />
          <label htmlFor="description" className="label label--default">
            Krótki opis:
          </label>
          <input
            type="text"
            name="description"
            id="description"
            value={description}
            onChange={handleChange}
            className="input input--default cms-task-edit-form__input"
          />
          <label htmlFor="date" className="label label--default">
            Termin zadania:
          </label>
          <DatePicker
            selected={date}
            onChange={handleDateChange}
            locale="pl"
            id="date"
            placeholderText="Termin zadania..."
            className="input input--default cms-task-edit-form__input"
          />
          <button type="submit" className="btn btn--theme">
            Zapisz zmiany
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default withRouter(UserTaskEdit);
