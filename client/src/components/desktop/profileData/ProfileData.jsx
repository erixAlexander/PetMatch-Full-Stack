import Dropdown from "../../dropdown/Dropdown";
import petList from "../../../utils/petsList";

const ProfileData = ({ handleSubmit, formData, handleChange, user }) => {
  return (
    <>
      <h1>My Profile</h1>
      <hr className="security-hr-sidebar" />
      <form onSubmit={handleSubmit}>
        <div className="sections">
          <section>
            <label htmlFor="pet_name">
              My {formData.type_of_pet ? formData.type_of_pet + "'s" : "pet's"}{" "}
              Name
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
          </section>
          <section>
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
            <label htmlFor="looking-for">Looking for:</label>
            <div className="multiple-input-container">
              <input
                type="checkbox"
                id="mate"
                name="looking_for"
                value="mate"
                onChange={handleChange}
                checked={formData?.looking_for?.mate}
              />
              <label htmlFor="mate">A mate</label>
              <input
                type="checkbox"
                id="friend"
                name="looking_for"
                value="friend"
                onChange={handleChange}
                checked={formData?.looking_for?.friend}
              />
              <label htmlFor="friend">A friend</label>
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
                id="adopt"
                name="looking_for"
                value="adopt"
                onChange={handleChange}
                checked={formData?.looking_for?.adopt}
              />
              <label htmlFor="adopt">A pet to adopt!</label>
            </div>
          </section>
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default ProfileData;
