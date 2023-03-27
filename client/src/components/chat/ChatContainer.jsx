import MatchesDisplay from "../matches/MatchesDisplay";
import ChatDisplay from "./ChatDisplay";
import Chatheader from "./Chatheader";
import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useCookies } from "react-cookie";
import "./chat.css";

const ChatContainer = ({ user }) => {

  const [cookies] = useCookies(null);
  const userId = cookies.userId;
  const [clickedUser, setClickedUser] = useState(null);
  const [msgEmmited, setMsgEmmited] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const socket = useRef();

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
    <div className="chat-container">
      <Chatheader user={user} />
      <div className="second-chat-header">
        <button
          className="option"
          onClick={() => {
            setClickedUser(null);
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
          msgEmmited={msgEmmited}
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
