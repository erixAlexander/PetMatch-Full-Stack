import { useEffect, useMemo, useState, createRef } from "react";
import TinderCard from "react-tinder-card";
import BackgroundImage from "./BackgroundImage";
import CardInfo from "./CardInfo";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import CardButtons from "./CardButtons";
import Loading from "../../loading/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const ActivitiesCard = ({
  setShowCard,
  userId,
  updateMatches,
  user,
  activity,
}) => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const [activityUsers, setActivityUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  const getActivityUsers = async () => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.REACT_APP_URL}/add-activity`,
        {
          params: { userId, activity },
        }
      );

      setActivityUsers(shuffleArray(response?.data));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const shuffleArray = (array) => {
    for (let i = array?.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  useEffect(() => {
    if (user && activity && !activityUsers.length) {
      getActivityUsers(userId);
    }
  }, [user]);

  useEffect(() => {
    setCurrentIndex(activityUsers?.length - 1);
  }, [activityUsers]);

  const childRefs = useMemo(
    () =>
      Array(activityUsers?.length)
        .fill(0)
        .map((i) => createRef()),
    [activityUsers]
  );

  const swiped = (direction, swipedUserId, index) => {
    if (direction === "right") {
      updateMatches(userId, swipedUserId);
    }
    setCurrentIndex(index - 1);
  };

  return (
    <div className="activities-card-container">
      <h3 onClick={() => setShowCard(false)}>
        Check out another activity! <FontAwesomeIcon icon={faArrowLeft} />
      </h3>
      {loading ? (
        <div className="activities-loading">
          <Loading type={"spin"} color={"#fe3072"} />
        </div>
      ) : activityUsers.length > 0 ? (
        <>
          {activityUsers.map((activityUser, index) => {
            return (
              <TinderCard
                key={activityUser.user_id}
                onSwipe={(dir) => swiped(dir, activityUser.user_id, index)}
                ref={childRefs[index]}
                className="activities-card"
              >
                <BackgroundImage activityUser={activityUser} />

                <CardInfo activityUser={activityUser} activity={activity} />
              </TinderCard>
            );
          })}
          <CardButtons
            activityUsers={activityUsers}
            setCurrentIndex={setCurrentIndex}
            currentIndex={currentIndex}
            childRefs={childRefs}
          />
        </>
      ) : (
        <div className="no-activity-users">
          <h2>There are no users in this activity at the moment</h2>
          <p>Come back soon!</p>
        </div>
      )}
    </div>
  );
};

export default ActivitiesCard;
