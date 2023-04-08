import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center flex-column">
      <h1>Welcome to our website!</h1>
      <p>You will be redirected to the home page in 5 seconds...</p>
      <Link to="/">Go to home page now</Link>
    </div>
  );
};

export default Welcome;
