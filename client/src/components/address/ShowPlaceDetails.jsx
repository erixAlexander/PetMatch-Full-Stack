const ShowPlaceDetails = ({className, data}) => {

  if (data) {
    return (
      <div className={className}>
        <h1>{data.poi.name}</h1>
        <h3>
          {data.poi.classifications[0].code} |{" "}
          {(data.dist / 1000).toFixed(2)}km away
        </h3>
        <p>
          {data.address.streetNumber +
            " " +
            data.address.streetName}
          <br />
          {data.address.municipality +
            ", " +
            data.address.countrySubdivision +
            " " +
            data.address.postalCode}
        </p>
        <br />
      </div>
    );
  } else {
    return null;
  }
};

export default ShowPlaceDetails;
