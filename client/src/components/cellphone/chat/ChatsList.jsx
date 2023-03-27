import "./Chat.css";
import MatchesList from "./MatchesList";
import { useState, useEffect } from "react";
import Loading from "../../loading/Loading";
import { useCookies } from "react-cookie";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Image } from "cloudinary-react";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChatsList = ({ setClickedUser }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [mssgRead, setMssgRead] = useState({});
  const [matchedProfiles, setMatchedProfiles] = useState([]);
  const [cookies] = useCookies(null);
  const userId = cookies.userId;
  const axiosPrivate = useAxiosPrivate();
  const [lastMessagesList, setLastMessagesList] = useState([]);

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

  const getMatches = async (userLikedUserIds) => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.REACT_APP_URL}/users`,
        {
          params: { userIds: JSON.stringify(userLikedUserIds) },
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

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      const likedUsers = user?.user_matches;
      const userLikedUserIds = likedUsers?.map(({ user_id }) => user_id);
      getMatches(userLikedUserIds);
    }
  }, [user]);

  // ----------------------------------------------Getting Last Messages--------------------------------------------

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
    matchedProfiles?.forEach(async (match) => {
      let sentMssg = await getSentUsersMessages(user.user_id, match.user_id);
      let receiveMssg = await getReceivedUsersMessages(
        match.user_id,
        user.user_id
      );

      if (!sentMssg.length && !receiveMssg.length) return;

      const messages = [];

      sentMssg?.forEach((message) => {
        const formattedsentMessage = {};
        formattedsentMessage["name"] = match?.first_name;
        formattedsentMessage["user_id"] = match?.user_id;
        formattedsentMessage["img"] = match?.images[0];
        formattedsentMessage["message"] = message?.message;
        formattedsentMessage["timestamp"] = message?.timestamp;
        formattedsentMessage["dir"] = "out";
        messages.push(formattedsentMessage);
      });

      receiveMssg?.forEach((message) => {
        const formattedsentMessage = {};
        formattedsentMessage["name"] = match?.first_name;
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

  const [finalOrderedMessages, setFinalOrderedMessages] = useState([]);
  useEffect(() => {
    setFinalOrderedMessages(
      lastMessagesList
        ?.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
        .reverse()
    );
  }, [lastMessagesList]);

  useEffect(() => {
    finalOrderedMessages.forEach((match, index) => {
      setMssgRead((prevState) => ({
        ...prevState,
        [index]: user?.user_matches?.find(
          (matchUser) => matchUser.user_id === match.user_id
        ).read,
      }));
    });
  }, [finalOrderedMessages]);

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
            {finalOrderedMessages.map((match, index) => {
              return (
                <div
                  onClick={() => {
                    setClickedUser(match);
                    readMessage(match.user_id);
                  }}
                  key={index}
                  className="small-chat-preview"
                >
                  {!mssgRead[index.toString()] && (
                    <div className="icon-mail-cell"></div>
                  )}
                  <div className="preview-img">
                    {match.img && (
                      <Image
                        cloudName="dhttotcxc"
                        publicId={match.img?.id}
                        height="50"
                        crop="scale"
                        fetchFormat="auto"
                        quality="auto"
                      />
                    )}
                  </div>
                  <div className="preview-message">
                    <p
                      style={{
                        margin: "0",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {match.name}
                    </p>
                    <div className="small-chat-preview">
                      <p style={{ margin: "0", color: "white" }}>
                        {match.dir === "in" ? (
                          <FontAwesomeIcon
                            style={{ color: "green" }}
                            icon={faArrowRight}
                          />
                        ) : (
                          <FontAwesomeIcon
                            style={{ color: "red" }}
                            icon={faArrowLeft}
                          />
                        )}
                      </p>

                      <p style={{ margin: "0", color: "white" }}>
                        {match?.message}
                      </p>
                    </div>
                    <hr
                      style={{ width: "100%", color: "white", border: "none" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Loading type={"spin"} color={"#C6C9CA"} />
      )}
    </>
  );
};

export default ChatsList;
