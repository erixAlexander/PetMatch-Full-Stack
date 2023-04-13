import { useState, useEffect } from "react";
import Loading from "../loading/Loading";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Image } from "cloudinary-react";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../chat/Chat.css";

const MatchesDisplay = ({
  clickedUser,
  setClickedUser,
  userId,
  socketNotification,
  setSocketNotification,
}) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [mssgRead, setMssgRead] = useState({});
  const [matchedProfiles, setMatchedProfiles] = useState([]);
  const [notificationArray, setNotificationArray] = useState([]);
  const axiosPrivate = useAxiosPrivate();

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

  const getMatches = async (likedUserIds) => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.REACT_APP_URL}/users`,
        {
          params: { userIds: JSON.stringify(likedUserIds) },
        }
      );
      const allLikedUsers = response.data;

      setMatchedProfiles(
        allLikedUsers.filter(
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

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      const likedUsers = user?.user_matches;
      const likedUserIds = likedUsers?.map(({ user_id }) => user_id);
      getMatches(likedUserIds);
    }
  }, [user, clickedUser]);

  useEffect(() => {
    matchedProfiles.forEach((match, index) => {
      setMssgRead((prev) => ({
        ...prev,
        [index]: user?.user_matches?.find(
          (matchedUser) => matchedUser.user_id === match.user_id
        ).read,
      }));
    });
  }, [matchedProfiles, clickedUser]);

  useEffect(() => {
    setNotificationArray((prev) => {
      const test2 = prev.filter((e) => e.userId != socketNotification.userId);
      return [...test2, socketNotification];
    });
  }, [socketNotification]);

  return (
    <>
      {!loading ? (
        <div className="matches-display">
          {matchedProfiles.map((match, index) => {
            return (
              <div
                key={index}
                className="match-card option-2"
                onClick={() => {
                  setClickedUser(match);
                  setSocketNotification({});
                  setNotificationArray((prev) => {
                    const test2 = prev.filter((e) => e.userId != match.user_id);
                    return test2;
                  });
                }}
              >
                <div className="matches-img-container">
                  {!mssgRead[index.toString()] && (
                    <FontAwesomeIcon className="icon-mail" icon={faEnvelope} />
                  )}
                  {notificationArray?.find((u) => u.userId == match.user_id)
                    ?.notification && (
                    <FontAwesomeIcon className="icon-mail" icon={faEnvelope} />
                  )}

                  {match.images && (
                    <Image
                      cloudName="dhttotcxc"
                      publicId={match.images[0]?.id}
                      width="400"
                      crop="scale"
                    />
                  )}
                  <div className="overlay-match-card"></div>
                  <h4>{match?.first_name}</h4>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="loading">
          <Loading type={"bars"} color={"#fe3072"} />
        </div>
      )}
    </>
  );
};

export default MatchesDisplay;
