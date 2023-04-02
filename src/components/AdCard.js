import React, {useEffect, useState} from "react";
import moment from "moment";
import { doc, onSnapshot, updateDoc, setDoc } from "firebase/firestore";
import { db, auth} from "../firebaseConfig";
import { Link } from "react-router-dom";
import {FaEye } from "react-icons/fa";
import { BsFillHeartFill, BsHeart } from "react-icons/bs";
import Moment from "react-moment";

import "./AdCard.css";

const AdCard = props => {
    const [isFavorite, setIsFavorite] = useState(false);

    const handleToggleFavorite = () => {
      setIsFavorite(!isFavorite);
    };
     const [users, setUsers] = useState([]);
     const { title, category, price, location, city, publishedAt } = props.ad;
     const adLink = `/${props.ad.category.toLowerCase()}/${props.ad.id}`;

     useEffect(() => {
       const docRef = doc(db, "favorites", props.ad.id);
       const unsub = onSnapshot(docRef, (querySnapshot) => {
         const data = querySnapshot.data();
         if (data && data.users) {
           setUsers(data.users);
         }
       });
       return () => unsub();
     }, []);
     console.log(users);
    const toggleFavorite = async () => {
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
      <Link to={adLink} className="card-image-container">
        <img
          src={props.ad.images[0].url}
          className="card-img-top"
          alt={title}
        />
        <div className="card-text-water__mark"></div>
      </Link>

      <div className="card-body">
        <div className="button-group d-flex">
          <Link to={adLink} className="card-title title-link">
            {title}
          </Link>
        </div>
        <div className="card-category-heart d-flex justify-content-between align-content-center">
          <Link to={adLink} className="category-link">
            <p className="card-category">{category}</p>
          </Link>

          <p className="heart">
            {users?.includes(auth.currentUser?.uid) ? (
              <BsFillHeartFill
                className="heart heart-fill"
                size={23}
                onClick={toggleFavorite}
              />
            ) : (
              <BsHeart
                className="heart heart-empty"
                size={23}
                onClick={toggleFavorite}
                style={{ color: "#209ab5" }}
              />
            )}
          </p>
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
            <div className="card-date">
              <Link to={adLink}>
                <p className="card-text">
                  <Moment fromNow>{props.ad.publishedAt.toDate()}</Moment>
                  <br />
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdCard;


