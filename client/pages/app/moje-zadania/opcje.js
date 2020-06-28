import React from "react";
import Layout from "../../../components/layout/Layout";
import Link from "next/link";
import Head from "../../../components/layout/Head";

const Options = () => {
  return (
    <Layout>
      <Head title="Moje zadania" />
      <div className="cms-home container">
        <h1 className="cms-home__title">Wybierz akcje</h1>

        <ul className="cms-action-list">
          <li className="cms-action-list__item">
            <Link href="/app/moje-zadania/dodaj">
              <button className="btn btn--option cms-action-list__link">
                <i className="fa fa-plus-square cms-home-icon"></i>
                Dodaj zadanie
              </button>
            </Link>
          </li>
          <li className="cms-action-list__item">
            <Link href="/app/moje-zadania/edytuj">
              <button className="btn btn--option cms-action-list__link">
                <i className="fa fa-edit cms-home-icon"></i>
                Edytuj zadania
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </Layout>
  );
};

export default Options;
