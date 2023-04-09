
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { BsFillHeartFill, BsHeart, BsTrash } from "react-icons/bs";
import Moment from "react-moment";
import defaultImage from "../assets/images/no-photo.jpg";
import useSnapshot from "../utils/useSnapshot";
import "./AdCard.css";

const AdCard = (props) => {
  const navigate = useNavigate();
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const { title, category, subcategory, price, location, city, publishedAt, userId } = props.ad;
  const adLink = `/${props.ad.category.toLowerCase()}/${props.ad.id}`;
  const { users } = useSnapshot("favorites", props.ad.id);

  const isCurrentUser = auth.currentUser && auth.currentUser.uid === userId;

    console.log(`ID: ${props.id}`);
  console.log( `USER: ${auth.currentUser}`);
  
  const toggleFavorite = async () => {
    if (!auth.currentUser) {
      setShowLoginMessage(true);
      setTimeout(() => {
        navigate("/auth/login");
      }, 1000);
      return;
    }
    const isFav = users.includes(auth.currentUser.uid);
    const favRef = doc(db, "favorites", props.ad.id);
    if (isFav) {
      const newUsers = users.filter((id) => id !== auth.currentUser.uid);
      await updateDoc(favRef, { users: newUsers });
    } else {
      const newUsers = users.concat(auth.currentUser.uid);
      await setDoc(favRef, { users: newUsers });
    }
  };

  const deleteAd = async () => {
    if (window.confirm("Are you sure you want to delete this ad?")) {
      await deleteDoc(doc(db, "ads", props.ad.id));
    }
  };

  let formattedDate = "";
  if (publishedAt) {
    const date = moment(publishedAt.toDate());
    if (date.isValid()) {
      formattedDate = date.fromNow();
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
              src={defaultImage}
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
            />
          )}
        </p>
        {isCurrentUser && (
          <p className="delete position-absolute">
            <BsTrash className="trash" size={20} onClick={deleteAd} />
          </p>
        )}
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
              src={defaultImage}
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
                <p className="card-text card-date">{formattedDate}</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdCard;
