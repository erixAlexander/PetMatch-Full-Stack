import { useState, useEffect } from "react";
import Loading from "../loading/Loading";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Image } from "cloudinary-react";
import "../chat/chat.css";

const MatchesDisplay = ({ clickedUser, setClickedUser, socket, msgEmmited, userId }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [mssgRead, setMssgRead] = useState({});
  const [matchedProfiles, setMatchedProfiles] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [socketUserArray, setSocketUserArray] = useState([]);

  useEffect(() => {
    socket.current?.on("newMessage", ({ userId, notification }) => {
      setSocketUserArray((prev) => [...prev, { userId, notification }]);
    });
  }, [msgEmmited]);

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

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      const likedUsers = user?.user_matches;
      const userLikedUserIds = likedUsers?.map(({ user_id }) => user_id);
      getMatches(userLikedUserIds);
    }
  }, [user, clickedUser]);

  useEffect(() => {
    matchedProfiles.forEach((match, index) => {
      setMssgRead((prev) => ({
        ...prev,
        [index]: user?.user_matches?.find(
          (matchUser) => matchUser.user_id === match.user_id
        ).read,
      }));
    });
  }, [matchedProfiles, clickedUser]);

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
                }}
              >
                <div className="matches-img-container">
                  {!mssgRead[index.toString()] && (
                    <div className="icon-mail"></div>
                  )}
                  {socketUserArray?.find((u) => u.userId === match.user_id)
                    ?.notification && <div className="icon-mail"></div>}

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
          <Loading type={"bars"} color={"#C6C9CA"} />
        </div>
      )}
    </>
  );
};

export default MatchesDisplay;
