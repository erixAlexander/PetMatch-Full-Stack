const BackgroundImage = ({ activityUser }) => {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${activityUser.images[0].url})`,
        }}
        className="activities-card-img"
      >
        <div className="activities-card-background"></div>
      </div>
    </>
  );
};

export default BackgroundImage;
