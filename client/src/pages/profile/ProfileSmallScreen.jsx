import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import MainProfile from "../../components/cellphone/profile/MainProfile";
import EditProfile from "../../components/cellphone/profile/EditProfile";
import PicturesProfile from "../../components/cellphone/profile/PicturesProfile";
import "./ProfileSmallScreen.css";
import "../../components/cellphone/profile/profile-components.css";

const Profile = ({
  formData,
  userId,
  userInfoFormData,
  handleSubmit,
  handleChange,
  getUser,
  user,
}) => {
  const [main, setMain] = useState(true);
  const [edit, setEdit] = useState(false);
  const [settings, setSettings] = useState(false);
  const [pictures, setPictures] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    getUser(userId);
  }, []);

  return (
    <>
      <>
        <div className="main-small-profile-container">
          <div className="background"></div>
          {user && main && (
            <MainProfile
              setPictures={setPictures}
              setEdit={setEdit}
              setMain={setMain}
              user={user}
            />
          )}
          {user && edit && (
            <EditProfile
              userInfoFormData={userInfoFormData}
              formData={formData}
              setEdit={setEdit}
              setMain={setMain}
              user={user}
              handleSubmit={handleSubmit}
              handleChange={handleChange}
            />
          )}
          {user && pictures && (
            <PicturesProfile
              user={user}
              setPictures={setPictures}
              setMain={setMain}
              userId={userId}
              getUser={getUser}
            />
          )}
        </div>
      </>
    </>
  );
};

export default Profile;
