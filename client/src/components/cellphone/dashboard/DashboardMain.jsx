import React, { useState, useEffect, useRef, useMemo } from "react";
import { faDog, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import SmallCardIcons from "../../cardIcons/SmallCardIcons";
import Loading from "../../loading/Loading";
import TinderCard from "react-tinder-card";
import TagsFromObject from "../../../components/tags/TagsFromObject";
import TagsFromBoolean from "../../../components/tags/TagsFromBoolean";
import CardAddress from "../tinderCard/CardAddress";
import CardGender from "../tinderCard/CardGender";
import CardPetName from "../tinderCard/CardPetName";
import "./DashboardMain.css";

const DashboardMain = ({
  user,
  loading,
  userId,
  genderedUsers,
  getGenderedUsers,
  updateMatches,
}) => {
  const axiosPrivate = useAxiosPrivate();
  const [lastDirection, setLastDirection] = useState("");
  const [usersToDisplay, setUsersToDisplay] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (user && !usersToDisplay.length) {
      getGenderedUsers();
    }
  }, [user]);

  useEffect(() => {
    const checkDistance = async (userlat, userlon, matchlat, matchlon) => {
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

    const shuffleArray = (array) => {
      for (let i = array?.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    };

    const checkDistanceAndShuffle = async (array) => {
      const usersInDistance = await Promise.all(
        array.map(async (match) => {
          return await checkDistance(
            user?.address_info?.lat,
            user?.address_info?.lon,
            match?.address_info?.lat,
            match?.address_info?.lon
          );
        })
      );

      const filteredUsersByDistance = array.filter(
        (e, i) => true //usersInDistance[i]
      );
      const shuffledArray = shuffleArray(filteredUsersByDistance);
      setUsersToDisplay(shuffledArray);
    };

    const allMatchedUsersId = user?.user_matches
      ?.map(({ user_id }) => user_id)
      .concat(userId);

    const usersNotMatched = genderedUsers?.filter(
      (genderedUser) => !allMatchedUsersId?.includes(genderedUser.user_id)
    );

    checkDistanceAndShuffle(usersNotMatched);
  }, [genderedUsers]);

  useEffect(() => {
    usersToDisplay && setCurrentIndex(usersToDisplay?.length - 1);
  }, [usersToDisplay]);

  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(usersToDisplay?.length)
        .fill(0)
        .map((i) => React.createRef()),
    [usersToDisplay]
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < usersToDisplay.length - 1;
  const canSwipe = currentIndex > -1;

  const swiped = (direction, swipedUserId, index) => {
    if (direction === "right") {
      updateMatches(userId, swipedUserId);
    }
    setLastDirection(direction);
    updateCurrentIndex((prev) => prev - 1);
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < usersToDisplay.length) {
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
          <div className="small-dashboard-body-container">
            {usersToDisplay?.map((character, index) => (
              <TinderCard
                ref={childRefs[index]}
                className="swipe"
                key={character.user_id}
                onSwipe={(dir) => swiped(dir, character.user_id, index)}
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
                  >
                    <TagsFromBoolean character={character} />
                    <TagsFromObject character={character} />
                    <CardPetName
                      character={character}
                      faDog={faDog}
                      FontAwesomeIcon={FontAwesomeIcon}
                    />
                    <CardAddress
                      character={character}
                      faLocationDot={faLocationDot}
                      FontAwesomeIcon={FontAwesomeIcon}
                    />
                    <CardGender character={character} />
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
      )}
    </>
  );
};

export default DashboardMain;
