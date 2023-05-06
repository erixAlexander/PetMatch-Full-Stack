import { faPencil, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Loading from "../../loading/Loading";
import { Image } from "cloudinary-react";

const ExistingPictures = ({
  imgArray,
  error,
  setImgArray,
  handleInputFileChange,
  deleteImage,
  checkInput,
}) => {
  const showEditButtons = (id, show) => {
    setImgArray((prev) => {
      return prev.map((img) => {
        if (img.id == id) {
          return { ...img, add: show };
        } else {
          return img;
        }
      });
    });
  };

  const changeImage = (e, id, change) => {
    const checkError = checkInput(e);
    if (checkError == "error") return;

    setImgArray((prev) => {
      return prev.map((img) => {
        if (img.id == id) {
          return { ...img, loading: true };
        } else {
          return img;
        }
      });
    });
    change == "change" ? handleInputFileChange(e, id, true) : deleteImage(id);

    setImgArray((prev) => {
      return prev.map((img) => {
        if (img.id == id) {
          return { ...img, add: false };
        } else {
          return img;
        }
      });
    });
  };

  return (
    <>
      {imgArray?.map(({ id, add, loading }) => {
        return (
          <div key={id} className="relative">
            {loading ? (
              <div className="new-pic-loading-container">
                <Loading
                  className="new-pic-loading"
                  type={"bars"}
                  color={"fff"}
                  width1={"35%"}
                />
              </div>
            ) : (
              <>
                {error && <p>{error}</p>}
                <Image
                  onClick={() => showEditButtons(id, true)}
                  cloudName="dhttotcxc"
                  publicId={id}
                  width="110"
                  height="110"
                  crop="fill"
                  className="test"
                />
                <div className={`${!add ? "overlay-hidden" : "image-overlay"}`}>
                  {add && (
                    <div className="img-change-buttons">
                      <input
                        type="file"
                        name="images"
                        id="url"
                        className="change-img-input"
                        onChange={(e) => {
                          changeImage(e, id, "change");
                        }}
                      />
                      <label htmlFor="url">
                        <FontAwesomeIcon
                          className="change-icon"
                          icon={faPencil}
                        />
                      </label>
                      {imgArray.length > 1 && (
                        <FontAwesomeIcon
                          onClick={(e) => {
                            changeImage(e, id, "delete");
                          }}
                          className="change-icon"
                          icon={faTrash}
                        />
                      )}

                      <FontAwesomeIcon
                        className="close-icon"
                        icon={faXmark}
                        onClick={() => {
                          showEditButtons(id, false);
                        }}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </>
  );
};

export default ExistingPictures;
