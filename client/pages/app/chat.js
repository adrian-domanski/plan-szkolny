import React, { useEffect, useState, useContext, useRef } from "react";
import Layout from "../../components/layout/Layout";
import openSocket from "socket.io-client";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@apollo/react-hooks";
import { getLastMessagesQuery } from "../../queries/messageQueries";
import Alert from "../../components/app/alert";
import moment from "moment";
import Head from "../../components/layout/Head";
import validator from "validator";
moment.locale("pl");

const Chat = () => {
  const [socket] = useState(() =>
    openSocket(
      process.env.NODE_ENV !== "production"
        ? "http://localhost:5000"
        : "https://api.plan-szkolny.pl"
    )
  );
  const [alert, setAlert] = useState("");
  const alertTimeout = useRef();
  const chatboxEl = useRef();
  const { refetch: getLastMessages } = useQuery(getLastMessagesQuery, {
    skip: true,
  });

  const [message, setMessage] = useState("");
  const [currentMessages, setCurrentMessages] = useState([]);
  const {
    authContext: { user },
  } = useContext(AuthContext);

  // Alert
  useEffect(() => {
    return () => clearTimeout(alertTimeout.current);
  }, []);

  const showAlert = (alertObj) => {
    setAlert(alertObj);
    alertTimeout.current = setTimeout(clearAlert, 4000);
  };

  const clearAlert = () => {
    setAlert("");
  };

  // Set last messages
  useEffect(() => {
    let isCancelled = false;
    (async () => {
      const { data } = await getLastMessages();
      if (!isCancelled) {
        setCurrentMessages(data.getLastMessages);
        scrollChatToBottom();
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    // Listen to new message
    socket.on("newMessage", (message) => {
      setCurrentMessages([...currentMessages, message]);
      scrollChatToBottom();
    });
  }, [currentMessages]);

  // Close connection on component unmount
  useEffect(() => () => socket.close(), []);

  const handleChange = ({ target: { name, value } }) => {
    switch (name) {
      case "message":
        return setMessage(value);
      default:
        break;
    }
  };

  const handleSendMessage = async (e) => {
    e && e.preventDefault();
    if (validator.isEmpty(message, { ignore_whitespace: true })) {
      return showAlert({ type: "danger", msg: "Pusta wiadomość" });
    }

    if (message.length > 3000) {
      return showAlert({ type: "danger", msg: "Maksymalnie 3000 znaków" });
    }
    const { avatar, id, rank, email, name, surname } = user;

    const newMessage = {
      author: { avatar, id, rank, email, name, surname },
      classCode: user.class.code,
      date: new Date().getTime(),
      msg: message,
    };

    socket.emit("newMessage", newMessage);
    setMessage("");
  };

  const isEnter = (e) => {
    if (e.keyCode === 13) handleSendMessage();
  };

  const scrollChatToBottom = () => {
    chatboxEl.current.scrollTop = chatboxEl.current.scrollHeight;
  };

  const messageList = currentMessages.map((message) => (
    <div key={message.id} className="chatbox-message">
      <div className="author-avatar">
        <img
          src={
            (message.author.avatar && message.author.avatar.url) ||
            "/img/app/avatar-placeholder.png"
          }
          alt="Zdjęcie użytkownka"
          className="author-avatar__img"
        />
      </div>
      <p className="message-date">
        {moment(JSON.parse(message.date)).fromNow()}
      </p>
      <p
        className={`author-name ${
          message.author.id == user.id ? "me" : ""
        }`}>{`${message.author.name} ${message.author.surname}:`}</p>
      <p className="chatbox-message__msg">{message.msg}</p>
    </div>
  ));

  return (
    <Layout>
      <Head title="Chat" />
      <div className="app-chat container">
        <h1 className="global-section-title">Chat</h1>
        <div className="app-chat-container">
          <div className="chatbox mb-1" ref={chatboxEl}>
            {messageList}
          </div>
          <form
            action="submit"
            className="chatbox-message-form"
            onSubmit={handleSendMessage}>
            <Alert
              alert={alert}
              clearAlert={clearAlert}
              className="mb-1 app-chat__alert"
            />
            <textarea
              name="message"
              value={message}
              onKeyDown={isEnter}
              onChange={handleChange}
              placeholder="Twoja wiadomość..."
              className="input input--default chatbox-message-form__message mb-1"></textarea>
            <button
              className="btn btn--theme chatbox-message-form__send"
              type="submit">
              Wyślij
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
