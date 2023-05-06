import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Slider from "@mui/material/Slider";
import ReactSearchBox from "react-search-box";
import ShowPlaceDetails from "./ShowPlaceDetails";
import marks from "../../utils/marksList";

const SearchBox = ({ setFormData, formData, onboarding }) => {
  const [selectedPlace, setSelectedPlace] = useState({});
  const [stateDistance, setStateDistance] = useState({});
  const [geoLocation, setGeoLocation] = useState({});
  const [geoError, setGeoError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showDistanceBar, setShowDistanceBar] = useState(false);
  const [cookies] = useCookies("user");
  const axiosPrivate = useAxiosPrivate();
  const API_KEY = process.env.REACT_APP_TOMTOM;
  // const geoLocation = state?.geoLocation;

  const getNearbyPlaces = async (
    query,
    lat,
    long,
    limit = 100,
    radius = 60000
  ) => {
    const baseUrl = "https://api.tomtom.com/search/2/poiSearch";
    let queryString = `limit=${limit}&lat=${lat}&lon=${long}&radius=${radius}&key=${API_KEY}`;
    let response = await axios.get(`${baseUrl}/${query}.json?${queryString}`);
    return response.data.results;
  };

  const onSearchChange = async (query) => {
    if (query.length > 0) {
      const response = await getNearbyPlaces(
        query,
        geoLocation.latitude,
        geoLocation.longitude
      );
      setSearchResults(response);
    }
  };

  const handleSubmitAdress = async (e) => {
    e.preventDefault();
    const addressInfo = {
      country: selectedPlace.address.country,
      name: selectedPlace.address.localName,
      lat: selectedPlace.position.lat,
      lon: selectedPlace.position.lon,
      full_name: selectedPlace.poi.name,
    };
    const userId = cookies.userId;
    try {
      const response = await axiosPrivate.put(
        `${process.env.REACT_APP_URL}/address`,
        {
          addressInfo,
          user_id: userId,
        }
      );
      const success = response.status === 200;
      if (success) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitDistance = async (e) => {
    e.preventDefault();
    const distance = stateDistance;
    const userId = cookies.userId;
    try {
      const response = await axiosPrivate.put(
        `${process.env.REACT_APP_URL}/address`,
        {
          distance,
          user_id: userId,
        }
      );
      const success = response.status === 200;
      if (success) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setPlace = (key) => {
    let place = searchResults.find((item) => String(item?.id) === String(key));
    if (!place) {
      setSelectedPlace(searchResults[0]);
    } else {
      setSelectedPlace(place);
    }
  };
  console.log(selectedPlace);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((e) => {
      try {
        setGeoLocation(e.coords);
      } catch (error) {
        console.log(error);
        setGeoError(error);
      }
    });
  }, []);

  useEffect(() => {
    if (geoLocation.latitude) {
      setLoading(false);
    }
  }, [geoLocation]);

  useEffect(() => {
    if (onboarding && Object.keys(selectedPlace).length) {
      const addressInfo = {
        country: selectedPlace.address.country,
        name: selectedPlace.address.localName,
        lat: selectedPlace.position.lat,
        lon: selectedPlace.position.lon,
        full_name: selectedPlace.poi.name,
      };
      setFormData((prevState) => ({
        ...prevState,
        address_info: { ...addressInfo },
      }));
    }
    console.log(formData);
  }, [selectedPlace]);

  return (
    <>
      {!loading ? (
        <>
          {!onboarding && (
            <button
              style={{ margin: "10px" }}
              onClick={(e) => {
                e.preventDefault();
                setShowSearchBar(!showSearchBar);
                setShowDistanceBar(false);
              }}
              className="primary-title-button"
            >
              Select my Address
            </button>
          )}
          {(showSearchBar || onboarding) && (
            <>
              <p style={{ margin: "10px 0 10px 0" }}>Please Select an Address Close To You</p>
              <ReactSearchBox
                required={true}
                placeholder="Search for nearby places"
                // matchedRecords={searchResults
                //   ?.map((result) => ({
                //     key: result.id,
                //     name: result.poi.name,
                //     dist: result.dist,
                //     value: `${result.poi.name} | ${(result.dist / 1000).toFixed(
                //       2
                //     )}km `,
                //   }))
                //   .sort((a, b) => a.dist - b.dist)}
                data={searchResults
                  ?.map((result) => ({
                    key: result.id,
                    // name: result.poi.name,
                    // dist: result.dist,
                    value: result.poi?.name || result.address.freeformAddress,
                  }))
                  .sort((a, b) => a.dist - b.dist)}
                onSelect={(place) => {
                  setPlace(place?.item?.key);
                }}
                autoFocus={false}
                onChange={(query) => {
                  onSearchChange(query);
                }}
                fuseConfigs={{
                  minMatchCharLength: 7,
                  threshold: 3,
                  distance: 10000,
                  sort: true,
                }}
                keys={["name"]}
              />
              {selectedPlace && (
                <div>
                  <ShowPlaceDetails
                    className="place-box"
                    data={selectedPlace}
                  />
                  {!onboarding && (
                    <button
                      onClick={(e) => {
                        handleSubmitAdress(e);
                      }}
                      className="primary-submit-button"
                    >
                      Submit Address
                    </button>
                  )}
                </div>
              )}
            </>
          )}
          <br />
          {!onboarding && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowDistanceBar(!showDistanceBar);
                setShowSearchBar(false);
              }}
              className="primary-title-button"
            >
              Show pets in this range
            </button>
          )}
          {(showDistanceBar || onboarding) && (
            <>
              <div>
                <p> Only Show pets in this range</p>
                <Slider
                  name="slider"
                  style={{ color: "#fe3072" }}
                  aria-label="Custom marks"
                  defaultValue={40}
                  step={20}
                  valueLabelDisplay="auto"
                  marks={marks}
                  min={20}
                  max={180}
                  onChange={(e) => {
                    if (onboarding) {
                      setFormData((prevState) => ({
                        ...prevState,
                        distance: Number(`${e.target.value}`),
                      }));
                    } else {
                      setStateDistance(Number(`${e.target.value}`));
                    }
                  }}
                />

                {!onboarding && (
                  <button
                    onClick={(e) => {
                      handleSubmitDistance(e);
                    }}
                    className="primary-submit-button"
                  >
                    Submit Range
                  </button>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        <p>...Loading</p>
      )}
    </>
  );
};

export default SearchBox;
