import React, { useState } from "react";
import Layout from "../../../components/layout/Layout";
import Tasks from "../../../components/app/Tasks";
import Link from "next/link";
import Head from "../../../components/layout/Head";

const MyTasksPage = () => {
  const [sortBy, setSortBy] = useState("today");
  return (
    <Layout>
      <Head title="Moje zadania" />
      <div className="app-tasks container">
        <h1 className="global-section-title">Moje zadania</h1>
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
        <Tasks sortBy={sortBy} onlyUserTasks={true} />

        <Link href="/app/moje-zadania/opcje">
          <div className="app-tasks__add-my-task">
            <i
              className="fas fa-plus app-tasks__add-my-task-icon"
              aria-hidden="true"></i>
          </div>
        </Link>
      </div>
    </Layout>
  );
};

export default MyTasksPage;
