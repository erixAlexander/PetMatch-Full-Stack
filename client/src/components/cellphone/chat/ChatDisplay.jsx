import { useEffect, useState, useRef } from "react";
import { Image } from "cloudinary-react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import ChatInput from "./ChatInput";
import "./Chat.css";

const ChatDisplay = ({ user, clickedUser, setClickedUser, socket }) => {
  const [sentUsersMessages, setSentUsersMessages] = useState(null);
  const [receivedUsersMessages, setReceivedUsersMessages] = useState(null);
  const [descendingOrderMessages, setDescendingOrderMessages] = useState(null);
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const myUserId = user?.user_id;
  const clickedUserId = clickedUser?.user_id;
  const axiosPrivate = useAxiosPrivate();
  const inputRef = useRef();

  const getSentUsersMessages = async () => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.REACT_APP_URL}/messages`,
        {
          params: {
            userId: myUserId,
            correspondingUserId: clickedUserId,
          },
        }
      );
      setSentUsersMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getReceivedUsersMessages = async () => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.REACT_APP_URL}/messages`,
        {
          params: {
            userId: clickedUserId,
            correspondingUserId: myUserId,
          },
        }
      );
      setReceivedUsersMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSentUsersMessages();
    getReceivedUsersMessages();
  }, []);

  useEffect(() => {
    setMessages([]);
    sentUsersMessages?.forEach((message) => {
      const formattedsentMessage = {};
      formattedsentMessage["name"] = user?.first_name;
      formattedsentMessage["img"] = user?.images[0] || user?.img;
      formattedsentMessage["message"] = message?.message;
      formattedsentMessage["timestamp"] = message?.timestamp;
      setMessages((prev) => [...prev, formattedsentMessage]);
    });

    receivedUsersMessages?.forEach((message) => {
      const formattedsentMessage = {};
      formattedsentMessage["name"] = clickedUser?.first_name;
      formattedsentMessage["img"] = clickedUser?.img || clickedUser?.images[0];
      formattedsentMessage["message"] = message?.message;
      formattedsentMessage["timestamp"] = message?.timestamp;
      setMessages((prev) => [...prev, formattedsentMessage]);
    });
  }, [receivedUsersMessages, sentUsersMessages]);

  useEffect(() => {
    setDescendingOrderMessages(
      [...new Set(messages)]?.sort((a, b) => {
        return a.timestamp.localeCompare(b.timestamp);
      })
    );
  }, [messages]);

  useEffect(() => {
    // readMessage(clickedUserId)
    socket.current?.on("newMessage", ({ userId, message }) => {
      // readMessage(clickedUserId)
      console.log("new message");
      setArrivalMessage({ userId, message });
    });
    return () => {
      socket.current.off("newMessage");
    };
  }, []);

  useEffect(() => {
    arrivalMessage &&
      clickedUser.user_id == arrivalMessage.userId &&
      setDescendingOrderMessages((prev) => [
        ...prev,
        {
          name: clickedUser.first_name,
          img: clickedUser?.images[0] || user?.url,
          message: arrivalMessage?.message,
          timestamp: new Date(),
        },
      ]);
  }, [arrivalMessage]);

  const scrollToBottom = () => {
    inputRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [descendingOrderMessages]);

  return (
    <div className="chatDisplay-main-container">
      <div onClick={() => setClickedUser(null)} className="back-chat-display">
        <FontAwesomeIcon icon={faArrowLeft} />
      </div>
      <div className="chat-display chat-display-flex">
        {descendingOrderMessages?.map((message, index) => {
          if (message?.name === user.first_name) {
            return (
              <div className="single-chat" key={index}>
                <div className="chat-message-header">
                  <div className="chat-display-img-container">
                    {descendingOrderMessages && (
                      <>
                        <Image
                          cloudName="dhttotcxc"
                          publicId={message?.img.id}
                          width="500"
                          crop="scale"
                        />
                        <p className="small-chat-pet-name">{message.name}</p>
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
                    <p className="user-chat-pet-message">{message.message}</p>
                    <div className="chat-text">
                      {descendingOrderMessages && (
                        <Image
                          cloudName="dhttotcxc"
                          publicId={message?.img?.id}
                          width="500"
                          crop="scale"
                        />
                      )}
                      <p className="small-chat-pet-name">{message.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })}
        <div ref={inputRef} />
      </div>
      <div className="chat-display-flex2">
        <ChatInput
          socket={socket}
          setDescendingOrderMessages={setDescendingOrderMessages}
          user={user}
          clickedUser={clickedUser}
        />
      </div>
    </div>
  );
};

export default ChatDisplay;
