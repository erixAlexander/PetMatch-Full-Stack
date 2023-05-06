import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const GoBackButton = ({ navigate }) => {
  return (
    <div
      onClick={() => {
        navigate("/");
      }}
      className="onboarding-go-back"
    >
      <FontAwesomeIcon icon={faChevronLeft} />
      Back
    </div>
  );
};

export default GoBackButton;
