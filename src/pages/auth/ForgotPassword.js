import React, { useState } from "react";
import { auth } from "../../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import {Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    setError("");
    setSuccess(false);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setEmail("");
    } catch (error) {
      // setError(error.message);
      setError("Email not found!");

    }
  };
  return (
    <form className="shadow rounded p-3 mt-5 form" onSubmit={handleSubmit}>
      <h4 className="text-center mb-3 fw-bold">
        <span style={{ color: "#5783db" }}>Viva</span>
        <span style={{ color: "#55c2da" }}>Congo</span>
      </h4>
      <h5 className="mb-3">Forgot Password</h5>
      <hr />
      {/* <h3 className="text-center mb-3">Forgot Password</h3> */}
      {success ? (
        <p className="text-center mt-5">
          An e-mail is sent containing password reset instructions
        </p>
      ) : (
        <>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error ? <p className="text-center text-danger">{error}</p> : null}
          <div className="text-center mb-3">
            <button
              className="btn btn-secondary btn-sm w-100 d-flex justify-content-center text-center text-light "
              style={{ backgroundColor: "#55c2da",height:"40px" }}
            >
              Send
            </button>
          </div>

          <small className="d-flex justify-content-between mt-3">
            <Link
              to="/auth/Login"
              className="text-decoration-none fs-6 register-in__forgotPassword"
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              className="text-decoration-none fs-6 forgot-password"
            >
              Register
            </Link>
          </small>
        </>
      )}
    </form>
  );
};

export default ForgotPassword;

