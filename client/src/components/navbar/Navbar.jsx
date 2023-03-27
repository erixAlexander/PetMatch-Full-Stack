import logo2 from "../../images/logo2.png";
import logo3 from "../../images/logo3.png";
import "./navbar.css"
import { useNavigate } from "react-router-dom";

const Nav = ({ minimal, setShowModal, ShowModal, setIsSignUp, authToken }) => {
  let navigate = useNavigate()
  const handleClick = () => {
    setShowModal(true);
    setIsSignUp(false);
  };

  return (
    <nav>
      <div className="logo-container">
        <img className="logo" src={minimal ? logo3 : logo2} alt="Logo" />
      </div>

      {!authToken && !minimal ? (
        <button
          className="nav-button"
          onClick={handleClick}
          disabled={ShowModal}
        >
          Log in
        </button>
      ): <button
      className="nav-button"
      onClick={()=> navigate("/dashboard")}
      disabled={ShowModal}
    >
      Dashboard
    </button>}
    </nav>
  );
};

export default Nav;
