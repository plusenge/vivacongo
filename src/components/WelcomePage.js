import React, { useState, useEffect } from "react";

const WelcomePage = ({ onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleStartClick = () => {
    setShow(false);
  };

  const handleSellClick = () => {
    setShow(false);
  };

  return (
    <>
      {show && (
        <div
          className="welcome-message"
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: "999",
          }}
        >
          <div
            className="welcome-message__content"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
            }}
          >
            <h1>Welcome to our website</h1>
            <p>Get started by clicking one of the buttons below:</p>
            <div
              className="welcome-message__buttons"
              style={{ display: "flex", gap: "20px", marginTop: "30px" }}
            >
              <button onClick={handleStartClick}>Start Now</button>
              <button onClick={handleSellClick}>Sell Your Item</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WelcomePage;
