import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "../../loading/Loading";

const EmptyPictures = ({
  array,
  setArray,
  handleInputFileChange,
  checkInput,
}) => {
  const addPicture = (e, num) => {
    const checkError = checkInput(e);
    if (checkError == "error") return;
    console.log(checkError)
    setArray((prev) => {
      return prev.map((number) => {
        if (number == num) {
          return { number, loading: true };
        } else {
          return number;
        }
      });
    });

    handleInputFileChange(e, "", false);

    setArray((prev) => {
      return prev.map((number) => {
        if (number == num) {
          return { number, loading: false };
        } else {
          return number;
        }
      });
    });
  };

  return array?.map((num) => {
    return (
      <div key={num} className="empty-img">
        {num.loading ? (
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
            <label htmlFor={`add-file-${num}`}>
              Add <FontAwesomeIcon icon={faCamera} />
            </label>
            <input
              className="change-img-input"
              type="file"
              name="add-file"
              id={`add-file-${num}`}
              onChange={(e) => {
                addPicture(e, num);
              }}
            />
          </>
        )}
      </div>
    );
  });
};

export default EmptyPictures;
