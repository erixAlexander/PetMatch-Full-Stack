import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faCamera } from "@fortawesome/free-solid-svg-icons";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import ExistingPictures from "./ExistingPictures";
import EmptyPictures from "./EmptyPictures";

const PicturesProfile = ({ setMain, setPictures, user, userId, getUser }) => {
  const [array, setArray] = useState([1, 2, 3, 4, 5, 6]);
  const [loadImgArray, setLoadImgArray] = useState(false);
  const [loadingArray, setLoadingArray] = useState(false);
  const [imgArray, setImgArray] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [error, setError] = useState("");

  const deleteImage = async (id) => {
    if (imgArray.length == 1) {
      return;
    }
    try {
      const response = await axiosPrivate.put(
        `${process.env.REACT_APP_URL}/delete-images`,
        {
          params: { user_id: user.user_id, id: id },
        }
      );

      setLoadingArray(false);
      setArray([1, 2, 3, 4, 5, 6]);
      response.data.response.modifiedCount == 1 && getUser(userId);
    } catch (error) {
      console.log(error);
    }
  };

  const updateImage = async (image, id) => {
    try {
      const response = await axiosPrivate.put(
        `${process.env.REACT_APP_URL}/update-images`,
        {
          params: { user_id: user.user_id, image, id },
        }
      );
      setLoadingArray(false);
      setArray([1, 2, 3, 4, 5, 6]);
      response.data.response.modifiedCount == 1 && getUser(userId);
    } catch (error) {
      console.log(error);
    }
  };

  const addImage = async (image) => {
    try {
      const response = await axiosPrivate.put(
        `${process.env.REACT_APP_URL}/add-images`,
        {
          params: { user_id: user.user_id, image },
        }
      );
      setLoadingArray(false);
      setArray([1, 2, 3, 4, 5, 6]);
      response.data.response.modifiedCount == 1 && getUser(userId);
    } catch (error) {
      console.log(error);
    }
  };

  const checkInput = (e) => {
    if (e?.target?.files.length > 1) {
      alert("You can only upload 1 Image");
      return "error";
    }
    if (Array.from(e?.target?.files).find((file) => file.size > 11e5)) {
      window.alert("Each individual file should be smaller than 1 MB");
      return "error";
    }
    const extensions = ["jpg", "png", "jpeg"];
    if (
      Array.from(e?.target?.files).find(
        (file) => !extensions.includes(file.name.split(".")[1].toLowerCase())
      )
    ) {
      window.alert(
        "You can only upload files with this extensions: .png .jpg .jpeg"
      );
      return "error";
    } else {
      setError("");
    }
  };

  const handleInputFileChange = (e, id, change) => {
    const extensions = ["jpg", "png", "jpeg"];

    const selectedImage = Array.from(e?.target?.files).find(
      (file) =>
        extensions.includes(file.name.split(".")[1].toLowerCase()) &&
        file.size < 11e5
    );

    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onloadend = () => {
      change ? updateImage(reader.result, id) : addImage(reader.result);
    };
  };

  useEffect(() => {
    setImgArray(user?.images);
    setLoadImgArray(!loadImgArray);
  }, [user]);

  useEffect(() => {
    let counter = 0;
    array.length == 6 &&
      imgArray?.forEach((img) => {
        array.pop();
        counter += 1;
      });
    setArray(array);
    counter != 0 && counter == imgArray.length && setLoadingArray(true);
  }, [loadImgArray, imgArray]);

  return (
    <>
      <div
        onClick={() => {
          setPictures(false);
          setMain(true);
        }}
        className="link-dashboard-icon"
      >
        <FontAwesomeIcon className="dashboard-icon" icon={faAnglesLeft} />
      </div>

      <section className="pictures-profile-edit">
        <div className="pictures-profile-title">
          <h1>Edit Pictures</h1>
        </div>
        <div>
          <div className="empty-img-container">
            <ExistingPictures
              imgArray={imgArray}
              setImgArray={setImgArray}
              handleInputFileChange={handleInputFileChange}
              deleteImage={deleteImage}
              error={error}
              checkInput={checkInput}
            />
            {loadingArray && (
              <EmptyPictures
                array={array}
                setArray={setArray}
                handleInputFileChange={handleInputFileChange}
                checkInput={checkInput}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default PicturesProfile;
