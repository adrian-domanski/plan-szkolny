import React, { useState, useEffect, useContext, useRef } from "react";
import Layout from "../../../components/layout/Layout";
import { useMutation } from "@apollo/react-hooks";
import {
  uploadClassPlanMutation,
  deleteClassPlanMutation,
  updateReplacementsMutation,
  changeClassNameMutation,
  generateNewClassCodeMutation,
} from "../../../queries/classQueries";
import { authUserQuery } from "../../../queries/authQueries";
import { AuthContext } from "../../../context/authContext";
import imageCompression from "browser-image-compression";
import { isImage } from "../../../helpers/helpers";
import Alert from "../../../components/app/alert";
import validator from "validator";
import Head from "../../../components/layout/Head";

const Settings = () => {
  const {
    authContext: { user, token },
  } = useContext(AuthContext);
  const [replacements, setReplacements] = useState({
    today: "",
    tomorrow: "",
    dayAfter: "",
    page: "",
  });

  const fileInput = useRef();

  const [uploadPlan] = useMutation(uploadClassPlanMutation);
  const [deletePlan] = useMutation(deleteClassPlanMutation);
  const [updateReplacements] = useMutation(updateReplacementsMutation);
  const [changeClassName] = useMutation(changeClassNameMutation);
  const [generateNewClassCode] = useMutation(generateNewClassCodeMutation);

  const [myClassName, setMyClassName] = useState("");
  const [schoolPlan, setSchoolPlan] = useState("");
  const [replacementsChanged, setReplacementsChanged] = useState(false);
  const [schoolPlanPreview, setSchoolPlanPreview] = useState("");
  const [schoolPlanLoading, setSchoolPlanLoading] = useState(false);
  const [schoolPlanAlert, setSchoolPlanAlert] = useState("");
  const [replacementAlert, setReplacementAlert] = useState("");
  const [alert, setAlert] = useState();

  // Set default values
  useEffect(() => {
    if (user.class.plan) {
      setSchoolPlanPreview(user.class.plan.url);
    }
    if (user.class.replacements) {
      const { today, tomorrow, dayAfter, page } = user.class.replacements;
      setReplacements({ today, tomorrow, dayAfter, page });
    }

    if (user.class) {
      setMyClassName(user.class.name);
    }
  }, [user]);

  const handleChange = async ({ target }) => {
    switch (target.name) {
      case "schoolPlan":
        const [file] = target.files;
        if (target.files.length) {
          if (!isImage(file)) {
            return setSchoolPlanAlert({
              type: "danger",
              msg: "Niepoprawny format pliku",
            });
          }
          const options = {
            maxSizeMB: 0.3,
            maxWidthOrHeight: 1200,
          };
          const compressed = await imageCompression(file, options);
          setSchoolPlan(compressed);

          // Live preview
          const reader = new FileReader();
          reader.addEventListener(
            "load",
            () => setSchoolPlanPreview(reader.result),
            false
          );
          reader.readAsDataURL(compressed);
          break;
        }
      case "replacementsToday":
        if (!replacementsChanged) setReplacementsChanged(true);
        return setReplacements({ ...replacements, today: target.value });
      case "replacementsTomorrow":
        if (!replacementsChanged) setReplacementsChanged(true);
        return setReplacements({ ...replacements, tomorrow: target.value });
      case "replacementsDayAfter":
        if (!replacementsChanged) setReplacementsChanged(true);
        return setReplacements({ ...replacements, dayAfter: target.value });
      case "replacementsPage":
        if (!replacementsChanged) setReplacementsChanged(true);
        return setReplacements({ ...replacements, page: target.value });
      case "myClassName":
        return setMyClassName(target.value);
      default:
        break;
    }
  };

  const handleUpdateReplacements = async () => {
    for (const rep in replacements) {
      if (
        replacements[rep] &&
        !validator.isURL(replacements[rep], { require_protocol: true })
      )
        return setReplacementAlert({ type: "danger", msg: "Niepoprawny link" });
    }
    try {
      await updateReplacements({
        variables: { ...replacements },
        refetchQueries: [{ query: authUserQuery, variables: { token } }],
      });
      setReplacementsChanged(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUploadPlan = async () => {
    try {
      setSchoolPlanLoading(true);
      setAlert({ type: "warning", msg: "Proszę czekać..." });
      await uploadPlan({
        variables: { image: schoolPlan },
        refetchQueries: [{ query: authUserQuery, variables: { token } }],
      });
      setAlert("");
      setSchoolPlanLoading(false);
      setSchoolPlan("");
    } catch (err) {
      console.log(err);
      setAlert("");
      setSchoolPlanLoading(false);
    }
  };

  const handleDeletePlan = async () => {
    try {
      setSchoolPlanLoading(true);
      await deletePlan({
        refetchQueries: [{ query: authUserQuery, variables: { token } }],
      });
      fileInput.current.value = "";
      setSchoolPlanLoading(false);
      setSchoolPlanPreview("");
      setSchoolPlan("");
    } catch (err) {
      console.log(err);
      setAlert("");
      setSchoolPlanLoading(false);
    }
  };

  const handleChangeClassName = async () => {
    try {
      if (myClassName.length > 10) {
        throw new Error("Maksymalnie 10 znaków");
      }

      await changeClassName({
        variables: {
          newClassName: myClassName,
        },
        refetchQueries: [{ query: authUserQuery, variables: { token } }],
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleNewClassCode = async () => {
    try {
      await generateNewClassCode({
        refetchQueries: [{ query: authUserQuery, variables: { token } }],
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <Head title="Ustawienia" />
      <div className="cms-settings container">
        <h1 className="global-section-title">Ustawienia</h1>
        <form
          action="submit"
          onSubmit={(e) => e.preventDefault()}
          className="cms-settings-form">
          {/* Alert */}
          <Alert
            alert={alert}
            clearAlert={() => setAlert("")}
            className="mb-1"
          />
          <label className="cms-settings-label">Zastępstwa:</label>
          <Alert
            alert={replacementAlert}
            clearAlert={() => setReplacementAlert("")}
            className="mb-1"
          />
          <input
            type="text"
            value={replacements.today}
            onChange={handleChange}
            name="replacementsToday"
            placeholder="Link do zastępstw na bieżący dzień..."
            className="input input--default cms-settings__input"
          />
          <input
            type="text"
            value={replacements.tomorrow}
            onChange={handleChange}
            name="replacementsTomorrow"
            placeholder="Link do zastępstw na następny dzień..."
            className="input input--default cms-settings__input"
          />
          <input
            type="text"
            value={replacements.dayAfter}
            onChange={handleChange}
            name="replacementsDayAfter"
            placeholder="Link do zastępstw na kolejny dzień..."
            className="input input--default cms-settings__input"
          />
          <input
            type="text"
            value={replacements.page}
            onChange={handleChange}
            name="replacementsPage"
            placeholder="Link do głownej strony z zastępstwami..."
            className="input input--default cms-settings__input"
          />
          {user && replacementsChanged ? (
            <button
              className="btn btn--theme mb-1"
              onClick={handleUpdateReplacements}>
              Zapisz zmiany
            </button>
          ) : null}

          {/* Lesson plan */}
          <label className="cms-settings-label">Plan lekcji:</label>
          {schoolPlanPreview ? (
            <div className="school-plan-preview">
              <img
                className="school-plan-preview__img"
                src={schoolPlanPreview}
                alt="Podgląd planu lekcji"
              />
            </div>
          ) : null}

          <Alert
            alert={schoolPlanAlert}
            className="mb-1"
            clearAlert={() => setSchoolPlanAlert("")}
          />
          <label
            htmlFor="schoolPlan"
            className="input input--default file-upload-label">
            {schoolPlanLoading ? "Proszę czekać..." : "Edytuj plan..."}
          </label>
          <input
            type="file"
            name="schoolPlan"
            id="schoolPlan"
            ref={fileInput}
            onChange={handleChange}
            className="input input--default input-file-upload"
          />
          {schoolPlan ? (
            <button
              type="submit"
              className="btn btn--theme cms-settings__submit"
              onClick={handleUploadPlan}>
              {schoolPlanLoading ? "Proszę czekać..." : "Zapisz plan"}
            </button>
          ) : null}
          {user.class.plan ? (
            <button className="btn btn--abort mt-1" onClick={handleDeletePlan}>
              {schoolPlanLoading ? "Proszę czekać..." : "Usuń plan"}
            </button>
          ) : null}
        </form>

        {/* Change class name */}
        <label className="cms-settings-label mt-1">Nazwa klasy:</label>
        <input
          type="text"
          className="input input--default"
          onChange={handleChange}
          name="myClassName"
          value={myClassName}
        />
        {myClassName !== user.class.name ? (
          <button
            className="btn btn--theme mt-1"
            onClick={handleChangeClassName}>
            Zmień nazwę
          </button>
        ) : null}

        {/* New class code */}
        <label className="cms-settings-label mt-1">Kod klasy:</label>
        <input
          type="text"
          name="myClassCode"
          className="input input--default"
          readOnly
          value={user.class.code}
        />
        <button className="btn btn--theme mt-1" onClick={handleNewClassCode}>
          Generuj nowy kod
        </button>
      </div>
    </Layout>
  );
};

export default Settings;
