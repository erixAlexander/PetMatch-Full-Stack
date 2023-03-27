import "./Chat.css";
import { useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const ChatInput = ({
  user,
  clickedUser,
  setDescendingOrderMessages,
  socket,
}) => {
  const myUserId = user?.user_id;
  const clickedUserId = clickedUser?.user_id;
  const [textArea, setTextArea] = useState("");
  const axiosPrivate = useAxiosPrivate();

  const addMessage = async () => {
    const message = {
      timestamp: new Date().toISOString(),
      from_user_id: myUserId,
      to_user_id: clickedUserId,
      message: textArea.trim(),
    };
    if (message.message === "") {
      setTextArea("");
      return;
    }

    socket.current?.emit('sendMessage', {
      userId: myUserId,
      receiverId:clickedUserId,
      message: message.message
    })

    try {
      const response = await axiosPrivate.post(
        `${process.env.REACT_APP_URL}/message`,
        {
          message,
        }
      );
      setDescendingOrderMessages((prev) => [
        ...prev,
        {
          name: user?.first_name,
          img: clickedUser?.img || clickedUser?.images[0],
          message: message?.message,
          timestamp: message?.timestamp,
        },
      ]);
      setTextArea("");

      const success = response.status == 200;
      success &&
        (await axiosPrivate.put(`${process.env.REACT_APP_URL}/write-message`, {
          myUserId,
          clickedUserId,
        }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="small-chat-input">
      <form
      className="small-chat-input-form"
        onSubmit={async (e) => {
          e.preventDefault();
          await addMessage();
        }}
      >
        <textarea
          className="small-text-area"
          value={textArea}
          onChange={(e) => setTextArea(e.target.value)}
        />
        <button className="small-secondary-button">Send</button>
      </form>
    </div>
  );
};

export default ChatInput;
