import "./Chat.css";
import { Image } from "cloudinary-react";

const MatchesList = ({ matchedProfiles, setClickedUser }) => {
  return (
    <div className="matchesList-main-container">
      {[...matchedProfiles].reverse().map((match, index) => {
        return (
          <div
            onClick={() => setClickedUser(match)}
            key={index}
            className="matchlist-item"
          >
            {match.images && (
              <Image
                className="match-image"
                cloudName="dhttotcxc"
                publicId={match.images[0]?.id}
                height="110"
                crop="scale"
                fetchFormat="auto"
                quality="auto"
              />
            )}{" "}
            <p className="match-name">{match.first_name}</p>
            <div className="match-overlay"></div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchesList;
