import ProfileWideScreen from "./ProfileWideScreen";
import ProfileSmallScreen from "./ProfileSmallScreen";
import useWindowSize from "../../hooks/useWindowSize";
import { useState, useEffect } from "react";

const Profile = () => {
  const size = useWindowSize();
  const [screenSize, setScreenSize] = useState();

  useEffect(() => {
    setScreenSize(size.width);
  }, [size]);

  return (
    <>{screenSize > 765 ? <ProfileWideScreen /> : <ProfileSmallScreen />}</>
  );
};

export default Profile;
