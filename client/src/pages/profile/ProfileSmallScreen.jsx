import { useState, useEffect } from "react";
import "./ProfileSmallScreen.css";
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
          <div className="main-small-profile-container">
            <Link to={"/dashboard"}>
              <div className="link-dashboard-icon">
                <FontAwesomeIcon
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    color: "white",
                    marginLeft: "10px",
                  }}
                  icon={faAnglesLeft}
                />
              </div>
            </Link>
            <div className="secondary-small-profile-container">
              <div className="small-profile-title">
                <h3>Profile</h3>
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
                    color: "white",
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
                  <h4
                    style={{
                      color: "white",
                    }}
                  >
                    Settings
                  </h4>
                </div>
                <div className="small-profile-icons-name">
                  {" "}
                  <div className="small-profile-main-icons middle">
                    <FontAwesomeIcon
                      className="small-profile-icons"
                      icon={faPencil}
                    />
                  </div>
                  <h4
                    style={{
                      color: "white",
                    }}
                  >
                    Edit
                  </h4>
                </div>

                <div className="small-profile-icons-name">
                  <div className="small-profile-main-icons">
                    <FontAwesomeIcon
                      className="small-profile-icons"
                      icon={faShield}
                    />
                  </div>
                  <h4
                    style={{
                      color: "white",
                    }}
                  >
                    Security
                  </h4>
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
