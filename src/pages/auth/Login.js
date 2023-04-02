import React, { useState, useEffect } from "react";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";
import "./Login.css";

const Login = () => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Delay the animation by 50ms
    const timeout = setTimeout(() => {
      setShowAnimation(true);
    }, 50);
    return () => clearTimeout(timeout);
  }, []);

  const [values, setValues] = useState({
    email: "",
    password: "",
    loading: false,
    showPassword: false,
  });

  const togglePasswordVisibility = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  const navigate = useNavigate();

  const { email, password, loading, showPassword } = values;
  const [loginErrors, setLoginErrors] = useState({});

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};

    // Check email field conditions
    if (!email) {
      validationErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.email = "Invalid email address";
    }

    // Check password field conditions
    if (!password) {
      validationErrors.password = "Password is required";
    }

    if (Object.keys(validationErrors).length !== 0) {
      setLoginErrors(validationErrors);
      return;
    }

    setLoginErrors({});
    setValues({ ...values, loading: true });

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in successfully");
      setValues({ email: "", password: "", loading: false });
      navigate("/");
      // Welcome message with username
      const userEmail = userCredential.user.email;
      const username = userEmail.split("@")[0];
      toast.success(`🎊🎉 ${username}, Welcome back!`, {
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
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setLoginErrors({
          firebase: "Invalid email or password. Please try again.",
        });
      } else {
        setLoginErrors({
          firebase: error.message,
        });
      }
      setValues({ ...values, loading: false });
    }
  };
  return (
    <div className="login-page">
      <div
        className={`form-animation__header ${showAnimation ? "animate" : ""}`}
      >
        <form className="shadow rounded p-3 mt-5 form" onSubmit={handleSubmit}>
          <h4 className="text-center mb-3 fw-bold">
            <span style={{ color: "#5783db" }}>Viva</span>
            <span style={{ color: "#55c2da" }}>Congo</span>
          </h4>
          <h5 className="mb-3">Login</h5>
          <hr />

          {/*=============== email input ==============*/}
          <div className="container-input">
            <label htmlFor="email" className="form-label">
              Email
            </label>

            <input
              type="email"
              className={`form-control ${loginErrors.email && "is-invalid"}`}
              name="email"
              value={email}
              onChange={handleChange}
            />
            {loginErrors.email && (
              <div className="invalid-feedback">{loginErrors.email}</div>
            )}
          </div>

          {/*=============== password ==============*/}

          <div className="mb-3 container-input">
            <label
              htmlFor="password"
              className="form-label d-flex justify-content-between"
              style={{ height: "50px" }}
            >
              <p className="mt-4">Password</p>
              <button
                className="btn btn-outline-secondary btn-togglePassword "
                type="button"
                onClick={togglePasswordVisibility}
              >
                <span className="">
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </button>
            </label>
            <input
              id="input-password"
              type={showPassword ? "text" : "password"}
              className={`form-control ${loginErrors.password && "is-invalid"}`}
              name="password"
              value={password}
              onChange={handleChange}
            />
            {loginErrors.password && (
              <div className="invalid-feedback">{loginErrors.password}</div>
            )}
          </div>

          {loginErrors.firebase && (
            <div className="alert alert-danger" role="alert">
              {loginErrors.firebase}
            </div>
          )}

          {/*============ login button ==============*/}
          <div className="text-center mb-3">
            <button
              className="btn btn-secondary btn-sm text-light d-flex justify-content-center text-center w-100 btn-register btn-login"
              disabled={loading}
            >
              Login
            </button>
          </div>
          <div className="text-center mb-3">
            <small className="d-flex justify-content-between">
              <Link
                to="/auth/Register"
                className="text-decoration-none fs-6 register-in__forgotPassword"
              >
                Register
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
    </div>
  );
};
export default Login;
