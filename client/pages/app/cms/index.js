import React from "react";
import Layout from "../../../components/layout/Layout";
import Link from "next/link";
import Head from "../../../components/layout/Head";

const Cms = () => {
  return (
    <Layout>
      <Head title="CMS" />
      <div className="cms-home container">
        <h1 className="cms-home__title">Wybierz akcje</h1>

        <ul className="cms-action-list">
          <li className="cms-action-list__item">
            <Link href="/app/cms/dodaj-zadanie">
              <button className="btn btn--option cms-action-list__link">
                <i
                  className="fa fa-plus-square cms-home-icon"
                  aria-hidden="true"></i>
                Dodaj zadanie
              </button>
            </Link>
          </li>
          <li className="cms-action-list__item">
            <Link href="/app/cms/edytuj-zadania">
              <button className="btn btn--option cms-action-list__link">
                <i className="fa fa-edit cms-home-icon" aria-hidden="true"></i>
                Edytuj zadania
              </button>
            </Link>
          </li>
          <li className="cms-action-list__item">
            <Link href="/app/cms/dodaj-powiadomienie">
              <button className="btn btn--option cms-action-list__link">
                <i
                  className="fas fa-comment-medical cms-home-icon"
                  aria-hidden="true"></i>
                Dodaj powiadomienie
              </button>
            </Link>
          </li>
          <li className="cms-action-list__item">
            <Link href="/app/cms/edytuj-powiadomienia">
              <button className="btn btn--option cms-action-list__link">
                <i
                  className="fas fa-comment-dots cms-home-icon"
                  aria-hidden="true"></i>
                Edytuj powiadomienia
              </button>
            </Link>
          </li>
          <li className="cms-action-list__item">
            <Link href="/app/cms/czlonkowie">
              <button className="btn btn--option cms-action-list__link">
                <i
                  className="fas fa-users cms-home-icon"
                  aria-hidden="true"></i>
                Członkowie
              </button>
            </Link>
          </li>
          <li className="cms-action-list__item">
            <Link href="/app/cms/ustawienia">
              <button className="btn btn--option cms-action-list__link">
                <i className="fas fa-cog cms-home-icon" aria-hidden="true"></i>
                Ustawienia
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </Layout>
  );
};

export default Cms;
