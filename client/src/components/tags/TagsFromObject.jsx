import "./Tags.css"

const TagsFromObject = ({character}) => {
  return (
    <div className="main-tags-container">
      {character?.looking_for &&
        Object.keys(character.looking_for).map(
          (key, index) =>
            character.looking_for[key] === true && (
              <h3 key={index} className="tag">
                {key}
              </h3>
            )
        )}
    </div>
  );
};

export default TagsFromObject;
