import { useState } from "react";
import { categories } from "../data/config";

const Category = ({ category, onClick }) => {
  const [showSubcategories, setShowSubcategories] = useState(false);

  const handleCategoryClick = () => {
    setShowSubcategories(!showSubcategories);
    onClick(category.name);
  };

  return (
    <div className="category-container">
      <div className="category d-flex" onClick={handleCategoryClick}>
        <div className="category-name">{category.name}</div>
        <div className="subcategory-count">
          {category.subcategories.length} subcategories
        </div>
      </div>
      {showSubcategories && (
        <ul className="subcategory-list">
          {category.subcategories.map((subcategory) => (
            <li key={subcategory} className="subcategory">
              {subcategory}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const CategorySubcategory = () => {
  const handleClick = (name) => {
    console.log(`Clicked category: ${name}`);
  };

  return (
    <div className="category-subcategory-container">
      {categories.map((category, index) => (
        <Category
          key={category.name}
          category={category}
          onClick={handleClick}
        />
      ))}
    </div>
  );
};

export default CategorySubcategory;
