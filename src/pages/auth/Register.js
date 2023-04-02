import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Delay the animation by 50ms
    const timeout = setTimeout(() => {
      setShowAnimation(true);
    }, 50);
    return () => clearTimeout(timeout);
  }, []);

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    errors: {},
    loading: false,
    showPassword: false,
    showConfirmPassword: false,
  });

  const togglePasswordVisibility = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const toggleConfirmPasswordVisibility = () => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword });
  };

  const navigate = useNavigate();

  const {
    name,
    email,
    password,
    confirmPassword,
    errors,
    loading,
    showPassword,
    showConfirmPassword,
  } = values;

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};

    // Check all fields are filled
    if (!name) {
      validationErrors.name = "Name is required";
    }
    if (!email) {
      validationErrors.email = "Email is required";
    }
    if (!password) {
      validationErrors.password = "Password is required";
    }
    if (!confirmPassword) {
      validationErrors.confirmPassword = "Confirm password is required";
    }

    // Check name field conditions
    if (name.length < 3 || /\d/.test(name)) {
      validationErrors.name =
        "Name must be at least 3 characters long and cannot contain numbers";
    }

    // Check email field conditions
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.email = "Invalid email address";
    }

    // Check password field conditions
    if (password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters long";
    }

    // Check confirmPassword field conditions
    if (confirmPassword !== password) {
      validationErrors.confirmPassword = "Passwords doesn't match";
    }

    if (Object.keys(validationErrors).length !== 0) {
      setValues({ ...values, errors: validationErrors });
      return;
    }

    setValues({ ...values, errors: {}, loading: true });

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Creating user document in Firestore...");

      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true,
      });
      console.log("User document created successfully.");

      setValues({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        errors: {},
        loading: false,
      });
      navigate("/");

      {
        /*=============== success message account created ==============*/
      }
      toast.success(`${name}'s account created!`, {
        className: "success-toast",
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        setValues({
          ...values,
          errors: { email: "Email is already in use" },
          loading: false,
        });
      } else {
        setValues({
          ...values,
          errors: { firebase: error.message },
          loading: false,
        });
      }
    }
  };

  return (
    <div className={`form-animation__header ${showAnimation ? "animate" : ""}`}>
      <form className="shadow rounded p-3 mt-5 form" onSubmit={handleSubmit}>
        <h4 className="text-center mb-3 fw-bold">
          <span style={{ color: "#5783db" }}>Viva</span>
          <span style={{ color: "#55c2da" }}>Congo</span>
        </h4>
        <h5 className="mb-3">Create An Account</h5>
        <hr />

        {/*=============== name input ==============*/}
        <div className="mb-3 container-input">
          <label htmlFor="name" className="form-label">
            Name*
          </label>
          <input
            type="text"
            className={`form-control ${errors.name && "is-invalid"}`}
            name="name"
            value={name}
            onChange={handleChange}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        {/*=============== email input ==============*/}
        <div className="mb-3 container-input">
          <label htmlFor="email" className="form-label">
            Email*
          </label>

          <input
            type="email"
            className={`form-control ${errors.email && "is-invalid"}`}
            name="email"
            value={email}
            onChange={handleChange}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>

        {/*=============== password ==============*/}

        <div className="mb-3 container-input">
          <label
            htmlFor="password"
            className="form-label d-flex d-flex justify-content-between form-label "
            style={{ height: "50px" }}
          >
            <p className="mt-4">Password*</p>
            <button
              className="btn btn-outline-secondary btn-togglePassword btn-eye"
              type="button"
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </label>
          <input
            id="input-password"
            type={showPassword ? "text" : "password"}
            className={`form-control ${errors.password && "is-invalid"}`}
            name="password"
            value={password}
            onChange={handleChange}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
        </div>

        {/*=============== confirm password ==============*/}

        <div className="mb-3 container-input">
          <label
            htmlFor="confirmPassword"
            className="d-flex justify-content-between form-label"
            style={{ height: "50px" }}
          >
            <p className="mt-4">Confirm Password*</p>
            <button
              className="btn btn-outline-secondary btn-togglePassword "
              type="button"
              onClick={toggleConfirmPasswordVisibility}
            >
              <span className="btn-eye">
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </span>
            </button>
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            className={`form-control ${errors.confirmPassword && "is-invalid"}`}
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <div className="invalid-feedback">{errors.confirmPassword}</div>
          )}
        </div>
        {errors.firebase && (
          <div className="alert alert-danger" role="alert">
            {errors.firebase}
          </div>
        )}

        {/*============ register button ==============*/}
        <div className="text-center mb-3">
          <button
            className="btn d-flex justify-content-center text-light btn-secondary btn-sm btn-register w-100"
            disabled={loading}
          >
            Create account
          </button>

          <small className="d-flex justify-content-between mt-3">
            <Link
              to="/auth/Login"
              className="text-decoration-none fs-6 register-in__forgotPassword"
            >
              Login
            </Link>
            <Link
              to="/auth/forgot-password"
              className="text-decoration-none fs-6 forgot-password"
            >
              Forgot Password
            </Link>
          </small>
        </div>
      </form>
    </div>
  );
};
export default Register;
