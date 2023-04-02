import React from 'react'
import './Loading.css'

const Loading = () => {
  return (
    <div style={{ position: "relative" }}>
      <h2
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50% ",
          color: "#55c2da",
        }}
      >
        Loading...
      </h2>
    </div>
  );
}

export default Loading