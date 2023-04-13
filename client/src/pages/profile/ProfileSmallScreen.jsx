import { useState, useEffect } from "react";
import { Image } from "cloudinary-react";
import { useCookies } from "react-cookie";
import Loading from "../../components/loading/Loading";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link } from "react-router-dom";
import {
  faAnglesLeft,
  faGears,
  faPencil,
  faShield,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ContentSlider from "../../components/contentSlider/ContentSlider";
import "./ProfileSmallScreen.css";

const Profile = () => {
  const [imgUrl, setImgUrl] = useState("");
  const [cookies] = useCookies("user");
  const userId = cookies.userId;
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  const getUser = async () => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.REACT_APP_URL}/user`,
        {
          params: { userId },
        }
      );
      setUser(response?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      {user && (
        <>
          <Link to={"/dashboard"}>
            <div className="link-dashboard-icon">
              <FontAwesomeIcon className="dashboard-icon" icon={faAnglesLeft} />
            </div>
          </Link>
          <div className="main-small-profile-container">
            <div className="background"></div>
            <div className="secondary-small-profile-container">
              <div className="small-profile-title">
                <h1>Profile</h1>
                <hr className="small-profile-hr-title" />
              </div>

              <div className="small-profile-circle">
                <div>
                  <Image
                    cloudName="dhttotcxc"
                    publicId={user.images[0]?.id}
                    width="260"
                    crop="scale"
                  />
                </div>
              </div>
              <div className="small-profile-pet-name-logo">
                <p className="small-profile-pet-name">
                  {user.pet_name}, Year of Birth {user.dob_year}
                </p>
                <FontAwesomeIcon
                  title="Verify your Profile"
                  style={{
                    fontSize: "20px",
                    color: "black",
                    marginLeft: "5px",
                  }}
                  icon={faUserCheck}
                />
              </div>
              <div className="small-profile-icons-container">
                <div className="small-profile-icons-name">
                  <div className="small-profile-main-icons">
                    <FontAwesomeIcon
                      className="small-profile-icons"
                      icon={faGears}
                    />
                  </div>
                  <h4>Settings</h4>
                </div>
                <div className="small-profile-icons-name">
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
          </div>
          <div className="small-profile-overlay"></div>
        </>
      )}
    </>
  );
};

export default Profile;
