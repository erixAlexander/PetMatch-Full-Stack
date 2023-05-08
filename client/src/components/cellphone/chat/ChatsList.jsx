import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import MatchesList from "./MatchesList";
import Loading from "../../loading/Loading";
import ChatListMessages from "./ChatListMessages";
import "./Chat.css";

const ChatsList = ({
  setClickedUser,
  socketNotification,
  setSocketNotification,
  notificationArray,
  setNotificationArray,
}) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [mssgRead, setMssgRead] = useState({});
  const [matchedProfiles, setMatchedProfiles] = useState([]);
  const [cookies] = useCookies(null);
  const [lastMessagesList, setLastMessagesList] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const userId = cookies.userId;
  const [latestReceivedMessages, setLatestReceivedMessages] = useState([]);

  const getUser = async () => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.REACT_APP_URL}/user`,
        {
          params: { userId },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getMatches = async (likedUsersIds) => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.REACT_APP_URL}/users`,
        {
          params: { userIds: JSON.stringify(likedUsersIds) },
        }
      );

      setMatchedProfiles(
        response.data?.filter(
          (matchedProfile) =>
            matchedProfile.user_matches.filter(
              (profile) => profile.user_id == userId
            ).length > 0
        )
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

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

  const getSentUsersMessages = async (myUserId, clickedUserId) => {
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
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getReceivedUsersMessages = async (clickedUserId, myUserId) => {
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
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      const likedUsers = user?.user_matches;
      const likedUsersIds = likedUsers?.map(({ user_id }) => user_id);
      getMatches(likedUsersIds);
    }
  }, [user]);

  useEffect(() => {
    matchedProfiles?.forEach(async (match) => {
      let sentMssg = await getSentUsersMessages(user.user_id, match.user_id);
      let receiveMssg = await getReceivedUsersMessages(
        match.user_id,
        user.user_id
      );

      if (!sentMssg.length && !receiveMssg.length) {
        // setLastMessagesList([]);
        return;
      }

      const messages = [];

      sentMssg?.forEach((message) => {
        const formattedsentMessage = {};
        formattedsentMessage["name"] = match?.pet_name;
        formattedsentMessage["user_id"] = match?.user_id;
        formattedsentMessage["img"] = match?.images[0];
        formattedsentMessage["message"] = message?.message;
        formattedsentMessage["timestamp"] = message?.timestamp;
        formattedsentMessage["dir"] = "out";
        messages.push(formattedsentMessage);
      });

      receiveMssg?.forEach((message) => {
        const formattedsentMessage = {};
        formattedsentMessage["name"] = match?.pet_name;
        formattedsentMessage["user_id"] = match?.user_id;
        formattedsentMessage["img"] = match?.images[0];
        formattedsentMessage["message"] = message?.message;
        formattedsentMessage["timestamp"] = message?.timestamp;
        formattedsentMessage["dir"] = "in";
        messages.push(formattedsentMessage);
      });

      const descendingOrderMessages = messages?.sort((a, b) =>
        a.timestamp.localeCompare(b.timestamp)
      );

      setLastMessagesList((prev) => [
        ...prev,
        descendingOrderMessages[descendingOrderMessages.length - 1],
      ]);
    });
  }, [matchedProfiles]);

  useEffect(() => {
    setLatestReceivedMessages(
      lastMessagesList
        ?.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
        .reverse()
    );
  }, [lastMessagesList]);

  useEffect(() => {
    latestReceivedMessages?.forEach((match, index) => {
      setMssgRead((prevState) => ({
        ...prevState,
        [index]: user?.user_matches?.find(
          (matchUser) => matchUser.user_id === match.user_id
        ).read,
      }));
    });
  }, [latestReceivedMessages]);

  useEffect(() => {
    setNotificationArray((prev) => {
      const filteredNotificationArray = prev.filter(
        (e) => e.userId != socketNotification.userId
      );
      return [...filteredNotificationArray, socketNotification];
    });
  }, [socketNotification]);

  return (
    <>
      {user && !loading ? (
        <div className="small-chatList-main-container">
          <div className="matches-info-containter">
            <h2 className="small-chat-title">Latest Matches</h2>
            <div className="small-matchesList">
              <MatchesList
                setClickedUser={setClickedUser}
                matchedProfiles={matchedProfiles}
              />
            </div>
          </div>
          <div className="small-chat-secondary-container">
            <h2 className="small-chat-title">Chats</h2>
            <ChatListMessages
              latestReceivedMessages={latestReceivedMessages}
              setClickedUser={setClickedUser}
              readMessage={readMessage}
              setSocketNotification={setSocketNotification}
              setNotificationArray={setNotificationArray}
              mssgRead={mssgRead}
              FontAwesomeIcon={FontAwesomeIcon}
              notificationArray={notificationArray}
            />
          </div>
        </div>
      ) : (
        <div className="chatdisplay-loading">
          <Loading type={"spin"} color={"#fe3072"} />
        </div>
      )}
    </>
  );
};

export default ChatsList;
