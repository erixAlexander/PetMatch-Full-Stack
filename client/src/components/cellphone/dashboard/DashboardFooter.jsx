import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faListSquares,
  faMessage,
  faShieldDog,
} from "@fortawesome/free-solid-svg-icons";

const DashboardFooter = ({ setMain, setMessages, setActivities }) => {
  return (
    <div className="small-dashboard-footer">
      <FontAwesomeIcon
        onClick={() => {
          setMain(true);
          setMessages(false);
          setActivities(false);
        }}
        className="footer-icon active-icon"
        icon={faShieldDog}
      />
      <FontAwesomeIcon
        onClick={() => {
          setActivities(true);
          setMain(false);
          setMessages(false);
        }}
        className="footer-icon"
        icon={faListSquares}
      />

      <FontAwesomeIcon className="footer-icon" icon={faFire} />

      <FontAwesomeIcon
        onClick={() => {
          setMessages(true);
          setMain(false);
          setActivities(false);
        }}
        className="footer-icon"
        icon={faMessage}
      />
    </div>
  );
};

export default DashboardFooter;
