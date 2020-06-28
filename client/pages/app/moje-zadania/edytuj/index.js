import React, { useContext, useState, useEffect } from "react";
import Layout from "../../../../components/layout/Layout";
import { useMutation } from "@apollo/react-hooks";
import { deleteUserTaskMutation } from "../../../../queries/taskQueries";
import { authUserQuery } from "../../../../queries/authQueries";
import { AuthContext } from "../../../../context/authContext";
import Link from "next/link";
import Modal from "../../../../components/app/modal";

const TasksEdit = () => {
  const { authContext } = useContext(AuthContext);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    selectedTask: {},
  });
  const [tasks, setTasks] = useState([]);
  const [deleteTask] = useMutation(deleteUserTaskMutation);

  // Set tasks
  useEffect(() => {
    if (authContext.user) {
      setTasks(authContext.user.tasks);
    }
  }, [authContext.user]);

  const handleShowModal = (e, task) => {
    e.preventDefault();
    setDeleteModal({ isOpen: true, selectedTask: task });
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask({
      variables: { taskId },
      refetchQueries: [
        {
          query: authUserQuery,
          variables: { token: authContext.token },
        },
      ],
    });
    setDeleteModal({ isOpen: false, selectedTask: {} });
  };

  const tasksList = tasks.map((task) => (
    <li key={task.id} className="task-list__item">
      {`${task.title} - ${task.description}`}
      <div className="task-actions">
        <Link
          href="/app/moje-zadania/edytuj/[id_zadania]"
          as={`/app/moje-zadania/edytuj/${task.id}`}>
          <a className="task-list__item-action action action--edit">
            <i className="fas fa-edit" aria-hidden="true"></i>
          </a>
        </Link>
        <a
          className="task-list__item-action action action--delete"
          href="/"
          onClick={(e) => handleShowModal(e, task)}>
          <i className="fas fa-trash"></i>
        </a>
      </div>
    </li>
  ));

  return (
    <Layout>
      <Modal
        title={"Czy chcesz usunąć to zadanie?"}
        isOpen={deleteModal.isOpen}
        body={`${deleteModal.selectedTask.title}`}
        abort={() => setDeleteModal({ isOpen: false, selectedTask: {} })}
        submit={() => handleDeleteTask(deleteModal.selectedTask.id)}
      />
      <div className="cms-tasks-edit container">
        <h1 className="global-section-title">Lista zadań</h1>
        <ul className="tasks-list">
          {tasks.length ? (
            tasksList
          ) : (
            <h1 className="global-section-title">Brak wyników</h1>
          )}
        </ul>
      </div>
    </Layout>
  );
};

export default TasksEdit;
