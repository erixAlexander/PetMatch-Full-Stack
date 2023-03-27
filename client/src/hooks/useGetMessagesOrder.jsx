
import { useEffect, useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useGetMessagesOrder = (user, match) => {
    
    const myUserId = user?.user_id;
    const clickedUserId = match?.user_id;
    const [sentUsersMessages, setSentUsersMessages] = useState(null);
    const [receivedUsersMessages, setReceivedUsersMessages] = useState(null);
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
        setReceivedUsersMessages(response.data);
      } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(() => {
      getSentUsersMessages();
      getReceivedUsersMessages();
    }, []);
  
    const messages = [];
  
    sentUsersMessages?.forEach((message) => {
      const formattedsentMessage = {};
      formattedsentMessage["name"] = user?.first_name;
      formattedsentMessage["img"] = user?.images[0] || user?.url;
      formattedsentMessage["message"] = message?.message;
      formattedsentMessage["timestamp"] = message?.timestamp;
      messages.push(formattedsentMessage);
    });
  
    receivedUsersMessages?.forEach((message) => {
      const formattedsentMessage = {};
      formattedsentMessage["name"] = match?.first_name;
      formattedsentMessage["img"] = match?.images[0] || user?.url;
      formattedsentMessage["message"] = message?.message;
      formattedsentMessage["timestamp"] = message?.timestamp;
      messages.push(formattedsentMessage);
    });
  
    const descendingOrderMessages = messages?.sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp)
    );
  
    return descendingOrderMessages
}
 
export default useGetMessagesOrder;