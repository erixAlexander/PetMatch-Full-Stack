const CardInfo = ({ activityUser, activity }) => {
  const { pet_name, gender_identity, address_info } = activityUser;

  return (
    <div className="card-info">
      <div className="card-activity">
        <h3>{activity}</h3>
      </div>
      <div className="card-info-name">
        <h1>{pet_name}</h1>
        <h2>{gender_identity}</h2>
      </div>
      <div className="card-info-address">
        <h4>{address_info.name}</h4>
      </div>
    </div>
  );
};

export default CardInfo;
