
import React, { useState, useEffect } from "react";
const ShowAnimation = () => {
const [showAnimation, setShowAnimation] = useState(false);

   useEffect(() => {
     // Delay the animation by 50ms
     const timeout = setTimeout(() => {
       setShowAnimation(true);
     }, 50);
     return () => clearTimeout(timeout);
   }, []);
  return (
     <div
        className={`form-animation__header ${showAnimation ? "animate" : ""}`}
    >
      </div>
  )
}

export default ShowAnimation