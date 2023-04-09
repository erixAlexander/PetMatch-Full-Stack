import axios from "axios";
import ReactSearchBox from "react-search-box";
import { useState, useEffect } from "react";
import ShowPlaceDetails from "./ShowPlaceDetails";
import Slider from "@mui/material/Slider";
import marks from "../../utils/marksList";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useCookies } from "react-cookie";

const SearchBox = ({ setFormData, formData, onboarding }) => {
  const [state, setState] = useState({
    geoLocation: {},
    geoError: null,
    searchResults: [],
  });
  const geoLocation = state?.geoLocation;
  const axiosPrivate = useAxiosPrivate();
  const API_KEY = process.env.REACT_APP_TOMTOM;
  const [loading, setLoading] = useState(true);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showDistanceBar, setShowDistanceBar] = useState(false);
  const [cookies] = useCookies("user");

  const getNearbyPlaces = async (
    query,
    lat,
    long,
    limit = 5,
    radius = 100000
  ) => {
    let baseUrl = "https://api.tomtom.com/search/2/poiSearch";
    let queryString = `limit=${limit}&lat=${lat}&lon=${long}&radius=${radius}&key=${API_KEY}`;
    let response = await axios.get(`${baseUrl}/${query}.json?${queryString}`);
    return response.data.results;
  };

  const onSearchChange = async (query) => {
    if (query.length > 0) {
      let results = await getNearbyPlaces(
        query,
        geoLocation.latitude,
        geoLocation.longitude
      );
      setState((prev) => ({ ...prev, searchResults: results }));
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (e) => {
        setState((prev) => ({ ...prev, geoLocation: e.coords }));
      },
      async (err) => {
        setState({
          geoError: err,
        });
      }
    );
  }, []);

  useEffect(() => {
    if (geoLocation.latitude) {
      setLoading(false);
    }
  }, [geoLocation]);

  const setPlace = (key) => {
    let place = state.searchResults.find((p) => Number(p?.id) === Number(key));
    setState((prev) => ({ ...prev, selectedPlace: place }));
  };

  useEffect(() => {
    if (onboarding) {
      const addressInfo = {
        country: state.selectedPlace?.address.country,
        name: state.selectedPlace?.address.localName,
        lat: state.selectedPlace?.position.lat,
        lon: state.selectedPlace?.position.lon,
        full_name: state.selectedPlace?.poi.name,
      };
      setFormData((prevState) => ({
        ...prevState,
        address_info: { ...addressInfo },
      }));
    }
  }, [state.selectedPlace]);

  const handleSubmitAdress = async (e) => {
    e.preventDefault();
    const addressInfo = {
      country: state.selectedPlace.address.country,
      name: state.selectedPlace.address.localName,
      lat: state.selectedPlace.position.lat,
      lon: state.selectedPlace.position.lon,
      full_name: state.selectedPlace.poi.name,
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
    const distance = state.distance;
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
              <p style={{ margin: "10px 0 10px 0" }}>Please Select your city</p>
              <ReactSearchBox
                required={true}
                placeholder="Search for nearby places"
                matchedRecords={state.searchResults
                  ?.map((result) => ({
                    key: result.id,
                    name: result.poi.name,
                    dist: result.dist,
                    value: `${result.poi.name} | ${(result.dist / 1000).toFixed(
                      2
                    )}km `,
                  }))
                  .sort((a, b) => a.dist - b.dist)}
                data={state.searchResults
                  ?.map((result) => ({
                    key: result.id,
                    name: result.poi.name,
                    dist: result.dist,
                    value: result.poi.name,
                  }))
                  .sort((a, b) => a.dist - b.dist)}
                onSelect={(place) => {
                  setPlace(place?.item?.key);
                }}
                autoFocus={true}
                onChange={(query) => {
                  onSearchChange(query);
                }}
                fuseConfigs={{
                  minMatchCharLength: 7,
                  threshold: 1,
                  distance: 100000,
                  sort: true,
                }}
                keys={["name"]}
              />
              {state.selectedPlace && (
                <div>
                  <ShowPlaceDetails
                    className="place-box"
                    data={state.selectedPlace}
                  ></ShowPlaceDetails>
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
                      setState((prevState) => ({
                        ...prevState,
                        distance: Number(`${e.target.value}`),
                      }));
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
