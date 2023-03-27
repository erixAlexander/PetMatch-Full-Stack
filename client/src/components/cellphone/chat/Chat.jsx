import { useState, useRef, useEffect } from "react";
import "./Chat.css";
import ChatDisplay from "./ChatDisplay";
import ChatsList from "./ChatsList";
import { io } from "socket.io-client";

const Chat = ({ user }) => {
  const [clickedUser, setClickedUser] = useState(null);
  const socket = useRef();
  const [msgEmmited, setMsgEmmited] = useState(false);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    return () => {
      socket.current.off("usersSocketsArray");
    };
  }, []);

  useEffect(() => {
    socket?.current?.emit("addUserToSocketArray", user?.user_id);
    setMsgEmmited(!msgEmmited);
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
