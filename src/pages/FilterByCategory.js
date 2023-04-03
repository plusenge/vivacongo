import { useState } from "react";
import "./FilterByCategory.css";

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

const FilterByCategory = () => {
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

  return (
    <div className="category-container">
      <div className="filter-container">
        <h5 className="filter-bycategory__title" FilterByCategory> Filter By Category</h5>
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
            {selectedCategoryObj.subcategories.map((subcategory, index) => (
              <li
                key={index}
                className={`subcategory ${
                  subcategory === selectedSubcategory ? "active" : ""
                }`}
                onClick={() => handleSubcategoryClick(subcategory)}
              >
                {subcategory}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterByCategory;

