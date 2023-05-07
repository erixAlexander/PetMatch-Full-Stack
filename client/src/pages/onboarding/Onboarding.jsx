import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading/Loading";
import GoBackButton from "./GoBackButton";
import OnboardingForm from "./OnboardingForm";
import "./onboarding.css";

const OnBoarding = () => {
  let navigate = useNavigate();
  const [cookies] = useCookies("user");
  const [loading, setLoading] = useState(false);

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
    user_matches: [],
    images: [],
    pedigree: false,
    address_info: {
      country: "",
      name: "",
      lat: "",
      lon: "",
      full_name: "",
    },
    distance: 40,
    activity: "",
  });

  return (
    <>
      {loading ? (
        <div className="onboarding-loading">
          <Loading type={"bars"} color={"#fe3072"} />
        </div>
      ) : (
        <div className="onboarding">
          <div className="background"></div>
          <GoBackButton navigate={navigate} />

          <div className="title">
            <h1 className="onboarding-title">Create Account</h1>
            <hr className="onboarding-underline-title" />
          </div>

          <OnboardingForm
            formData={formData}
            setLoading={setLoading}
            navigate={navigate}
            setFormData={setFormData}
          />
        </div>
      )}
    </>
  );
};

export default OnBoarding;
