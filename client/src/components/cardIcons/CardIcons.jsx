import {
  faHeart,
  faStar,
  faXmark,
  faArrowRotateLeft,
  faDog
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./cardIcons.css";

const CardIcons = ({ swipe, canSwipe, goBack, canGoBack }) => {
  return (
    <div className="icons">
      <FontAwesomeIcon
        style={{ backgroundColor: !canSwipe && "#c3c4d3" }} 
        onClick={() => swipe("left")}
        className="circle x"
        icon={faXmark}
        title="Not my kind of doggy"
      />
      <FontAwesomeIcon
      style={{ backgroundColor: !canGoBack && "#c3c4d3" }}
      onClick={() => goBack()}
        className="circle"
        icon={faArrowRotateLeft}
        title="Wait, maybe I did like that doggy :( "
      />
      <FontAwesomeIcon style={{ backgroundColor: !canSwipe && "#c3c4d3" }} className="circle dog" icon={faDog} title="Super Like, I loooove this doggy!!!" />
      <FontAwesomeIcon style={{ backgroundColor: !canSwipe && "#c3c4d3" }} className="circle" icon={faStar} title="Super Like" />
      <FontAwesomeIcon
        style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
        onClick={() => swipe("right")}
        className="circle heart"
        icon={faHeart}
        title="I really like this doggy"
      />
    </div>
  );
};

export default CardIcons;
