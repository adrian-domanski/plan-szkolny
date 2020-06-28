import React, { useState, useEffect } from "react";
import Layout from "../../../../components/layout/Layout";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  getAllNotificationsByClassQuery,
  deleteNotificationByIdMutation,
} from "../../../../queries/notificationQueries";
import Link from "next/link";
import Modal from "../../../../components/app/modal";
import Head from "../../../../components/layout/Head";

const NotificationsEdit = () => {
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    selectedNotification: {},
  });
  const [notifications, setNotifications] = useState([]);
  const [deleteNotification] = useMutation(deleteNotificationByIdMutation);
  const { data: notificationsData, loading: notificationsLoading } = useQuery(
    getAllNotificationsByClassQuery
  );

  // Set notifications
  useEffect(() => {
    if (!notificationsLoading) {
      setNotifications(notificationsData.getNotificationsByClass);
    }
  }, [notificationsLoading, notificationsData]);

  const handleShowModal = (e, notification) => {
    e.preventDefault();
    setDeleteModal({ isOpen: true, selectedNotification: notification });
  };

  const handleDeleteNotification = async (notificationId) => {
    await deleteNotification({
      variables: { notificationId },
      refetchQueries: [
        {
          query: getAllNotificationsByClassQuery,
        },
      ],
    });
    setDeleteModal({ isOpen: false, selectedNotification: {} });
  };

  const tasksList = notifications.map((notification) => (
    <li key={notification.id} className="notifications-list__item">
      {`${notification.title} - ${notification.description}`}
      <div className="notification-actions">
        <Link
          href="/app/cms/edytuj-powiadomienia/[id_powiadomienia]"
          as={`/app/cms/edytuj-powiadomienia/${notification.id}`}>
          <a className="notification-list__item-action action action--edit">
            <i className="fas fa-edit"></i>
          </a>
        </Link>
        <a
          className="notification-list__item-action action action--delete"
          href="/"
          onClick={(e) => handleShowModal(e, notification)}>
          <i className="fas fa-trash"></i>
        </a>
      </div>
    </li>
  ));

  return (
    <Layout>
      <Head title="Edytuj powiadomienia" />
      <Modal
        title={"Czy chcesz usunąć to powiadomienie?"}
        isOpen={deleteModal.isOpen}
        body={`${deleteModal.selectedNotification.title}`}
        abort={() =>
          setDeleteModal({ isOpen: false, selectedNotification: {} })
        }
        submit={() =>
          handleDeleteNotification(deleteModal.selectedNotification.id)
        }
      />
      <div className="cms-notifications-edit container">
        <h1 className="global-section-title">Lista powiadomień</h1>
        <ul className="notifications-list">
          {notificationsLoading ? (
            <div className="loader">Loading...</div>
          ) : notificationsData.getNotificationsByClass.length ? (
            tasksList
          ) : (
            <h1 className="global-section-title">Brak wyników</h1>
          )}
        </ul>
      </div>
    </Layout>
  );
};

export default NotificationsEdit;
