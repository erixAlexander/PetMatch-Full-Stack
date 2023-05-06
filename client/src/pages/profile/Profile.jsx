import ProfileWideScreen from "./ProfileWideScreen";
import ProfileSmallScreen from "./ProfileSmallScreen";
import useWindowSize from "../../hooks/useWindowSize";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Profile = () => {
  const [cookies] = useCookies("user");
  const [screenSize, setScreenSize] = useState();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [formData, setFormData] = useState({
    user_id: cookies.userId,
    pet_name: "",
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
    pedigree: false,
  });
  const axiosPrivate = useAxiosPrivate();
  const userId = cookies.userId;
  const size = useWindowSize();

  const getUser = async (userId) => {
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

  const userInfoFormData = (user) => {
    setFormData((prev) => {
      return {
        ...prev,
        pet_name: user.pet_name,
        dob_year: user.dob_year,
        gender_identity: user.gender_identity,
        type_of_pet: user.type_of_pet,
        gender_interest: user.gender_interest,
        about: user.about,
        looking_for: user.looking_for,
        pedigree: user.pedigree,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosPrivate.put(
        `${process.env.REACT_APP_URL}/profile`,
        {
          formData,
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

  useEffect(() => {
    setScreenSize(size.width);
  }, [size]);

  return (
    <>
      {screenSize > 765 ? (
        <ProfileWideScreen
          formData={formData}
          setFormData={setFormData}
          userInfoFormData={userInfoFormData}
          handleSubmit={handleSubmit}
          loading={loading}
          handleChange={handleChange}
          user={user}
          getUser={getUser}
          userId={userId}
        />
      ) : (
        <ProfileSmallScreen
          getUser={getUser}
          formData={formData}
          setFormData={setFormData}
          userInfoFormData={userInfoFormData}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          userId={userId}
          loading={loading}
          user={user}
        />
      )}
    </>
  );
};

export default Profile;
