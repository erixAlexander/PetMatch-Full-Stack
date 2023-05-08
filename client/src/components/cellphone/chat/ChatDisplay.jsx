import { useEffect, useState, useRef } from "react";
import { Image } from "cloudinary-react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import ChatInput from "./ChatInput";
import Loading from "../../loading/Loading";
import "./Chat.css";

const ChatDisplay = ({
  user,
  clickedUser,
  setClickedUser,
  socket,
  setSocketNotification,
  setNotificationArray,
}) => {
  const [sentUsersMessages, setSentUsersMessages] = useState(null);
  const [receivedUsersMessages, setReceivedUsersMessages] = useState(null);
  const [descendingOrderMessages, setDescendingOrderMessages] = useState(null);
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const myUserId = user?.user_id;
  const clickedUserId = clickedUser?.user_id;
  const axiosPrivate = useAxiosPrivate();
  const inputRef = useRef();

  const newCellMessage = ({ userId, message }) => {
    setArrivalMessage({ userId, message });
  };

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
      setLoading(false)
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
      formattedsentMessage["name"] = user?.pet_name;
      formattedsentMessage["img"] = user?.images[0] || user?.img;
      formattedsentMessage["message"] = message?.message;
      formattedsentMessage["timestamp"] = message?.timestamp;
      setMessages((prev) => [...prev, formattedsentMessage]);
    });

    receivedUsersMessages?.forEach((message) => {
      const formattedsentMessage = {};
      formattedsentMessage["name"] = clickedUser?.pet_name;
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
    socket.current?.on("newMessage", newCellMessage);
    return () => {
      socket.current.off("newMessage", newCellMessage);
    };
  }, [socket]);

  useEffect(() => {
    arrivalMessage &&
      clickedUser.user_id == arrivalMessage.userId &&
      setDescendingOrderMessages((prev) => [
        ...prev,
        {
          name: clickedUser.pet_name,
          img: clickedUser?.img || clickedUser?.images[0],
          message: arrivalMessage?.message,
          timestamp: new Date(),
        },
      ]);
  }, [arrivalMessage]);

  useEffect(() => {
    const scrollToBottom = () => {
      inputRef.current?.scrollIntoView({ behavior: "smooth" });
      setLoading(false);
    };

    descendingOrderMessages?.length && scrollToBottom();
  }, [descendingOrderMessages]);

  const readMessage = async (match_id) => {
    try {
      const response = await axiosPrivate.put(
        `${process.env.REACT_APP_URL}/read-message`,
        {
          match_id,
          userId: myUserId,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <div className="chatdisplay-loading">
          <Loading type={"spin"} color={"#fe3072"} />
        </div>
      ) : (
        <div className="chatDisplay-main-container">
          <div
            onClick={() => {
              readMessage(clickedUserId);
              setSocketNotification({});
              setNotificationArray((prev) => {
                const test2 = prev.filter((e) => e.userId != clickedUserId);
                return test2;
              });
              setTimeout(() => {
                setClickedUser(null);
              }, 1000);
            }}
            className="back-chat-display"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
          <div className="chat-display chat-display-flex">
            {descendingOrderMessages?.map((message, index) => {
              if (message?.name === user.pet_name) {
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
                            <p className="small-chat-pet-name">
                              {message.name}
                            </p>
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
      )}
    </>
  );
};

export default ChatDisplay;
