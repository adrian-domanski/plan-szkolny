import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@apollo/react-hooks";
import { getAllNotificationsByClassQuery } from "../../queries/notificationQueries";
import moment from "moment";
moment.locale("pl");

const Notifications = () => {
  const { authContext } = useContext(AuthContext);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  const {
    data: notificationsData,
    loading: notificationsLoading,
    error,
  } = useQuery(getAllNotificationsByClassQuery, {
    variables: { code: authContext.user && authContext.user.class.code },
    ssr: false,
  });

  const getColor = (importance) => {
    switch (importance) {
      case "low":
        return "#21A408";
      case "medium":
        return "#D8A600";
      case "height":
        return "#FF0066";
      default:
        return "#21A408";
    }
  };

  useEffect(() => {
    if (!notificationsLoading && notificationsData && !error) {
      setSelectedNotifications(notificationsData.getNotificationsByClass);
    }
  }, [notificationsLoading]);

  const notificationsList = selectedNotifications.map((notification) => (
    <div className="notifications-grid__item" key={notification.id}>
      <div className="notifications-grid__item-flag">
        <i
          className="fas fa-flag"
          style={{ color: getColor(notification.importance) }}
          aria-hidden="true"></i>
      </div>
      <div className="notifications-grid__item-date">
        {moment()
          .add(
            new Date(notification.date).getDate() - new Date().getDate(),
            "days"
          )
          .calendar(null, {
            lastDay: "[Wczoraj]",
            sameDay: "[Dzisiaj]",
            nextDay: "[Jutro]",
            nextWeek: "dddd",
            sameElse: "L",
          })}
      </div>
      <div className="notifications-grid__item-title">{notification.title}</div>
      <div className="notifications-grid__item-description">
        {notification.description}
      </div>
    </div>
  ));

  return notificationsLoading ? (
    <div className="loader">Wczytywanie...</div>
  ) : selectedNotifications.length ? (
    <div className="notifications-grid">{notificationsList}</div>
  ) : (
    <p className="global-section-subtitle">Brak powiadomień</p>
  );
};

export default Notifications;
