import "./Tags.css"

const TagsFromBoolean = ({character}) => {
  return (
    <div className="main-tags-container">
      {character?.pedigree &&
              <h3 className="pedigree-tag">
                Pedigree!
              </h3>}
    </div>
  );
};

export default TagsFromBoolean;