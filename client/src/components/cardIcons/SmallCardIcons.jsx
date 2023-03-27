import {
    faHeart,
    faStar,
    faXmark,
    faArrowRotateLeft,
    faDog
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import "./cardIcons.css";
  
  const SmallCardIcons = ({ swipe, canSwipe, goBack, canGoBack }) => {
    return (
      <div className="small-icons">
        <FontAwesomeIcon
          style={{ backgroundColor: !canSwipe && "#c3c4d3" }} 
          onClick={() => swipe("left")}
          className="small-circle-icons small-x"
          icon={faXmark}
          title="Not my kind of doggy"
        />
        <FontAwesomeIcon
        style={{ backgroundColor: !canGoBack && "#c3c4d3" }}
        onClick={() => goBack()}
          className="small-circle-icons"
          icon={faArrowRotateLeft}
          title="Wait, maybe I did like that doggy :( "
        />
        <FontAwesomeIcon style={{ backgroundColor: !canSwipe && "#c3c4d3" }} className="small-circle-icons dog" icon={faDog} title="Super Like, I loooove this doggy!!!" />
        <FontAwesomeIcon style={{ backgroundColor: !canSwipe && "#c3c4d3" }} className="small-circle-icons" icon={faStar} title="Super Like" />
        <FontAwesomeIcon
          style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
          onClick={() => swipe("right")}
          className="small-circle-icons heart"
          icon={faHeart}
          title="I really like this doggy"
        />
      </div>
    );
  };
  
  export default SmallCardIcons;
  