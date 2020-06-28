import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import Tasks from "../../components/app/Tasks";
import Head from "../../components/layout/Head";

const TasksPage = () => {
  const [sortBy, setSortBy] = useState("today");
  return (
    <Layout>
      <Head title="Zadania" />
      <div className="app-tasks container">
        <h1 className="global-section-title">Zadania</h1>
        {/* Sort by */}
        <ul className="task-sort">
          <li
            className={`task-sort__item ${sortBy === "today" ? "active" : ""}`}
            onClick={() => setSortBy("today")}>
            Dzisiaj
          </li>
          <li
            className={`task-sort__item ${
              sortBy === "tomorrow" ? "active" : ""
            }`}
            onClick={() => setSortBy("tomorrow")}>
            Jutro
          </li>
          <li
            className={`task-sort__item ${sortBy === "week" ? "active" : ""}`}
            onClick={() => setSortBy("week")}>
            Tydzień
          </li>
          <li
            className={`task-sort__item ${sortBy === "all" ? "active" : ""}`}
            onClick={() => setSortBy("all")}>
            Wszystkie
          </li>
        </ul>
        {/* Tasks */}
        <Tasks sortBy={sortBy} />
      </div>
    </Layout>
  );
};

export default TasksPage;
