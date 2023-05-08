import React from "react";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Image } from "cloudinary-react";

const ChatListMessages = ({
  latestReceivedMessages,
  setClickedUser,
  readMessage,
  setSocketNotification,
  setNotificationArray,
  mssgRead,
  FontAwesomeIcon,
  notificationArray,
}) => {
  return (
    <>
      {!latestReceivedMessages.length ? (
        <p>Let's make some new friends</p>
      ) : (
        latestReceivedMessages?.map((match, index) => {
          return (
            <div
              onClick={() => {
                setClickedUser(match);
                readMessage(match.user_id);
                setSocketNotification({});
                setNotificationArray((prev) => {
                  const test2 = prev.filter((e) => e.userId != match.user_id);
                  return test2;
                });
              }}
              key={index}
              className="small-chat-preview"
            >
              {!mssgRead[index.toString()] && (
                <FontAwesomeIcon className="icon-mail-cell" icon={faEnvelope} />
              )}
              {notificationArray?.find((u) => u.userId == match.user_id)
                ?.notification && (
                <FontAwesomeIcon className="icon-mail-cell" icon={faEnvelope} />
              )}
              <div className="preview-img">
                {match.img && (
                  <Image
                    cloudName="dhttotcxc"
                    publicId={match.img?.id}
                    height="50"
                    crop="scale"
                    fetchFormat="auto"
                    quality="auto"
                  />
                )}
              </div>
              <div className="preview-message">
                <p>{match.name}</p>
                <div className="small-chat-preview">
                  <p>
                    {match.dir === "in" ? (
                      <FontAwesomeIcon
                        style={{ color: "green" }}
                        icon={faArrowRight}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{ color: "red" }}
                        icon={faArrowLeft}
                      />
                    )}
                  </p>
                  <p>{match?.message}</p>
                </div>
                <hr />
              </div>
            </div>
          );
        })
      )}
    </>
  );
};

export default ChatListMessages;
