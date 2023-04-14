import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage, auth } from "../firebaseConfig";
import { TbPhoneCalling } from "react-icons/tb";
import { FaTrashAlt, FaUser } from "react-icons/fa";
import { HiChatAlt2 } from "react-icons/hi";
import Moment from "react-moment";
import "../components/AdCard.css";
import defaultImage from "../assets/images/no-photo.jpg";
import useSnapshot from "../utils/useSnapshot";
import "./Ad.css";
import Sold from "../components/Sold";

const Ad = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [ad, setAd] = useState();
  const [idx, setIdx] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [showBelowImages, setShowBelowImages] = useState(true);
  const { users } = useSnapshot("favorites", id);
  const [seller, setSeller] = useState(false);
  const [showNumber, setShowNumber] = useState(false);

  const getAd = async () => {
    const docRef = doc(db, "ads", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setAd(docSnap.data());

      const sellerRef = doc(db, "users", docSnap.data().postedBy);
      const sellerSnap = await getDoc(sellerRef);

      if (sellerSnap.exists()) {
        setSeller(sellerSnap.data());
        new SpeechSynthesisUtterance(sellerSnap.data());
      }
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
    navigate(`/edit-ad/${id}`);
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

  const handleLogin = async () => {
    // login logic
    navigate(location.state?.from || "/");
  };
  //Is sold ad
  //Is sold ad
  const updateStatus = async () => {
    const newValue = !ad.isSold; // Toggle the value of isSold
    await updateDoc(doc(db, "ads", id), {
      isSold: newValue,
    });
    getAd();
  };
  return ad ? (
    <div style={{ marginTop: "5rem" }}>
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
                  {ad.isSold && <Sold />}
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
              <div className="card mt-3">
                <div className="card-body">
                  <h5 className="card-title">Seller Description</h5>
                  <Link
                    to={`/profile/${ad.postedBy}`}
                    className="text-decoration-none text-dark"
                  >
                    <div className="d-flex align-items center">
                      {seller.photoUrl ? (
                        <img
                          src={seller.photoUrl}
                          alt={seller.name}
                          style={{
                            width: "70px",
                            height: "70px",
                            borderRadius: "50%",
                            marginRight: "10px",
                          }}
                        />
                      ) : (
                        <FaUser
                          className="me-2"
                          style={{
                            width: "70px",
                            height: "70px",
                            borderRadius: "50%",
                            marginRight: "10px",
                            backgroundColor: "grey",
                            fill: "#f0f8ff",
                            padding: "2px",
                            border: "solid 5px #f0f8ff",
                          }}
                        />
                      )}
                      <h6>{seller?.name}</h6>
                    </div>
                  </Link>
                </div>
                <div>
                  {auth.currentUser ? (
                    <div className="d-flex justify-content-around text-center m-auto pb-2 container-chat_showContact">
                      {ad.postedBy !== auth.currentUser?.uid && (
                        <button className="btn btn-secondary btn-sm show-contact__chat">
                          <HiChatAlt2 size={25} /> Chat
                        </button>
                      )}

                      {showNumber ? (
                        <p className="mx-2">{ad.contact}</p>
                      ) : (
                        <div className="d-flex justify-content-center">
                          <hr />
                          <button
                            className="btn btn-sm mb-3 show-contact"
                            onClick={() => setShowNumber(true)}
                          >
                            <TbPhoneCalling size={25} /> Show
                          </button>
                        </div>
                      )}
                      <br />
                    </div>
                  ) : (
                    <p className="text-center login-see_contactInfo">
                      <Link
                        to="/auth/login"
                        state={{ from: location }}
                        style={{
                          textDecoration: "none",
                          fontSize: "18px",
                          color: "#099ba9",
                          fontWeight: "400",
                          padding: "5px",
                        }}
                        onClick={handleLogin}
                      >
                        Login
                      </Link>{" "}
                      to see contact info
                    </p>
                  )}
                </div>
              </div>

              <div className=" d-flex justify-content-center">
                <button
                  className="btn isSold-button btn-secondary text-center btn-sm"
                  onClick={updateStatus}
                  style={{
                    display:
                      ad.postedBy === auth.currentUser?.uid ? "block" : "none",
                  }}
                >
                  {ad.isSold && ad.postedBy === auth.currentUser?.uid
                    ? "Still Available"
                    : "Mark as Sold"}
                </button>
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
