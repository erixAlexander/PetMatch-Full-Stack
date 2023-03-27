const Banner = ({ geoError, geoLocation }) => {
  if (geoError) {
    return <p className="banner warn">{geoError.message}</p>;
  } else if (geoLocation.latitude) {
    return (
      <p className="banner success">
        Lat: <strong>{geoLocation.latitude.toFixed(4)}</strong>, Long:{" "}
        <strong>{geoLocation.longitude.toFixed(4)}</strong>
      </p>
    );
  } else {
    return null;
  }
};

export default Banner;
