import React, { useState, useEffect } from "react";
import Layout from "../../../../components/layout/Layout";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  getAllTasksByClassQuery,
  deleteTaskByIdMutation,
} from "../../../../queries/taskQueries";
import Link from "next/link";
import Modal from "../../../../components/app/modal";
import Head from "../../../../components/layout/Head";

const TasksEdit = () => {
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    selectedTask: {},
  });
  const [tasks, setTasks] = useState([]);
  const [deleteTask] = useMutation(deleteTaskByIdMutation);
  const { data: tasksData, loading: tasksLoading } = useQuery(
    getAllTasksByClassQuery
  );

  // Set tasks
  useEffect(() => {
    if (!tasksLoading) {
      setTasks(tasksData.getTasksByClass);
    }
  }, [tasksLoading, tasksData]);

  const handleShowModal = (e, task) => {
    e.preventDefault();
    setDeleteModal({ isOpen: true, selectedTask: task });
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask({
      variables: { taskId },
      refetchQueries: [
        {
          query: getAllTasksByClassQuery,
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
          href="/app/cms/edytuj-zadania/[id_zadania]"
          as={`/app/cms/edytuj-zadania/${task.id}`}>
          <a className="task-list__item-action action action--edit">
            <i className="fas fa-edit"></i>
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
      <Head title="Edytuj zadania" />
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
          {tasksLoading ? (
            <div className="loader">Loading...</div>
          ) : tasksData.getTasksByClass.length ? (
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
