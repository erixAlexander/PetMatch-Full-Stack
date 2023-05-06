import { Link } from "react-router-dom";
import { Image } from "cloudinary-react";
import {
  faAnglesLeft,
  faCamera,
  faGears,
  faPencil,
  faShield,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ContentSlider from "../../../components/contentSlider/ContentSlider";

const MainProfile = ({ user, setEdit, setMain, setPictures }) => {
  return (
    <>
      <Link to={"/dashboard"}>
        <div className="link-dashboard-icon">
          <FontAwesomeIcon className="dashboard-icon" icon={faAnglesLeft} />
        </div>
      </Link>

      <div className="secondary-small-profile-container">
        <div className="small-profile-title">
          <h1>Profile</h1>
          <hr className="small-profile-hr-title" />
        </div>

        <div className="small-profile-circle">
          <div>
            <Image
              cloudName="dhttotcxc"
              publicId={user?.images[0]?.id}
              width="260"
              crop="scale"
            />
          </div>
        </div>
        <div
          onClick={() => {
            setMain(false);
            setPictures(true);
          }}
          className="small-profile-edit-pictures"
        >
          <FontAwesomeIcon
            className="small-profile-camera-icon"
            icon={faCamera}
          />
        </div>
        <div className="small-profile-pet-name-logo">
          <p className="small-profile-pet-name">
            {user?.pet_name}, Year of Birth {user?.dob_year}
          </p>
          <FontAwesomeIcon
            title="Verify your Profile"
            className="verify"
            icon={faUserCheck}
          />
        </div>
        <div className="small-profile-icons-container">
          <div className="small-profile-icons-name">
            <div className="small-profile-main-icons">
              <FontAwesomeIcon className="small-profile-icons" icon={faGears} />
            </div>
            <h4>Settings</h4>
          </div>
          <div
            onClick={() => {
              setMain(false);
              setEdit(true);
            }}
            className="small-profile-icons-name"
          >
            <div className="small-profile-main-icons middle">
              <FontAwesomeIcon
                className="small-profile-icons"
                icon={faPencil}
              />
            </div>
            <h4>Edit</h4>
          </div>
          <div className="small-profile-icons-name">
            <div className="small-profile-main-icons">
              <FontAwesomeIcon
                className="small-profile-icons"
                icon={faShield}
              />
            </div>
            <h4>Security</h4>
          </div>
        </div>
      </div>
      <div className="content-slider">
        <ContentSlider />
      </div>
    </>
  );
};

export default MainProfile;
