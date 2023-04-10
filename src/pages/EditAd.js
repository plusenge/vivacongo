import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { FaCloudUploadAlt } from "react-icons/fa";
import { categories, locations } from "../data/config";
import Animation from "../components/Animation";
import "./EditAd.css";

const EditAd = () => {
  const [showAnimation, setShowAnimation] = useState(false);

   useEffect(() => {
     // Delay the animation by 50ms
     const timeout = setTimeout(() => {
       setShowAnimation(true);
     }, 50);
     return () => clearTimeout(timeout);
   }, []);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const [adData, setAdData] = useState({
    title: "",
    category: "",
    subcategory: "",
    location: "",
    city: "",
    contact: "",
    description: "",
    price: "",
    images: [],
  });
  const [imageFiles, setImageFiles] = useState([]);

  const getAd = async () => {
    const docRef = doc(db, "ads", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const ad = docSnap.data();
      setAdData(ad);
    }
  };

  useEffect(() => {
    getAd();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const handleRemoveImage = (index, event) => {
    event.preventDefault();
    if (index < adData.images.length) {
      // Remove existing image
      const imagesCopy = [...adData.images];
      imagesCopy.splice(index, 1);
      setAdData((prevState) => ({
        ...prevState,
        images: imagesCopy,
      }));
    } else {
      // Remove newly added image
      const filesCopy = [...imageFiles];
      filesCopy.splice(index - adData.images.length, 1);
      setImageFiles(filesCopy);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Update ad data in firestore
    const adRef = doc(db, "ads", id);
    await updateDoc(adRef, {
      title: adData.title,
      category: adData.category,
      subcategory: adData.subcategory,
      location: adData.location,
      city: adData.city,
      contact: adData.contact,
      description: adData.description,
      price: adData.price,
    });
    // Upload new images to storage if any
    const promises = imageFiles.map(async (file) => {
      const filePath = `ads/${id}/${file.name}`;
      const fileRef = ref(storage, filePath);
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      return {
        name: file.name,
        path: filePath,
        url: downloadUrl,
      };
    });
    const images = await Promise.all(promises);
    // Update ad images in firestore
    await updateDoc(adRef, { images: images });
    navigate(`/ad/${id}`);
  };

  return (
    <div className={`container mt-5 form-animation__header ${showAnimation ? "animate" : ""}`}>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="images" className="form-label">
            Images
          </label>
          <input
            type="file"
            className="form-control"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <div className="row mt-2">
            {adData.images.map((image) => (
              <div className="col-md-3 mb-2" key={image.name}>
                <img
                  src={image.url}
                  alt={image.name}
                  className="img-thumbnail"
                />
              </div>
            ))}
            {imageFiles.map((file) => (
              <div className="col-md-3 mb-2" key={file.name}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="img-thumbnail"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={adData.title}
            onChange={(e) => setAdData({ ...adData, title: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            className="form-select"
            id="category"
            value={adData.category}
            onChange={(e) => {
              const selectedCategory = categories.find(
                (cat) => cat.name === e.target.value
              );
              setAdData({
                ...adData,
                category: selectedCategory?.name || "",
                subcategory: selectedCategory?.subcategories[0] || "",
              });
            }}
          >
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="subcategory" className="form-label">
            Subcategory
          </label>
          <select
            className="form-select"
            id="subcategory"
            value={adData.subcategory}
            onChange={(e) =>
              setAdData({ ...adData, subcategory: e.target.value })
            }
          >
            {categories
              .find((cat) => cat.name === adData.category)
              ?.subcategories.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <select
            className="form-select"
            id="location"
            value={adData.location}
            onChange={(e) => setAdData({ ...adData, location: e.target.value })}
          >
            <option value="">Select a location</option>
            {locations.map((location) => (
              <option key={location.name} value={location.name}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="city" className="form-label">
            City
          </label>
          <select
            className="form-select"
            id="city"
            value={adData.city}
            onChange={(e) => setAdData({ ...adData, city: e.target.value })}
          >
            <option value="">Select a city</option>
            {locations
              .find((location) => location.name === adData.location)
              ?.cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="contact" className="form-label">
            Contact
          </label>
          <input
            type="text"
            className="form-control"
            id="contact"
            value={adData.contact}
            onChange={(e) => setAdData({ ...adData, contact: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            value={adData.price}
            onChange={(e) => setAdData({ ...adData, price: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            rows="5"
            value={adData.description}
            onChange={(e) =>
              setAdData({ ...adData, description: e.target.value })
            }
            style={{ width: "100%", height: "200px" }}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Save Change
        </button>
      </form>
    </div>
  );
};
export default EditAd;
