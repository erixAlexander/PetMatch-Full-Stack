import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchBox from "./SearchBox";
import "./Address.css";

const Address = ({ user }) => {
  return (
    <div className="address-container">
      <h1>Address Information</h1>
      <hr className="security-hr-sidebar" />
      <div className="address-icon-container">
        <FontAwesomeIcon icon={faMapLocationDot} />
        <h2>Current Address</h2>
      </div>
      <div className="address-info">
        <h4>Country: {user.address_info.country}</h4>
        <p>
          <strong>City:</strong> {user.address_info.full_name}
        </p>
        <p>
          <strong>Place:</strong> {user.address_info.name}
        </p>
      </div>
      <h4>Showing pets in this Distance:</h4>
      <p>{user.distance} Km</p>

      <SearchBox />
    </div>
  );
};

export default Address;
