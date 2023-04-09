import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

import { db, storage, auth } from "../firebaseConfig";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import Moment from "react-moment";
import "../components/AdCard.css";
import defaultImage from "../assets/images/no-photo.jpg";
import useSnapshot from "../utils/useSnapshot";
import fav from "../utils/fav";

import "./Ad.css";

const Ad = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState();
  const [idx, setIdx] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [showBelowImages, setShowBelowImages] = useState(true);
  const { users } = useSnapshot("favorites", id);

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

  //Delete ad function
  const deleteAd = async () => {
    const confirm = window.confirm(`Delete ${ad.title}?`);
    if (confirm && auth.currentUser && auth.currentUser.uid === ad.postedBy) {
      //delete images
      for (const image of ad.images) {
        const imgRef = ref(storage, image.path);
        await deleteObject(imgRef); // Corrected line
      }
      //delete fav doc from firestore
      await deleteDoc(doc(db, "favorites", id));
      // delete ad doc from firestore
      await deleteDoc(doc(db, "ads", id));
      //navigate to seller profile
      navigate(`/profile/${auth.currentUser.uid}`);
    } else {
      alert("Not authorized to delete this ad");
    }
    console.log(`USER: ${auth.currentUser?.uid}`);
    console.log(`ID: ${ad.postedBy}`);
  };

  const handleEdit = () => {
    //navigate to seller edit
    navigate(`/ads/${id}/edit`);
  };

  const handleViewMore = () => {
    setShowAllImages(!showAllImages);
    setShowBelowImages(false); // hide all small images below when View More is clicked
    setIdx(0); // reset the main image index to 0
  };

  let images = ad?.images || [];
  if (images.length === 0) {
    images = [{ url: defaultImage }];
  }
  if (showAllImages) {
    images = ad?.images || [];
  } else {
    images = images.slice(0, 8);
  }
  const mainImage = images[idx] || { url: defaultImage };

  return ad ? (
    <div>
      <useSnapshot />
      <div className="mt-5 container">
        <div className="row ">
          <div
            id="carousselDetail"
            className=" carousel slide col-md-8 d-flex flex-md-row flex-column justify-content-between"
            style={{ width: "80%", margin: "0 auto" }}
          >
            <div className="carousel-inner " style={{ height: "410px" }}>
              {images.map((image, i) => (
                <div
                  className={`carousel-item card-text-water__mark ${
                    idx === i ? "active" : ""
                  }`}
                  key={i}
                >
                  <img
                    src={image.url || defaultImage}
                    alt={ad.title}
                    className="d-block w-100"
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
                    data-bs-target="#carousselDetail"
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
                    data-bs-target="#carousselDetail"
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

            <div className="col-md-4 mx-md-4 card-container__content">
              <div className="card">
                <div className="card-body ">
                  <div className="d-flex justify-content-between align-items-center border-0">
                    <h5 className="card-title">
                      ${Number(ad.price).toLocaleString()}
                    </h5>
                    {/*=============// Delete button =========== */}
                    {auth.currentUser &&
                      auth.currentUser.uid === ad.postedBy && (
                        <FaTrashAlt
                          size={20}
                          className="text-danger cursor-pointer"
                          onClick={deleteAd}
                        />
                      )}
                    {/* <AiOutlineHeart size={30} /> */}
                  </div>
                  <h6 className="card-subtitle mb-2">{ad.title}</h6>
                  <div className="d-flex justify-content-between">
                    <p className="card-text">
                      {ad.location} -{" "}
                      <small>
                        <Moment fromNow>{ad.publishedAt.toDate()}</Moment>
                      </small>
                    </p>
                    {/*=============// Edit button =========== */}
                    {auth.currentUser &&
                      auth.currentUser.uid === ad.postedBy && (
                        <>
                          <button
                            className="btn btn-primary"
                            onClick={handleEdit}
                          >
                            Edit
                          </button>
                        </>
                      )}
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
        <div
          className="mt-5 container-carousselDetail"
          style={{ width: "80%", margin: "0 auto" }}
        >
          <h3>Description:</h3>
          <p style={{ maxWidth: "700px", wordWrap: "break-word" }}>
            {ad.description}
          </p>
        </div>
      </div>
    </div>
  ) : null;
};
export default Ad;
