import React from 'react'
import Home from '../pages/Home';
import { useParams, useNavigate, Link } from "react-router-dom";

const None = () => {
  const navigate = useNavigate()
  const handleHome = () => {
    //navigate back to home page
    navigate("/");
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="d-flex flex-column align-items-center text-center">
        <h1 className="text-danger" style={{fontSize:"11rem"}}>404</h1>
        <h1>OOPS! Page Not Found!</h1>
        <p>Either something went wrong or the page doesn't exist anymore.</p>
        <button className="btn bg-danger text-light" style={{padding:"1.15rem"}} onClick={handleHome}>
          Take me home
        </button>
      </div>
    </div>
  );
}

export default None