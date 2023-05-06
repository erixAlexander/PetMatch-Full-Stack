const ShowPlaceDetails = ({ className, data }) => {
  if (Object.keys(data).length) {
    return (
      <div className={className}>
        <h1>{data.address.freeformAddress}</h1>
        <h2>{data.address?.municipality}</h2>
        <h3>
          {`${(data.dist / 1000).toFixed(2)}km 
          away from your current location`}
        </h3>
        {/* <p>
          {data.address?.streetNumber + " " + data.address.streetName}
          <br />
          {data.address?.municipality +
            ", " +
            data.address.countrySubdivision +
            " " +
            data.address.postalCode}
        </p>
        <br /> */}
      </div>
    );
  } else {
    return null;
  }
};

export default ShowPlaceDetails;
