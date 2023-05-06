import React, { useEffect, useMemo, useState } from "react";
import TinderCard from "react-tinder-card";

const ActivitiesCard = ({
  setShowCard,
  genderedUsers,
  userId,
  updateMatches,
}) => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    // currentIndexRef.current = val;
  };

  useEffect(() => {
    setCurrentIndex(genderedUsers?.length - 1);
  }, [genderedUsers]);

  const childRefs = useMemo(
    () =>
      Array(genderedUsers?.length)
        .fill(0)
        .map((i) => React.createRef()),
    [genderedUsers]
  );

  const swiped = (direction, swipedUserId, index) => {
    if (direction === "right") {
      updateMatches(userId, swipedUserId);
    }
    updateCurrentIndex(index - 1);
  };
  console.log(currentIndex)

  return (
    <div className="activities-card-container">
      <h1 onClick={() => setShowCard(false)}>Activity</h1>
      {genderedUsers.map((genderedUser, index) => {
        return (
          <TinderCard
            key={genderedUser.user_id}
            onSwipe={(dir) => swiped(dir, genderedUser.user_id, index)}
            ref={childRefs[index]}
            className="activities-card"
          >
            <div
              style={{
                backgroundImage: `url(${genderedUser.images[0].url})`,
              }}
              className="activities-card-img"
            ></div>
          </TinderCard>
        );
      })}
    </div>
  );
};

export default ActivitiesCard;
