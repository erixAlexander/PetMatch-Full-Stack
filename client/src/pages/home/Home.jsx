import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Nav from "../../components/navbar/Navbar";
import AuthModal from "../../components/authModal/AuthModal";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import "./Home.css";

const Home = () => {
  const [ShowModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [cookies, , removeCookie] = useCookies("user");
  const axiosPrivate = useAxiosPrivate();
  const authToken = cookies.userId;

  const handleClick = async () => {
    try {
      if (authToken) {
        await axiosPrivate.get(`${process.env.REACT_APP_URL}/logout`, {
          withCredentials: true,
        });
        removeCookie("userId", cookies.userId);
        removeCookie("authToken", cookies.authToken);
        window.location.reload();
        return;
      }
      setShowModal(true);
      setIsSignUp(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="home-container">
      <Nav
        minimal={false}
        setShowModal={setShowModal}
        ShowModal={ShowModal}
        setIsSignUp={setIsSignUp}
        authToken={authToken}
        handleClick={handleClick}
      />
      <div className="home">
        <h1 className="home-primary-title">PetMtch®</h1>
        {ShowModal && (
          <AuthModal setShowModal={setShowModal} isSignUp={isSignUp} />
        )}
      </div>
      <div className="home-background"></div>
    </div>
  );
};

export default Home;
