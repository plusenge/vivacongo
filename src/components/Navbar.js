import { signOut } from "firebase/auth";
import { doc, updateDoc, getDoc, onSnapshot } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { auth, db } from "../firebaseConfig";
import React, { useContext, useState, useEffect } from "react";
import { MdAddCircle } from "react-icons/md";
import "./Navbar.css";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");

  const handleSignout = async () => {
    //update user doc
    await updateDoc(doc(db, "users", user.uid), {
      isOnline: false,
    });
    //logout
    await signOut(auth);
    //navigate to home page
    navigate("/");
  };

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        doc(db, "users", user.uid),
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            setUserName(docSnapshot.data().name);
            setUserImage(docSnapshot.data().photoUrl);
          } else {
            console.log("Document does not exist!");
          }
        }
      );

      return unsubscribe;
    }
  }, [user]);

  const handleImageError = (event) => {
    event.target.src =
      userImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  };
  return (
    <div>
      <nav className="navbar navbar-expand-md bg-light navbar-light fixed-top shadow-sm ">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <span className="logo-viva">Viva</span>
            <span className="logo-soko">Soko</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {user ? (
                <>
                  <li className="nav-item userImageNavBar">
                    {user && (
                      <div className="d-flex align-items-center">
                        <span className=" me-2 userGreet">
                          Hey {userName}!{" "}
                        </span>
                        <Link to={`/profile/${user.uid}`}>
                          <img
                            src={
                              userImage ||
                              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            alt="User Profile"
                            className="rounded-circle me-2"
                            onError={handleImageError}
                            style={{ width: "40px", height: "40px" }}
                          />
                        </Link>
                      </div>
                    )}
                    <Link className="nav-link" to={`/profile/${user.uid}`}>
                      Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link " to={`/sell`}>
                      <MdAddCircle size={30} fill={"#55c2da"} />
                      Sell
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link " to={`/favorites`}>
                      My Favorites
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-sm px-3 text-light btn-logout bg-danger mx-2"
                      onClick={handleSignout}
                    >
                      Log Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/auth/register">
                      Register
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/auth/login">
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;





