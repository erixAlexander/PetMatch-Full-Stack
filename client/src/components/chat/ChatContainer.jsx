import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { useCookies } from "react-cookie";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import MatchesDisplay from "./MatchesDisplay";
import ChatDisplay from "./ChatDisplay";
import Chatheader from "./Chatheader";
import "./Chat.css";

const ChatContainer = ({ user }) => {
  const [cookies] = useCookies(null);
  const [clickedUser, setClickedUser] = useState(null);
  const [socketNotification, setSocketNotification] = useState({});
  const [notificationArray, setNotificationArray] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const socket = useRef();
  const userId = cookies.userId;
  const URL = process.env.REACT_APP_SOCKET;

  const newNotification = ({ userId, notification }) => {
    setSocketNotification((prev) => {
      return { ...prev, userId, notification };
    });
  };

  const readMessage = async (match_id) => {
    try {
      await axiosPrivate.put(`${process.env.REACT_APP_URL}/read-message`, {
        match_id,
        userId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.current = io(`${URL}`);
    return () => {
      socket.current.off("usersSocketsArray");
    };
  }, []);

  useEffect(() => {
    socket?.current?.emit("addUserToSocketArray", user?.user_id);
  }, [socket]);

  useEffect(() => {
    socket.current?.on("newMessage", newNotification);

    return () => {
      socket.current.off("newMessage", newNotification);
    };
  }, [socket]);

  return (
    <div className="chat-container">
      <Chatheader user={user} />
      <div className="second-chat-header">
        <button
          className="option"
          onClick={() => {
            readMessage(clickedUser.user_id);
            setSocketNotification({});
            setNotificationArray((prev) => {
              const test2 = prev.filter((e) => e.userId != clickedUser.user_id);
              return test2;
            });
            setTimeout(() => {
              setClickedUser(null);
            }, 1000);
          }}
        >
          Matches
        </button>
        <button className="option" disabled={!clickedUser}>
          Chat
        </button>
      </div>
      {!clickedUser && (
        <MatchesDisplay
          userId={userId}
          readMessage={readMessage}
          socket={socket}
          setClickedUser={setClickedUser}
          clickedUser={clickedUser}
          socketNotification={socketNotification}
          setSocketNotification={setSocketNotification}
          notificationArray={notificationArray}
          setNotificationArray={setNotificationArray}
        />
      )}
      {clickedUser && (
        <ChatDisplay
          readMessage={readMessage}
          socket={socket}
          user={user}
          clickedUser={clickedUser}
        />
      )}
    </div>
  );
};

export default ChatContainer;
