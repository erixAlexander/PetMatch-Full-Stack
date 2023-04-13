import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Image} from "cloudinary-react"
import "./Chat.css";

const ChatHeader = ({ user }) => {
  let navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [cookies, setCookie, removeCookie] = useCookies("[user]");
  const logout = async () => {
    const response = await axiosPrivate.get(`${process.env.REACT_APP_URL}/logout`, {
      withCredentials: true,
    });
    removeCookie("userId", cookies.userId);
    removeCookie("authToken", cookies.authToken);
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="chat-container-header-div">
      <div className="chat-container-header-profile-img">
        <div className="chat-container-img-container">
          {user && <Image
          onClick={() => {
            navigate("/profile");
          }}
          className= "image-cloudinary-chatheader"
          cloudName= "dhttotcxc"
          publicId={user.images[0]?.id}
          width= "400"
          crop="scale"
          Transformation radius = "10"
          />}
        </div>
        <h3>{user.first_name}</h3>
      </div>
      <div className="chat-header-icons">
        <FontAwesomeIcon
          className="profile-icon option-2"
          onClick={() => {
            navigate("/profile");
          }}
          icon={faUser}
          title="My Profile"
        />
        <FontAwesomeIcon
          className="log-out-icon option-2"
          onClick={logout}
          icon={faSignOut}
          title="Sign-Out"
        />
      </div>
    </div>
  );
};

export default ChatHeader;
