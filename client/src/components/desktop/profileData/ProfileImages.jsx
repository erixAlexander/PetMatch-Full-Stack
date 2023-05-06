import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

const ProfileImages = ({setFormData}) => {
  const [inputFile, setInputFile] = useState([]);
  const [error, setError] = useState("");

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

  useEffect(() => {
    if (formData) {
      setFormData((prevState) => ({
        ...prevState,
        images: inputFile,
      }));
    }
  }, [inputFile]);

  return (
    <>
      <label htmlFor="url" className="url-label">
        <FontAwesomeIcon icon={faUpload} title="Upload" />
        Profile Pictures (Max 5 files)
      </label>

      <input
        type="file"
        name="images"
        id="url"
        className="url-input"
        multiple
        onChange={handleInputFileChange}
      ></input>
      <div className="photo-container">
        {inputFile?.length > 0 && (
          <img
            className="profile-img"
            src={inputFile[0]}
            alt="Profile Picture"
          />
        )}
        {inputFile?.length > 0 && (
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
        {error && <p style={{ color: "red", fontWeight: "bolder" }}>{error}</p>}
      </div>
    </>
  );
};

export default ProfileImages;
