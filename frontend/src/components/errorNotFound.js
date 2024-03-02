import React from "react";
import "../mainfile.css";

const ErrorNotFound = () => {
  return (
    <div className="error-css">
      <h1 style={{ color: "red" }}>404 NOT FOUND</h1>
      <a href="/">Go To Home Page</a>
    </div>
  );
};

export default ErrorNotFound;
