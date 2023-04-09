import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import moment from "moment";
import { doc, updateDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { BsFillHeartFill, BsHeart } from "react-icons/bs";
import Moment from "react-moment";
import defaultImage from "../assets/images/no-photo.jpg";
import useSnapshot from "../utils/useSnapshot";
import "./AdCard.css";

const AdCard = (props) => {
  const navigate = useNavigate();
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const { title, category, subcategory, price, location, city, publishedAt } =props.ad;
  const adLink = `/${props.ad.category.toLowerCase()}/${props.ad.id}`;
  const { users } = useSnapshot("favorites", props.ad.id)

  // Show the login message and redirect to login page
  const toggleFavorite = async () => {
    if (!auth.currentUser) {
      setShowLoginMessage(true);
      setTimeout(() => {
        navigate("/auth/login");
      }, 1000); // Delay the redirection by 1 seconds
      return;
    }
    const isFav = users.includes(auth.currentUser.uid);
    const favRef = doc(db, "favorites", props.ad.id);
    if (isFav) {
      // Remove the current user ID from the users array
      const newUsers = users.filter((id) => id !== auth.currentUser.uid);
      await updateDoc(favRef, { users: newUsers });
    } else {
      // Add the current user ID to the users array
      const newUsers = users.concat(auth.currentUser.uid);
      await setDoc(favRef, { users: newUsers });
    }
  };

  // Extract the date from the publishedAt field
  let formattedDate = "";
  if (publishedAt) {
    const date = moment(publishedAt[0]);
    if (date.isValid()) {
      formattedDate = date.format("MMMM D, YYYY");
    }
  }

  return (
    <div className="card ad-card ad-card-container">
      <div className="position-relative">
        {props.ad.images && props.ad.images[0] && props.ad.images[0].url ? (
          <img
            src={props.ad.images[0].url}
            alt={props.ad.title}
            className="card-img-top"
            style={{ width: "100%", height: "200px" }}
          />
        ) : (
          <div
            className="card-img-top"
            style={{ width: "100%", height: "200px" }}
          >
            <img
              src={defaultImage} // use the default image as the src
              alt="No image available"
              className="card-img-top"
              style={{ width: "100%", height: "200px" }}
            />
          </div>
        )}
        <p className="heart position-absolute">
          {users?.includes(auth.currentUser?.uid) ? (
            <BsFillHeartFill
              className="heart heart-fill"
              size={20}
              onClick={toggleFavorite}
            />
          ) : (
            <BsHeart
              className="heart heart-empty"
              size={23}
              onClick={toggleFavorite}
              style={{ color: "#209ab5" }}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Save to favorites"
            />
          )}
        </p>
      </div>
      <Link
        to={adLink}
        className="position-relative card-image-container card-text-water__mark"
      >
        {props.ad.images && props.ad.images[0] && props.ad.images[0].url ? (
          <img
            src={props.ad.images[0].url}
            alt={props.ad.title}
            className="card-img-top"
            style={{ width: "100%", height: "200px" }}
          />
        ) : (
          <div
            className="card-img-top"
            style={{ width: "100%", height: "200px" }}
          >
            <img
              src={defaultImage} // use the default image as the src
              alt="No image available"
              className="card-img-top"
              style={{ width: "100%", height: "200px" }}
            />
          </div>
        )}
      </Link>{" "}
      <div className="card-body">
        {" "}
        <div className="button-group d-flex">
          {" "}
          <Link to={adLink} className="card-title title-link">
            {title}{" "}
          </Link>{" "}
        </div>{" "}
        <div className="card-category-heart d-flex justify-content-between align-content-center">
          {" "}
          <Link to={adLink} className="category-link">
            <p className="card-category">{category}</p>{" "}
          </Link>{" "}
          <Link to={adLink} className="category-link">
            <p className="card-category subcategory-name">{subcategory}</p>{" "}
          </Link>{" "}
          {showLoginMessage && (
            <span
              className="alert-warning__favorite alert alert-warning text-bg-danger"
              role="alert"
            >
              Please log in to add to your favorites.
            </span>
          )}
        </div>
        <div className="card-details">
          <div className="card-location">
            <span className="location-icon">&#x1f4cd;</span> {location}
          </div>
          <div className="card-city">
            <span className="location-icon">&#x1f5fa;</span> {city}
          </div>
        </div>
        <div className="card-price-date">
          <div className="card-price-container">
            <div className="card-price">${price}</div>
          </div>
          <div className="card-date-container">
            <div>
              <Link to={adLink} className="card-date">
                <p className="card-text card-date">
                  <Moment fromNow className="text-sucess">
                    {props.ad.publishedAt.toDate()}
                  </Moment>
                  <br />
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdCard;




