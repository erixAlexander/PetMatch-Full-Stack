import {
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import ReviewCard from "../card/ReviewCard";
import "./Sidebar.css";

const Sidebar = ({
  handleSidebar,
  petInfo,
  activeSidebar,
  openByDefault = true,
  swipe
}) => {
  const [imgIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const lastIndex = petInfo?.images?.length - 1;
    if (imgIndex < 0) {
      setImageIndex(lastIndex);
    }
    if (imgIndex > lastIndex) {
      setImageIndex(0);
    }
  }, [imgIndex]);

  return (
    <>
      {activeSidebar && !openByDefault && (
        <div className="sidebar-close-icon" onClick={handleSidebar}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
      )}
      <div>
      
        {!petInfo && activeSidebar && (
          <h3 style={{ margin: "10%", color: "gray" }}>
            More Pet's are joining Everyday! Come back Soon.
          </h3>
        ) 
          
        }
      </div>
      <div className="sidebar-activeSidebar-div">
        {activeSidebar && petInfo !== undefined && (
          <>
            <ReviewCard  swipe={swipe} setImageIndex={setImageIndex} imgIndex={imgIndex} petInfo={petInfo} />
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar;
