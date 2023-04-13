import { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Dropdown from "../../components/dropdown/Dropdown";
import Loading from "../../components/loading/Loading";
import SearchBox from "../../components/address/SearchBox";
import petList from "../../utils/petsList";
import "./onboarding.css";

const OnBoarding = () => {
  let navigate = useNavigate();
  const [cookies] = useCookies("user");
  const axiosPrivate = useAxiosPrivate();
  const [inputFile, setInputFile] = useState([]);
  const [error, setError] = useState("");
  const [locationError, setLocationError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

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
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // if (!formData.address_info.country) {
      //   setLocationError(
      //     "You need to select your nearest Location before Submitting"
      //   );
      //   return;
      // }
      setLoading(true);
      setLocationError(false);
      const response = await axiosPrivate.put(
        `${process.env.REACT_APP_URL}/user`,
        {
          formData,
        }
      );

      if (response.status == 200) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    if (name === "looking_for") {
      const checked = e.target.checked;
      const value = e.target.value;
      setFormData((prevState) => ({
        ...prevState,
        [name]: { ...prevState.looking_for, [value]: checked },
      }));
      return;
    }
    const value =
      e.target.name === "pedigree"
        ? e.target.checked
        : e.target.name === "type_of_pet"
        ? e.target.value.toLowerCase()
        : e.target.value;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInputFileChange = (e) => {
    if (inputFile) {
      setInputFile([]);
    }
    if (e?.target?.files.length > 5) {
      alert("You can only upload up to 5 images");
      setInputFile([]);
      return;
    }
    if (Array.from(e?.target?.files).find((file) => file.size > 11e5)) {
      window.alert("Each individual file should be smaller than 1 MB");
    }
    const extensions = ["jpg", "png", "jpeg"];
    if (
      Array.from(e?.target?.files).find(
        (file) => !extensions.includes(file.name.split(".")[1].toLowerCase())
      )
    ) {
      setError(
        "You can only upload files with this extensions: .png .jpg .jpeg"
      );
    } else {
      setError("");
    }
    const correctArray = Array.from(e?.target?.files).filter(
      (file) =>
        extensions.includes(file.name.split(".")[1].toLowerCase()) &&
        file.size < 11e5
    );

    Array.from(correctArray).forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setInputFile((prev) => [...prev, reader.result]);
      };
    });
  };

  const focus = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 200);
  };

  useEffect(() => {
    focus();
  }, []);

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      images: inputFile,
    }));
  }, [inputFile]);

  return (
    <>
      {loading ? (
        <div className="onboarding-loading">
          <h1>Loading...</h1>
          <Loading type={"bars"} color={"#C6C9CA"} />
        </div>
      ) : (
        <div className="onboarding">
          <div className="background"></div>
          <div className="title">
            <h1 className="onboarding-title">Create Account</h1>
            <hr className="onboarding-underline-title" />
          </div>
          <button
            onClick={() => {
              navigate("/");
            }}
            className="onboarding-go-back"
          >
            <ChevronLeftIcon />
            goBack
          </button>
          <form onSubmit={handleSubmit}>
            <section>
              <label htmlFor="first_name">My First Name</label>
              <input
                ref={inputRef}
                type="text"
                id="first_name"
                name="first_name"
                placeholder="First Name"
                required={true}
                value={formData.first_name}
                onChange={handleChange}
              />
              <label htmlFor="pet_name">
                My{" "}
                {formData.type_of_pet ? formData.type_of_pet + "'s" : "pet's"}{" "}
                Name
              </label>
              <input
                type="text"
                id="pet_name"
                name="pet_name"
                placeholder="Pet Name"
                required={true}
                value={formData.pet_name}
                onChange={handleChange}
              />

              <label>
                My{" "}
                {formData.type_of_pet && formData.type_of_pet != "other"
                  ? formData.type_of_pet + "'s "
                  : "pet's "}{" "}
                birthday is in
              </label>
              <div className="multiple-input-container">
                <input
                  type="number"
                  id="dob_month"
                  name="dob_month"
                  placeholder="MM"
                  required={true}
                  value={formData.dob_month}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  id="dob_year"
                  name="dob_year"
                  placeholder="YYYY"
                  required={true}
                  value={formData.dob_year}
                  onChange={handleChange}
                />
              </div>
              <label htmlFor="pet-type">My pet is a</label>
              <Dropdown handleChange={handleChange} items={petList} />
              {(formData.type_of_pet == "dog" ||
                formData.type_of_pet == "cat") && (
                <>
                  <div className="multiple-input-container">
                    <input
                      type="checkbox"
                      id="pedigree"
                      name="pedigree"
                      onChange={handleChange}
                      checked={formData.pedigree}
                    />
                    <label htmlFor="pedigree">
                      {formData.pedigree ? "With Pedigree" : "No Pedigree"}
                    </label>
                  </div>
                </>
              )}
              <label htmlFor="gender">
                My{" "}
                {formData.type_of_pet && formData.type_of_pet != "other"
                  ? formData.type_of_pet + "'s "
                  : "pet's "}
                gender is
              </label>
              <div className="multiple-input-container">
                <input
                  type="radio"
                  id="man-gender-identity"
                  name="gender_identity"
                  required={true}
                  value="male"
                  onChange={handleChange}
                  checked={formData.gender_identity === "male"}
                />
                <label htmlFor="man-gender-identity">Male</label>
                <input
                  type="radio"
                  id="woman-gender-identity"
                  name="gender_identity"
                  required={true}
                  value="female"
                  onChange={handleChange}
                  checked={formData.gender_identity === "female"}
                />
                <label htmlFor="woman-gender-identity">Female</label>
              </div>

              <label htmlFor="show-pet">Show me pets with this gender</label>
              <div className="multiple-input-container">
                <input
                  type="radio"
                  id="man-gender-interest"
                  name="gender_interest"
                  required={true}
                  value="male"
                  onChange={handleChange}
                  checked={formData.gender_interest === "male"}
                />
                <label htmlFor="man-gender-interest">Male</label>
                <input
                  type="radio"
                  id="woman-gender-interest"
                  name="gender_interest"
                  required={true}
                  value="female"
                  onChange={handleChange}
                  checked={formData.gender_interest === "female"}
                />
                <label htmlFor="woman-gender-interest">Female</label>
                <input
                  type="radio"
                  id="any-gender-interest"
                  name="gender_interest"
                  required={true}
                  value="any"
                  onChange={handleChange}
                  checked={formData.gender_interest === "any"}
                />
                <label htmlFor="any-gender-interest">Any</label>
              </div>
            </section>
            <section>
              <label htmlFor="about">
                A little bit about my{" "}
                {formData.type_of_pet && formData.type_of_pet != "other"
                  ? formData.type_of_pet
                  : "pet"}
                :
              </label>
              <input
                style={{ maxWidth: "100%" }}
                type="text"
                id="about"
                name="about"
                required={true}
                placeholder={
                  formData.type_of_pet && formData.type_of_pet != "other"
                    ? "My " + formData.type_of_pet + " likes to take baths..."
                    : "My pet likes to take baths..."
                }
                value={formData.about}
                onChange={handleChange}
              />
              <label htmlFor="looking-for">Looking for:</label>
              <div className="multiple-input-container main-input-container">
                <div className="multiple-input-container-divider">
                  <input
                    type="checkbox"
                    id="mate"
                    name="looking_for"
                    value="mate"
                    onChange={handleChange}
                    checked={formData.looking_for.mate}
                  />
                  <label htmlFor="mate">A mate</label>
                  <input
                    type="checkbox"
                    id="friend"
                    name="looking_for"
                    value="friend"
                    onChange={handleChange}
                    checked={formData.looking_for.friend}
                  />
                  <label htmlFor="friend">Friend</label>
                </div>
                <div className="multiple-input-container-divider">
                  <input
                    type="checkbox"
                    id="give_for_adoption"
                    name="looking_for"
                    value="give_for_adoption"
                    onChange={handleChange}
                    checked={formData.looking_for.give_for_adoption}
                  />
                  <label htmlFor="give_for_adoption">Give for adoption</label>
                  <input
                    type="checkbox"
                    id="adopt"
                    name="looking_for"
                    value="adopt"
                    onChange={handleChange}
                    checked={formData.looking_for.adopt}
                  />
                  <label htmlFor="adopt">Adopt!</label>
                </div>
              </div>
              <label>Upload your images</label>
              <label htmlFor="url" className="url-label">
                <FontAwesomeIcon icon={faUpload} title="Upload" /> Upload (Max 5
                files)
              </label>
              <input
                type="file"
                name="images"
                id="url"
                className="url-input"
                multiple
                required={true}
                onChange={handleInputFileChange}
              ></input>
              <div className="photo-container">
                {inputFile.length > 0 && (
                  <img
                    className="onboarding-profile-img"
                    src={inputFile[0]}
                    alt="Profile Picture"
                  />
                )}
                {inputFile.length > 0 && (
                  <div className="secondary-images-div">
                    {inputFile.map((file, i) => (
                      <img
                        key={i}
                        className="profile-img-secondary"
                        src={file}
                        alt="Profile Picture"
                      />
                    ))}
                  </div>
                )}
                {error && (
                  <p style={{ color: "red", fontWeight: "bolder" }}>{error}</p>
                )}
              </div>
            </section>
            <section className="onboarding-address-section">
              <SearchBox
                focus={{ preventScroll: true }}
                formData={formData}
                setFormData={setFormData}
                onboarding={true}
              />
              <input type="submit" />
              {locationError && (
                <p style={{ color: "red", fontWeight: "bolder" }}>
                  {locationError}
                </p>
              )}
            </section>
          </form>
        </div>
      )}
    </>
  );
};

export default OnBoarding;
