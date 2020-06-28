import React, { useEffect, useState } from "react";
import { withRouter } from "next/router";
import Layout from "../../../../components/layout/Layout";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  getTaskByClassQuery,
  editTaskMutation,
  getAllTasksByClassQuery,
} from "../../../../queries/taskQueries";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import Head from "../../../../components/layout/Head";
import pl from "date-fns/locale/pl";
registerLocale("pl", pl);

const TaskEdit = ({ router }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [alert, setAlert] = useState("");
  const [alertTimeout, setAlertTimeout] = useState("");

  // Get task query
  const { data: taskData, loading: taskLoading } = useQuery(
    getTaskByClassQuery,
    {
      variables: {
        taskId: router.query.id_zadania,
      },
    }
  );

  const [editTask] = useMutation(editTaskMutation);

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
    if (!taskLoading) {
      const { title, description, date } = taskData.getTaskByClass;
      setTitle(title);
      setDescription(description);
      setDate(new Date(date));
    }
  }, [taskLoading]);

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

  const handleDateChange = (date) => {
    setDate(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      title: dbTitle,
      description: dbDescription,
      date: dbDate,
    } = taskData.getTaskByClass;
    if (
      title === dbTitle &&
      description === dbDescription &&
      date.toString() === new Date(dbDate).toString()
    ) {
      return showAlert({
        type: "danger",
        msg: "Wprowadź zmiany aby nadpisać zadanie",
      });
    }

    // Update item
    const editedItem = {
      taskId: router.query.id_zadania,
      title,
      description,
      date,
    };

    try {
      await editTask({
        variables: editedItem,
        refetchQueries: [
          {
            query: getAllTasksByClassQuery,
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
      <Head title="Edytuj zadania" />
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
          <input
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
            className="input input--default cms-task-edit-form__input"
          />
          <input
            type="text"
            name="description"
            value={description}
            onChange={handleChange}
            className="input input--default cms-task-edit-form__input"
          />
          <DatePicker
            selected={date}
            onChange={handleDateChange}
            locale="pl"
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

export default withRouter(TaskEdit);
