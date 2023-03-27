import "./chat.css";
import { Image } from "cloudinary-react";
import { useRef, useEffect } from "react";
import Loading from "../loading/Loading";

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
        <Loading type={"bars"} color={"#C6C9CA"} />
      </div>
      ) : (
        <>
          <div className="chat-display">
            {descendingOrderMessages &&
              descendingOrderMessages.map((message, index) => {
                if (message?.name === user.first_name) {
                  return (
                    <div className="single-chat" key={index}>
                      <div className="chat-message-header">
                        <div className="chat-display-img-container">
                          {descendingOrderMessages && (
                            <>
                              <Image
                                cloudName="dhttotcxc"
                                publicId={message?.img?.id}
                                width="500"
                                crop="scale"
                              />
                              <p className="chat-pet-name">{message.name}</p>
                            </>
                          )}
                        </div>
                        <p className="chat-pet-message">{message.message}</p>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="single-chat" key={index}>
                      <div className="user-chat-message-header">
                        <div className="user-chat-display-img-container">
                          <p className="user-chat-pet-message">
                            {message.message}
                          </p>
                          <div className="chat-text">
                            {descendingOrderMessages && (
                              <Image
                                cloudName="dhttotcxc"
                                publicId={message?.img.id}
                                width="500"
                                crop="scale"
                              />
                            )}
                            <p className="chat-pet-name">{message.name}</p>
                          </div>
                        </div>
                      </div>
                    </div>
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
