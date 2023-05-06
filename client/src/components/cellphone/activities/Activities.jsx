import { useState } from "react";
import ActivitiesCard from "./ActivitiesCard";
import "./Activities.css";

const Activities = ({ genderedUsers, userId, updateMatches }) => {
  const [showCard, setShowCard] = useState(false);
  return (
    <>
      {!showCard ? (
        <div className="all-activities">
          <div className="main-activity">Walk in the park</div>
          <div className="activities-array">Frisbeeeee!!!</div>
          <button onClick={() => setShowCard(true)}>Click</button>
        </div>
      ) : (
        <ActivitiesCard
          setShowCard={setShowCard}
          genderedUsers={genderedUsers}
          userId={userId}
          updateMatches={updateMatches}
        />
      )}
    </>
  );
};

export default Activities;
