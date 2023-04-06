// import React, { useState, useEffect, useContext } from "react";
// import {
//   collection,
//   orderBy,
//   query,
//   getDocs,
//   limit,
//   where,
// } from "firebase/firestore";
// import { db } from "../firebaseConfig";
// import AdCard from "../components/AdCard";
// import { AuthContext } from "../context/auth";
// import { Link } from "react-router-dom";

// const categories = [
//   {
//     name: "👶 Babies & Kids Goods",
//     subcategories: ["Baby Gear", "Toys & Games", "Clothing & Shoes"],
//   },
//   {
//     name: "🏢 Commercial Equipment",
//     subcategories: [
//       "Restaurant & Food Service",
//       "Retail & Services",
//       "Industrial & Construction",
//     ],
//   },
//   {
//     name: "👗 Fashion",
//     subcategories: ["Clothing", "Shoes", "Accessories"],
//   },
//   {
//     name: "🏠 Property",
//     subcategories: ["For Rent", "For Sale", "Land & Plots"],
//   },
//   {
//     name: "📱 Electronics",
//     subcategories: [
//       "Mobile Phones",
//       "Computers & Laptops",
//       "TV, Audio & Video",
//     ],
//   },
//   {
//     name: "🚗 Vehicle",
//     subcategories: ["Cars", "Motorcycles", "Commercial & Other Vehicles"],
//   },
// ];

// const Home = () => {
//   const [ads, setAds] = useState([]);
//   const { user } = useContext(AuthContext);

//   const [selectedPrice, setSelectedPrice] = useState("");



//     // const [sort, setSort] = useState("");
//     // State variables for the selected category and subcategory
//     const [selectedCategory, setSelectedCategory] = useState("");
//     const [selectedSubcategory, setSelectedSubcategory] = useState("");
//     // Event handler for selecting a category
//     const handleCategoryChange = (e) => {
//       const selectedCategory = e.target.value;
//       setSelectedCategory(selectedCategory);
//       setSelectedSubcategory("");
//     };

//     // Get the object for the currently selected category
//     const selectedCategoryObj = categories.find(
//       (category) => category.name === selectedCategory
//     );

//     // Event handler for selecting a subcategory
//     const handleSubcategoryClick = (subcategoryName) => {
//       setSelectedSubcategory(subcategoryName);
//     };



//   const handleSortByPrice = (ads) => {
//     if (selectedPrice === "high") {
//       return ads.sort((a, b) => b.price - a.price);
//     } else if (selectedPrice === "low") {
//       return ads.sort((a, b) => a.price - b.price);
//     } else {
//       return ads;
//     }
//   };

//   const getAds = async () => {
//     const adsRef = collection(db, "ads");
//     let q;
//     if (selectedCategory) {
//       q = query(
//         adsRef,
//         orderBy("publishedAt", "desc"),
//         where("category", "==", selectedCategory),
//         limit(8)
//       );
//     } else {
//       q = query(adsRef, orderBy("publishedAt", "desc"));
//     }
//     const adDocs = await getDocs(q);
//     let ads = [];
//     adDocs.forEach((doc) => ads.push({ ...doc.data(), id: doc.id }));
//     setAds(handleSortByPrice(ads));
//   };

//   useEffect(() => {
//     getAds();
//   }, [selectedCategory, selectedPrice]);

//   const handleFavoriteClick = (ad) => {
//     if (!user) {
//       // redirect to login page if user is not logged in
//       return <Link to="/auth/login" />;
//     }
//     // handle adding to favorites for logged in user
//     console.log("Add to favorites:", ad);
//   };

//   return (
//     <div className="mt-5 container category-container">
//       <div className="d-flex justify-content-center justify-content-md-between flex-wrap ">
//         <div className="sortyBy_price">
//           <h5>Sort By</h5>
//           <select
//             className="form-select sortBy-price__container"
//             onChange={(e) => setSelectedPrice(e.target.value)}
//           >
//             <option value="">Latest</option>
//             <option value="high">Price High</option>
//             <option value="low">Price Low</option>
//           </select>
//         </div>

//         <div className="d-flex justify-content-center justify-content-md-between flex-wrap ">
//           <div>
//             <div className="filter-container">
//               <h5 className="filter-bycategory__title" FilterByCategory>
//                 {" "}
//                 Filter By Category
//               </h5>
//               <select
//                 className="form-select filter-input__category"
//                 value={selectedCategory}
//                 onChange={handleCategoryChange}
//               >
//                 <option value="">All</option>
//                 {categories.map((category, index) => (
//                   <option key={index} value={category.name}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {selectedCategory && (
//               <div className="category-list">
//                 <p
//                   className="category active"
//                   onClick={() => setSelectedCategory("")}
//                 ></p>
//               </div>
//             )}

