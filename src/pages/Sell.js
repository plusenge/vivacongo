import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdAddCircle } from "react-icons/md";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { doc,addDoc, collection, setDoc, Timestamp } from "firebase/firestore";
import { storage, db, auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { categories, locations } from "../data/config";
import "./Sell.css";

const Sell = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleDeleteImage = (index) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
  };

  useEffect(() => {
    // Delay the animation by 50ms
    const timeout = setTimeout(() => {
      setShowAnimation(true);
    }, 50);
    return () => clearTimeout(timeout);
  }, []);

  const [errors, setErrors] = useState({
    title: "",
    category: "",
    subcategory: "",
    price: "",
    location: "",
    city: "",
    contact: "",
    description: "",
  });

  const validate = () => {
    let errors = {};
    let isValid = true;

    // Title validation
    if (!title) {
      errors.title = "Title is required";
      isValid = false;
    }

    // Category validation
    if (!category) {
      errors.category = "Category is required";
      isValid = false;
    }

    // Subcategory validation
    if (category && !subcategory) {
      errors.subcategory = "Subcategory is required";
      isValid = false;
    }

    // Price validation
    if (!price) {
      errors.price = "Price is required";
      isValid = false;
    } else if (isNaN(price)) {
      errors.price = "Price must be a number";
      isValid = false;
    }

    // Location validation
    if (!location) {
      errors.location = "Location is required";
      isValid = false;
    }

    // City validation
    if (location && !city) {
      errors.city = "City is required";
      isValid = false;
    }

    // Contact validation
    if (!contact) {
      errors.contact = "Contact is required";
      isValid = false;
    }

    // Description validation
    if (!description) {
      errors.description = "Description is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const navigate = useNavigate();

  const [values, setValues] = useState({
    images: [],
    title: "",
    category: "",
    subcategory: "",
    price: "",
    location: "",
    city: "",
    contact: "",
    description: "",
    error: "",
    loading: false,
  });
  const {
    images,
    title,
    category,
    subcategory,
    price,
    location,
    city,
    contact,
    description,
    error,
    loading,
  } = values;

  const handleChange = (e) => {
    if (e.target.name === "category") {
      setValues({ ...values, category: e.target.value, subcategory: "" });
    } else if (e.target.name === "location") {
      setValues({ ...values, location: e.target.value, city: "" });
    } else {
      setValues({ ...values, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    const isValid = validate();
    if (!isValid) {
      return;
    }

    setValues({ ...values, error: "", loading: true });

    try {
      let imgs = [];
      // loop through images
      if (images.length) {
        for (let image of images) {
          const imgRef = ref(storage, `ads/${Date.now()} - ${image.name}`);
          const result = await uploadBytes(imgRef, image);
          const fileUrl = await getDownloadURL(
            ref(storage, result.ref.fullPath)
          );

          imgs.push({ url: fileUrl, path: result.ref.fullPath });
        }
      }
      // add data into firestore
      const result = await addDoc(collection(db, "ads"), {
        images: imgs,
        title,
        category,
        subcategory, // include the subcategory value here
        price,
        location,
        city, // include the city value here
        contact,
        description,
        isSold: false,
        publishedAt: Timestamp.fromDate(new Date()),
        postedBy: auth.currentUser.uid,
      });
      await setDoc(doc(db, 'favorites', result.id), {
        users:[]
      })

      setValues({
        images: [],
        title: "",
        category: "",
        price: "",
        location: "",
        contact: "",
        description,
        loading: false,
      });
      navigate("/");
    } catch (error) {
      setValues({ ...values, error: error.message, loading: false });
    }
  };

  return (
    <>
      <div
        className={`form-animation__header ${showAnimation ? "animate" : ""}`}
      >
        <form className="form shadow rounded p-3 mt-5" onSubmit={handleSubmit}>
          <h3 className="text-center mb-3">Create An Ad</h3>
          <div className="mb-3 text-center">
            <label htmlFor="image">
              <div
                className="btn-upload__img main-button btn btn-sm text-light"
                style={{
                  backgroundColor: "#55c2da",
                  height: "45px",
                  fontSize: "18px",
                  fontWeight: "400",
                }}
              >
                <FaCloudUploadAlt size={30} /> Upload Image
              </div>
            </label>
            <input
              type="file"
              id="image"
              style={{ display: "none" }}
              accept="image/*"
              multiple
              onChange={(e) => setValues({ ...values, images: e.target.files })}
            />

            <div className="d-flex flex-wrap mt-3">
              {images &&
                Array.from(images).map((file, index) => (
                  <div key={index} className="me-2 mb-2 position-relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="img-thumbnail"
                      width="100"
                      height="100"
                    />
                    {/* <MdClose
                      className="delete-icon"
                    /> */}
                  </div>
                ))}
            </div>

            {/*End previewImages before uploading*/}
          </div>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={title}
              onChange={handleChange}
            />
            {errors.title && <div className="text-danger">{errors.title}</div>}
          </div>
          <select
            name="category"
            className="form-select select-red-color"
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option
                value={category.name}
                key={category.name}
                className="icons"
              >
                <h1>
                  {category.icon} {category.name}
                </h1>
              </option>
            ))}
          </select>

          {values.category && (
            <div className="mb-3">
              <label className="form-label">Subcategory</label>
              <select
                name="subcategory"
                className="form-select"
                onChange={handleChange}
                value={values.subcategory}
              >
                <option value="">Select Subcategory</option>
                {categories
                  .find((category) => category.name === values.category)
                  .subcategories.map((subcategory) => (
                    <option value={subcategory} key={subcategory}>
                      <span className="category-icon">{subcategory}</span>
                    </option>
                  ))}
              </select>
              {errors.category && (
                <div className="text-danger">{errors.subcategory}</div>
              )}
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Price</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={price}
              onChange={handleChange}
            />
            {errors.category && (
              <div className="text-danger">{errors.price}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Location</label>
            <select
              name="location"
              className="form-select"
              onChange={handleChange}
            >
              <option value="">Select Province</option>
              {locations.map((location) => (
                <option value={location.province} key={location.province}>
                  {location.province}
                </option>
              ))}
            </select>
            {errors.category && (
              <div className="text-danger">{errors.province}</div>
            )}
          </div>

          {values.location && (
            <div className="mb-3">
              <label className="form-label">City</label>
              <select
                name="city"
                className="form-select"
                onChange={handleChange}
                value={values.city}
              >
                <option value="">Select City</option>
                {locations
                  .find((location) => location.province === values.location)
                  .cities.map((city) => (
                    <option value={city} key={city}>
                      {city}
                    </option>
                  ))}
              </select>
              {errors.category && (
                <div className="text-danger">{errors.city}</div>
              )}
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Contact</label>
            <input
              type="text"
              className="form-control"
              name="contact"
              value={contact}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              cols="30"
              rows="3"
              className="form-control"
              value={description}
              onChange={handleChange}
            ></textarea>

            {errors.category && (
              <div className="text-danger">{errors.description}</div>
            )}
          </div>

          {error ? <p className="text-center text-danger">{error}</p> : null}
          <div className="mb-3 text-center d-flex justify-content-center ">
            <button
              className="create-btn main-button btn-sm px-3 text-light rounded"
              disabled={loading}
              style={{ height: "45px", fontSize: "17px" }}
            >
              <MdAddCircle size={30} /> Create
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Sell;


