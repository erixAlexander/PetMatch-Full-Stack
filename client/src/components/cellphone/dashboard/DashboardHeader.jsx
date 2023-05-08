import { Link } from "react-router-dom";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const DashboardHeader = ({ user, Image }) => {
  let navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [cookies, setCookie, removeCookie] = useCookies("[user]");

  const handleLogout = async () => {
    const response = await axiosPrivate.get(
      `${process.env.REACT_APP_URL}/logout`,
      {
        withCredentials: true,
      }
    );
    removeCookie("userId", cookies.userId);
    removeCookie("authToken", cookies.authToken);
    navigate("/");
    window.location.reload();
  };
  return (
    <div className="small-dashboard-header">
      <div className="header-division">
        <FontAwesomeIcon
          title="sign-out"
          onClick={handleLogout}
          className="sign-out"
          icon={faSignOut}
        />
      </div>
      <div className="header-division">
        <p className="petmatch">PetMtch</p>
      </div>
      <div className="header-division">
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
    </div>
  );
};

export default DashboardHeader;
