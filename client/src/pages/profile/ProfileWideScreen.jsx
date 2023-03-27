import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Loading from "../../components/loading/Loading";
import Sidebar from "../../components/sidebar/Sidebar";
import "./profile.css";
import ProfileData from "../../components/profileData/ProfileData";
import ProfileSecurity from "../../components/profileData/ProfileSecurity";
import ProfileAddress from "../../components/profileData/ProfileAddress";
import { Image } from "cloudinary-react";

const ProfileWideScreen = () => {
  let navigate = useNavigate();
  const [cookies] = useCookies("user");
  const userId = cookies.userId;
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [showProfileData, setShowProfileData] = useState(false);
  const [showProfileSecurity, setShowProfileSecurity] = useState(false);
  const [showProfileAddress, setShowProfileAddress] = useState(false);
  const [showProfile, setShowProfile] = useState(true);
  const [formData, setFormData] = useState({
    user_id: cookies.userId,
    first_name: "",
    pet_name: "",
    dob_month: "",
    dob_year: "",
    gender_identity: "",
    type_of_pet: "",
    gender_interest: "",
    about: "",
    looking_for: {
      mate: false,
      friend: false,
      adopt: false,
      give_for_adoption: false,
    },
    images: [],
    pedigree: false,
  });

  const getUser = async () => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.REACT_APP_URL}/user`,
        {
          params: { userId },
        }
      );
      setUser(response?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const asArray = Object.entries(formData);
      const filtered = asArray.filter(
        ([key, value]) =>
          value.length > 0 ||
          value === true ||
          (key === "looking_for" &&
            Object.entries(value).find(([k, v]) => v === true)) ||
          (key === "pedigree" &&
            key === "type_of_pet" &&
            key &&
            formData.pedigree !== key)
      );
      const cleanFormData = Object.fromEntries(filtered);
      console.log(cleanFormData);
      const response = await axiosPrivate.put(
        `${process.env.REACT_APP_URL}/profile`,
        {
          cleanFormData,
        }
      );

      const success = response.status == 200;
      if (success) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "looking_for") {
      const checked = e.target.checked;
      const value = e.target.value;
      const name = e.target.name;
      setFormData((prevState) => ({
        ...prevState,
        [name]: { ...prevState.looking_for, [value]: checked },
      }));
      return;
    }
    const value =
      e.target.type === "checkbox" && e.target.name === "pedigree"
        ? e.target.checked
        : e.target.name === "type_of_pet"
        ? e.target.value.toLowerCase()
        : e.target.value;
    const name = e.target.name;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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
              <div>
                <p>Promociones</p>
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
              <p
                onClick={() => {
                  navigate("/dashboard");
                }}
                className="go-back"
              >
                {"<< Dashboard"}
              </p>
              {user &&
                showProfile &&
                !showProfileData &&
                !showProfileSecurity &&
                !showProfileAddress && (
                  <Sidebar
                    petInfo={user}
                    handleSidebar={(e) => console.log(e)}
                    activeSidebar={true}
                  />
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
            </div>{" "}
            <div className="profile-dog-img">
              {user.type_of_pet === "dog" &&
              <Image
                cloudName="dhttotcxc"
                publicId="v1656458831/vecteezy_cute-dog-sitting-cartoon-vector-illustration-flat-cartoon_-removebg-preview_ndavf5.png"
                width="200"
                crop="scale"
              />
            }
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProfileWideScreen;
