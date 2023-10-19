import React from "react";
import "../Assets/CSS/spinner.css";

export default function Spinner() {
  return (
    <div className="loader-container">
      <p>loading..</p>
      <div className="spinner-loader">
      </div>
    </div>
  );
}