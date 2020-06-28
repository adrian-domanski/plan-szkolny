import React, { useContext, useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { AuthContext } from "../../context/authContext";
import Head from "../../components/layout/Head";

const LessonPlan = () => {
  const {
    authContext: { user },
  } = useContext(AuthContext);
  const [schoolPlan, setSchoolPlan] = useState("");

  useEffect(() => {
    if (user.class.plan) setSchoolPlan(user.class.plan.url);
  }, [user.class.plan]);

  return (
    <Layout>
      <Head title="Plan lekcji" />
      <div className="app-lesson-plan container">
        <h1 className="global-section-title">Plan lekcji</h1>
        {schoolPlan ? (
          <div className="lesson-plan-container">
            <img
              src={schoolPlan}
              alt="Plan szkoly"
              className="lesson-plan-container__img"
            />
          </div>
        ) : (
          <p className="global-section-subtitle">
            Brak planu dla twojej klasy, poproś administratora o jego dodanie.
          </p>
        )}
        {schoolPlan ? (
          <a
            href={schoolPlan}
            className="btn btn--theme app-lesson-plan__download">
            Pobierz plan
          </a>
        ) : null}
      </div>
    </Layout>
  );
};

export default LessonPlan;
