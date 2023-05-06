const CardAddress = ({ character, FontAwesomeIcon, faLocationDot }) => {
  return (
    <p className="dashboard-card-address extra-margin">
      <FontAwesomeIcon icon={faLocationDot} />
      {character.address_info.full_name.length < 26
        ? `${character.address_info.full_name}`
        : `${character.address_info.full_name.substr(0, 27)}...`}
    </p>
  );
};

export default CardAddress;
