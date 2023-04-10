import React from 'react'
import { useState, useEffect } from "react";
const Animation = () => {
  const [showAnimation, setShowAnimation] = useState(false);

    useEffect(() => {
      // Delay the animation by 50ms
      const timeout = setTimeout(() => {
        setShowAnimation(true);
      }, 50);
      return () => clearTimeout(timeout);
    }, []);
  return (
    <div className={`container mt-5 form-animation__header ${showAnimation ? "animate" : ""}`}>
    </div>

  )
}

export default Animation