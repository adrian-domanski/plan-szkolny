import React, { useState, useEffect, useContext } from "react";
import { useMutation } from "@apollo/react-hooks";
import { createUserTaskMutation } from "../../../queries/taskQueries";
import { authUserQuery } from "../../../queries/authQueries";
import Layout from "../../../components/layout/Layout";
import { AuthContext } from "../../../context/authContext";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";
registerLocale("pl", pl);
import { capitalize } from "../../../helpers/helpers";

const AddMyTask = () => {
  const {
    authContext: { token }
  } = useContext(AuthContext);
  const [alert, setAlert] = useState("");
  const [alertTimeout, setAlertTimeout] = useState("");
  const [createTask] = useMutation(createUserTaskMutation);
  // Task state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);

  // Set defined subjects
  useEffect(() => {
    let isCancelled = false;
    const getSubjects = async () => {
      const subjects = await import("../../../helpers/subjects.json");
      if (!isCancelled) {
        setSubjects(subjects.default);
      }
    };
    getSubjects();
    // Clear
    return () => {
      isCancelled = true;
    };
  }, []);

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

  const clearInputs = () => {
    setTitle("");
    setDescription("");
    setDate("");
  };

  const handleDateChange = date => {
    setDate(date);
  };

  const handleChange = ({ target: { name, value } }) => {
    switch (name) {
      case "title":
        const filteredSubjects = subjects.filter(
          subject =>
            value &&
            subject.subject.toLowerCase() !== value.toLowerCase() &&
            subject.subject.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSubjects(filteredSubjects);
        return setTitle(capitalize(value));
      case "description":
        return setDescription(value);
      default:
        break;
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!title || !date) {
      return showAlert({
        type: "danger",
        msg: "Tytuł i data są wymagane"
      });
    }

    const dataObj = {
      title,
      description,
      date: date.toISOString()
    };
    try {
      await createTask({
        variables: dataObj,
        refetchQueries: [
          {
            query: authUserQuery,
            variables: { token }
          }
        ]
      });
      clearInputs();
      showAlert({ type: "success", msg: "Dodano zadanie!" });
    } catch (err) {
      console.log(err);
    }
  };

  const ifEnter = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (filteredSubjects.length) {
        setTitle(filteredSubjects[0].subject);
        setFilteredSubjects([]);
      }
    }
  };

  const getAutocompleteList = () => {
    return filteredSubjects.map(subject => {
      const subjectSuggestion = subject.subject
        .toLowerCase()
        .replace(title.toLowerCase(), `<b>${title}</b>`);

      const handleClickSelected = selected => {
        setTitle(selected);
        setFilteredSubjects([]);
      };
      return (
        <li
          key={subject.id}
          className="input-title__autocomplete-item"
          dangerouslySetInnerHTML={{ __html: subjectSuggestion }}
          onClick={() => handleClickSelected(subject.subject)}></li>
      );
    });
  };

  return (
    <Layout>
      <div className="cms-add-task container">
        <h1 className="global-section-title">Dodaj moje zadanie</h1>
        <form
          action="submit"
          className="cms-add-task-form"
          onSubmit={handleSubmit}>
          {/* Alert */}
          {alert ? (
            <div className={`alert alert--${alert.type} cms-add-task__alert`}>
              <p className="alert__text">{alert.msg}</p>
              <i
                className="fas fa-times alert-close"
                onClick={clearAlert}
                aria-hidden="true"></i>
            </div>
          ) : null}
          <div className="input-title mb-1">
            <input
              type="text"
              name="title"
              placeholder="Tytuł zadania..."
              className="input input--default input-title__title"
              onChange={handleChange}
              value={title}
              onKeyDown={ifEnter}
              autoComplete="off"
            />
            <ul className="input-title__autocomplete">
              {getAutocompleteList()}
            </ul>
          </div>

          <input
            type="text"
            name="description"
            placeholder="Krótka informacja o zadaniu..."
            className="input input--default cms-add-task__input"
            onChange={handleChange}
            value={description}
          />
          <DatePicker
            selected={date}
            onChange={handleDateChange}
            locale="pl"
            placeholderText="Termin zadania..."
            className="input input--default cms-add-task__input"
          />
          <button type="submit" className="btn btn--theme cms-add-task__submit">
            Dodaj zadanie
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddMyTask;
