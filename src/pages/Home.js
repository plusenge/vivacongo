import React, { useState, useEffect, useContext } from "react";
import { collection, orderBy, query, getDocs, limit } from "firebase/firestore";
import { db } from "../firebaseConfig";
import AdCard from "../components/AdCard";
import { AuthContext } from "../context/auth";
import { Link } from "react-router-dom";
import FilterByCategory from "./FilterByCategory"



const Home = () => {
  const [ads, setAds] = useState([]);
  const { user } = useContext(AuthContext);

  const getAds = async () => {
 
    const adsRef = collection(db, "ads");
    const q = query(adsRef, orderBy("publishedAt", "desc"), limit(8));
    const adDocs = await getDocs(q);
    let ads = [];
    adDocs.forEach((doc) => ads.push({ ...doc.data(), id: doc.id }));
    setAds(ads);
  };

  useEffect(() => {
    getAds();
  }, []);
  console.log(ads);

  const handleFavoriteClick = (ad) => {
    if (!user) {
      // redirect to login page if user is not logged in
      return <Link to="/auth/login" />;
    }
    // handle adding to favorites for logged in user
    console.log("Add to favorites:", ad);
  };

  return (
    <div className="mt-5 container">
      <FilterByCategory />
      <h3 className="mt-3 mb-0">Recent Listings...</h3>
      <div className="row">
        {ads.map((ad) => (
          <div className="col-sm-6 col-md-4 col-xl-3 mb-3" key={ad.id}>
            <AdCard ad={ad} onFavoriteClick={handleFavoriteClick} />
          </div>
        ))}
      </div>
      <h6 className="mx-4 pb-5">View more...</h6>
    </div>
  );
};

export default Home;