//             {selectedCategoryObj && (
//               <div className="subcategory-container">
//                 <h6 className="mt-3 display-category__name">
//                   {selectedCategoryObj.name}
//                 </h6>
//                 <ul className="subcategory-list">
//                   {selectedCategoryObj.subcategories.map(
//                     (subcategory, index) => (
//                       <li
//                         key={index}
//                         className={`subcategory ${
//                           subcategory === selectedSubcategory ? "active" : ""
//                         }`}
//                         onClick={() => handleSubcategoryClick(subcategory)}
//                       >
//                         {subcategory}
//                       </li>
//                     )
//                   )}
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <h3 className="mt-3 mb-0">Recent Listings...</h3>
//       <div className="row">
//         {ads.map((ad) => (
//           <div className="col-sm-6 col-md-4 col-xl-3 mb-3" key={ad.id}>
//             <AdCard ad={ad} onFavoriteClick={handleFavoriteClick} />
//           </div>
//         ))}
//       </div>
//       <h6 className="mx-4 pb-5">View more...</h6>
//     </div>
//   );
// };

// export default Home;

// import React, { useState, useEffect, useContext } from "react";
// import {
//   collection,
//   orderBy,
//   query,
//   getDocs,
//   limit,
//   where,
// } from "firebase/firestore";
// import { db } from "../firebaseConfig";
// import AdCard from "../components/AdCard";
// import { AuthContext } from "../context/auth";
// import { Link } from "react-router-dom";

// const categories = [
//   {
//     name: "👶 Babies & Kids Goods",
//     subcategories: ["Baby Gear", "Toys & Games", "Clothing & Shoes"],
//   },
//   {
//     name: "🏢 Commercial Equipment",
//     subcategories: [
//       "Restaurant & Food Service",
//       "Retail & Services",
//       "Industrial & Construction",
//     ],
//   },
//   {
//     name: "👗 Fashion",
//     subcategories: ["Clothing", "Shoes", "Accessories"],
//   },
//   {
//     name: "🏠 Property",
//     subcategories: ["For Rent", "For Sale", "Land & Plots"],
//   },
//   {
//     name: "📱 Electronics",
//     subcategories: [
//       "Mobile Phones",
//       "Computers & Laptops",
//       "TV, Audio & Video",
//     ],
//   },
//   {
//     name: "🚗 Vehicle",
//     subcategories: ["Cars", "Motorcycles", "Commercial & Other Vehicles"],
//   },
// ];

// const Home = () => {
//   const [ads, setAds] = useState([]);
//   const { user } = useContext(AuthContext);

//   const [selectedPrice, setSelectedPrice] = useState("");



//     const [sort, setSort] = useState("");
//     // State variables for the selected category and subcategory
//     const [selectedCategory, setSelectedCategory] = useState("");
//     const [selectedSubcategory, setSelectedSubcategory] = useState("");
//     // Event handler for selecting a category
//     const handleCategoryChange = (e) => {
//       const selectedCategory = e.target.value;
//       setSelectedCategory(selectedCategory);
//       setSelectedSubcategory("");
//     };

//     // Get the object for the currently selected category
//     const selectedCategoryObj = categories.find(
//       (category) => category.name === selectedCategory
//     );

//     // Event handler for selecting a subcategory
//     const handleSubcategoryClick = (subcategoryName) => {
//       setSelectedSubcategory(subcategoryName);
//     };



//   const handleSortByPrice = (ads) => {
//     if (selectedPrice === "high") {
//       return ads.sort((a, b) => b.price - a.price);
//     } else if (selectedPrice === "low") {
//       return ads.sort((a, b) => a.price - b.price);
//     } else {
//       return ads;
//     }
//   };

//   const getAds = async () => {
//     const adsRef = collection(db, "ads");
//     let q;
//     if (selectedCategory) {
//       q = query(
//         adsRef,
//         orderBy("publishedAt", "desc"),
//         where("category", "==", selectedCategory),
//         limit(8)
//       );
//     } else {
//       q = query(adsRef, orderBy("publishedAt", "desc"));
//     }
//     const adDocs = await getDocs(q);
//     let ads = [];
//     adDocs.forEach((doc) => ads.push({ ...doc.data(), id: doc.id }));
//     setAds(handleSortByPrice(ads));
//   };

//   useEffect(() => {
//     getAds();
//   }, [selectedCategory, selectedPrice]);

//   const handleFavoriteClick = (ad) => {
//     if (!user) {
//       // redirect to login page if user is not logged in
//       return <Link to="/auth/login" />;
//     }
//     // handle adding to favorites for logged in user
//     console.log("Add to favorites:", ad);
//   };

//   return (
//     <div className="mt-5 container category-container">
//       <div className="d-flex justify-content-center justify-content-md-between flex-wrap ">
//         <div className="sortyBy_price">
//           <h5>Sort By</h5>
//           <select
//             className="form-select sortBy-price__container"
//             onChange={(e) => setSelectedPrice(e.target.value)}
//           >
//             <option value="">Latest</option>
//             <option value="high">Price High</option>
//             <option value="low">Price Low</option>
//           </select>
//         </div>

