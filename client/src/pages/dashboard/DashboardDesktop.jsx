import React, { useState, useEffect, useRef, useMemo } from "react";
import { faDog, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TinderCard from "react-tinder-card";
import ChatContainer from "../../components/desktop/chat/ChatContainer";
import TagsFromObject from "../../components/tags/TagsFromObject";
import TagsFromBoolean from "../../components/tags/TagsFromBoolean";
import Sidebar from "../../components/sidebar/Sidebar";
import CardIcons from "../../components/cardIcons/CardIcons";
import Loading from "../../components/loading/Loading";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import axios from "axios";
import "./dashboard-desktop.css";

const DashboardDesktop = ({
  userId,
  loading,
  user,
  getUser,
  genderedUsers,
  getGenderedUsers,
  updateMatches,
}) => {
  const [usersToDisplay, setUsersToDisplay] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [petInfo, setPetInfo] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    getUser(userId);
  }, []);

  useEffect(() => {
    if (user && !usersToDisplay.length) {
      getGenderedUsers(userId);
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
          response?.data?.routes[0]?.summary?.lengthInMeters / 1000;

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

    const usersFilteredByGender = genderedUsers?.filter(
      (genderedUser) => !allMatchedUsersId?.includes(genderedUser.user_id)
    );

    checkDistanceAndShuffle(usersFilteredByGender);
  }, [genderedUsers]);

  useEffect(() => {
    setCurrentIndex(usersToDisplay?.length - 1);
  }, [usersToDisplay]);

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
  const canSwipe = currentIndex >= 0;

  const outOfFrame = (index) => {
    currentIndexRef.current >= index && childRefs[index].current.restoreCard();
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < usersToDisplay.length) {
      await childRefs[currentIndex]?.current.swipe(dir);
    }
  };
  const swiped = (direction, swipedUserId, index) => {
    if (direction === "right") {
      updateMatches(userId, swipedUserId);
    }
    updateCurrentIndex(index - 1);
  };

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  const [activeSidebar, setActiveSidebar] = useState(false);
  const handleSidebar = () => {
    if (!activeSidebar) {
      setActiveSidebar("active");
    } else {
      setActiveSidebar("");
    }
  };

  useEffect(() => {
    setPetInfo(usersToDisplay[currentIndex]);
  }, [currentIndex, activeSidebar]);

  return (
    <>
      {user && !loading ? (
        <>
          <div className="dashboard">
            <div className="background"></div>
            <ChatContainer user={user} />
            <div className="swipe-container">
              <div className="vertical-card-container">
                <div className="card-container">
                  {usersToDisplay?.map((character, index) => (
                    <TinderCard
                      ref={childRefs[index]}
                      className="swipe"
                      key={character.user_id}
                      onSwipe={(dir) => swiped(dir, character.user_id, index)}
                      onCardLeftScreen={() => outOfFrame(index)}
                    >
                      <div
                        style={{
                          backgroundImage:
                            "url(" + character?.images[0]?.url + ")",
                        }}
                        className="card"
                      >
                        <div
                          title="Double-click To Open This Profile"
                          onDoubleClick={handleSidebar}
                          className="overlay"
                        >
                          <div className="dashboard-pedigree-div">
                            <TagsFromBoolean character={character} />
                          </div>
                          <div className="dashboard-lookingfor-container">
                            <TagsFromObject character={character} />
                          </div>
                          <div>
                            <h3 onClick={handleSidebar} className="pet-name">
                              <FontAwesomeIcon icon={faDog} title="doggy" />
                              <span className="capitalize">{`${character.pet_name}`}</span>
                            </h3>
                            <p className="dashboard-card-address">
                              <FontAwesomeIcon icon={faLocationDot} />
                              {character?.address_info?.full_name.length < 26
                                ? `${character?.address_info?.full_name}`
                                : `${character?.address_info?.full_name.substr(
                                    0,
                                    27
                                  )}...`}
                            </p>
                            <p className="gender">{`${character.gender_identity}`}</p>
                          </div>
                        </div>
                      </div>
                    </TinderCard>
                  ))}
                </div>
                <div className="icons-container">
                  <CardIcons
                    swipe={swipe}
                    canSwipe={canSwipe}
                    goBack={goBack}
                    canGoBack={canGoBack}
                  />
                  <div className={`sidebar-container ${activeSidebar}`}>
                    <Sidebar
                      swipe={swipe}
                      activeSidebar={activeSidebar}
                      petInfo={petInfo}
                      handleSidebar={handleSidebar}
                      openByDefault={false}
                    />
                  </div>
                </div>
              </div>
            </div>
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

export default DashboardDesktop;
