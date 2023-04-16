import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import ChatDisplay from "./ChatDisplay";
import ChatsList from "./ChatsList";
import "./Chat.css";

const Chat = ({ user }) => {
  const [clickedUser, setClickedUser] = useState(null);
  const [msgEmmited, setMsgEmmited] = useState(false);
  const [socketNotification, setSocketNotification] = useState({});
  const [notificationArray, setNotificationArray] = useState([]);
  const socket = useRef();
  const URL = process.env.REACT_APP_SOCKET;

  const newCellNotification = ({ userId, notification }) => {
    setSocketNotification((prev) => {
      return { ...prev, userId, notification };
    });
  };

  useEffect(() => {
    console.log(URL);
    socket.current = io(`${URL}`);
    return () => {
      socket.current.off("usersSocketsArray");
    };
  }, []);

  useEffect(() => {
    socket?.current?.emit("addUserToSocketArray", user?.user_id);
  }, [socket]);

  useEffect(() => {
    socket.current?.on("newMessage", newCellNotification);

    return () => {
      setSocketNotification({});
      socket.current.off("newMessage", newCellNotification);
    };
  }, [socket]);

  return (
    <>
      {!clickedUser ? (
        <ChatsList
          setClickedUser={setClickedUser}
          user={user}
          socketNotification={socketNotification}
          setSocketNotification={setSocketNotification}
          notificationArray={notificationArray}
          setNotificationArray={setNotificationArray}
        />
      ) : (
        <ChatDisplay
          user={user}
          clickedUser={clickedUser}
          setClickedUser={setClickedUser}
          socket={socket}
          msgEmmited={msgEmmited}
          setSocketNotification={setSocketNotification}
          setNotificationArray={setNotificationArray}
        />
      )}
    </>
  );
};

export default Chat;
