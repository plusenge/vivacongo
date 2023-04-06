import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import Moment from "react-moment";
import "../components/AdCard.css";
import "./Ad.css";

const Ad = () => {
  const { id } = useParams();
  const [ad, setAd] = useState();
  const [idx, setIdx] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [showBelowImages, setShowBelowImages] = useState(true);

  const getAd = async () => {
    const docRef = doc(db, "ads", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setAd(docSnap.data());
    }
  };

  useEffect(() => {
    getAd();
  }, []);

  console.log(ad);

  const handleViewMore = () => {
    setShowAllImages(!showAllImages);
    setShowBelowImages(false); // hide all small images below when View More is clicked
    setIdx(0); // reset the main image index to 0
  };

  // Get all images if "View More" is clicked
  const images = showAllImages ? ad?.images : ad?.images.slice(0, 8) || [];
  return ad ? (
    <div>
      <div className="mt-5 container">
        <div className="row ">
          <div
            id="carouselExample"
            className=" carousel slide col-md-8 d-flex flex-md-row flex-column justify-content-between"
            style={{ width: "80%", margin: "0 auto" }}
          >
            <div className="carousel-inner" style={{ height: "410px" }}>
              {images.map((image, i) => (
                <div
                  className={`carousel-item card-text-water__mark ${
                    idx === i ? "active" : ""
                  }`}
                  key={i}
                >
                  <img
                    src={image.url}
                    className="d-block w-100"
                    alt={ad.title}
                    style={{
                      width: "100%",
                      height: "400px",
                      objectFit: "cover",
                      transition: "opacity 0.5s ease-in-out",
                    }}
                  />

                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExample"
                    data-bs-slide="prev"
                    onClick={() => setIdx(i)}
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExample"
                    data-bs-slide="next"
                    onClick={() => setIdx(i)}
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="col-md-4 mx-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title">
                      ${Number(ad.price).toLocaleString()}
                    </h5>
                    <AiOutlineHeart size={30} />
                  </div>
                  <h6 className="card-subtitle mb-2">{ad.title}</h6>
                  <div className="d-flex justify-content-between">
                    <p className="card-text">
                      {ad.location} -{" "}
                      <small>
                        <Moment fromNow>{ad.publishedAt.toDate()}</Moment>
                      </small>
                    </p>
                    <FaTrashAlt size={20} className="text-danger" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showBelowImages && (
            <div
              className="mb-2 small-images-container "
              style={{ width: "80%", margin: "0 auto" }}
            >
              {ad.images.slice(0, 8).map((image, i) => (
                <div
                  className={`small-image ${idx === i ? "active" : ""}`}
                  key={i}
                  onClick={() => setIdx(i)}
                >
                  <img src={image.url} alt={ad.title} />
                </div>
              ))}
              {ad.images.length > 8 && !showAllImages && (
                <div className="small-image view-more" onClick={handleViewMore}>
                  <span>View More</span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-5" style={{ width: "80%", margin: "0 auto" }}>
          <h3>Description:</h3>
          <p style={{ maxWidth: "700px", wordWrap: "break-word" }}>
            {ad.description}
          </p>
        </div>
      </div>
    </div>
  ) : null;
}
export default Ad;


