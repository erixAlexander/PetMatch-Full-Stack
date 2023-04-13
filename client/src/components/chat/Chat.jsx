import { Image } from "cloudinary-react";
import { useRef, useEffect } from "react";
import Loading from "../loading/Loading";
import UserMessage from "./UserMessage";
import MatchMessage from "./MatchMessage";
import "./Chat.css";

const Chat = ({ descendingOrderMessages, user, loading }) => {
  const inputRef = useRef();
  const scrollToBottom = () => {
    inputRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [descendingOrderMessages]);

  return (
    <>
      {loading ? (
        <div className="loading">
          <Loading type={"bars"} color={"#fe3072"} />
        </div>
      ) : (
        <>
          <div className="chat-display">
            {descendingOrderMessages &&
              descendingOrderMessages?.map((message, index) => {
                if (message?.name === user.first_name) {
                  return (
                    <UserMessage
                      descendingOrderMessages={descendingOrderMessages}
                      index={index}
                      message={message}
                      Image={Image}
                    />
                  );
                } else {
                  return (
                    <MatchMessage
                      descendingOrderMessages={descendingOrderMessages}
                      index={index}
                      message={message}
                      Image={Image}
                    />
                  );
                }
              })}
            <div ref={inputRef} />
          </div>
        </>
      )}
    </>
  );
};

export default Chat;
