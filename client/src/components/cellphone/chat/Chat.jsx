import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import ChatDisplay from "./ChatDisplay";
import ChatsList from "./ChatsList";
import "./Chat.css";

const Chat = ({ user }) => {
  const [clickedUser, setClickedUser] = useState(null);
  const [msgEmmited, setMsgEmmited] = useState(false);
  const socket = useRef();
  const URL = process.env.REACT_APP_SOCKET;

  useEffect(() => {
    socket.current = io(`${URL}`);
    return () => {
      socket.current.off("usersSocketsArray");
    };
  }, []);

  useEffect(() => {
    socket?.current?.emit("addUserToSocketArray", user?.user_id);
  }, [socket]);

  return (
    <>
      {!clickedUser ? (
        <ChatsList
          socket={socket}
          msgEmmited={msgEmmited}
          setClickedUser={setClickedUser}
          user={user}
        />
      ) : (
        <ChatDisplay
          user={user}
          clickedUser={clickedUser}
          setClickedUser={setClickedUser}
          socket={socket}
          msgEmmited={msgEmmited}
        />
      )}
    </>
  );
};

export default Chat;
