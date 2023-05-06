import "./Tags.css";

const TagsFromBoolean = ({ character }) => {
  return (
    <div className="dashboard-pedigree-div">
      <div className="main-tags-container">
        {character?.pedigree && <h3 className="pedigree-tag">Pedigree!</h3>}
      </div>
    </div>
  );
};

export default TagsFromBoolean;
