import { useCookies } from "react-cookie";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  faFire,
  faListSquares,
  faMessage,
  faShieldDog,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Image } from "cloudinary-react";
import { Link } from "react-router-dom";
import DashboardMain from "../../components/cellphone/dashboard/DashboardMain";
import Activities from "../../components/cellphone/activities/Activities";
import Loading from "../../components/loading/Loading";
import Chat from "../../components/cellphone/chat/Chat";
import "./DashboardSmallScreen.css";

const DashboardSmallScreen = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [main, setMain] = useState(true);
  const [messages, setMessages] = useState(false);
  const [activities, setActivities] = useState(false);
  const [cookies] = useCookies("");
  const userId = cookies.userId;
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
      {user && !loading ? (
        <>
          <div className="small-dashboard-main-container">
            <div className="background"></div>
            <div className="small-dashboard-header">
              <p className="petmatch">PetMtch</p>
              <div className="small-circle">
                <Link to={"/profile"}>
                  <Image
                    cloudName="dhttotcxc"
                    publicId={user.images[0]?.id}
                    width="60"
                    crop="scale"
                  />
                </Link>
              </div>
            </div>
            {main && (
              <div className="small-dashboard-body">
                <DashboardMain />
              </div>
            )}
            {messages && user && (
              <div className="small-dashboard-body">
                <Chat user={user} />
              </div>
            )}

            {activities && (
              <div className="small-dashboard-body">
                <Activities />
              </div>
            )}
            <div className="small-dashboard-footer">
              <div
                onClick={() => {
                  setMain(true);
                  setMessages(false);
                  setActivities(false);
                }}
                className="footer-icon active-icon"
              >
                <FontAwesomeIcon icon={faShieldDog} />
              </div>

              <div
                onClick={() => {
                  setMain(false);
                  setMessages(false);
                  setActivities(true);
                }}
                className="footer-icon"
              >
                <FontAwesomeIcon icon={faListSquares} />
              </div>
              <div className="footer-icon">
                <FontAwesomeIcon icon={faFire} />
              </div>
              <div
                onClick={() => {
                  setMain(false);
                  setMessages(true);
                  setActivities(false);
                }}
                className="footer-icon"
              >
                <FontAwesomeIcon icon={faMessage} />
              </div>
            </div>
            <div className="copyrigth">
              <p>CopyRigth</p>
            </div>
          </div>
        </>
      ) : (
        <div className="loading-icon">
          <Loading type={"spin"} color={"#C6C9CA"} />
        </div>
      )}{" "}
    </>
  );
};

export default DashboardSmallScreen;
