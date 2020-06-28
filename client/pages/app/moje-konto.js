import React, { useContext, useState, useEffect, useRef } from "react";
import Layout from "../../components/layout/Layout";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { AuthContext } from "../../context/authContext";
import Modal from "../../components/app/modal";
import {
  deleteClassMutation,
  leaveClassMutation,
} from "../../queries/classQueries";
import {
  updateAvatarMuation,
  deleteAvatarMutation,
  authUserQuery,
  updateUserMutation,
  remindPasswordQuery,
  sendChangeEmailInfoQuery,
} from "../../queries/authQueries";
import { isImage } from "../../helpers/helpers";
import imageCompression from "browser-image-compression";
import Head from "../../components/layout/Head";

const MyAccount = () => {
  const {
    authContext: { user, token },
  } = useContext(AuthContext);

  const [deleteClass] = useMutation(deleteClassMutation);
  const [leaveClass] = useMutation(leaveClassMutation);
  const [updateAvatar] = useMutation(updateAvatarMuation);
  const [deleteAvatar] = useMutation(deleteAvatarMutation);
  const [updateUser] = useMutation(updateUserMutation);
  const { refetch: remindPassword } = useQuery(remindPasswordQuery, {
    skip: true,
  });
  const { refetch: sendChangeEmailInfo } = useQuery(sendChangeEmailInfoQuery, {
    skip: true,
  });

  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [changeEmailModal, setChangeEmailModal] = useState(false);
  const [alert, setAlert] = useState("");
  const [alertTimeout, setAlertTimeout] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [modal, setModal] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [personalDataChange, setPersonalDataChange] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setSurname(user.surname);
    if (user.avatar) {
      setAvatarPreview(user.avatar.url);
    } else {
      setAvatarPreview("");
    }
  }, []);

  // console.log(user);

  // Listen to personal data change
  useEffect(() => {
    if (
      name !== "" &&
      (name !== user.name || surname !== user.surname || email !== user.email)
    ) {
      setPersonalDataChange(true);
    } else {
      if (personalDataChange) {
        setPersonalDataChange(false);
      }
    }
  }, [name, email, surname]);

  // Clear timeout
  useEffect(() => () => clearTimeout(alertTimeout));

  const showAlert = (alertObj) => {
    // Clear current alert
    if (alert || alertTimeout) {
      clearAlert();
    }
    // Set alert
    setAlert(alertObj);
    const timeout = setTimeout(clearAlert, 4000);
    setAlertTimeout(timeout);
  };

  const clearAlert = () => {
    setAlert("");
    if (alertTimeout) {
      clearTimeout(alertTimeout);
    }
  };

  const handleChange = async ({ target: { value, name, files } }) => {
    switch (name) {
      case "name":
        return setName(value);
      case "surname":
        return setSurname(value);
      case "email":
        return setEmail(value);
      case "avatar":
        const [file] = files;
        if (file && isImage(file)) {
          if (!isImage(file))
            return showAlert({
              type: "danger",
              msg: "Niepoprawny format pliku",
            });

          // Compress image
          const options = {
            maxSizeMB: 0.3,
            maxWidthOrHeight: 240,
          };
          const compressed = await imageCompression(file, options);
          setAvatar(compressed);
          const reader = new FileReader();
          reader.addEventListener(
            "load",
            () => setAvatarPreview(reader.result),
            false
          );
          reader.readAsDataURL(compressed);
        }
        break;
      default:
        break;
    }
  };

  const handleDeleteClass = async () => {
    try {
      await deleteClass({
        refetchQueries: [{ query: authUserQuery, variables: { token } }],
      });
      setModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLeaveClass = async () => {
    try {
      await leaveClass({
        refetchQueries: [{ query: authUserQuery, variables: { token } }],
      });
      setModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAvatarUpload = async () => {
    if (avatar) {
      setAvatarLoading(true);
      await updateAvatar({
        variables: { image: avatar },
        refetchQueries: [{ query: authUserQuery, variables: { token } }],
      });
      setAvatarLoading(false);
      setAvatar("");
      fileInputRef.current.value = "";
    }
  };

  const handleAvatarDelete = async () => {
    setAvatarLoading(true);
    await deleteAvatar({
      refetchQueries: [{ query: authUserQuery, variables: { token } }],
    });
    setAvatarPreview("");
    setAvatarLoading(false);
  };

  const handleUserDataUpdate = async () => {
    setUserDataLoading(true);
    const userData = {
      name,
      surname,
    };
    await updateUser({
      variables: userData,
      refetchQueries: [{ query: authUserQuery, variables: { token } }],
    });
    setUserDataLoading(false);
    setPersonalDataChange(false);
  };

  const handleChangePassword = async () => {
    try {
      await remindPassword({ email: user.email });
    } catch (err) {
      console.log(err);
    }
    setChangePasswordModal(false);
  };

  const handleChangeEmail = async () => {
    try {
      await sendChangeEmailInfo({ email: user.email });
    } catch (err) {
      console.log(err);
    }
    setChangeEmailModal(false);
  };

  return (
    <Layout>
      <Head title="Moje konto" />
      <div className="app-my-account container">
        <h1 className="app-my-account__title global-section-title">
          Moje konto
        </h1>
        <section className="app-my-account-avatar">
          <div className="app-my-account-avatar__avatar">
            <img
              src={avatarPreview || "/img/app/avatar-placeholder.png"}
              alt="Domyślne zdjęcie użytkownika"
              className="app-my-account__avatar"
            />
          </div>

          <label
            htmlFor="avatar"
            className="input input--default file-upload-label app-my-account__file-upload">
            Edytuj zdjęcie
          </label>
          <input
            type="file"
            name="avatar"
            id="avatar"
            ref={fileInputRef}
            className="input input--default input-file-upload"
            onChange={handleChange}
          />
          {avatar ? (
            <button
              className="btn btn--theme mt-1"
              onClick={handleAvatarUpload}>
              {avatarLoading ? "Proszę czekać..." : "Zapisz zdjęcie"}
            </button>
          ) : null}
          {user.avatar ? (
            <button
              className="btn btn--abort mt-1"
              onClick={handleAvatarDelete}>
              {avatarLoading ? "Proszę czekać..." : "Usuń avatar"}
            </button>
          ) : null}
        </section>
        <section className="my-accout-about-me">
          <label className="label label--default">Informacje o mnie:</label>
          <input
            type="text"
            name="name"
            placeholder="Imie..."
            value={name}
            onChange={handleChange}
            className="input input--default my-account-input"
          />
          <input
            type="text"
            name="surname"
            placeholder="Nazwisko..."
            value={surname}
            onChange={handleChange}
            className="input input--default my-account-input"
          />
          {personalDataChange ? (
            <button
              className="btn btn--theme mb-1"
              onClick={handleUserDataUpdate}>
              {userDataLoading ? "Proszę czekać..." : "Zapisz zmiany"}
            </button>
          ) : null}

          {/* Change password */}
          <Modal
            isOpen={changePasswordModal}
            abort={() => setChangePasswordModal(false)}
            title={"Czy chcesz zmienić hasło?"}
            submit={handleChangePassword}
            body={`Potwierdź swoją decyzje a wyślemy dalsze instrukcje na adres:<br/><br/><b>${email}</b>`}
          />
          <button
            className="btn btn--option mb-1"
            onClick={() => setChangePasswordModal(true)}>
            Zmień hasło
          </button>
          {/* Change email */}
          <Modal
            isOpen={changeEmailModal}
            abort={() => setChangeEmailModal(false)}
            submit={handleChangeEmail}
            title={"Czy chcesz zmienić email?"}
            body={`Potwierdź swoją decyzje a wyślemy dalsze instrukcje na adres:<br/><br/><b>${email}</b>`}
          />
          <button
            className="btn btn--option"
            onClick={() => setChangeEmailModal(true)}>
            Zmień email
          </button>
        </section>
        <section className="my-account-class">
          <label className="label label--default my-account-label">
            Moja klasa:
          </label>
          {user.class ? (
            <>
              <input
                type="text"
                className="input input--default my-account-input"
                value={user.class.name}
                readOnly
              />
              <input
                type="text"
                className="input input--default my-account-input"
                value={user.class.code}
                readOnly
              />
              {user.class.owner.id === user.id ? (
                <>
                  <Modal
                    isOpen={modal}
                    abort={() => setModal(false)}
                    title={"Czy chcesz usunąć klasę?"}
                    body={
                      "Jesteś założycielem tej klasy. Jeżeli ją usuniesz, wszyscy członkowie zostaną automatycznie usunięci!"
                    }
                    submit={handleDeleteClass}
                  />
                  <button
                    className="btn btn--abort my-account-btn"
                    onClick={() => setModal(true)}>
                    Usuń klasę
                  </button>
                </>
              ) : (
                <>
                  <Modal
                    isOpen={modal}
                    abort={() => setModal(false)}
                    title={"Czy chcesz opuścić klasę?"}
                    body={"Utracisz dostęp do tej klasy"}
                    submit={handleLeaveClass}
                  />

                  <button
                    className="btn btn--abort my-account-btn"
                    onClick={() => setModal(true)}>
                    Opuść klasę
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <Link href="/app/dolacz-do-klasy">
                <a>
                  <button className="btn btn--option my-account-btn">
                    Dołącz do klasy
                  </button>
                </a>
              </Link>
              <Link href="/app/utworz-klase">
                <a>
                  <button className="btn btn--option my-account-btn">
                    Utwórz klasę
                  </button>
                </a>
              </Link>
            </>
          )}
        </section>
        {/* Alert */}
        {alert ? (
          <div className={`alert alert--${alert.type} my-account__alert`}>
            <p className="alert__text">{alert.msg}</p>
            <i
              className="fas fa-times alert-close"
              onClick={clearAlert}
              aria-hidden="true"></i>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default MyAccount;
