import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Image } from "cloudinary-react";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ReviewCard.css";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ReviewCard({
  petInfo,
  imgIndex,
  setImageIndex,
  swipe,
}) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 450, minWidth: 450 }}>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={`${petInfo?.pet_name}`}
        className="card-title"
      />
      <div className="sidebar-card">
        {petInfo?.images[0]?.id &&
          petInfo?.images.map((image, personIndex) => {
            let position = "nextSlide";
            if (personIndex === imgIndex) {
              position = "activeSlide";
            }
            if (
              personIndex === imgIndex - 1 ||
              (petInfo.images.length !== 1 &&
                imgIndex === 0 &&
                personIndex === petInfo?.images?.length - 1)
            ) {
              position = "lastSlide";
            }
            return (
              <Image
                key={personIndex}
                cloudName="dhttotcxc"
                publicId={image.id}
                width="500"
                crop="limit"
                className={`${position} images-array-sidebar`}
              />
            );
          })}
      </div>

      <div className="arrow-icons-sidebar">
        <IconButton onClick={() => setImageIndex(imgIndex - 1)}>
          <FontAwesomeIcon className="arrow-icon-sidebar" icon={faArrowLeft} />
        </IconButton>
        <IconButton onClick={() => setImageIndex(imgIndex + 1)}>
          <FontAwesomeIcon className="arrow-icon-sidebar" icon={faArrowRight} />
        </IconButton>
      </div>

      <CardContent className="card-content">
        <p className="pet-info-sidebar">
          <span className="capitalize">
            {petInfo?.about.length > 200
              ? `${petInfo?.about.slice(0, 200)}..`
              : `${petInfo?.about}`}
          </span>
        </p>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          onClick={() => swipe("right")}
          aria-label="add to favorites"
        >
          <FavoriteIcon className="favorite-icon"/>
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon className="share-icon"/>
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {petInfo.looking_for && (
          <CardContent>
            <h3 className="title-sidebar">Looking For</h3>
            <div className="tags-sidebar">
              {petInfo?.looking_for &&
                Object.keys(petInfo.looking_for).map(
                  (key) =>
                    petInfo.looking_for[key] === true && (
                      <h3
                        key={`${key}${petInfo.user_id}`}
                        className="pet-tag-sidebar"
                      >
                        {key}
                      </h3>
                    )
                )}
            </div>
            <div>
              <h3>Year of Birth</h3>
              {petInfo.dob_year}
            </div>
          </CardContent>
        )}
      </Collapse>
    </Card>
  );
}
