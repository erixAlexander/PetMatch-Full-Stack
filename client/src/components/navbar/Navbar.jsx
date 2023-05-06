import { useNavigate } from "react-router-dom";
import logo2 from "../../images/logo2.png";
import NavButtons from "./NavButtons";
import "./navbar.css";

const Nav = ({
  setShowModal,
  ShowModal,
  setIsSignUp,
  authToken,
  handleClick,
}) => {
  let navigate = useNavigate();

  const handleNavigate = () => navigate("/dashboard");

  const handleLogin = () => {
    setShowModal(true);
    setIsSignUp(false);
  };

  return (
    <nav>
      <div className="logo-container">
        <img className="logo" src={logo2} alt="Logo" />
      </div>
      {!authToken ? (
        <NavButtons
          firstButtonClick={handleLogin}
          secondButtonClick={handleClick}
          isDisabled={ShowModal}
          firstText={"Login"}
          secondText={"Signup"}
        />
      ) : (
        <NavButtons
          firstButtonClick={handleNavigate}
          secondButtonClick={handleClick}
          isDisabled={ShowModal}
          firstText={"Dashboard"}
          secondText={"Signout"}
        />
      )}
    </nav>
  );
};

export default Nav;
