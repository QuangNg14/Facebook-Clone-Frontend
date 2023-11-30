import React from "react";
import { Link } from "react-router-dom";

const NavigateComponent = ({ handleLogout }) => {
  return (
    <div>
      <Link to="/profile" className="link-text">
        <button className="link-button">Profile</button>
      </Link>
      <Link to="/" className="link-text" onClick={handleLogout}>
        <button className="link-button" data-testid="logout-button">
          Logout
        </button>
      </Link>
    </div>
  );
};

export default NavigateComponent;
