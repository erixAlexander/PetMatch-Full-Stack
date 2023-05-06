const CardPetName = ({character, FontAwesomeIcon, faDog}) => {
  return (
    <>
      <h3 className="pet-name extra-margin">
        <FontAwesomeIcon icon={faDog} title="doggy" />
        <span className="capitalize">
          {character.pet_name.length < 10
            ? `${character.pet_name}`
            : `${character.pet_name.substr(0, 10)}...`}
        </span>
      </h3>
    </>
  );
};

export default CardPetName;
