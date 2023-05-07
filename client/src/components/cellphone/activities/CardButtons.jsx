import {
  faArrowRotateLeft,
  faHeart,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CardButtons = ({
  currentIndex,
  setCurrentIndex,
  childRefs,
  activityUsers,
}) => {
  const canGoBack = currentIndex < activityUsers.length - 1;
  const canSwipe = currentIndex >= 0;

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };
  console.log(childRefs);
  console.log(currentIndex);

  const swipe = async (dir) => {
    console.log(currentIndex);
    console.log(childRefs);
    if (canSwipe && currentIndex < activityUsers.length) {
      await childRefs[currentIndex]?.current.swipe(dir);
    }
  };
  return (
    <div className="card-activities-buttons">
      <FontAwesomeIcon
        onClick={() => {
          swipe("left");
        }}
        className="card-button-icon"
        icon={faXmarkCircle}
      />
      <FontAwesomeIcon
        onClick={goBack}
        className="card-button-icon"
        icon={faArrowRotateLeft}
      />
      <FontAwesomeIcon
        onClick={() => {
          swipe("right");
        }}
        className="card-button-icon"
        icon={faHeart}
      />
    </div>
  );
};

export default CardButtons;
