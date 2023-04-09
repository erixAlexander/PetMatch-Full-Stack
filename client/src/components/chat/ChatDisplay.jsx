import { useEffect, useState } from "react";
import Chat from "./Chat";
import ChatInput from "./ChatInput";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import "./chat.css";

const ChatDisplay = ({ user, clickedUser, socket, readMessage }) => {
  const myUserId = user?.user_id;
  const clickedUserId = clickedUser?.user_id;
  const [sentUsersMessages, setSentUsersMessages] = useState(null);
  const [receivedUsersMessages, setReceivedUsersMessages] = useState(null);
  const [descendingOrderMessages, setDescendingOrderMessages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  // const [mssgReceived, setMssReceived] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const axiosPrivate = useAxiosPrivate();

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
      setLoading(false);
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
      formattedsentMessage["img"] = user?.images[0] || user?.url;
      formattedsentMessage["message"] = message?.message;
      formattedsentMessage["timestamp"] = message?.timestamp;
      setMessages((prev) => [...prev, formattedsentMessage]);
    });

    receivedUsersMessages?.forEach((message) => {
      const formattedsentMessage = {};
      formattedsentMessage["name"] = clickedUser?.first_name;
      formattedsentMessage["img"] = clickedUser?.images[0] || clickedUser?.url;
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
    readMessage(clickedUserId)
    socket.current?.on("newMessage", ({ userId, message }) => {
      readMessage(clickedUserId)
      setArrivalMessage({ userId, message });
    });
    return () => {
      socket.current.off("newMessage");
    };
  }, []);

  useEffect(() => {
    arrivalMessage &&
      clickedUser.user_id === arrivalMessage.userId &&
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

  return (
    <>
      <Chat
        loading={loading}
        descendingOrderMessages={descendingOrderMessages}
        user={user}
      />
      <ChatInput
        socket={socket}
        user={user}
        clickedUser={clickedUser}
        setDescendingOrderMessages={setDescendingOrderMessages}
      />
    </>
  );
};

export default ChatDisplay;