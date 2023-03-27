import { useCookies } from "react-cookie";
import Loading from "../../loading/Loading";
import SmallCardIcons from "../../cardIcons/SmallCardIcons";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {
  faDog,
  faLocationDot,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import TinderCard from "react-tinder-card";
import React, { useState, useEffect, useRef, useMemo } from "react";
import TagsFromObject from "../../../components/tags/TagsFromObject";
import TagsFromBoolean from "../../../components/tags/TagsFromBoolean";
import "./DashboardMain.css";

const DashboardMain = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [genderedUsers, setGenderedUsers] = useState([]);
  const [cookies] = useCookies("");
  const userId = cookies.userId;
  const axiosPrivate = useAxiosPrivate();
  const [lastDirection, setLastDirection] = useState("");
  const [filteredGenderUsers, setFilteredGenderUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(filteredGenderUsers?.length);

  const getUser = async () => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.REACT_APP_URL}/user`,
        {
          params: { userId },
        }
      );
      setUser(response?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getGenderedUsers = async () => {
    try {
      const response = await axiosPrivate.get(
        `${process.env.REACT_APP_URL}/gendered-users`,
        {
          params: { gender: user?.gender_interest, type: user?.type_of_pet },
        }
      );
      setGenderedUsers(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user && !filteredGenderUsers.length) {
      getGenderedUsers();
    }
  }, [user]);

  const updateMatches = async (matchedUserId) => {
    try {
      await axiosPrivate.put(`${process.env.REACT_APP_URL}/addmatch`, {
        userId,
        matchedUserId
      });
      getUser();
    } catch (error) {
      console.log(error);
    }
  };

  const matchedUsersId = user?.user_matches
    ?.map(({ user_id }) => user_id)
    .concat(userId);

  const checkDistance = async (match, userlat, userlon, matchlat, matchlon) => {
    try {
      if (!matchlat || !matchlon) return false;
      const response = await axios.get(
        `https://api.tomtom.com/routing/1/calculateRoute/${userlat}%2C${userlon}%3A${matchlat}%2C${matchlon}/json?key=${process.env.REACT_APP_TOMTOM}`
      );
      const distanceInKm =
        response.data.routes[0].summary.lengthInMeters / 1000;

      return distanceInKm < user.distance;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const shuffledArray = (array) => {
      for (let i = array?.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    };

    const distanceArray = async (array) => {
      const posts = await Promise.all(
        array.map(async (match) => {
          return await checkDistance(
            match,
            user?.address_info?.lat,
            user?.address_info?.lon,
            match?.address_info?.lat,
            match?.address_info?.lon
          );
        })
      );

      const filteredDistanceArray = array.filter((e, i) => posts[i]);
      const newShuflledArray = shuffledArray(filteredDistanceArray);
      setFilteredGenderUsers(newShuflledArray);
    };
    const genderedArray = genderedUsers?.filter(
      (genderedUser) => !matchedUsersId?.includes(genderedUser.user_id)
    );

    distanceArray(genderedArray);

    setCurrentIndex(filteredGenderUsers?.length - 1);
  }, [genderedUsers]);

  useEffect(() => {
    setCurrentIndex(filteredGenderUsers?.length - 1);
  }, [filteredGenderUsers]);

  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(filteredGenderUsers?.length)
        .fill(0)
        .map((i) => React.createRef()),
    [filteredGenderUsers]
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < filteredGenderUsers.length - 1;
  const canSwipe = currentIndex >= 0;

  const swiped = (direction, swipedUserId, index) => {
    if (direction === "right") {
      updateMatches(swipedUserId);
      updateCurrentIndex(index - 1);
    }
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, index) => {
    currentIndexRef.current >= index && childRefs[index].current.restoreCard();
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < filteredGenderUsers.length) {
      await childRefs[currentIndex]?.current.swipe(dir);
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  return (
    <>
      {user && !loading ? (
        <>
          {" "}
          <div className="small-dashboard-body-container">
            {filteredGenderUsers?.map((character, index) => (
              <TinderCard
                ref={childRefs[index]}
                className="swipe"
                key={character.user_id}
                onSwipe={(dir) => swiped(dir, character.user_id, index)}
                onCardLeftScreen={() => outOfFrame(character.first_name, index)}
              >
                <div
                  style={{
                    backgroundImage: "url(" + character?.images[0]?.url + ")",
                  }}
                  className="small-card"
                >
                  <div
                    title="Double-click To Open This Profile"
                    className="overlay"
                    style={{ maxWidth: "96%", left: "auto", right: "auto" }}
                  >
                    <div className="dashboard-pedigree-div">
                      <TagsFromBoolean character={character} />
                    </div>

                    <div className="dashboard-lookingfor-container extra-margin">
                      <TagsFromObject character={character} />
                    </div>
                    <div>
                      {" "}
                      <h3 className="pet-name extra-margin">
                        <FontAwesomeIcon icon={faDog} title="doggy" />
                        <span className="capitalize">
                          {character.pet_name.length < 10
                            ? `${character.pet_name}`
                            : `${character.pet_name.substr(0, 10)}...`}
                        </span>
                      </h3>{" "}
                      <p className="dashboard-user-name extra-margin">
                        <FontAwesomeIcon icon={faUser} />
                        {character.first_name.length < 10
                          ? `${character.first_name}`
                          : `${character.first_name.substr(0, 10)}...`}
                      </p>
                      <p className="dashboard-card-address extra-margin">
                        <FontAwesomeIcon icon={faLocationDot} />
                        {character.address_info.full_name.length < 26
                          ? `${character.address_info.full_name}`
                          : `${character.address_info.full_name.substr(
                              0,
                              27
                            )}...`}
                      </p>
                      <p className="gender extra-margin">{`${character.gender_identity}`}</p>
                    </div>
                  </div>
                </div>
              </TinderCard>
            ))}
          </div>
          <div className="small-main-icons-container">
            <SmallCardIcons
              swipe={swipe}
              canSwipe={canSwipe}
              goBack={goBack}
              canGoBack={canGoBack}
            />
          </div>
        </>
      ) : (
        <div className="loading-icon">
          <Loading type={"spin"} color={"#C6C9CA"} />
        </div>
      )}{" "}
    </>
  );
};

export default DashboardMain;
