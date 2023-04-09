import logo2 from "../../images/logo2.png";
import logo3 from "../../images/logo3.png";
import "./navbar.css";
import { useNavigate } from "react-router-dom";

const Nav = ({ minimal, setShowModal, ShowModal, setIsSignUp, authToken, handleClick }) => {
  let navigate = useNavigate();
  const handleLogin = () => {
    setShowModal(true);
    setIsSignUp(false);
  };

  return (
    <nav>
      <div className="logo-container">
        <img className="logo" src={minimal ? logo3 : logo2} alt="Logo" />
      </div>

      {!authToken && !minimal ? (
        <div className="nav-button-container">
          <button
            className="nav-login-button"
            onClick={handleLogin}
            disabled={ShowModal}
          >
            Login
          </button>
          <button
            className="nav-signup-button"
            onClick={handleClick}
            disabled={ShowModal}
          >
            {authToken ? "Signout" : "Signup"}
          </button>
        </div>
      ) : (
        <button
          className="nav-login-button"
          onClick={() => navigate("/dashboard")}
          disabled={ShowModal}
        >
          Dashboard
        </button>
      )}
    </nav>
  );
};

export default Nav;
