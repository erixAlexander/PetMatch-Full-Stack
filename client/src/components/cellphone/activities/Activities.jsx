import { useState } from "react";
import ActivitiesCard from "./ActivitiesCard";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import "./Activities.css";

const Activities = ({ userId, updateMatches, user }) => {
  const [showCard, setShowCard] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [mainActivity, setMainActivity] = useState({
    name: "Snacking at home with my hooman!",
    img: "https://res.cloudinary.com/dhttotcxc/image/upload/v1683491433/Activities/AdobeStock_323496812-scaled_amrvzh.jpg",
  });
  const [activities, setActivities] = useState([
    {
      name: "Go for a swim!",
      img: "https://res.cloudinary.com/dhttotcxc/image/upload/v1683491434/Activities/Golden-Retriever-swimming-wearing-a-life-vest-fetching-a-toy_r2ph2u.jpg",
    },
    {
      name: "Frisbee!!",
      img: "https://res.cloudinary.com/dhttotcxc/image/upload/v1683492522/Activities/205100809-bace59b9-d607-4e6d-9bbe-e87630f4d03a_l61jwj.jpg",
    },
    {
      name: "Playing in the park",
      img: "https://res.cloudinary.com/dhttotcxc/image/upload/v1683491433/Activities/best-dog-for-active-person-400x400-b88ff2da67e84a079bd6c5029490af39_m3ayce.jpg",
    },
    {
      name: "Adopting or giving for adoption!",
      img: "https://res.cloudinary.com/dhttotcxc/image/upload/v1683492639/Activities/images_wek48t.jpg",
    },
  ]);
  const [activity, setActivity] = useState("");

  const addActivityToUser = async (act) => {
    try {
      const activity = act;
      const response = await axiosPrivate.put(
        `${process.env.REACT_APP_URL}/add-activity`,
        {
          params: { userId, activity },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const setUserActivity = (act) => {
    addActivityToUser(act.name);
    setActivity(act.name);
    setShowCard(true);
  };

  return (
    <>
      {!showCard ? (
        <div className="all-activities">
          <div
            onClick={() => {
              setUserActivity(mainActivity);
            }}
            style={{ backgroundImage: `url(${mainActivity.img})` }}
            className="main-activity"
          >
            <div className="activities-overlay"></div>
            <h1>{mainActivity.name}</h1>
          </div>
          <div className="activities-array">
            {activities.map((act) => {
              return (
                <div
                  style={{ backgroundImage: `url(${act.img})` }}
                  onClick={() => {
                    setUserActivity(act);
                  }}
                  key={act.name}
                  className="activities-item"
                >
                  <div className="activities-overlay"></div>
                  <p>{act.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <ActivitiesCard
          activity={activity}
          setShowCard={setShowCard}
          userId={userId}
          updateMatches={updateMatches}
          user={user}
        />
      )}
    </>
  );
};

export default Activities;
