import React, { useContext, useState, useEffect } from "react";
import Layout from "../../../../components/layout/Layout";
import { AuthContext } from "../../../../context/authContext";
import { withRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { getTaskByClassQuery } from "../../../../queries/taskQueries";
import { deleteUserTaskMutation } from "../../../../queries/taskQueries";
import { authUserQuery } from "../../../../queries/authQueries";
import Modal from "../../../../components/app/modal";
import moment from "moment";
import Link from "next/link";
import { capitalize } from "../../../../helpers/helpers";
moment.locale("pl");

const MyTaskDetails = ({ router }) => {
  const isClassTask = router.query.typ_zadania === "klasa";
  const {
    authContext: { user, token },
  } = useContext(AuthContext);
  const [deleteModal, setDeleteModal] = useState(false);
  const [task, setTask] = useState("");
  const [deleteTask] = useMutation(deleteUserTaskMutation);

  // Get task query if class task
  const { data: taskData, loading: taskLoading } = useQuery(
    getTaskByClassQuery,
    {
      skip: !isClassTask,
      variables: {
        taskId: router.query.id_zadania,
      },
    }
  );

  useEffect(() => {
    if (isClassTask && !taskLoading) {
      // add class task to state
      const fetchedTask = taskData.getTaskByClass;
      setTask(fetchedTask);
    } else {
      // add own task to state
      const fetchedTask = user.tasks.find(
        (task) => task.id === router.query.id_zadania
      );
      setTask(fetchedTask);
    }
  }, [taskLoading]);

  const handleDeleteTask = async (taskId) => {
    await deleteTask({
      variables: { taskId },
      refetchQueries: [
        {
          query: authUserQuery,
          variables: { token },
        },
      ],
    });
    setDeleteModal(false);
    router.back();
  };

  return (
    <Layout>
      {task ? (
        <div className="task-details container">
          <Modal
            title={"Czy chcesz usunąć to zadanie?"}
            isOpen={deleteModal}
            body={task.title}
            abort={() => setDeleteModal(false)}
            submit={() => handleDeleteTask(task.id)}
          />
          <div className="task-details-content">
            <h1 className="global-section-title">{task.title}</h1>
            <div className="task-details__date">
              <label className="label label--default task-details__subtitle">
                <b>Termin:</b>
              </label>
              {capitalize(
                moment(task.date).calendar(null, {
                  lastDay: "[Wczoraj]",
                  sameDay: "[Dzisiaj]",
                  nextDay: "[Jutro]",
                  nextWeek: "dddd",
                  sameElse: "L",
                })
              )}
            </div>
            <hr className="separator" />
            <div className="task-details__description">
              <label className="label label--default task-details__subtitle">
                <b>Opis:</b>
              </label>
              {task.description ? task.description : "Brak opisu"}
            </div>
          </div>
          <div className="task-details-actions">
            {isClassTask ? null : (
              <div className="task-details-actions__own-task">
                <button
                  className="btn btn--abort task-details-actions__btn"
                  onClick={() => setDeleteModal(true)}>
                  Usuń zadanie
                </button>
                <Link
                  href="/app/moje-zadania/edytuj/[id_zadania]"
                  as={`/app/moje-zadania/edytuj/${task.id}`}>
                  <button className="btn btn--submit task-details-actions__btn">
                    Edytuj zadanie
                  </button>
                </Link>
              </div>
            )}
            <button
              className="btn btn--theme task-details-actions__back"
              onClick={() => router.back()}>
              Powrót
            </button>
          </div>
        </div>
      ) : (
        <div className="loader">Wczytywanie...</div>
      )}
    </Layout>
  );
};

export default withRouter(MyTaskDetails);
