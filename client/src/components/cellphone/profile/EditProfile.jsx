import { useEffect } from "react";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from "../../dropdown/Dropdown";
import petList from "../../../utils/petsList";

const EditProfile = ({
  user,
  setEdit,
  setMain,
  formData,
  userInfoFormData,
  handleSubmit,
  handleChange,
}) => {
  useEffect(() => {
    userInfoFormData(user);
  }, [user]);

  return (
    <div className="profile-edit-container">
      <div
        onClick={() => {
          setEdit(false);
          setMain(true);
        }}
        className="link-dashboard-icon"
      >
        <FontAwesomeIcon className="dashboard-icon" icon={faAnglesLeft} />
      </div>
      <div className="profile-edit-header">
        <h1>Edit Profile</h1>
      </div>
      <div className="profile-edit-form">
        <form onSubmit={handleSubmit}>
          <section className="profile-first-section">
            <label htmlFor="pet_name">
              {`My ${
                formData.type_of_pet ? formData.type_of_pet + "'s" : "pet's "
              }
              Name`}
            </label>
            <input
              type="text"
              id="pet_name"
              name="pet_name"
              placeholder={user.pet_name}
              value={formData.pet_name}
              onChange={handleChange}
            />

            <label>
              My{" "}
              {formData.type_of_pet && formData.type_of_pet != "other"
                ? formData.type_of_pet + "'s "
                : "pet's "}
              birth year is
            </label>
            <div className="multiple-input-container">
              <input
                type="number"
                id="dob_year"
                name="dob_year"
                placeholder={user.dob_year}
                value={formData.dob_year}
                onChange={handleChange}
              />
            </div>
            <label htmlFor="pet-type">My pet is a</label>
            <Dropdown handleChange={handleChange} items={petList} user={user} />
            {(formData.type_of_pet == "dog" ||
              formData.type_of_pet == "cat") && (
              <>
                <div className="multiple-input-container">
                  <input
                    type="checkbox"
                    id="pedigree"
                    name="pedigree"
                    onChange={handleChange}
                    checked={formData?.pedigree}
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
                value="male"
                onChange={handleChange}
                checked={formData?.gender_identity === "male"}
              />
              <label htmlFor="man-gender-identity">Male</label>
              <input
                type="radio"
                id="woman-gender-identity"
                name="gender_identity"
                value="female"
                onChange={handleChange}
                checked={formData?.gender_identity === "female"}
              />
              <label htmlFor="woman-gender-identity">Female</label>
            </div>

            <label htmlFor="show-pet">Show me pets with this gender</label>
            <div className="multiple-input-container">
              <input
                type="radio"
                id="man-gender-interest"
                name="gender_interest"
                value="male"
                onChange={handleChange}
                checked={formData?.gender_interest === "male"}
              />
              <label htmlFor="man-gender-interest">Male</label>
              <input
                type="radio"
                id="woman-gender-interest"
                name="gender_interest"
                value="female"
                onChange={handleChange}
                checked={formData?.gender_interest === "female"}
              />
              <label htmlFor="woman-gender-interest">Female</label>
              <input
                type="radio"
                id="any-gender-interest"
                name="gender_interest"
                value="any"
                onChange={handleChange}
                checked={formData?.gender_interest === "any"}
              />
              <label htmlFor="any-gender-interest">Any</label>
            </div>
            <label htmlFor="about">
              A little bit about my{" "}
              {formData.type_of_pet && formData.type_of_pet != "other"
                ? formData.type_of_pet
                : "pet"}
              :
            </label>
            <input
              type="text"
              id="about"
              name="about"
              placeholder={
                formData.type_of_pet && formData.type_of_pet != "other"
                  ? "My " + formData.type_of_pet + " likes to take baths..."
                  : "My pet likes to take baths..."
              }
              value={formData.about}
              onChange={handleChange}
            />

            <div className="multiple-input-container">
              <input
                type="checkbox"
                id="adopt"
                name="looking_for"
                value="adopt"
                onChange={handleChange}
                checked={formData?.looking_for?.adopt}
              />
              <label htmlFor="adopt">To Adopt</label>
              <input
                type="checkbox"
                id="give_for_adoption"
                name="looking_for"
                value="give_for_adoption"
                onChange={handleChange}
                checked={formData?.looking_for?.give_for_adoption}
              />
              <label htmlFor="give_for_adoption">Give for adoption</label>
              <input
                type="checkbox"
                id="mate"
                name="looking_for"
                value="mate"
                onChange={handleChange}
                checked={formData?.looking_for?.mate}
              />
              <label htmlFor="mate">A Mate</label>
              <input
                type="checkbox"
                id="friend"
                name="looking_for"
                value="friend"
                onChange={handleChange}
                checked={formData?.looking_for?.friend}
              />
              <label htmlFor="friend">A Friend</label>
            </div>
          </section>
          <button className="profile-edit-btn" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
