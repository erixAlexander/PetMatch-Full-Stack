import "./Address.css";
import SearchBox from "./SearchBox";
import {
  faMapLocationDot
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Address = ({ user }) => {
  return (
    <div className="address-container">
      <h1>Address Information</h1>
      <hr className="security-hr-sidebar" />
      <div className="address-icon-container">
      <FontAwesomeIcon
        icon={faMapLocationDot}
      />
      <h2>Current Address</h2>
      </div>
      <div style={{marginTop:"-10px"}}>
        <h4>Country: {user.address_info.country}</h4>
        <p style={{marginTop:"-10px"}}>
          <strong>City:</strong> {user.address_info.full_name}
        </p>
        <p style={{marginTop:"-10px"}}>
          <strong>Place:</strong> {user.address_info.name}
        </p>
      </div>
      <h4>Showing pets in this Distance:</h4>
      <p style={{marginTop:"-10px"}}>{user.distance} Km</p>

      <SearchBox />
    </div>
  );
};

export default Address;
