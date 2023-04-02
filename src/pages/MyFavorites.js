import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  documentId,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import AdCard from "../components/AdCard";
import "./MyFavorites.css";

const MyFavorites = () => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Delay the animation by 50ms
    const timeout = setTimeout(() => {
      setShowAnimation(true);
    }, 50);
    return () => clearTimeout(timeout);
  }, []);

  const [ads, setAds] = useState([]);

  const getAds = async () => {
    // get ads from fav collection where users includes logged in user
    const favRef = collection(db, "favorites");
    const q = query(
      favRef,
      where("users", "array-contains", auth.currentUser.uid)
    );
    const docsSnap = await getDocs(q);

    let promises = [];
    docsSnap.forEach(async (doc) => {
      const adsRef = collection(db, "ads");
      const q = query(adsRef, where(documentId(), "==", doc.id));
      promises.push(getDocs(q));
    });
    let ads = [];
    const docs = await Promise.all(promises);
    docs.forEach((querySnap) =>
      querySnap.forEach((dSnap) => ads.push({ ...dSnap.data(), id: dSnap.id }))
    );
    setAds(ads);
  };

  useEffect(() => {
    getAds();
  }, []);

  return (
    <div className={`form-animation__header ${showAnimation ? "animate" : ""}`}>
      <div className="mt-5 container">
        {ads.length ? <h3>Favorite Ads...</h3> : <h3>No Favorite Ads...</h3>}

        <div className="row card-img__content">
          {ads.map((ad) => (
            <div
              className="col-sm-6 col-md-4 col-xl-3 mb-3 single-card__favorite"
              key={ad.id}
            >
              <AdCard ad={ad} className="background-image_photo" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyFavorites;