//         <div className="d-flex justify-content-center justify-content-md-between flex-wrap ">
//           <div>
//             <div className="filter-container">
//               <h5 className="filter-bycategory__title" FilterByCategory>
//                 {" "}
//                 Filter By Category
//               </h5>
//               <select
//                 className="form-select filter-input__category"
//                 value={selectedCategory}
//                 onChange={handleCategoryChange}
//               >
//                 <option value="">All</option>
//                 {categories.map((category, index) => (
//                   <option key={index} value={category.name}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {selectedCategory && (
//               <div className="category-list">
//                 <p
//                   className="category active"
//                   onClick={() => setSelectedCategory("")}
//                 ></p>
//               </div>
//             )}

//             {selectedCategoryObj && (
//               <div className="subcategory-container">
//                 <h6 className="mt-3 display-category__name">
//                   {selectedCategoryObj.name}
//                 </h6>
//                 <ul className="subcategory-list">
//                   {selectedCategoryObj.subcategories.map(
//                     (subcategory, index) => (
//                       <li
//                         key={index}
//                         className={`subcategory ${
//                           subcategory === selectedSubcategory ? "active" : ""
//                         }`}
//                         onClick={() => handleSubcategoryClick(subcategory)}
//                       >
//                         {subcategory}
//                       </li>
//                     )
//                   )}
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <h3 className="mt-3 mb-0">Recent Listings...</h3>
//       <div className="row">
//         {ads.map((ad) => (
//           <div className="col-sm-6 col-md-4 col-xl-3 mb-3" key={ad.id}>
//             <AdCard ad={ad} onFavoriteClick={handleFavoriteClick} />
//           </div>
//         ))}
//       </div>
//       <h6 className="mx-4 pb-5">View more...</h6>
//     </div>
//   );
// };

// export default Home;

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

const categories = [
  {
    name: "👶 Babies & Kids Goods",
    subcategories: ["Baby Gear", "Toys & Games", "Clothing & Shoes"],
  },
  {
    name: "🏢 Commercial Equipment",
    subcategories: [
      "Restaurant & Food Service",
      "Retail & Services",
      "Industrial & Construction",
    ],
  },
  {
    name: "👗 Fashion",
    subcategories: ["Clothing", "Shoes", "Accessories"],
  },
  {
    name: "🏠 Property",
    subcategories: ["For Rent", "For Sale", "Land & Plots"],
  },
  {
    name: "📱 Electronics",
    subcategories: [
      "Mobile Phones",
      "Computers & Laptops",
      "TV, Audio & Video",
    ],
  },
  {
    name: "🚗 Vehicle",
    subcategories: ["Cars", "Motorcycles", "Commercial & Other Vehicles"],
  },
];

const Home = () => {
  const [ads, setAds] = useState([]);
  const { user } = useContext(AuthContext);

  const [selectedPrice, setSelectedPrice] = useState("");

    const [sort, setSort] = useState("");
    // State variables for the selected category and subcategory
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    // Event handler for selecting a category
    const handleCategoryChange = (e) => {
      const selectedCategory = e.target.value;
      setSelectedCategory(selectedCategory);
      setSelectedSubcategory("");
    };
    // Get the object for the currently selected category
    const selectedCategoryObj = categories.find(
      (category) => category.name === selectedCategory
    );

    // Event handler for selecting a subcategory
    const handleSubcategoryClick = (subcategoryName) => {
      setSelectedSubcategory(subcategoryName);
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

  const getAds = async () => {
    const adsRef = collection(db, "ads");
    let q;
    if (selectedCategory) {
      q = query(
        adsRef,
        orderBy("publishedAt", "desc"),
        where("category", "==", selectedCategory),
        limit(8)
      );
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
  }, [selectedCategory, selectedPrice]);

  const handleFavoriteClick = (ad) => {
    if (!user) {
      // redirect to login page if user is not logged in
      return <Link to="/auth/login" />;
    }
    // handle adding to favorites for logged in user
    console.log("Add to favorites:", ad);
  };

  return (
    <div className="mt-5 container category-container">
      <div className="d-flex justify-content-center justify-content-md-between flex-wrap ">
        <div className="sortyBy_price">
          <h5>Sort By</h5>
          <select
            className="form-select sortBy-price__container"
            onChange={(e) => setSelectedPrice(e.target.value)}
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
                {" "}
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

            {selectedCategory && (
              <div className="category-list">
                <p
                  className="category active"
                  onClick={() => setSelectedCategory("")}
                ></p>
              </div>
            )}

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
                          subcategory === selectedSubcategory ? "active" : ""
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
          </div>
        </div>
      </div>
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



