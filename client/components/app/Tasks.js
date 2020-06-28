import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@apollo/react-hooks";
import { getAllTasksByClassQuery } from "../../queries/taskQueries";
import Link from "next/link";
import subjects from "../../helpers/subjects.json";

const Tasks = ({ selectedDay, sortBy, onlyUserTasks }) => {
  const { authContext } = useContext(AuthContext);
  const [selectedTasks, setSelectedTasks] = useState([]);

  const {
    data: tasksData = { getTasksByClass: [] },
    loading: tasksLoading,
  } = useQuery(getAllTasksByClassQuery, {
    variables: {
      code: authContext.user.class && authContext.user.class.code,
    },
    skip: !authContext.user.class || onlyUserTasks,
    ssr: false,
  });

  const classTasks = tasksData.getTasksByClass.map((task) => ({
    ...task,
    type: "klasa",
  }));
  const userTasks = authContext.user.tasks.map((task) => ({
    ...task,
    type: "moje",
  }));

  const tasks = [...classTasks, ...userTasks];

  useEffect(() => {
    if (!tasksLoading) {
      if (selectedDay) {
        const selectedTasks = tasks.filter(
          (task) =>
            new Date(task.date).getDate().toString() === selectedDay.toString()
        );
        setSelectedTasks(selectedTasks);
      } else if (sortBy) {
        filterUsingSortBy();
      } else {
        setSelectedTasks([]);
      }
    }
  }, [selectedDay, tasksLoading, sortBy]);

  const filterUsingSortBy = () => {
    switch (sortBy) {
      case "today":
        return setSelectedTasks(() => {
          const selectedFilter = new Date().getDate();
          const tempArr = tasks.filter(
            (task) =>
              new Date(task.date).getDate().toString() ===
              selectedFilter.toString()
          );

          return tempArr;
        });
      case "tomorrow":
        return setSelectedTasks(() => {
          const selectedFilter = new Date().getDate() + 1;
          const tempArr = tasks.filter(
            (task) =>
              new Date(task.date).getDate().toString() ===
              selectedFilter.toString()
          );

          return tempArr;
        });
      case "week":
        return setSelectedTasks(() => {
          const selectedFilter = new Date().getDate();
          const tempArr = tasks.filter(
            (task) =>
              new Date(task.date).getDate() >= selectedFilter &&
              new Date(task.date).getDate() <= selectedFilter + 6
          );

          return tempArr;
        });
      case "all":
        return setSelectedTasks(tasks);

      default:
        return setSelectedTasks(tasks);
    }
  };

  const tasksList = (
    <div className="tasks-list">
      {selectedTasks.map((task) => {
        const definedSubject = subjects.find(
          (subject) => subject.subject === task.title
        );
        let color = "#fff";
        if (definedSubject) {
          color = definedSubject.color;
        } else {
          color = task.color;
        }

        return (
          <Link
            key={task.id}
            href={"/app/zadanie/[typ_zadania]/[id_zadania]"}
            as={`/app/zadanie/${task.type}/${task.id}`}>
            <div className="task-item">
              <div
                className="task-item__letter"
                style={{ backgroundColor: color }}>
                {task.title[0]}
              </div>
              <div className="task-item-content">
                <div className="task-item__title">{task.title}</div>
                <div className="task-item__description">{task.description}</div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <section className="tasks container ">
      {tasksLoading ? (
        <div className="loader">Loading...</div>
      ) : selectedTasks.length ? (
        tasksList
      ) : (
        <h1 className="global-section-title">Brak zadań</h1>
      )}
    </section>
  );
};

export default Tasks;
