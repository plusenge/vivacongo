import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { db, storage, auth } from "../firebaseConfig";
import { FaUser, FaCloudUploadAlt } from "react-icons/fa";
import { MdAddAPhoto } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import moment from "moment";
import { query, where } from "firebase/firestore";
import AdCard from "../components/AdCard";
import "./Profile.css";
import EditAd from "./EditAd";

const monthAndYear = (date) =>
  `${moment(date).format("MMMM").slice(0, 3)} ${moment(date).format("YYYY")}`;

const Profile = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  useEffect(() => {
    // Delay the animation by 50ms
    const timeout = setTimeout(() => {
      setShowAnimation(true);
    }, 50);
    return () => clearTimeout(timeout);
  }, []);

  const { id } = useParams();
  const [user, setUser] = useState();
  const [img, setImg] = useState("");
  const [backgroundImg, setBackgroundImg] = useState("");
  const [ads, setAds] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState("#0000");
  const getUser = async () => {
    const unsub = onSnapshot(doc(db, "users", id), (querySnapshot) =>
      setUser(querySnapshot.data())
    );
    return () => unsub();
  };

  const uploadImage = async (isBackgroundImg) => {
    // create image reference
    const imgRef = ref(
      storage,
      `${isBackgroundImg ? "background" : "profile"}/${Date.now()} - ${
        isBackgroundImg ? backgroundImg.name : img.name
      }`
    );
    if (isBackgroundImg && user.backgroundImageUrl) {
      await deleteObject(ref(storage, user.backgroundImagePath));
    } else if (!isBackgroundImg && user.photoUrl) {
      await deleteObject(ref(storage, user.photoPath));
    }
    // upload image
    const result = await uploadBytes(
      imgRef,
      isBackgroundImg ? backgroundImg : img
    );
    // get download url
    const url = await getDownloadURL(ref(storage, result.ref.fullPath));
    // update user doc
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      [isBackgroundImg ? "backgroundImageUrl" : "photoUrl"]: url,
      [isBackgroundImg ? "backgroundImagePath" : "photoPath"]:
        result.ref.fullPath,
    });
    setImg("");
    setBackgroundImg("");
  };

  const deletePhoto = async (isBackgroundImg) => {
    const confirm = window.confirm(
      `Delete ${isBackgroundImg ? "background" : "profile"} photo permanently?`
    );
    if (confirm) {
      await deleteObject(
        ref(
          storage,
          isBackgroundImg ? user.backgroundImagePath : user.photoPath
        )
      );
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        [isBackgroundImg ? "backgroundImageUrl" : "photoUrl"]: "",
        [isBackgroundImg ? "backgroundImagePath" : "photoPath"]: "",
      });
    }
  };
  const getAds = async () => {
    //create collection reference
    const adsRef = collection(db, "ads");
    //execute query
    const q = query(
      adsRef,
      where("postedBy", "==", id, orderBy("publishedAt", "desc"))
    );
    //get data from firestore
    const docs = await getDocs(q);
    let ads = [];
    docs.forEach((doc) => {
      ads.push({ ...doc.data(), id: doc.id });
    });
    setAds(ads);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (img) {
      uploadImage(false);
    }
    if (backgroundImg) {
      uploadImage(true);
    }
    getAds();
  }, [img, backgroundImg]);
  //console log the ads
  console.log(ads);
  return user ? (
    <div className={`form-animation__header ${showAnimation ? "animate" : ""}`}>
      <div className="big-container__card row mt-5 container">
        <div className="text-center col-sm-2 col-md-3 position-relative container-profile_image">
          <div
            className="background-image_photo background-img  position-absolute top-0 bottom-0 start-0 end-0 "
            style={{
              backgroundImage: `url(${user.backgroundImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.87,
              zIndex: -1,
              border: "solid 1px back",
              width: "100%",
              height: "150px",
              marginLeft: "0px",
              backgroundColor: "#E9EBEE",
            }}
          ></div>
          {user.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user.name}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                position: "absolute",
                top: 80,
                left: 5,
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out",
                border: "solid 3px #fff",
              }}
              className="rounded-circle me-2"
              onClick={() => document.getElementById("profileImgInput").click()}
            />
          ) : (
            <FaUser
              style={{
                position: "absolute",
                top: "4rem",
                left: "0",
                borderRadius: "50%",
                backgroundColor: "#f0f8ff",
                marginLeft: "10px",
                border: "solid 5px #fff",
              }}
              size={70}
              onClick={() => document.getElementById("profileImgInput").click()}
            />
          )}
          <div className="dropdown my-3 text-center">
            <button
              className="edit-photos btn btn-secondary btn-sm dropdown-toggle fw-bolder"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{
                position: "absolute",
                top: 90,
                right: "0",
                backgroundColor: "#f1f1f1",
                color: "#202020",
                border: "solid 1px #fff",
              }}
            >
              <MdAddAPhoto size={18} /> Edit Photos
            </button>
            <ul className="dropdown-menu ">
              <li>
                <label htmlFor="profileImgInput" className="dropdown-item">
                  <FaCloudUploadAlt size={30} /> Upload Profile Photo
                </label>
                <input
                  type="file"
                  id="profileImgInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => setImg(e.target.files[0])}
                />
              </li>
              {user.photoUrl ? (
                <li
                  className="dropdown-item btn mt-1 mb-3 btn-remove"
                  onClick={() => deletePhoto(false)}
                >
                  <span className="text-danger delete-symbol ">
                    <TiDelete size={30} />
                  </span>
                  Remove Profile Photo
                </li>
              ) : null}
              <li className="dropdown-divider"></li>
              <li>
                <label
                  htmlFor="backgroundImgInput"
                  className="dropdown-item mt-3"
                >
                  <FaCloudUploadAlt size={30} /> Upload Background Image
                </label>
                <input
                  type="file"
                  id="backgroundImgInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => setBackgroundImg(e.target.files[0])}
                />
              </li>
              {user.backgroundImageUrl ? (
                <li
                  className="dropdown-item btn mt-1 btn-remove"
                  onClick={() => deletePhoto(true)}
                >
                  <span className="text-danger delete-symbol">
                    <TiDelete size={30} />
                  </span>
                  Remove Background Image
                </li>
              ) : null}
            </ul>
          </div>
          <p
            style={{
              position: "absolute",
              color: "#696969",
              top: "-2rem",
              right: "0px",
            }}
          >
            <span className="member-since ">
              Member since {monthAndYear(user.createdAt.toDate())}
            </span>
          </p>
        </div>
        <div className="col-sm-10 col-md-9">
          <h3 className="user-name mx-3">{user.name}</h3>

          {/*Horizontal line below user name*/}
          <hr />
          <div className="row">
            {ads.length ? (
              <h4 className="published-ads mx-3"> Published Ads...</h4>
            ) : (
              <h4 className="noAdds-from__user position-absolute">No ads from this user...</h4>
            )}
            <div className="row card-img__content">
              {ads.map((ad) => (
                <div
                  className="col-sm-6 col-md-4 col-xl-4 mb-3 single-card"
                  key={ad.id}
                >
                  <AdCard ad={ad} className="background-image_photo" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Profile;
