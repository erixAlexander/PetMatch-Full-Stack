import Nav from "../../components/navbar/Navbar";
import { useState } from "react";
import AuthModal from "../../components/authModal/AuthModal";
import { useCookies } from "react-cookie";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Image } from "cloudinary-react";
import useWindowSize from "../../hooks/useWindowSize";
import { useEffect } from "react";
import "./Home.css";

const HomeWideScreen = () => {
  const [ShowModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies("user");
  const axiosPrivate = useAxiosPrivate();
  const authToken = cookies.userId;
  const size = useWindowSize();
  const [imgSize, setImgSize] = useState();

  useEffect(() => {
    setImgSize(size.width);
  }, [size]);

  const handleClick = async () => {
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
  };

  return (
    <>
      <div className="overlay-home">
        <Nav
          minimal={false}
          setShowModal={setShowModal}
          ShowModal={ShowModal}
          setIsSignUp={setIsSignUp}
          authToken={authToken}
        />
        <div className="home">
          <h1 className="home-primary-title">PetMtch®</h1>
          <button className="home-primary-button" onClick={handleClick}>
            {authToken ? "Signout" : "Create an account"}
          </button>
          {ShowModal && (
            <AuthModal setShowModal={setShowModal} isSignUp={isSignUp} />
          )}
        </div>
      </div>
      <div className="home-background-img">
        <Image
          cloudName="dhttotcxc"
          publicId="pets-g7ea4ad480_1920_c3dmnb"
          width={imgSize}
          crop="scale"
        />
        <div className="home-background"></div>
      </div>
    </>
  );
};

export default HomeWideScreen;
