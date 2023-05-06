import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../../components/loading/Loading";
import Sidebar from "../../components/sidebar/Sidebar";
import ProfileData from "../../components/desktop/profileData/ProfileData";
import ProfileSecurity from "../../components/desktop/profileData/ProfileSecurity";
import ProfileAddress from "../../components/desktop/profileData/ProfileAddress";
import "./profile.css";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ProfileWideScreen = ({
  formData,
  setFormData,
  userInfoFormData,
  handleSubmit,
  loading,
  handleChange,
  getUser,
  user,
  userId,
}) => {
  let navigate = useNavigate();
  const [showProfileData, setShowProfileData] = useState(false);
  const [showProfileSecurity, setShowProfileSecurity] = useState(false);
  const [showProfileAddress, setShowProfileAddress] = useState(false);
  const [showProfile, setShowProfile] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    getUser(userId);
  }, []);

  useEffect(() => {
    userInfoFormData(user);
  }, [user]);

  return (
    <>
      {loading ? (
        <div className="onboarding-loading">
          <Loading type={"bars"} color={"#C6C9CA"} />
        </div>
      ) : (
        <>
          <div className="profile-main-container">
            <div className="profile-sidebar">
              <div className="promo">
                <h1>Promos</h1>
                <h3>comming soon</h3>
              </div>
              <div className="profile-buttons-container">
                <button
                  className="profile-buttons"
                  onClick={() => {
                    setShowProfileSecurity(false);
                    setShowProfileAddress(false);
                    setShowProfileData(false);
                  }}
                >
                  My Profile
                </button>
                <button
                  className="profile-buttons"
                  onClick={() => {
                    setShowProfileData(!showProfileData);
                    setShowProfileSecurity(false);
                    setShowProfileAddress(false);
                  }}
                >
                  Change Profile Information
                </button>
                <button
                  className="profile-buttons"
                  onClick={() => {
                    setShowProfileSecurity(!showProfileSecurity);
                    setShowProfileData(false);
                    setShowProfileAddress(false);
                  }}
                >
                  Security Information
                </button>
                <button
                  className="profile-buttons"
                  onClick={() => {
                    setShowProfileAddress(!showProfileAddress);
                    setShowProfileData(false);
                    setShowProfileSecurity(false);
                  }}
                >
                  Address Information
                </button>
              </div>
            </div>
            <div className="profile">
              <div className="background"></div>
              <button
                onClick={() => {
                  navigate("/dashboard");
                }}
                className="go-back"
              >
                {"<< Dashboard"}
              </button>
              {user &&
                showProfile &&
                !showProfileData &&
                !showProfileSecurity &&
                !showProfileAddress && (
                  <Sidebar petInfo={user} activeSidebar={true} />
                )}
              {user && showProfileData && (
                <ProfileData
                  handleSubmit={handleSubmit}
                  formData={formData}
                  setFormData={setFormData}
                  handleChange={handleChange}
                  user={user}
                />
              )}
              {showProfileSecurity && <ProfileSecurity user={user} />}
              {showProfileAddress && <ProfileAddress user={user} />}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProfileWideScreen;
