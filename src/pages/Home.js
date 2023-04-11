import React, { useState, useEffect, useContext } from "react";
import {
  collection,
  orderBy,
  query,
  getDocs,
  limit,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import AdCard from "../components/AdCard";
import { AuthContext } from "../context/auth";
import { Link } from "react-router-dom";
import "./Home.css";
import Footer from "./Footer";
import { categories, locations } from "../data/config";
import Category from "../components/CategorySubcategory";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterSelected, setIsFilterSelected] = useState(false);
  const [ads, setAds] = useState([]);
  const { user } = useContext(AuthContext);
  const [selectedPrice, setSelectedPrice] = useState("");
  const [sort, setSort] = useState("");
  // State variables for the selected category and subcategory
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubcategory] = useState("");

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Event handler for selecting a category
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setSelectedCategory(selectedCategory);
    setSelectedSubcategory("");
    //Not found product message only show when filter =0 or search = 0
    setIsFilterSelected(true);
  };
  // Get the object for the currently selected category
  const selectedCategoryObj = categories.find(
    (category) => category.name === selectedCategory
  );
  // Event handler for selecting a subcategory
  const handleSubcategoryClick = (subcategoryName) => {
    setSelectedSubcategory(subcategoryName);
    //Not found product message only show when filter =0 or search = 0
    setIsFilterSelected(true);
  };
  const handleSortByPrice = (ads) => {
    if (selectedPrice === "high") {
      return ads.sort((a, b) => b.price - a.price);
    } else if (selectedPrice === "low") {
      return ads.sort((a, b) => a.price - b.price);
    } else {
      return ads;
    }
  };
  // Get ads handler function
  const getAds = async () => {
    const adsRef = collection(db, "ads");
    let q;
    if (selectedCategory) {
      if (selectedSubCategory) {
        q = query(
          adsRef,
          orderBy("publishedAt", "desc"),
          where("category", "==", selectedCategory),
          where("subcategory", "==", selectedSubCategory),
          limit(8)
        );
      } else {
        q = query(
          adsRef,
          orderBy("publishedAt", "desc"),
          where("category", "==", selectedCategory),
          limit(8)
        );
      }
    } else {
      q = query(adsRef, orderBy("publishedAt", "desc"));
    }
    const adDocs = await getDocs(q);
    let ads = [];
    adDocs.forEach((doc) => ads.push({ ...doc.data(), id: doc.id }));
    setAds(handleSortByPrice(ads));
  };
  useEffect(() => {
    getAds();
  }, [selectedCategory, selectedPrice, selectedSubCategory]);

  const handleFavoriteClick = (ad) => {
    if (!user) {
      // redirect to login page if user is not logged in
      return <Link to="/auth/login" />;
    }
    // handle adding to favorites for logged in user
    console.log("Add to favorites:", ad);
  };
  const handleRemoveAllClick = () => {
    setSelectedPrice("");
    setSelectedCategory("");
    setSelectedSubcategory("");
  };

  return (
    <div className="container category-container">
      <div
        className="d-flex justify-content-center justify-content-md-between flex-wrap filter-container p-3"
        style={{ backgroundColor: "aliceblue" }}
      >
        <div className="sortyBy_price">
          <h5>Sort By</h5>
          <select
            className="form-select sortBy-price__container"
            onChange={(e) => setSelectedPrice(e.target.value)}
            value={selectedPrice}
          >
            <option value="">Latest</option>
            <option value="high">Price High</option>
            <option value="low">Price Low</option>
          </select>
        </div>

        <div className="d-flex justify-content-center justify-content-md-between flex-wrap ">
          <div>
            <div className="filter-container">
              <h5 className="filter-bycategory__title" FilterByCategory>
                Filter By Category
              </h5>
              <select
                className="form-select filter-input__category"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">All</option>
                {categories.map((category, index) => (
                  <option key={index} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedCategoryObj && (
              <div className="subcategory-container">
                <h6 className="mt-3 display-category__name">
                  {selectedCategoryObj.name}
                </h6>
                <ul className="subcategory-list">
                  {selectedCategoryObj.subcategories.map(
                    (subcategory, index) => (
                      <li
                        key={index}
                        className={`subcategory ${
                          subcategory === selectedSubCategory ? "active" : ""
                        }`}
                        onClick={() => handleSubcategoryClick(subcategory)}
                      >
                        {subcategory}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
            {selectedSubCategory && (
              <div className="category-list">
                <p
                  className="category active"
                  onClick={() => setSelectedSubcategory("")}
                >
                  {selectedSubCategory} <i className="bi bi-x"></i>
                </p>
              </div>
            )}
          </div>

          {selectedPrice || selectedCategory || selectedSubCategory ? (
            <div className="remove-all-container">
              <button
                className="btn remove-all_filter"
                onClick={handleRemoveAllClick}
              >
                <span className="text-danger mx-1 fs-5">X</span>Remove All
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      <h4 className="mt-3 mb-0">Recent Listings...</h4>

      {/*AdCard component pass handleFavoriteClick function*/}
      {ads.length > 0 ? (
        <div className="row">
          {ads.map((ad) => (
            <div className="col-sm-6 col-md-4 col-xl-3 mb-3" key={ad.id}>
              <AdCard ad={ad} onFavoriteClick={handleFavoriteClick} />
            </div>
          ))}
        </div>
      ) : (
        (searchQuery || isFilterSelected) && (
          <div className="p-3 mt-3" style={{ backgroundColor: "#f8d7da" }}>
            <h5>Sorry, we could not find any results for your search...</h5>
            <span>Following tips might help you to get better results</span>
            <ul>
              <li>Use more general keywords</li>
              <li>Check spelling of position</li>
              <li>Reduce filters, use less of them</li>
            </ul>
          </div>
        )
      )}
      <Footer />
    </div>
  );
};
export default Home;
